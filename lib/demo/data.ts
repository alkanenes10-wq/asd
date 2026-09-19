/**
 * Demo verisi — seansapp'i tek bir API anahtarı olmadan canlı gösteren örnek
 * klinik günü. Etiketler { tr, en } tipinde; arayüz Türkçesini kullanır.
 * Özel adlar (hasta adı, e-posta) olduğu gibi kalır. Supabase bağlandığında
 * yerini gerçek sorgular alır.
 *
 * Model bir diş kliniğini anlatır: tedaviler, hekimler, hastalar ve
 * hekim × saat ızgarasına yerleşmiş bir günlük randevu listesi.
 *
 * NOT: `price` / `deposit` alanları tipte duruyor ama arayüzde
 * gösterilmiyor (bkz. appConfig.features). Randevu odaklı ürün için 0'lar.
 */
import type { L } from "@/lib/i18n/config";

/* ── Tedaviler ──────────────────────────────────────────────────────────────
   Her tedavinin bir süresi ve bir renk anahtarı var; renk, gün programındaki
   bloğu ve her yerdeki lejantı belirler. */
export type ServiceColor = "muayene" | "temizlik" | "dolgu" | "kanal" | "implant" | "ortodonti";

export interface Service {
  id: string;
  name: L;
  durationMin: number;
  /** Ücret — arayüzde gösterilmiyor, ödeme modülü açılınca kullanılır. */
  price: number;
  color: ServiceColor;
  /** Slotu tutmak için istenen kapora (0 = yok). Şimdilik kullanılmıyor. */
  deposit: number;
  bookings30d: number;
}

export const SERVICE_VAR: Record<ServiceColor, string> = {
  muayene: "var(--svc-muayene)",
  temizlik: "var(--svc-temizlik)",
  dolgu: "var(--svc-dolgu)",
  kanal: "var(--svc-kanal)",
  implant: "var(--svc-implant)",
  ortodonti: "var(--svc-ortodonti)",
};

export const services: Service[] = [
  { id: "s1", name: { tr: "Muayene & kontrol", en: "Check-up" }, durationMin: 20, price: 0, color: "muayene", deposit: 0, bookings30d: 186 },
  { id: "s2", name: { tr: "Diş taşı temizliği", en: "Scale & polish" }, durationMin: 30, price: 0, color: "temizlik", deposit: 0, bookings30d: 124 },
  { id: "s3", name: { tr: "Dolgu", en: "Filling" }, durationMin: 45, price: 0, color: "dolgu", deposit: 0, bookings30d: 98 },
  { id: "s4", name: { tr: "Kanal tedavisi", en: "Root canal" }, durationMin: 60, price: 0, color: "kanal", deposit: 0, bookings30d: 42 },
  { id: "s5", name: { tr: "İmplant konsültasyonu", en: "Implant consult" }, durationMin: 30, price: 0, color: "implant", deposit: 0, bookings30d: 37 },
  { id: "s6", name: { tr: "Ortodonti kontrolü", en: "Orthodontic check" }, durationMin: 20, price: 0, color: "ortodonti", deposit: 0, bookings30d: 71 },
  { id: "s7", name: { tr: "Diş beyazlatma", en: "Whitening" }, durationMin: 45, price: 0, color: "ortodonti", deposit: 0, bookings30d: 29 },
];

export function serviceById(id: string) {
  return services.find((s) => s.id === id)!;
}

/* ── Hekimler ───────────────────────────────────────────────────────────────
   Gün programındaki sütunlar. Her birinin unvanı, çalışma aralığı ve
   doluluğu var. */
export interface Staff {
  id: string;
  name: string;
  initials: string;
  role: L;
  /** Çalışma aralığı — gece yarısından itibaren dakika. */
  startMin: number;
  endMin: number;
  /** Bugünkü doluluk (%). */
  utilization: number;
  online: boolean;
}

