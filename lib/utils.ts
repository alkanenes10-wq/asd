import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Uygulamanın para birimi. Randevu arayüzünde tutar gösterilmez; bu
 *  yardımcılar tanıtım sayfasındaki paketler ve ileride açılacak ödeme
 *  ekranları için duruyor (bkz. appConfig.features.payments). */
export const CURRENCY = "TRY";

/** Arayüzün tek yerelleştirmesi. */
export const LOCALE = "tr-TR";

export function formatMoney(amount: number, currency: string = CURRENCY) {
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(n: number) {
  return new Intl.NumberFormat(LOCALE).format(n);
}

export function formatPercent(n: number, digits = 1) {
  return `${n > 0 ? "+" : ""}${n.toFixed(digits)}%`;
}

export function formatDate(d: Date | string, opts?: Intl.DateTimeFormatOptions) {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat(
    LOCALE,
    opts ?? { day: "2-digit", month: "short", year: "numeric" },
  ).format(date);
}

export function formatRelative(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  const diff = Date.now() - date.getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "az önce";
  if (m < 60) return `${m} dk önce`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} sa önce`;
  const days = Math.floor(h / 24);
  if (days < 7) return `${days} gün önce`;
  return formatDate(date);
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/** Kuruşu koruyan tutar — ödeme ekranları açıldığında kullanılır. */
export function formatPrice(amount: number, currency: string = CURRENCY) {
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency,
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}

/** Gece yarısından itibaren dakika → "09:30". Klinikte 24 saat kullanılır. */
export function minutesToLabel(min: number) {
  return minutesToHHMM(min);
}

/** Minutes since midnight → "09:30" (24h, used for compact slot chips). */
export function minutesToHHMM(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Süre (dakika) → "1 sa 30 dk" / "45 dk". */
export function formatDuration(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h && m) return `${h} sa ${m} dk`;
  if (h) return `${h} sa`;
  return `${m} dk`;
}

/** Add a positive sign and a percent. */
export function deltaLabel(n: number, digits = 1) {
  return `${n > 0 ? "+" : ""}${n.toFixed(digits)}%`;
}
