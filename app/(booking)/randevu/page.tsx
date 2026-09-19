import type { Metadata } from "next";
import appConfig from "@/app.config";
import { BookingFlow } from "@/components/booking/booking-flow";
import { bookingPage } from "@/lib/demo/data";
import { DEFAULT_LANG, pick } from "@/lib/i18n/config";

export const metadata: Metadata = {
  title: `Randevu al · ${bookingPage.business} — ${appConfig.name}`,
  description: pick(bookingPage.tagline, DEFAULT_LANG),
};

/**
 * Kliniğin paylaştığı halka açık randevu sayfası. Giriş gerektirmez.
 * Marka (üstteki logo) `app/(booking)/layout.tsx` tarafından basılır.
 */
export default function RandevuPage() {
  return <BookingFlow />;
}
