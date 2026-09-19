"use client";

import { Star, Check } from "lucide-react";
import { useLang } from "@/components/i18n/language-provider";
import { formatDuration, minutesToHHMM } from "@/lib/utils";
import { services, serviceById, SERVICE_VAR, bookingPage } from "@/lib/demo/data";

/* ── "Kullananlar" satırı için inline-SVG örnek klinik işaretleri ───────────── */
export function CompanyMark({ name }: { name: string }) {
  const glyphs: Record<string, React.ReactNode> = {
    "Karabük Diş": <path d="M12 4 v16 M4 12 h16" />,
    "Safranbolu Ağız & Diş": <path d="M12 4 c5 4 5 10 0 14 c-5 -4 -5 -10 0 -14 z" />,
    "Beyaz Diş Kliniği": <circle cx="12" cy="11" r="7" />,
    "Yenişehir Dental": <path d="M4 5 h16 v4 h-6 v9 h-4 v-9 h-6 z" />,
    "Ortodent": <path d="M3 17 L9 4 L12 11 L15 4 L21 17" />,
    "Gülüş Tasarım": <path d="M5 10 a7 7 0 0 0 14 0" />,
    "Bahçelievler Diş": <path d="M6 4 v14 h10" />,
    "Dentalife": <path d="M9 4 h6 v9 a3 3 0 0 1 -6 0 z" />,
  };
  return (
    <span className="inline-flex items-center gap-2 text-muted-foreground/70">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        {glyphs[name]}
      </svg>
      <span className="text-[15px] font-semibold tracking-tight">{name}</span>
    </span>
  );
}

/* ── Hero'daki ürün önizlemesi: herkese açık randevu widget'ı ──────────────── */
export function ProductPreview() {
  const { t } = useLang();
  const opts = bookingPage.options.map(serviceById);

  return (
    <div className="w-full rounded-2xl border border-border bg-card p-4 shadow-pop sm:p-5">
      {/* business header */}
      <div className="rounded-xl p-4 text-white" style={{ backgroundImage: "var(--grad-brand)" }}>
        <p className="font-display text-lg font-bold leading-tight">{bookingPage.business}</p>
        <p className="text-[12px] text-white/80">{t(bookingPage.tagline)}</p>
        <p className="mt-1.5 flex items-center gap-1 text-[12px] text-white/90">
          <Star className="h-3.5 w-3.5 fill-white text-white" />
          {bookingPage.rating} · {bookingPage.reviews} yorum
        </p>
      </div>

      {/* tedavi seçenekleri */}
      <p className="mt-4 label-mono text-muted-foreground">Tedavi seç</p>
      <div className="mt-2 space-y-2">
        {opts.slice(0, 3).map((s, i) => (
          <div
            key={s.id}
            className={`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 ${i === 0 ? "border-primary/40 bg-primary/[0.05]" : "border-border"}`}
          >
            <span className="h-3 w-3 rounded-[4px]" style={{ background: SERVICE_VAR[s.color] }} />
            <span className="min-w-0 flex-1 truncate text-[13px] font-medium">{t(s.name)}</span>
            <span className="tnum text-[12.5px] text-muted-foreground">{formatDuration(s.durationMin)}</span>
            {i === 0 && (
              <span className="grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
            )}
          </div>
        ))}
      </div>

      {/* uygun saatler */}
      <p className="mt-4 label-mono text-muted-foreground">Uygun saatler</p>
      <div className="mt-2 grid grid-cols-3 gap-1.5">
        {bookingPage.slots.map((m, i) => (
          <span
            key={m}
            className={`tnum rounded-md border py-1.5 text-center text-[12.5px] ${i === 1 ? "border-primary bg-primary text-primary-foreground" : "border-border text-foreground"}`}
          >
            {minutesToHHMM(m)}
          </span>
        ))}
      </div>

      <button className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary py-2.5 text-[13px] font-semibold text-primary-foreground">
        Randevu al
      </button>
      <p className="mt-2 text-center text-[10.5px] text-muted-foreground">
        Onay anında SMS ile gelir
      </p>
    </div>
  );
}

/* ── Small star rating row used by testimonials ─────────────────────────────── */
export function Stars({ n = 5 }: { n?: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5 fill-warning text-warning" />
      ))}
    </span>
  );
}

export { services };