export const staff: Staff[] = [
  { id: "st1", name: "Dt. Selin Aydın", initials: "SA", role: { tr: "Diş hekimi", en: "Dentist" }, startMin: 9 * 60, endMin: 18 * 60, utilization: 86, online: true },
  { id: "st2", name: "Dt. Mert Kaya", initials: "MK", role: { tr: "Diş hekimi", en: "Dentist" }, startMin: 9 * 60, endMin: 17 * 60, utilization: 74, online: true },
  { id: "st3", name: "Dr. Dt. Aylin Demir", initials: "AD", role: { tr: "Ortodonti uzmanı", en: "Orthodontist" }, startMin: 10 * 60, endMin: 18 * 60, utilization: 62, online: true },
  { id: "st4", name: "Cem Yıldız", initials: "CY", role: { tr: "Ağız-diş sağlığı asistanı", en: "Dental assistant" }, startMin: 8 * 60, endMin: 16 * 60, utilization: 58, online: false },
];

export function staffById(id: string) {
  return staff.find((s) => s.id === id)!;
}

/* ── Schedule window (the day grid bounds) ──────────────────────────────────── */
export const dayStartMin = 8 * 60; // 08:00
export const dayEndMin = 19 * 60; // 19:00
export const slotMin = 30; // grid row granularity

/* ── Randevular ─────────────────────────────────────────────────────────────
   Canlı liste + ızgara blokları. `startMin` seçili gündeki gece yarısından
   itibaren dakika; `dayOffset` birkaç kaydı komşu günlere taşır ki gün
   gezinmesinde içerik olsun. */
export type ApptStatus = "booked" | "checked-in" | "done" | "no-show";

export interface Appointment {
  id: string;
  client: string;
  clientInitials: string;
  clientPhone: string;
  serviceId: string;
  staffId: string;
  /** "Bugün"e göre gün farkı (0 = bugün, -1 dün, 1 yarın). */
  dayOffset: number;
  startMin: number;
  status: ApptStatus;
  /** Tutar — arayüzde gösterilmiyor, ödeme modülü için duruyor. */
  price: number;
  paid: boolean;
  /** Randevunun geliş yolu: randevu sayfası, kapıdan ya da telefon. */
  source: "online" | "walk-in" | "phone";
  /** Bundan önceki geliş sayısı. */
  pastVisits: number;
  note?: L;
}

export const STATUS_META: Record<ApptStatus, { label: L; tone: string; dot: string }> = {
  booked: { label: { tr: "randevulu", en: "booked" }, tone: "text-info bg-info/10", dot: "var(--color-info)" },
  "checked-in": { label: { tr: "geldi", en: "checked-in" }, tone: "text-primary bg-primary/10", dot: "var(--color-primary)" },
  done: { label: { tr: "tamamlandı", en: "done" }, tone: "text-success bg-success/10", dot: "var(--color-success)" },
  "no-show": { label: { tr: "gelmedi", en: "no-show" }, tone: "text-destructive bg-destructive/10", dot: "var(--color-destructive)" },
};

