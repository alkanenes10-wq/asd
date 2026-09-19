/**
 * Randevu sayfasının kuralları: boş saat hesabı, çakışma kontrolü ve telefon
 * doğrulaması.
 *
 * Izgara sabitleri (`dayStartMin`, `dayEndMin`, `slotMin`) ve veri
 * `lib/demo/data.ts`'ten gelir — burada yeniden tanımlanmaz.
 */
import {
  dayStartMin,
  dayEndMin,
  slotMin,
  serviceById,
  staffById,
  type Appointment,
  type Service,
  type Staff,
} from "@/lib/demo/data";

export interface Slot {
  /** Gece yarısından itibaren dakika. */
  min: number;
  available: boolean;
}

/** Bir randevunun kapladığı aralık — tedavinin süresi kadar. */
function apptRange(a: Appointment): [number, number] {
  return [a.startMin, a.startMin + serviceById(a.serviceId).durationMin];
}

function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number) {
  return aStart < bEnd && bStart < aEnd;
}

/**
 * Bir hekimin belirli bir gündeki, seçilen tedavi için uygun saatleri.
 * Hekimin çalışma aralığını `slotMin` adımlarla gezer; tedavi mesai bitimini
 * aşıyorsa ya da mevcut bir randevuyla çakışıyorsa slot dolu işaretlenir.
 */
export function slotsForDay(
  staffId: string,
  dayOffset: number,
  service: Service,
  existing: Appointment[],
): Slot[] {
  const doc = staffById(staffId);
  const from = Math.max(doc.startMin, dayStartMin);
  const to = Math.min(doc.endMin, dayEndMin);

  const busy = existing
    .filter((a) => a.staffId === staffId && a.dayOffset === dayOffset)
    .map(apptRange);

  const slots: Slot[] = [];
  for (let m = from; m + service.durationMin <= to; m += slotMin) {
    const end = m + service.durationMin;
    const free = !busy.some(([bs, be]) => overlaps(m, end, bs, be));
    slots.push({ min: m, available: free });
  }
  return slots;
}

/** Form gönderilirken son çakışma kontrolü. */
export function isSlotFree(
  staffId: string,
  dayOffset: number,
  service: Service,
  startMin: number,
  existing: Appointment[],
): boolean {
  return slotsForDay(staffId, dayOffset, service, existing).some(
    (s) => s.min === startMin && s.available,
  );
}

/**
 * O gün ve saatte müsait olan ilk hekim ("Fark etmez" seçeneği için).
 * Hekim listesindeki sıra korunur, böylece seçim öngörülebilir olur.
 */
export function firstFreeStaff(
  candidates: Staff[],
  dayOffset: number,
  service: Service,
  startMin: number,
  existing: Appointment[],
): Staff | null {
  return (
    candidates.find((s) =>
      isSlotFree(s.id, dayOffset, service, startMin, existing),
    ) ?? null
  );
}

/**
 * Verilen hekimlerin birleşik müsaitliği — "Fark etmez" seçildiğinde gösterilen
 * saatler. Bir saat, hekimlerden en az biri boşsa müsait sayılır.
 */
export function unionSlots(
  candidates: Staff[],
  dayOffset: number,
  service: Service,
  existing: Appointment[],
): Slot[] {
  const byMin = new Map<number, boolean>();
  for (const doc of candidates) {
    for (const s of slotsForDay(doc.id, dayOffset, service, existing)) {
      byMin.set(s.min, (byMin.get(s.min) ?? false) || s.available);
    }
  }
  return [...byMin.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([min, available]) => ({ min, available }));
}

/* ── Telefon ────────────────────────────────────────────────────────────────── */

/** Rakamlara indirger ve TR ülke/sıfır ön ekini atar → "5XXXXXXXXX". */
export function normalizePhone(raw: string): string {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("90")) d = d.slice(2);
  else if (d.startsWith("0")) d = d.slice(1);
  return d;
}

/** TR cep telefonu: 10 hane ve 5 ile başlar. */
export function isValidTrPhone(raw: string): boolean {
  const d = normalizePhone(raw);
  return d.length === 10 && d.startsWith("5");
}

/** Demo verisiyle aynı görünüm: "+90 5XX XXX XXXX". */
export function formatTrPhone(raw: string): string {
  const d = normalizePhone(raw);
  if (d.length !== 10) return raw;
  return `+90 ${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
}

/** Ad soyad: en az iki kelime, her biri en az iki harf. */
export function isValidName(raw: string): boolean {
  const parts = raw.trim().split(/\s+/).filter(Boolean);
  return parts.length >= 2 && parts.every((p) => p.length >= 2);
}
