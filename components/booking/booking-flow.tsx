"use client";

import { useMemo, useState } from "react";
import { Check, Star, CalendarPlus, Loader2 } from "lucide-react";
import { useLang } from "@/components/i18n/language-provider";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { BookingConfirmation } from "@/components/booking/booking-confirmation";
import { cn, formatDuration, minutesToHHMM } from "@/lib/utils";
import {
  services,
  serviceById,
  staff,
  bookingPage,
  SERVICE_VAR,
  type Appointment,
} from "@/lib/demo/data";
import { useAllAppointments, addBooking } from "@/lib/demo/store";
import {
  slotsForDay,
  unionSlots,
  isSlotFree,
  firstFreeStaff,
  formatTrPhone,
  isValidTrPhone,
  isValidName,
} from "@/lib/booking";

/** "Fark etmez" hekim seçeneğinin anahtarı. */
const ANY = "any";

/**
 * Yalnızca Bugün ve Yarın. Panelin gün gezinmesi -1..+1 ile sınırlı
 * (`dashboard/page.tsx:124-125`, `calendar/page.tsx:52-56`); daha ileri bir gün
 * için alınan randevu klinik panelinde hiç görünmezdi.
 */
const DAYS: { offset: number; label: string }[] = [
  { offset: 0, label: "Bugün" },
  { offset: 1, label: "Yarın" },
];

/**
 * Hastaya açık randevu akışı: tedavi → hekim → gün → saat → iletişim.
 * Tek sayfada, numaralandırılmış adımlarla; tanıtım sayfasındaki
 * `booking-demo.tsx` widget'ının görsel dili sürdürülür.
 */