export const appointments: Appointment[] = [
  { id: "ap1", client: "Elif Şahin", clientInitials: "EŞ", clientPhone: "+90 532 110 4421", serviceId: "s1", staffId: "st1", dayOffset: 0, startMin: 9 * 60, status: "done", price: 0, paid: false, source: "online", pastVisits: 7, note: { tr: "Sol alt 6 numarada hassasiyet.", en: "Sensitivity on the lower left molar." } },
  { id: "ap2", client: "Burak Öz", clientInitials: "BÖ", clientPhone: "+90 535 220 8830", serviceId: "s2", staffId: "st2", dayOffset: 0, startMin: 9 * 60 + 30, status: "done", price: 0, paid: false, source: "walk-in", pastVisits: 3 },
  { id: "ap3", client: "Deniz Arslan", clientInitials: "DA", clientPhone: "+90 530 441 2210", serviceId: "s4", staffId: "st1", dayOffset: 0, startMin: 10 * 60, status: "checked-in", price: 0, paid: false, source: "phone", pastVisits: 12, note: { tr: "İkinci seans — panoramik film mevcut.", en: "Second session — panoramic X-ray on file." } },
  { id: "ap4", client: "Zeynep Korkmaz", clientInitials: "ZK", clientPhone: "+90 538 902 1144", serviceId: "s6", staffId: "st3", dayOffset: 0, startMin: 10 * 60 + 30, status: "checked-in", price: 0, paid: false, source: "online", pastVisits: 5, note: { tr: "Tel kontrolü, lastik değişimi.", en: "Braces check, elastics change." } },
  { id: "ap5", client: "Kerem Aslan", clientInitials: "KA", clientPhone: "+90 533 700 5512", serviceId: "s5", staffId: "st1", dayOffset: 0, startMin: 11 * 60, status: "booked", price: 0, paid: false, source: "online", pastVisits: 21, note: { tr: "Alt çene arka bölge implant planı.", en: "Implant plan for the lower posterior." } },
  { id: "ap6", client: "Naz Yılmaz", clientInitials: "NY", clientPhone: "+90 536 318 7740", serviceId: "s3", staffId: "st2", dayOffset: 0, startMin: 12 * 60, status: "booked", price: 0, paid: false, source: "phone", pastVisits: 2 },
  { id: "ap7", client: "Ahmet Çelik", clientInitials: "AÇ", clientPhone: "+90 532 555 9081", serviceId: "s1", staffId: "st1", dayOffset: 0, startMin: 12 * 60 + 30, status: "booked", price: 0, paid: false, source: "phone", pastVisits: 9 },
  { id: "ap8", client: "Sıla Demir", clientInitials: "SD", clientPhone: "+90 535 642 3320", serviceId: "s1", staffId: "st2", dayOffset: 0, startMin: 13 * 60, status: "booked", price: 0, paid: false, source: "online", pastVisits: 0, note: { tr: "İlk geliş — anamnez formu alınacak.", en: "First visit — take the medical history form." } },
  { id: "ap9", client: "Onur Kılıç", clientInitials: "OK", clientPhone: "+90 530 904 6651", serviceId: "s7", staffId: "st3", dayOffset: 0, startMin: 14 * 60, status: "booked", price: 0, paid: false, source: "online", pastVisits: 1 },
  { id: "ap10", client: "Ece Polat", clientInitials: "EP", clientPhone: "+90 538 233 1190", serviceId: "s3", staffId: "st1", dayOffset: 0, startMin: 14 * 60 + 30, status: "booked", price: 0, paid: false, source: "online", pastVisits: 6, note: { tr: "Lokal anestezi alerjisi yok.", en: "No local anaesthetic allergy." } },
  { id: "ap11", client: "Tolga Ak", clientInitials: "TA", clientPhone: "+90 533 118 7702", serviceId: "s2", staffId: "st4", dayOffset: 0, startMin: 13 * 60, status: "no-show", price: 0, paid: false, source: "online", pastVisits: 4 },
  { id: "ap12", client: "Pınar Güneş", clientInitials: "PG", clientPhone: "+90 536 770 2231", serviceId: "s4", staffId: "st3", dayOffset: 0, startMin: 15 * 60 + 30, status: "booked", price: 0, paid: false, source: "phone", pastVisits: 8 },
  { id: "ap13", client: "Barış Yatağan", clientInitials: "BY", clientPhone: "+90 532 449 1187", serviceId: "s2", staffId: "st2", dayOffset: 0, startMin: 15 * 60, status: "booked", price: 0, paid: false, source: "walk-in", pastVisits: 11 },
  { id: "ap14", client: "Melis Acar", clientInitials: "MA", clientPhone: "+90 535 661 3309", serviceId: "s1", staffId: "st1", dayOffset: 0, startMin: 16 * 60 + 30, status: "booked", price: 0, paid: false, source: "online", pastVisits: 14 },
  // komşu günler (gün gezinmesinde içerik olsun diye)
  { id: "ap15", client: "Hakan Şen", clientInitials: "HŞ", clientPhone: "+90 533 200 4410", serviceId: "s6", staffId: "st3", dayOffset: 1, startMin: 9 * 60, status: "booked", price: 0, paid: false, source: "online", pastVisits: 3 },
  { id: "ap16", client: "Defne Toprak", clientInitials: "DT", clientPhone: "+90 536 884 2218", serviceId: "s4", staffId: "st1", dayOffset: 1, startMin: 11 * 60, status: "booked", price: 0, paid: false, source: "phone", pastVisits: 5 },
  { id: "ap17", client: "Yusuf Eren", clientInitials: "YE", clientPhone: "+90 532 071 9923", serviceId: "s2", staffId: "st2", dayOffset: -1, startMin: 10 * 60, status: "done", price: 0, paid: false, source: "walk-in", pastVisits: 6 },
];

