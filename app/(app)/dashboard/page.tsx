"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  X,
  Check,
  Phone,
  Clock,
  Star,
  Plus,
  CalendarCheck,
  Share2,
} from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { AreaChart, SegmentedBar } from "@/components/app/charts";
import { useLang } from "@/components/i18n/language-provider";
import { cn, minutesToLabel, minutesToHHMM, formatDuration, formatRelative } from "@/lib/utils";
import appConfig from "@/app.config";
import { useAllAppointments } from "@/lib/demo/store";
import {
  services,
  serviceById,
  staff,
  staffById,
  clients,
  CLIENT_TAG,
  kpis,
  bookingTrend,
  sources,
  sourcesMeta,
  activity,
  upcoming,
  bookingPage,
  dayStartMin,
  dayEndMin,
  slotMin,
  SERVICE_VAR,
  STATUS_META,
  type Appointment,
  type ApptStatus,
} from "@/lib/demo/data";

const DAY_LABELS = ["Dün", "Bugün", "Yarın"];

/** Randevunun geliş yolu — arayüzde Türkçe görünür. */
const SOURCE_LABEL: Record<Appointment["source"], string> = {
  online: "randevu sayfası",
  "walk-in": "kapıdan",
  phone: "telefon",
};

export default function DashboardPage() {
  const { t } = useLang();
  const [dayOffset, setDayOffset] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>("ap3");

  // Demo verisi + randevu sayfasından alınanlar.
  const appointments = useAllAppointments();

  const dayAppts = useMemo(
    () => appointments.filter((a) => a.dayOffset === dayOffset).sort((a, b) => a.startMin - b.startMin),
    [appointments, dayOffset],
  );
  /**
   * "Bugünkü randevu" ve "Online alınan" kartları demo verisinde sabit metindi.
   * Randevu sayfasından gelen kayıtlar da sayılsın diye bugünün listesinden
   * türetiliyor; diğer kartlar `kpis` içindeki değerini korur.
   */
  const liveKpi = useMemo<Record<string, string>>(() => {
    const today = appointments.filter((a) => a.dayOffset === 0);
    return {
      bookings: String(today.length),
      online: String(today.filter((a) => a.source === "online").length),
    };
  }, [appointments]);

  const selected = appointments.find((a) => a.id === selectedId) ?? null;
  const drawerOpen = selected !== null;

  const dayLabel = DAY_LABELS[dayOffset + 1] ?? "Gün";

  return (
    <div className="mx-auto max-w-[1500px] animate-fade-in">
      <div className={cn("grid gap-6", drawerOpen ? "xl:grid-cols-[1fr_360px]" : "grid-cols-1")}>
        {/* ── Ana sütun ────────────────────────────────────────────── */}
        <div className="min-w-0 space-y-6">
          {/* Sayfa başlığı */}
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight">Randevu paneli</h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Bugünün programı, hekim doluluğu ve gelmeyen hastalar — tek ekranda.
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Link
                href={appConfig.bookingPath}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3.5 text-[13px] font-medium text-foreground shadow-pill transition-colors hover:bg-muted"
              >
                <Share2 className="h-4 w-4 text-muted-foreground" />
                Randevu linki
              </Link>
              <button className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-[13px] font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90">
                <Plus className="h-4 w-4" />
                Randevu ekle
              </button>
            </div>
          </div>

          {/* İstatistik satırı */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {kpis.map((k) => {
              const up = (k.delta ?? 0) >= 0;
              // Randevu sayfasından yeni randevu gelince bu iki sayaç canlı artar.
              const value = liveKpi[k.key] ?? k.value;
              return (
                <div key={k.key} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
                  <div className="flex items-center justify-between">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Icon name={k.icon} className="h-[17px] w-[17px]" />
                    </span>
                    {k.delta !== undefined && (
                      <span className={cn("inline-flex items-center gap-0.5 text-[11px] font-semibold", up ? "text-success" : "text-destructive")}>
                        {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {Math.abs(k.delta).toFixed(1)}%
                      </span>
                    )}
                  </div>
                  <p className="mt-3 tnum text-2xl font-bold leading-none text-foreground">{value}</p>
                  <p className="mt-1.5 text-[12.5px] font-medium text-foreground/80">{t(k.label)}</p>
                  <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">{t(k.hint)}</p>
                </div>
              );
            })}
          </div>

          {/* Gün programı (hekim sütunları × saat satırları) */}
          <DaySchedule
            dayOffset={dayOffset}
            dayLabel={dayLabel}
            onPrev={() => setDayOffset((d) => Math.max(-1, d - 1))}
            onNext={() => setDayOffset((d) => Math.min(1, d + 1))}
            appts={dayAppts}
            selectedId={selectedId}
            onSelect={setSelectedId}
            t={t}
          />

          {/* Randevu listesi */}
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
            <div className="flex flex-wrap items-center gap-2.5 border-b border-border p-4">
              <h2 className="font-display text-[15px] font-semibold tracking-tight">Randevular</h2>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                {dayAppts.length}
              </span>
              <div className="ml-auto flex items-center gap-1.5">
                {(["booked", "checked-in", "done", "no-show"] as ApptStatus[]).map((s) => (
                  <span key={s} className="hidden items-center gap-1.5 text-[11px] text-muted-foreground sm:inline-flex">
                    <span className="h-2 w-2 rounded-full" style={{ background: STATUS_META[s].dot }} />
                    {t(STATUS_META[s].label)}
                  </span>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="label-mono py-2.5 pl-4 font-medium text-muted-foreground">Hasta</th>
                    <th className="label-mono py-2.5 font-medium text-muted-foreground">Tedavi</th>
                    <th className="label-mono hidden py-2.5 font-medium text-muted-foreground sm:table-cell">Hekim</th>
                    <th className="label-mono py-2.5 font-medium text-muted-foreground">Saat</th>
                    <th className="label-mono py-2.5 font-medium text-muted-foreground">Durum</th>
                    <th className="label-mono py-2.5 pr-4 text-right font-medium text-muted-foreground">Kaynak</th>
                  </tr>
                </thead>
                <tbody>
                  {dayAppts.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                        Bu gün için randevu yok.
                      </td>
                    </tr>
                  )}
                  {dayAppts.map((a) => {
                    const svc = serviceById(a.serviceId);
                    const stf = staffById(a.staffId);
                    const st = STATUS_META[a.status];
                    const isSel = a.id === selectedId;
                    return (
                      <tr
                        key={a.id}
                        onClick={() => setSelectedId(a.id)}
                        className={cn(
                          "cursor-pointer border-b border-border/60 transition-colors last:border-0",
                          isSel ? "bg-primary/[0.04]" : "hover:bg-muted/50",
                        )}
                      >
                        <td className="py-3 pl-4">
                          <div className="flex items-center gap-2.5">
                            <Avatar initials={a.clientInitials} />
                            <div className="min-w-0">
                              <p className="font-semibold leading-tight">{a.client}</p>
                              <p className="text-[11px] text-muted-foreground">
                                {a.pastVisits === 0 ? "yeni hasta" : `${a.pastVisits} geliş`}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="inline-flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: SERVICE_VAR[svc.color] }} />
                            <span className="font-medium">{t(svc.name)}</span>
                          </span>
                        </td>
                        <td className="hidden py-3 sm:table-cell">
                          <span className="text-[13px] text-muted-foreground">{stf.name}</span>
                        </td>
                        <td className="py-3">
                          <span className="tnum whitespace-nowrap text-[13px] text-muted-foreground">
                            {minutesToHHMM(a.startMin)}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold", st.tone)}>
                            {t(st.label)}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-right">
                          <span className="text-[12px] text-muted-foreground">{SOURCE_LABEL[a.source]}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Randevu eğilimi + kaynak */}
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-[15px] font-semibold tracking-tight">{t(bookingTrend.meta.title)}</h3>
                  <p className="text-xs text-muted-foreground">{t(bookingTrend.meta.subtitle)}</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">
                  <ArrowUpRight className="h-3 w-3" />
                  {bookingTrend.meta.delta}
                </span>
              </div>
              <p className="mt-3 tnum text-2xl font-bold leading-none">{bookingTrend.meta.total} randevu</p>
              <div className="mt-4">
                <AreaChart data={bookingTrend.series} labels={bookingTrend.labels} height={158} />
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <h3 className="font-display text-[15px] font-semibold tracking-tight">{t(sourcesMeta.title)}</h3>
              <p className="text-xs text-muted-foreground">Son 30 gün</p>
              <div className="mt-5">
                <SegmentedBar segments={sources.map((s) => ({ label: t(s.label), value: s.value, color: s.color }))} />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <MiniStat label="Doluluk" value="70%" />
                <MiniStat label="Ort. süre" value="34 dk" />
              </div>
            </div>
          </div>

          {/* Tedaviler / hekimler paneli */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Tedaviler */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
              <div className="flex items-center justify-between border-b border-border p-4">
                <h3 className="font-display text-[15px] font-semibold tracking-tight">Tedaviler</h3>
                <button className="inline-flex items-center gap-1 text-[12px] font-medium text-primary hover:underline">
                  <Plus className="h-3.5 w-3.5" />
                  Ekle
                </button>
              </div>
              <div className="divide-y divide-border/60">
                {services.slice(0, 5).map((s) => (
                  <div key={s.id} className="flex items-center gap-3 px-4 py-2.5">
                    <span className="h-7 w-1.5 rounded-full" style={{ background: SERVICE_VAR[s.color] }} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13.5px] font-medium">{t(s.name)}</p>
                      <p className="tnum text-[11px] text-muted-foreground">
                        {s.bookings30d} randevu · son 30 gün
                      </p>
                    </div>
                    <span className="tnum text-sm font-semibold text-muted-foreground">{formatDuration(s.durationMin)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hekim doluluğu */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
              <div className="flex items-center justify-between border-b border-border p-4">
                <h3 className="font-display text-[15px] font-semibold tracking-tight">Hekimler</h3>
                <span className="text-[12px] text-muted-foreground">bugünkü doluluk</span>
              </div>
              <div className="divide-y divide-border/60">
                {staff.map((s) => (
                  <div key={s.id} className="flex items-center gap-3 px-4 py-2.5">
                    <span className="relative">
                      <Avatar initials={s.initials} />
                      <span className={cn("absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-card", s.online ? "bg-success" : "bg-muted-foreground/40")} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13.5px] font-medium">{s.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {t(s.role)} · {minutesToHHMM(s.startMin)}–{minutesToHHMM(s.endMin)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${s.utilization}%` }} />
                      </div>
                      <span className="tnum w-8 text-right text-[12px] font-semibold text-muted-foreground">{s.utilization}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Hastalar */}
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
            <div className="flex items-center justify-between border-b border-border p-4">
              <h3 className="font-display text-[15px] font-semibold tracking-tight">Hastalar</h3>
              <Link href="/clients" className="inline-flex items-center gap-1 text-[13px] font-medium text-primary hover:underline">
                Tümünü gör
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="label-mono py-2.5 pl-4 font-medium text-muted-foreground">İsim</th>
                    <th className="label-mono hidden py-2.5 font-medium text-muted-foreground sm:table-cell">Etiket</th>
                    <th className="label-mono py-2.5 text-right font-medium text-muted-foreground">Geliş</th>
                    <th className="label-mono py-2.5 pr-4 text-right font-medium text-muted-foreground">Telefon</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.slice(0, 6).map((c) => {
                    const tag = CLIENT_TAG[c.tag];
                    return (
                      <tr key={c.id} className="border-b border-border/60 transition-colors last:border-0 hover:bg-muted/50">
                        <td className="py-3 pl-4">
                          <div className="flex items-center gap-2.5">
                            <Avatar initials={c.initials} />
                            <div className="min-w-0">
                              <p className="font-semibold leading-tight">{c.name}</p>
                              <p className="truncate text-[11px] text-muted-foreground">{c.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="hidden py-3 sm:table-cell">
                          <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase", tag.tone)}>{t(tag.label)}</span>
                        </td>
                        <td className="tnum py-3 text-right text-muted-foreground">{c.visits}</td>
                        <td className="tnum py-3 pr-4 text-right text-[12.5px] text-muted-foreground">{c.phone}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── Sağ çekmece ──────────────────────────────────────────── */}
        {drawerOpen && selected && (
          <aside className="animate-float-up xl:sticky xl:top-2 xl:self-start">
            <AppointmentDrawer appt={selected} onClose={() => setSelectedId(null)} t={t} />

            {/* Yaklaşan / gelmeyen paneli */}
            <div className="mt-5 space-y-3">
              <UpcomingCard
                icon={<CalendarCheck className="h-4 w-4" />}
                tone="info"
                label={t(upcoming.reminders.label)}
                count={upcoming.reminders.count}
                sub={t(upcoming.reminders.sub)}
              />
              <UpcomingCard
                icon={<X className="h-4 w-4" />}
                tone="destructive"
                label={t(upcoming.noShows.label)}
                count={upcoming.noShows.count}
                sub={t(upcoming.noShows.sub)}
              />
              <UpcomingCard
                icon={<Clock className="h-4 w-4" />}
                tone="warning"
                label={t(upcoming.waitlist.label)}
                count={upcoming.waitlist.count}
                sub={t(upcoming.waitlist.sub)}
              />
            </div>

            {/* Randevu sayfası önizlemesi */}
            <BookingPreview t={t} />

            {/* Son hareketler */}
            <div className="mt-5 rounded-2xl border border-border bg-card p-5 shadow-soft">
              <h3 className="font-display text-[15px] font-semibold tracking-tight">Son hareketler</h3>
              <div className="mt-3.5 space-y-3.5">
                {activity.map((a) => (
                  <div key={a.id} className="flex items-start gap-2.5">
                    <span
                      className={cn(
                        "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                        a.tone === "success" ? "bg-success" : a.tone === "warning" ? "bg-warning" : a.tone === "info" ? "bg-info" : "bg-muted-foreground",
                      )}
                    />
                    <div className="min-w-0 text-[13px]">
                      <p className="leading-snug">
                        <span className="font-semibold">{a.who}</span>{" "}
                        <span className="text-muted-foreground">{t(a.action)}</span>{" "}
                        <span className="font-medium">{a.target}</span>
                      </p>
                      <p className="text-[11px] text-muted-foreground">{formatRelative(a.at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

/* ───────────────────────────── Alt bileşenler ───────────────────────────── */

function Avatar({ initials, size = 28 }: { initials: string; size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full bg-muted text-[11px] font-bold text-foreground/70 ring-1 ring-border"
      style={{ width: size, height: size }}
    >
      {initials}
    </span>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border p-3">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-1 tnum text-lg font-bold leading-none">{value}</p>
    </div>
  );
}

function UpcomingCard({
  icon,
  tone,
  label,
  count,
  sub,
}: {
  icon: React.ReactNode;
  tone: "info" | "destructive" | "warning";
  label: string;
  count: number;
  sub: string;
}) {
  const toneCls =
    tone === "info" ? "bg-info/10 text-info" : tone === "destructive" ? "bg-destructive/10 text-destructive" : "bg-warning/15 text-warning-foreground";
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-soft">
      <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-lg", toneCls)}>{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold leading-tight">{label}</p>
        <p className="truncate text-[11px] text-muted-foreground">{sub}</p>
      </div>
      <span className="tnum text-xl font-bold">{count}</span>
    </div>
  );
}

/* ── Gün programı ızgarası (hekim sütunları × saat satırları) ──────────────── */
function DaySchedule({
  dayLabel,
  onPrev,
  onNext,
  appts,
  selectedId,
  onSelect,
  t,
}: {
  dayOffset: number;
  dayLabel: string;
  onPrev: () => void;
  onNext: () => void;
  appts: Appointment[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  t: (v: { tr: string; en: string }) => string;
}) {
  const rowH = 38; // slot başına px
  const totalSlots = (dayEndMin - dayStartMin) / slotMin;
  const gridH = totalSlots * rowH;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      <div className="flex flex-wrap items-center gap-2.5 border-b border-border p-4">
        <h2 className="font-display text-[15px] font-semibold tracking-tight">Gün programı</h2>
        <div className="ml-auto flex items-center gap-1">
          <button onClick={onPrev} aria-label="Önceki gün" className="grid h-8 w-8 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-[88px] text-center text-[13px] font-semibold">{dayLabel}</span>
          <button onClick={onNext} aria-label="Sonraki gün" className="grid h-8 w-8 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[640px]">
          {/* hekim başlıkları */}
          <div className="grid border-b border-border" style={{ gridTemplateColumns: `56px repeat(${staff.length}, 1fr)` }}>
            <div />
            {staff.map((s) => (
              <div key={s.id} className="flex items-center gap-2 px-3 py-2.5">
                <Avatar initials={s.initials} size={26} />
                <div className="min-w-0">
                  <p className="truncate text-[12.5px] font-semibold leading-tight">{s.name}</p>
                  <p className="truncate text-[10px] text-muted-foreground">{t(s.role)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ızgara gövdesi */}
          <div className="grid" style={{ gridTemplateColumns: `56px repeat(${staff.length}, 1fr)` }}>
            {/* saat oluğu */}
            <div className="relative" style={{ height: gridH }}>
              {Array.from({ length: totalSlots + 1 }).map((_, i) => {
                const min = dayStartMin + i * slotMin;
                const isHour = min % 60 === 0;
                return isHour ? (
                  <div key={i} className="absolute right-2 -translate-y-1/2 tnum text-[10px] text-muted-foreground" style={{ top: i * rowH }}>
                    {minutesToHHMM(min)}
                  </div>
                ) : null;
              })}
            </div>

            {/* hekim sütunları */}
            {staff.map((s) => {
              const colAppts = appts.filter((a) => a.staffId === s.id);
              return (
                <div key={s.id} className="relative border-l border-border/60" style={{ height: gridH }}>
                  {/* slot çizgileri */}
                  {Array.from({ length: totalSlots }).map((_, i) => {
                    const min = dayStartMin + i * slotMin;
                    return (
                      <div
                        key={i}
                        className={cn("absolute inset-x-0 border-t", min % 60 === 0 ? "border-border/70" : "border-border/30")}
                        style={{ top: i * rowH, height: rowH }}
                      />
                    );
                  })}
                  {/* randevu blokları */}
                  {colAppts.map((a) => {
                    const svc = serviceById(a.serviceId);
                    const top = ((a.startMin - dayStartMin) / slotMin) * rowH;
                    const height = (svc.durationMin / slotMin) * rowH;
                    const color = SERVICE_VAR[svc.color];
                    const active = a.id === selectedId;
                    const faded = a.status === "no-show";
                    return (
                      <button
                        key={a.id}
                        onClick={() => onSelect(a.id)}
                        className={cn(
                          "absolute inset-x-1 overflow-hidden rounded-md border-l-[3px] px-2 py-1 text-left transition-all hover:z-10 hover:shadow-pop",
                          active ? "z-10 ring-2 ring-offset-1 ring-offset-card" : "",
                          faded && "opacity-55",
                        )}
                        style={{
                          top: top + 1,
                          height: Math.max(height - 2, 22),
                          background: `color-mix(in oklch, ${color} 13%, white)`,
                          borderColor: color,
                          ...(active ? ({ "--tw-ring-color": color } as React.CSSProperties) : {}),
                        }}
                        title={`${a.client} · ${t(svc.name)}`}
                      >
                        <p className="truncate text-[11px] font-semibold leading-tight" style={{ color: `color-mix(in oklch, ${color} 70%, black)` }}>
                          {a.client}
                        </p>
                        {height > 30 && (
                          <p className="truncate text-[10px] text-foreground/60">{t(svc.name)}</p>
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Randevu detay çekmecesi ───────────────────────────────────────────────── */
function AppointmentDrawer({
  appt,
  onClose,
  t,
}: {
  appt: Appointment;
  onClose: () => void;
  t: (v: { tr: string; en: string }) => string;
}) {
  const svc = serviceById(appt.serviceId);
  const stf = staffById(appt.staffId);
  const st = STATUS_META[appt.status];
  const endMin = appt.startMin + svc.durationMin;

  return (
    <div className="space-y-5 rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-[15px] font-semibold tracking-tight">Randevu detayı</h2>
        <button
          onClick={onClose}
          aria-label="Kapat"
          className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Hasta */}
      <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-sm font-bold text-white" style={{ backgroundImage: "var(--grad-brand)" }}>
          {appt.clientInitials}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold leading-tight">{appt.client}</p>
          <p className="tnum truncate text-[11px] text-muted-foreground">{appt.clientPhone}</p>
        </div>
        <a href={`tel:${appt.clientPhone.replace(/\s/g, "")}`} aria-label="Hastayı ara" className="grid h-8 w-8 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <Phone className="h-4 w-4" />
        </a>
      </div>

      {/* Tedavi + saat */}
      <div className="space-y-2.5">
        <Row label="Tedavi">
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: SERVICE_VAR[svc.color] }} />
            {t(svc.name)}
          </span>
        </Row>
        <Row label="Hekim">{stf.name}</Row>
        <Row label="Saat">
          <span className="tnum">{minutesToLabel(appt.startMin)} – {minutesToLabel(endMin)}</span>
        </Row>
        <Row label="Süre">
          <span className="tnum">{formatDuration(svc.durationMin)}</span>
        </Row>
        <Row label="Durum">
          <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold", st.tone)}>{t(st.label)}</span>
        </Row>
        <Row label="Kaynak">
          <span className="text-muted-foreground">{SOURCE_LABEL[appt.source]}</span>
        </Row>
      </div>

      {appt.note && (
        <div className="rounded-xl border border-border bg-muted/30 p-3">
          <p className="label-mono text-muted-foreground">Not</p>
          <p className="mt-1 text-[13px]">{t(appt.note)}</p>
        </div>
      )}

      {/* Hasta geçmişi */}
      <div className="flex items-center justify-between rounded-xl border border-border p-3">
        <p className="label-mono text-muted-foreground">Geçmiş</p>
        <p className="flex items-center gap-1.5 text-sm font-semibold">
          <Star className="h-3.5 w-3.5 text-warning" />
          {appt.pastVisits} geliş
        </p>
      </div>

      {appt.status === "booked" || appt.status === "checked-in" ? (
        <button className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary py-2.5 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90">
          <Check className="h-4 w-4" />
          {appt.status === "booked" ? "Geldi olarak işaretle" : "Tamamlandı işaretle"}
        </button>
      ) : (
        <button className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-card py-2.5 text-[13px] font-semibold text-foreground transition-colors hover:bg-muted">
          Yeni randevu ver
        </button>
      )}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 text-[13px]">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{children}</span>
    </div>
  );
}

/* ── Herkese açık randevu sayfası önizlemesi (mini widget) ─────────────────── */
function BookingPreview({ t }: { t: (v: { tr: string; en: string }) => string }) {
  const opts = bookingPage.options.map(serviceById);
  return (
    <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      <div className="flex items-center justify-between border-b border-border p-4">
        <h3 className="font-display text-[15px] font-semibold tracking-tight">Randevu sayfası</h3>
        <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">
          <span className="h-1.5 w-1.5 rounded-full bg-success pulse-dot" />
          yayında
        </span>
      </div>
      <div className="p-4">
        {/* klinik başlığı */}
        <div className="rounded-xl p-3.5 text-white" style={{ backgroundImage: "var(--grad-brand)" }}>
          <p className="font-display text-base font-bold leading-tight">{bookingPage.business}</p>
          <p className="text-[11px] text-white/80">{t(bookingPage.tagline)}</p>
          <p className="mt-1.5 flex items-center gap-1 text-[11px] text-white/90">
            <Star className="h-3 w-3 fill-white text-white" />
            {bookingPage.rating} · {bookingPage.reviews} yorum
          </p>
        </div>
        {/* tedavi seçenekleri */}
        <p className="mt-3 label-mono text-muted-foreground">Tedavi seç</p>
        <div className="mt-1.5 space-y-1.5">
          {opts.slice(0, 3).map((s, i) => (
            <div key={s.id} className={cn("flex items-center gap-2.5 rounded-lg border px-2.5 py-2", i === 0 ? "border-primary/40 bg-primary/[0.05]" : "border-border")}>
              <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: SERVICE_VAR[s.color] }} />
              <span className="flex-1 text-[12.5px] font-medium">{t(s.name)}</span>
              <span className="tnum text-[12px] text-muted-foreground">{formatDuration(s.durationMin)}</span>
            </div>
          ))}
        </div>
        {/* saatler */}
        <p className="mt-3 label-mono text-muted-foreground">Uygun saatler</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {bookingPage.slots.map((m, i) => (
            <span key={m} className={cn("tnum rounded-md border px-2 py-1 text-[12px]", i === 1 ? "border-primary bg-primary text-primary-foreground" : "border-border text-foreground")}>
              {minutesToHHMM(m)}
            </span>
          ))}
        </div>
        <Link
          href={appConfig.bookingPath}
          target="_blank"
          rel="noreferrer"
          className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary py-2.5 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Randevu sayfasını aç
        </Link>
      </div>
    </div>
  );
}
