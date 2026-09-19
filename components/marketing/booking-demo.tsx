"use client";

import { useState } from "react";
import { Check, Clock, CalendarPlus, Stethoscope } from "lucide-react";
import { useLang } from "@/components/i18n/language-provider";
import { cn, formatDuration, minutesToHHMM } from "@/lib/utils";
import { serviceById, SERVICE_VAR, demoServices, demoSlots } from "@/lib/demo/data";

interface Booked {
  serviceId: string;
  slotMin: number;
  client: string;
}

const CLIENTS = ["Ayşe", "Mehmet", "Elif", "Emre", "Zeynep", "Deniz"];

/**
 * Tanıtım sayfasındaki etkileşimli demo: hasta bir tedavi ve saat seçer,
 * randevu alır; randevu gün şeridine düşer ve bugünkü randevu sayacı artar.
 * Saf useState — bağımlılık yok. Sıfırlanabilir.
 */
export function BookingDemo() {
  const { t } = useLang();
  const [serviceId, setServiceId] = useState(demoServices[0]);
  const [slot, setSlot] = useState<number | null>(null);
  const [booked, setBooked] = useState<Booked[]>([]);
  const [pulse, setPulse] = useState(false);

  const baseCount = 12;
  const totalToday = baseCount + booked.length;
  const takenSlots = new Set(booked.map((b) => b.slotMin));

  function book() {
    if (slot === null || takenSlots.has(slot)) return;
    const client = CLIENTS[booked.length % CLIENTS.length];
    setBooked((b) => [...b, { serviceId, slotMin: slot, client }]);
    setSlot(null);
    setPulse(true);
    setTimeout(() => setPulse(false), 600);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      {/* ── Left: the public booking widget ───────────────────────── */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
            <Stethoscope className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[13px] font-semibold leading-tight">Hasta görünümü</p>
            <p className="text-[11px] text-muted-foreground">kliniğinizin randevu sayfası</p>
          </div>
        </div>

        {/* tedavi seçimi */}
        <p className="mt-4 label-mono text-muted-foreground">1 · Tedavi</p>
        <div className="mt-2 space-y-2">
          {demoServices.map((id) => {
            const s = serviceById(id);
            const sel = id === serviceId;
            return (
              <button
                key={id}
                onClick={() => setServiceId(id)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left transition-colors",
                  sel ? "border-primary/50 bg-primary/[0.05]" : "border-border hover:bg-muted/50",
                )}
              >
                <span className="h-3 w-3 rounded-[4px]" style={{ background: SERVICE_VAR[s.color] }} />
                <span className="min-w-0 flex-1 truncate text-[13px] font-medium">{t(s.name)}</span>
                <span className="tnum text-[12px] text-muted-foreground">{formatDuration(s.durationMin)}</span>
                {sel && (
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* saat seçimi */}
        <p className="mt-4 label-mono text-muted-foreground">2 · Saat</p>
        <div className="mt-2 grid grid-cols-4 gap-1.5">
          {demoSlots.map((s) => {
            const taken = takenSlots.has(s.min);
            const sel = slot === s.min;
            return (
              <button
                key={s.min}
                disabled={taken}
                onClick={() => setSlot(s.min)}
                className={cn(
                  "tnum rounded-md border py-1.5 text-center text-[12.5px] transition-colors",
                  taken
                    ? "cursor-not-allowed border-border/60 bg-muted text-muted-foreground/40 line-through"
                    : sel
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-foreground hover:border-primary/50",
                )}
              >
                {s.label}
              </button>
            );
          })}
        </div>

        <button
          onClick={book}
          disabled={slot === null}
          className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary py-2.5 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          <CalendarPlus className="h-4 w-4" />
          Randevu al
        </button>
        {booked.length > 0 && (
          <button onClick={() => setBooked([])} className="mt-2 w-full text-center text-[11px] text-muted-foreground hover:text-foreground">
            Demoyu sıfırla
          </button>
        )}
      </div>

      {/* ── Sağ: kliniğin gün şeridi + randevu sayacı ──────────────── */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[13px] font-semibold leading-tight">Klinik paneli</p>
            <p className="text-[11px] text-muted-foreground">anında güncellenir</p>
          </div>
          <div className={cn("rounded-xl border border-border bg-muted/40 px-3 py-1.5 text-right transition-transform", pulse && "animate-pop")}>
            <p className="label-mono text-muted-foreground">Bugünkü randevu</p>
            <p className="tnum text-lg font-bold leading-none text-foreground">{totalToday}</p>
          </div>
        </div>

        {/* day strip */}
        <div className="mt-4 space-y-1.5">
          {demoSlots.map((s) => {
            const b = booked.find((x) => x.slotMin === s.min);
            const svcB = b ? serviceById(b.serviceId) : null;
            return (
              <div key={s.min} className="flex items-center gap-3">
                <span className="tnum w-12 shrink-0 text-[11px] text-muted-foreground">{minutesToHHMM(s.min)}</span>
                {b && svcB ? (
                  <div
                    className="animate-pop flex flex-1 items-center gap-2 overflow-hidden rounded-md border-l-[3px] px-2.5 py-1.5"
                    style={{ background: `color-mix(in oklch, ${SERVICE_VAR[svcB.color]} 13%, white)`, borderColor: SERVICE_VAR[svcB.color] }}
                  >
                    <span className="text-[12px] font-semibold" style={{ color: `color-mix(in oklch, ${SERVICE_VAR[svcB.color]} 70%, black)` }}>
                      {b.client}
                    </span>
                    <span className="truncate text-[11px] text-foreground/60">{t(svcB.name)}</span>
                    <span className="tnum ml-auto text-[11px] font-semibold text-foreground/70">{formatDuration(svcB.durationMin)}</span>
                  </div>
                ) : (
                  <div className="flex flex-1 items-center rounded-md border border-dashed border-border px-2.5 py-1.5 text-[11px] text-muted-foreground/60">
                    boş
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2 text-[12px] text-muted-foreground">
          <Clock className="h-3.5 w-3.5 text-primary" />
          {booked.length === 0
            ? "Bir tedavi ve saat seçin, sonra randevu alın →"
            : `${booked.length} randevu eklendi · ${booked.length} SMS hatırlatma kuyruğa alındı`}
        </div>
      </div>
    </div>
  );
}