/* ── İstatistik satırı (bugün) ──────────────────────────────────────────────── */
export interface DKpi {
  key: string;
  label: L;
  value: string;
  delta?: number;
  icon: string;
  hint: L;
}

export const kpis: DKpi[] = [
  { key: "bookings", label: { tr: "Bugünkü randevu", en: "Bookings today" }, value: "14", delta: 9.2, icon: "calendar-check", hint: { tr: "dün 12", en: "12 yesterday" } },
  { key: "online", label: { tr: "Online alınan", en: "Booked online" }, value: "9", delta: 22.0, icon: "globe", hint: { tr: "telefon yerine", en: "instead of phone" } },
  { key: "utilization", label: { tr: "Doluluk", en: "Utilization" }, value: "70%", delta: 4.1, icon: "gauge", hint: { tr: "4 hekim ort.", en: "avg of 4 dentists" } },
  { key: "clients", label: { tr: "Yeni hasta", en: "New patients" }, value: "5", delta: -2.0, icon: "user-plus", hint: { tr: "bu hafta", en: "this week" } },
];

/* ── Zaman içinde randevu adedi ─────────────────────────────────────────────── */
export const bookingTrend = {
  meta: {
    title: { tr: "Randevu adedi", en: "Appointments" } as L,
    subtitle: { tr: "Son 14 gün", en: "Last 14 days" } as L,
    delta: "+14.6%",
    total: 168,
  },
  series: [9, 11, 8, 13, 12, 9, 16, 17, 14, 12, 17, 15, 14, 14],
  labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14"],
};

/* ── Randevunun geliş yolu (bölmeli çubuk) ──────────────────────────────────── */
export const sourcesMeta = { title: { tr: "Randevu kaynağı", en: "Booking source" } as L };
export const sources: { label: L; value: number; color: string }[] = [
  { label: { tr: "Randevu sayfası", en: "Booking page" }, value: 58, color: "var(--seg-1)" },
  { label: { tr: "Telefon", en: "Phone" }, value: 24, color: "var(--seg-2)" },
  { label: { tr: "Tekrar gelen", en: "Returning" }, value: 12, color: "var(--seg-3)" },
  { label: { tr: "Kapıdan", en: "Walk-in" }, value: 6, color: "var(--seg-4)" },
];

/* ── Hastalar ───────────────────────────────────────────────────────────────── */
export interface Client {
  id: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  visits: number;
  /** Toplam harcama — arayüzde gösterilmiyor, ödeme modülü için duruyor. */
  spend: number;
  lastVisit: string;
  tag: "vip" | "regular" | "new" | "lapsed";
}

export const CLIENT_TAG: Record<Client["tag"], { label: L; tone: string }> = {
  vip: { label: { tr: "düzenli takip", en: "recall" }, tone: "text-primary bg-primary/10" },
  regular: { label: { tr: "kayıtlı", en: "regular" }, tone: "text-info bg-info/10" },
  new: { label: { tr: "yeni", en: "new" }, tone: "text-success bg-success/10" },
  lapsed: { label: { tr: "uzun süredir gelmedi", en: "lapsed" }, tone: "text-warning-foreground bg-warning/15" },
};