export function BookingFlow() {
  const { t } = useLang();
  const existing = useAllAppointments();

  const [serviceId, setServiceId] = useState(bookingPage.options[0] ?? services[0].id);
  const [staffId, setStaffId] = useState<string>(ANY);
  const [dayOffset, setDayOffset] = useState(0);
  const [slot, setSlot] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<Appointment | null>(null);

  const service = serviceById(serviceId);
  /** Asistan randevu almaz — yalnızca hekimler listelenir. */
  const dentists = useMemo(() => staff.filter((s) => s.id !== "st4"), []);

  const slots = useMemo(
    () =>
      staffId === ANY
        ? unionSlots(dentists, dayOffset, service, existing)
        : slotsForDay(staffId, dayOffset, service, existing),
    [staffId, dayOffset, service, existing, dentists],
  );

  const freeCount = slots.filter((s) => s.available).length;

  /** Seçim değiştiğinde artık geçerli olmayan saati düşür. */
  function reselect(next: () => void) {
    next();
    setSlot(null);
    setError(null);
  }

  const nameOk = isValidName(name);
  const phoneOk = isValidTrPhone(phone);

  /**
   * Düğme yalnızca gönderim sürerken kilitlenir. Eksik alan varsa tıklama
   * engellenmez — tıklayınca hangi alanın eksik olduğu gösterilir. Düğmeyi
   * devre dışı bırakmak, hata mesajı hiç görünmediği için sessiz bir çıkmaz
   * yaratıyordu.
   */
  const missing = slot === null ? "saat" : !nameOk ? "ad" : !phoneOk ? "telefon" : null;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);

    if (slot === null) {
      setError("Önce bir saat seçin.");
      document.getElementById("saat-adimi")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (!nameOk) {
      setError(null);
      document.getElementById("ad")?.focus();
      return;
    }
    if (!phoneOk) {
      setError(null);
      document.getElementById("tel")?.focus();
      return;
    }

    // Seçim yapıldıktan sonra o saat dolmuş olabilir — son kontrol.
    const assigned =
      staffId === ANY
        ? firstFreeStaff(dentists, dayOffset, service, slot, existing)
        : isSlotFree(staffId, dayOffset, service, slot, existing)
          ? dentists.find((s) => s.id === staffId) ?? null
          : null;

    if (!assigned) {
      setSlot(null);
      setError("Bu saat az önce doldu. Lütfen başka bir saat seçin.");
      return;
    }

    setSubmitting(true);
    setError(null);
    const appt = addBooking({
      client: name,
      clientPhone: formatTrPhone(phone),
      serviceId,
      staffId: assigned.id,
      dayOffset,
      startMin: slot,
      note,
    });
    // Kısa bir bekleme, gerçek bir gönderim hissi verir.
    setTimeout(() => {
      setSubmitting(false);
      setDone(appt);
    }, 450);
  }

  function reset() {
    setDone(null);
    setSlot(null);
    setName("");
    setPhone("");
    setNote("");
    setTouched(false);
    setError(null);
  }

  if (done) {
    return <BookingConfirmation appointment={done} onAgain={reset} />;
  }

  return (
    <div className="mx-auto max-w-3xl animate-fade-in px-5 py-8">
      {/* ── Klinik başlığı ─────────────────────────────────────────── */}
      <div
        className="rounded-2xl p-5 text-white shadow-soft"
        style={{ backgroundImage: "var(--grad-brand)" }}
      >
        <h1 className="font-display text-xl font-bold leading-tight sm:text-2xl">
          {bookingPage.business}
        </h1>
        <p className="mt-0.5 text-[13px] text-white/80">{t(bookingPage.tagline)}</p>
        <p className="mt-2 flex items-center gap-1.5 text-[12.5px] text-white/90">
          <Star className="h-3.5 w-3.5 fill-white text-white" />
          <span className="tnum">{bookingPage.rating}</span> · {bookingPage.reviews} yorum
        </p>
      </div>

      <p className="mt-5 text-[13.5px] text-muted-foreground">
        Randevunuzu birkaç adımda oluşturun. Kayıt olmanıza gerek yok.
      </p>

      <form onSubmit={submit} className="mt-5 space-y-5" noValidate>
        {/* ── 1 · Tedavi ───────────────────────────────────────────── */}
        <Section step={1} title="Tedavi">
          <div className="grid gap-2 sm:grid-cols-2">
            {services.map((s) => {
              const sel = s.id === serviceId;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => reselect(() => setServiceId(s.id))}
                  aria-pressed={sel}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left transition-colors",
                    sel
                      ? "border-primary/50 bg-primary/[0.05]"
                      : "border-border hover:bg-muted/50",
                  )}
                >
                  <span
                    className="h-3 w-3 shrink-0 rounded-[4px]"
                    style={{ background: SERVICE_VAR[s.color] }}
                  />
                  <span className="min-w-0 flex-1 truncate text-[13px] font-medium">
                    {t(s.name)}
                  </span>
                  <span className="tnum shrink-0 text-[12px] text-muted-foreground">
                    {formatDuration(s.durationMin)}
                  </span>
                  {sel && (
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </Section>

        {/* ── 2 · Hekim ────────────────────────────────────────────── */}
        <Section step={2} title="Hekim">
          <div className="grid gap-2 sm:grid-cols-2">
            <StaffCard
              selected={staffId === ANY}
              onClick={() => reselect(() => setStaffId(ANY))}
              initials="—"
              name="Fark etmez"
              role="ilk müsait hekime atanır"
            />
            {dentists.map((d) => (
              <StaffCard
                key={d.id}
                selected={staffId === d.id}
                onClick={() => reselect(() => setStaffId(d.id))}
                initials={d.initials}
                name={d.name}
                role={t(d.role)}
              />
            ))}
          </div>
        </Section>

        {/* ── 3 · Gün ──────────────────────────────────────────────── */}
        <Section step={3} title="Gün">
          <div className="flex flex-wrap gap-2">
            {DAYS.map((d) => {
              const sel = d.offset === dayOffset;
              return (
                <button
                  key={d.offset}
                  type="button"
                  onClick={() => reselect(() => setDayOffset(d.offset))}
                  aria-pressed={sel}
                  className={cn(
                    "rounded-lg border px-4 py-2 text-[13px] font-medium transition-colors",
                    sel
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-foreground hover:border-primary/50",
                  )}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
        </Section>

        {/* ── 4 · Saat ─────────────────────────────────────────────── */}
        <Section
          id="saat-adimi"
          step={4}
          title="Saat"
          hint={
            freeCount > 0
              ? `${freeCount} uygun saat · ${formatDuration(service.durationMin)}`
              : undefined
          }
        >
          {slots.length === 0 || freeCount === 0 ? (
            <p className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-[13px] text-muted-foreground">
              Bu gün için uygun saat kalmadı. Başka bir gün ya da hekim seçin.
            </p>
          ) : (
            <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-6">
              {slots.map((s) => {
                const sel = slot === s.min;
                return (
                  <button
                    key={s.min}
                    type="button"
                    disabled={!s.available}
                    onClick={() => {
                      setSlot(s.min);
                      setError(null);
                    }}
                    aria-pressed={sel}
                    className={cn(
                      "tnum rounded-md border py-2 text-center text-[12.5px] transition-colors",
                      !s.available
                        ? "cursor-not-allowed border-border/60 bg-muted text-muted-foreground/40 line-through"
                        : sel
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-foreground hover:border-primary/50",
                    )}
                  >
                    {minutesToHHMM(s.min)}
                  </button>
                );
              })}
            </div>
          )}
        </Section>

        {/* ── 5 · İletişim ─────────────────────────────────────────── */}
        <Section step={5} title="İletişim bilgileriniz">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              id="ad"
              label="Ad Soyad"
              value={name}
              onChange={setName}
              placeholder="Ayşe Yılmaz"
              autoComplete="name"
              error={touched && !nameOk ? "Ad ve soyadınızı yazın." : null}
            />
            <Field
              id="tel"
              label="Telefon"
              value={phone}
              onChange={setPhone}
              placeholder="0532 111 22 33"
              type="tel"
              autoComplete="tel"
              error={
                touched && !phoneOk
                  ? "Geçerli bir cep telefonu girin (5 ile başlayan 10 hane)."
                  : null
              }
            />
          </div>
          <div className="mt-3">
            <Label htmlFor="not">
              Not <span className="font-normal text-muted-foreground">(isteğe bağlı)</span>
            </Label>
            <Input
              id="not"
              className="mt-1.5"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Şikâyetinizi kısaca yazabilirsiniz"
              maxLength={140}
            />
          </div>
        </Section>

        {error && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-[13px] text-destructive">
            {error}
          </p>
        )}

        <div className="sticky bottom-0 -mx-5 border-t border-border bg-background/90 px-5 py-3 backdrop-blur">
          <Button
            type="submit"
            size="lg"
            disabled={submitting}
            className={cn("w-full", missing && "opacity-70")}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Gönderiliyor…
              </>
            ) : (
              <>
                <CalendarPlus className="h-4 w-4" />
                Randevu al
              </>
            )}
          </Button>
          <p className="mt-2 text-center text-[11.5px] text-muted-foreground">
            {missing === "saat"
              ? "Devam etmek için bir saat seçin."
              : missing === "ad"
                ? "Ad ve soyadınızı yazın."
                : missing === "telefon"
                  ? "Cep telefonunuzu yazın."
                  : `${DAYS.find((d) => d.offset === dayOffset)?.label} ${minutesToHHMM(slot!)} · ${t(service.name)}`}
          </p>
        </div>
      </form>
    </div>
  );
}

/* ── Küçük parçalar ─────────────────────────────────────────────────────────── */

function Section({
  id,
  step,
  title,
  hint,
  children,
}: {
  id?: string;
  step: number;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-5"
    >
      <div className="mb-3 flex items-baseline gap-2">
        <p className="label-mono text-muted-foreground">
          {step} · {title}
        </p>
        {hint && <span className="ml-auto text-[11.5px] text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </section>
  );
}

function StaffCard({
  selected,
  onClick,
  initials,
  name,
  role,
}: {
  selected: boolean;
  onClick: () => void;
  initials: string;
  name: string;
  role: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
        selected ? "border-primary/50 bg-primary/[0.05]" : "border-border hover:bg-muted/50",
      )}
    >
      <span
        className={cn(
          "grid h-9 w-9 shrink-0 place-items-center rounded-full text-[12px] font-semibold",
          selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
        )}
      >
        {initials}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-medium">{name}</span>
        <span className="block truncate text-[11.5px] text-muted-foreground">{role}</span>
      </span>
      {selected && (
        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
          <Check className="h-3 w-3" strokeWidth={3} />
        </span>
      )}
    </button>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  ...rest
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error: string | null;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "id">) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        className={cn("mt-1.5", error && "border-destructive focus-visible:ring-destructive")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        {...rest}
      />
      {error && <p className="mt-1 text-[12px] text-destructive">{error}</p>}
    </div>
  );
}
