"use client";

import { Check, CalendarPlus } from "lucide-react";
import { useLang } from "@/components/i18n/language-provider";
import { Button } from "@/components/ui/button";
import { formatDuration, minutesToHHMM } from "@/lib/utils";
import {
  serviceById,
  staffById,
  bookingPage,
  SERVICE_VAR,
  type Appointment,
} from "@/lib/demo/data";

const DAY_LABEL: Record<number, string> = { 0: "Bugün", 1: "Yarın" };

/**
 * Randevu alındıktan sonraki onay ekranı. Hastanın ekranda görüp
 * doğrulayabileceği tek özet — klinik adı, tedavi, hekim, gün/saat ve telefon.
 */
export function BookingConfirmation({
  appointment,
  onAgain,
}: {
  appointment: Appointment;
  onAgain: () => void;
}) {
  const { t } = useLang();
  const service = serviceById(appointment.serviceId);
  const doc = staffById(appointment.staffId);
  const day = DAY_LABEL[appointment.dayOffset] ?? "Yakında";

  return (
    <div className="mx-auto max-w-lg animate-fade-in px-5 py-12 text-center">
      <span className="animate-pop mx-auto grid h-14 w-14 place-items-center rounded-full bg-success text-success-foreground">
        <Check className="h-7 w-7" strokeWidth={3} />
      </span>

      <h1 className="mt-4 font-display text-2xl font-bold tracking-tight">
        Randevunuz alındı
      </h1>
      <p className="mt-1.5 text-[13.5px] text-muted-foreground">
        {bookingPage.business} · Sizi bekliyoruz, {appointment.client}.
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card text-left shadow-soft">
        <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
          <span
            className="h-3 w-3 shrink-0 rounded-[4px]"
            style={{ background: SERVICE_VAR[service.color] }}
          />
          <span className="flex-1 text-[14px] font-semibold">{t(service.name)}</span>
          <span className="tnum text-[12.5px] text-muted-foreground">
            {formatDuration(service.durationMin)}
          </span>
        </div>
        <dl className="divide-y divide-border">
          <Row label="Gün">{day}</Row>
          <Row label="Saat">
            <span className="tnum">{minutesToHHMM(appointment.startMin)}</span>
          </Row>
          <Row label="Hekim">{doc.name}</Row>
          <Row label="Telefon">
            <span className="tnum">{appointment.clientPhone}</span>
          </Row>
        </dl>
      </div>

      <p className="mt-4 text-[12.5px] text-muted-foreground">
        Randevunuzdan bir gün önce SMS ile hatırlatma göndereceğiz. Değişiklik
        için kliniği arayabilirsiniz.
      </p>

      <Button variant="outline" className="mt-6" onClick={onAgain}>
        <CalendarPlus className="h-4 w-4" />
        Yeni randevu al
      </Button>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-2.5 text-[13px]">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{children}</dd>
    </div>
  );
}