export const clients: Client[] = [
  { id: "c1", name: "Elif Şahin", initials: "EŞ", email: "elif@example.com", phone: "+90 532 110 4421", visits: 8, spend: 0, lastVisit: "2026-06-14", tag: "vip" },
  { id: "c2", name: "Kerem Aslan", initials: "KA", email: "kerem@example.com", phone: "+90 533 700 5512", visits: 22, spend: 0, lastVisit: "2026-06-14", tag: "vip" },
  { id: "c3", name: "Deniz Arslan", initials: "DA", email: "deniz@example.com", phone: "+90 530 441 2210", visits: 13, spend: 0, lastVisit: "2026-06-14", tag: "vip" },
  { id: "c4", name: "Ahmet Çelik", initials: "AÇ", email: "ahmet@example.com", phone: "+90 532 555 9081", visits: 10, spend: 0, lastVisit: "2026-06-12", tag: "regular" },
  { id: "c5", name: "Pınar Güneş", initials: "PG", email: "pinar@example.com", phone: "+90 536 770 2231", visits: 9, spend: 0, lastVisit: "2026-06-11", tag: "regular" },
  { id: "c6", name: "Sıla Demir", initials: "SD", email: "sila@example.com", phone: "+90 535 642 3320", visits: 1, spend: 0, lastVisit: "2026-06-14", tag: "new" },
  { id: "c7", name: "Onur Kılıç", initials: "OK", email: "onur@example.com", phone: "+90 530 904 6651", visits: 2, spend: 0, lastVisit: "2026-06-14", tag: "new" },
  { id: "c8", name: "Tolga Ak", initials: "TA", email: "tolga@example.com", phone: "+90 533 118 7702", visits: 5, spend: 0, lastVisit: "2026-05-02", tag: "lapsed" },
];

/* ── Yaklaşan / gelmeyen paneli ─────────────────────────────────────────────── */
export const upcoming = {
  reminders: {
    label: { tr: "Yarınki hatırlatmalar", en: "Tomorrow's reminders" } as L,
    count: 9,
    sub: { tr: "SMS · 18:00'de gönderilir", en: "SMS · sent at 18:00" } as L,
  },
  noShows: {
    label: { tr: "Bu hafta gelmeyen", en: "No-shows this week" } as L,
    count: 3,
    recovered: 2,
    sub: { tr: "2 hastaya yeni randevu verildi", en: "2 patients rebooked" } as L,
  },
  waitlist: {
    label: { tr: "Bekleme listesi", en: "Waitlist" } as L,
    count: 4,
    sub: { tr: "iptal olursa otomatik teklif", en: "auto-offered on cancellation" } as L,
  },
};

/* ── Herkese açık randevu sayfası önizlemesi ────────────────────────────────── */
export const bookingPage = {
  business: "Özel Karabük Diş Kliniği",
  tagline: { tr: "Ağız ve diş sağlığı · Karabük", en: "Dental care · Karabük" } as L,
  rating: 4.9,
  reviews: 312,
  /** Herkese açık widget'ın sunduğu tedaviler. */
  options: ["s1", "s2", "s3", "s6"],
  /** Seçili gün için boş saatler (gece yarısından itibaren dakika). */
  slots: [9 * 60, 10 * 60 + 30, 11 * 60, 13 * 60, 14 * 60 + 30, 16 * 60],
};

/* ── Son hareketler ─────────────────────────────────────────────────────────── */
export interface DActivity {
  id: string;
  who: string;
  action: L;
  target: string;
  at: string;
  tone: "neutral" | "success" | "warning" | "info";
}

export const activity: DActivity[] = [
  { id: "a1", who: "Elif Şahin", action: { tr: "online randevu aldı:", en: "booked online:" }, target: "Muayene & kontrol", at: "2026-06-14T09:42:00Z", tone: "success" },
  { id: "a2", who: "Tolga Ak", action: { tr: "gelmedi —", en: "no-show —" }, target: "yeni randevu önerildi", at: "2026-06-14T13:05:00Z", tone: "warning" },
  { id: "a3", who: "Sıla Demir", action: { tr: "ilk randevusunu aldı:", en: "first booking:" }, target: "Muayene & kontrol", at: "2026-06-14T08:20:00Z", tone: "info" },
  { id: "a4", who: "Deniz Arslan", action: { tr: "randevusunu erteledi:", en: "rescheduled:" }, target: "Kanal tedavisi", at: "2026-06-14T07:55:00Z", tone: "neutral" },
  { id: "a5", who: "Sistem", action: { tr: "hatırlatma gönderdi:", en: "sent reminders:" }, target: "9 hasta", at: "2026-06-14T06:00:00Z", tone: "neutral" },
];

/* ── Tanıtım sayfasındaki etkileşimli demo ──────────────────────────────────── */
export const demoServices = ["s1", "s2", "s3"];
export const demoSlots = [
  { min: 10 * 60, label: "10:00" },
  { min: 11 * 60 + 30, label: "11:30" },
  { min: 14 * 60, label: "14:00" },
  { min: 16 * 60, label: "16:00" },
];
