"use client";

/**
 * Randevu sayfasından alınan randevuların deposu.
 *
 * Demo modda (Supabase bağlı değilken) randevular tarayıcının localStorage'ında
 * durur. Panel sayfaları (`dashboard`, `calendar`) hepsi "use client" olduğu ve
 * `lib/demo/data.ts`'teki statik listeyi doğrudan okuduğu için bu en az sürtünmeli
 * yol: sunucu tarafı bir depo iki sayfanın da server component'e çevrilmesini
 * gerektirirdi. Böylece hasta `/randevu`'dan randevu alır, klinik panelinde
 * anında belirir ve sayfa yenilense bile durur.
 *
 * Supabase bağlandığında yalnızca bu dosyanın içi değişir; çağıran yerler aynı
 * kalır.
 */

import { useMemo, useSyncExternalStore } from "react";
import { initials } from "@/lib/utils";
import { appointments, type Appointment } from "@/lib/demo/data";

const STORAGE_KEY = "seansapp:bookings";

/** Randevu sayfasından gelen ham girdi. */
export interface BookingInput {
  client: string;
  clientPhone: string;
  serviceId: string;
  staffId: string;
  dayOffset: number;
  startMin: number;
  note?: string;
}

/* ── Abonelik altyapısı ───────────────────────────────────────────────────────
   useSyncExternalStore bir "snapshot" fonksiyonunun aynı veri için aynı referansı
   döndürmesini şart koşar; aksi halde sonsuz render döngüsü olur. Bu yüzden
   ayrıştırılmış diziyi önbellekte tutup yalnızca ham metin değiştiğinde
   yeniliyoruz. */

let cachedRaw: string | null = null;
let cachedList: Appointment[] = [];

const EMPTY: Appointment[] = [];

const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Başka bir sekmede alınan randevu bu sekmeyi de tazelesin.
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function read(): Appointment[] {
  if (typeof window === "undefined") return EMPTY;
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // Gizli sekme ya da site verisi engelliyse: depo yokmuş gibi davran.
    return EMPTY;
  }
  if (raw === null) {
    cachedRaw = null;
    cachedList = EMPTY;
    return EMPTY;
  }
  if (raw === cachedRaw) return cachedList;
  try {
    const parsed = JSON.parse(raw);
    cachedList = Array.isArray(parsed) ? (parsed as Appointment[]) : EMPTY;
  } catch {
    cachedList = EMPTY;
  }
  cachedRaw = raw;
  return cachedList;
}

/** Sunucuda render edilirken depo boştur — hydration uyuşmazlığını önler. */
function readServer(): Appointment[] {
  return EMPTY;
}

function write(list: Appointment[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // Depolama kullanılamıyorsa randevu yine de bu oturumda görünsün.
  }
  emit();
}

/* ── Yazma ──────────────────────────────────────────────────────────────────── */

/**
 * Benzersiz kayıt anahtarı. `crypto.randomUUID()` yalnızca güvenli bağlamda
 * (https ya da localhost) tanımlıdır; klinik sayfayı telefondan yerel ağ IP'siyle
 * açtığında yoktur ve çağrı hata fırlatır. Bu yüzden yedeği var.
 */
function newId(): string {
  const c = globalThis.crypto;
  if (typeof c?.randomUUID === "function") return `web-${c.randomUUID()}`;
  return `web-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Yeni bir randevu kaydeder ve oluşturulan kaydı döndürür. */
export function addBooking(input: BookingInput): Appointment {
  const appt: Appointment = {
    id: newId(),
    client: input.client.trim(),
    clientInitials: initials(input.client.trim()),
    clientPhone: input.clientPhone,
    serviceId: input.serviceId,
    staffId: input.staffId,
    dayOffset: input.dayOffset,
    startMin: input.startMin,
    status: "booked",
    price: 0,
    paid: false,
    source: "online",
    pastVisits: 0,
    ...(input.note?.trim()
      ? { note: { tr: input.note.trim(), en: input.note.trim() } }
      : {}),
  };
  write([...read(), appt]);
  return appt;
}

/** Randevu sayfasından alınan tüm randevuları siler (demoyu sıfırlar). */
export function clearBookings() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* yoksay */
  }
  emit();
}

/* ── Okuma ──────────────────────────────────────────────────────────────────── */

/** Yalnızca randevu sayfasından alınmış randevular. */
export function useBookings(): Appointment[] {
  return useSyncExternalStore(subscribe, read, readServer);
}

/**
 * Demo verisi + randevu sayfasından alınanlar — panelin okuduğu tam liste.
 * Referans kararlı tutulur; çağıranlar bunu `useMemo` bağımlılığı olarak
 * kullanıyor.
 */
export function useAllAppointments(): Appointment[] {
  const booked = useBookings();
  return useMemo(
    () => (booked.length === 0 ? appointments : [...appointments, ...booked]),
    [booked],
  );
}
