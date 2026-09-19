"use client";

import Link from "next/link";
import {
  ArrowRight,
  Check,
  Minus,
  ShieldCheck,
  Zap,
  CalendarCheck,
  BellRing,
  Link2,
  Sparkles,
} from "lucide-react";
import appConfig from "@/app.config";
import { Icon } from "@/components/ui/icon";
import { BookingDemo } from "@/components/marketing/booking-demo";
import { ProductPreview, CompanyMark, Stars } from "@/components/marketing/marks";
import { useLang } from "@/components/i18n/language-provider";
import { cn } from "@/lib/utils";
import type { L } from "@/lib/i18n/config";

/* ─────────────────────────────────────────────────────────────────────────────
   app.config.ts'e ait olmayan, bu sayfaya özel metinler. Hepsi { tr, en }
   tipinde; arayüz Türkçe gösterir (bkz. LanguageProvider).
   ───────────────────────────────────────────────────────────────────────────── */

const HERO_BENEFITS: L[] = [
  { tr: "Paylaşılabilir randevu sayfası — 7/24 açık", en: "A shareable booking page — open 24/7" },
  { tr: "Otomatik SMS hatırlatmaları gelmeyen hastayı azaltır", en: "Automatic SMS reminders cut your no-shows" },
  { tr: "Her hekimin takvimi tek ekranda, çakışmasız", en: "Every dentist's calendar on one screen, no clashes" },
];

const TRUSTED = [
  "Karabük Diş",
  "Safranbolu Ağız & Diş",
  "Beyaz Diş Kliniği",
  "Yenişehir Dental",
  "Ortodent",
  "Gülüş Tasarım",
  "Bahçelievler Diş",
  "Dentalife",
];

const HOW_STEPS: { n: string; icon: string; title: L; body: L }[] = [
  {
    n: "01",
    icon: "stethoscope",
    title: { tr: "Tedavilerinizi tanımlayın", en: "Set your treatments" },
    body: { tr: "Muayene, temizlik, dolgu, kanal… her tedavinin süresini girin; hekimleri ve çalışma saatlerini ekleyin.", en: "Check-up, cleaning, filling, root canal… enter each treatment's duration, then add dentists and hours." },
  },
  {
    n: "02",
    icon: "share-2",
    title: { tr: "Randevu linkinizi paylaşın", en: "Share your link" },
    body: { tr: "Kliniğinizin randevu sayfasını Instagram profiline, WhatsApp'a veya web sitenize koyun. Uygulama gerekmez.", en: "Put your clinic's booking page in your Instagram bio, WhatsApp or website. No app needed." },
  },
  {
    n: "03",
    icon: "calendar-check",
    title: { tr: "Hastalar randevu alsın", en: "Patients book themselves" },
    body: { tr: "Hasta boş saati seçer; randevu doğru hekimin takvimine düşer, çakışma olmaz.", en: "The patient picks an open time; it lands on the right dentist's calendar, never double-booked." },
  },
  {
    n: "04",
    icon: "bell-ring",
    title: { tr: "Hatırlatma otomatik gitsin", en: "Reminders go out on their own" },
    body: { tr: "Randevudan bir gün önce SMS gider; hasta gelemeyecekse tek dokunuşla saatini değiştirir.", en: "An SMS goes out the day before; if they can't come, they move the slot in one tap." },
  },
];

type CompareValue = boolean | L | string;
const COMPARE: { feature: L; phone: CompareValue; generic: CompareValue; seansapp: CompareValue }[] = [
  { feature: { tr: "7/24 online randevu", en: "24/7 online booking" }, phone: false, generic: true, seansapp: true },
  { feature: { tr: "Hekim bazlı takvim", en: "Per-dentist calendars" }, phone: { tr: "Randevu defteri", en: "On paper" }, generic: { tr: "Kısıtlı", en: "Limited" }, seansapp: true },
  { feature: { tr: "Tedaviye göre süre", en: "Duration per treatment" }, phone: { tr: "Tahmini", en: "Guesswork" }, generic: { tr: "Kısıtlı", en: "Limited" }, seansapp: true },
  { feature: { tr: "Çakışma koruması", en: "Double-booking protection" }, phone: false, generic: { tr: "Kısmi", en: "Partial" }, seansapp: true },
  { feature: { tr: "SMS hatırlatma", en: "SMS reminders" }, phone: { tr: "Manuel", en: "Manual" }, generic: { tr: "Sadece e-posta", en: "Email only" }, seansapp: true },
  { feature: { tr: "Hasta geçmişi & notlar", en: "Patient history & notes" }, phone: false, generic: { tr: "Kısmi", en: "Partial" }, seansapp: true },
  { feature: { tr: "Takvim senkronu", en: "Calendar sync" }, phone: false, generic: true, seansapp: true },
  { feature: { tr: "Mesai dışı randevu", en: "After-hours booking" }, phone: false, generic: true, seansapp: true },
];

const TESTIMONIALS: { quote: L; name: string; role: L; initials: string; metric: L }[] = [
  { quote: { tr: "Sekreterimiz artık gün boyu telefonla uğraşmıyor. Hastalar saatini kendisi seçiyor.", en: "Our receptionist no longer spends the day on the phone. Patients pick their own slot." }, name: "Dt. Mert Kaya", role: { tr: "Karabük Diş", en: "Karabük Dental" }, initials: "MK", metric: { tr: "Haftada 6 sa geri", en: "6h/wk saved" } },
  { quote: { tr: "Bir gün önce giden SMS'ten sonra gelmeyen hasta sayısı ilk ayda yarıya indi.", en: "After the day-before SMS, no-shows halved in the first month." }, name: "Dt. Selin Aydın", role: { tr: "Beyaz Diş Kliniği", en: "Beyaz Dental" }, initials: "SA", metric: { tr: "-%48 gelmeyen", en: "-48% no-shows" } },
  { quote: { tr: "Üç hekimin takvimini tek ekranda görüyorum. Aynı saate iki hasta yazma derdi bitti.", en: "I see three dentists' calendars on one screen. No more two patients in one slot." }, name: "Dr. Dt. Aylin Demir", role: { tr: "Ortodent", en: "Ortodent" }, initials: "AD", metric: { tr: "0 çakışma", en: "0 conflicts" } },
  { quote: { tr: "Kanal tedavisi 60 dakika, muayene 20 — süreler tanımlı olunca gün kendiliğinden düzene girdi.", en: "A root canal is 60 minutes, a check-up 20 — with durations defined the day sorts itself out." }, name: "Dt. Cem Yıldız", role: { tr: "Yenişehir Dental", en: "Yenişehir Dental" }, initials: "CY", metric: { tr: "%92 doluluk", en: "92% utilization" } },
  { quote: { tr: "Randevu linkini Instagram profiline koydum, ertesi sabah 11 yeni randevu vardı.", en: "I put the booking link in our Instagram bio and woke up to 11 new appointments." }, name: "Naz Yılmaz", role: { tr: "Gülüş Tasarım", en: "Gülüş Tasarım" }, initials: "NY", metric: { tr: "1 gecede +11", en: "+11 overnight" } },
  { quote: { tr: "Altı aylık kontrol randevularını sistem hatırlatıyor; hastalar geri geliyor.", en: "The system reminds patients of their six-month recall; they come back." }, name: "Dt. Onur Kılıç", role: { tr: "Dentalife", en: "Dentalife" }, initials: "OK", metric: { tr: "+%31 kontrol", en: "+31% recalls" } },
];

const SECURITY: { icon: typeof ShieldCheck; title: L; body: L }[] = [
  { icon: BellRing, title: { tr: "Akıllı hatırlatma", en: "Smart reminders" }, body: { tr: "Randevudan 24 saat ve 2 saat önce SMS. Hasta tek dokunuşla onaylar veya saatini değiştirir.", en: "SMS 24h and 2h before. One tap to confirm or reschedule." } },
  { icon: Zap, title: { tr: "Bekleme listesi", en: "Auto waitlist" }, body: { tr: "Bir iptal olduğunda boşalan saat, bekleyen hastalara otomatik teklif edilir.", en: "When a slot opens, it's auto-offered to waitlisted patients in seconds." } },
  { icon: ShieldCheck, title: { tr: "Kontrol takibi", en: "Recall tracking" }, body: { tr: "Altı aylık kontrol zamanı gelen hastalara hatırlatma gider — koltuk boş kalmaz.", en: "Patients due for their six-month recall get a nudge — the chair doesn't sit empty." } },
];

const USE_CASES: { icon: string; title: L; body: L }[] = [
  { icon: "user", title: { tr: "Tek hekimli muayenehane", en: "Single-dentist practice" }, body: { tr: "Tek takvim, tek link. Sekreteriniz olmasa da randevular düzenli akar.", en: "One calendar, one link. Bookings flow even without a receptionist." } },
  { icon: "users", title: { tr: "Çok hekimli klinik", en: "Multi-dentist clinic" }, body: { tr: "Her hekim kendi sütununda; hasta doğru hekime, doğru saate yazılır.", en: "Each dentist in their own column; patients land on the right one at the right time." } },
  { icon: "smile", title: { tr: "Ortodonti", en: "Orthodontics" }, body: { tr: "Düzenli aralıklı kontrol randevuları ve otomatik hatırlatmalar.", en: "Recurring check-ups at fixed intervals, with automatic reminders." } },
  { icon: "activity", title: { tr: "İmplant & cerrahi", en: "Implants & surgery" }, body: { tr: "Uzun seanslar için ayrı süre tanımı, konsültasyon ve kontrol randevusu ayrımı.", en: "Longer sessions get their own durations; consults and follow-ups stay separate." } },
];

const DEEP_DIVE_POINTS: L[] = [
  { tr: "Randevudan 24 saat önce otomatik SMS hatırlatması", en: "An automatic SMS 24 hours before the appointment" },
  { tr: "Hasta gelemiyorsa tek dokunuşla saat değiştirme", en: "One-tap reschedule when the patient can't make it" },
  { tr: "Boşalan saat bekleme listesindeki hastaya teklif edilir", en: "An opened slot is offered to the waitlist" },
  { tr: "Altı aylık kontrol randevuları otomatik hatırlatılır", en: "Six-month recalls are reminded automatically" },
];

/* Takvim bölümünün maddeleri. */
const CALENDAR_POINTS: { icon: string; title: L; body: L }[] = [
  { icon: "columns-3", title: { tr: "Hekim sütunları", en: "Dentist columns" }, body: { tr: "Her hekim kendi sütununda; günün tamamını ve herkesin doluluğunu tek bakışta görün.", en: "Each dentist in their own column; read the whole day at a glance." } },
  { icon: "shield-check", title: { tr: "Çakışma koruması", en: "No double-booking" }, body: { tr: "Tedavi süreleri ve hazırlık payları sayesinde iki hasta asla aynı saate denk gelmez.", en: "Treatment durations and prep buffers mean two patients never land on the same slot." } },
  { icon: "refresh-cw", title: { tr: "Takvim senkronu", en: "Calendar sync" }, body: { tr: "Google ve Apple Takvim ile çift yönlü senkron — hekimin kişisel programı da korunur.", en: "Two-way Google & Apple Calendar sync — personal plans stay protected." } },
];

/* Hatırlatma akışı adımları. */
const REMINDER_TIMELINE: { when: L; title: L; body: L; tone: string }[] = [
  { when: { tr: "Randevu anı", en: "On booking" }, title: { tr: "Onay + takvime ekle", en: "Confirmation + add to calendar" }, body: { tr: "Hasta anında SMS onayı alır ve randevuyu tek dokunuşla kendi takvimine ekler.", en: "The patient gets an instant SMS confirmation and a one-tap calendar add." }, tone: "var(--color-success)" },
  { when: { tr: "24 saat önce", en: "24h before" }, title: { tr: "Hatırlatma", en: "Reminder" }, body: { tr: "Nazik bir hatırlatma gider; gelemiyorsa tek dokunuşla saatini değiştirir.", en: "A gentle reminder goes out; if they can't make it, they reschedule in one tap." }, tone: "var(--color-info)" },
  { when: { tr: "2 saat önce", en: "2h before" }, title: { tr: "Son SMS", en: "Final SMS" }, body: { tr: "Klinik adresi ve onay bağlantısıyla son bir SMS — gelmeyen hasta sayısı düşer.", en: "A final SMS with the clinic address and a confirm link — no-shows drop." }, tone: "var(--color-primary)" },
  { when: { tr: "Sonrasında", en: "After" }, title: { tr: "Kontrol randevusu", en: "Recall" }, body: { tr: "Bir sonraki kontrol zamanı geldiğinde hastaya hazır bir randevu bağlantısı gider.", en: "When the next check-up is due, a ready-made booking link goes out." }, tone: "var(--seg-2)" },
];

const CX_POINTS: { icon: string; title: L; body: L }[] = [
  { icon: "smartphone", title: { tr: "Uygulama yok", en: "No app" }, body: { tr: "Mobil uyumlu sayfa; tarayıcıda açılır.", en: "A mobile-first page; opens in any browser." } },
  { icon: "zap", title: { tr: "Anında onay", en: "Instant confirm" }, body: { tr: "Onay SMS'i saniyeler içinde gelir.", en: "The confirmation SMS arrives in seconds." } },
  { icon: "calendar-plus", title: { tr: "Takvime ekle", en: "Add to calendar" }, body: { tr: "Tek dokunuşla kendi takvimine kaydeder.", en: "Saves to their own calendar in one tap." } },
];

const INCLUDED: L[] = [
  { tr: "Sınırsız tedavi tanımı", en: "Unlimited treatment types" },
  { tr: "Klinik adına randevu sayfası", en: "Booking page branded for your clinic" },
  { tr: "Hekim başına çalışma saatleri", en: "Per-dentist working hours" },
  { tr: "Tedaviye göre süre & hazırlık payı", en: "Duration and buffer per treatment" },
  { tr: "Çakışma koruması", en: "Double-booking protection" },
  { tr: "SMS + e-posta hatırlatmalar", en: "SMS + email reminders" },
  { tr: "Kontrol randevusu hatırlatması", en: "Recall reminders" },
  { tr: "Hasta kartları & hekim notları", en: "Patient cards & clinical notes" },
  { tr: "Bekleme listesi", en: "Waitlist" },
  { tr: "Google/Apple takvim senkronu", en: "Google/Apple calendar sync" },
  { tr: "Doluluk raporları", en: "Utilization reports" },
  { tr: "Mobil uyumlu yönetim paneli", en: "Mobile-friendly dashboard" },
];

const INTEGRATIONS: { name: string; desc: L; icon: string }[] = [
  { name: "Supabase", desc: { tr: "Veritabanı & giriş", en: "Database & auth" }, icon: "database" },
  { name: "Google Calendar", desc: { tr: "Takvim senkronu", en: "Calendar sync" }, icon: "calendar" },
  { name: "Twilio", desc: { tr: "SMS hatırlatma", en: "SMS reminders" }, icon: "message-square" },
  { name: "WhatsApp", desc: { tr: "Randevu bağlantısı paylaşımı", en: "Share the booking link" }, icon: "message-circle" },
];

export default function LandingPage() {
  const { t } = useLang();
  const m = appConfig.marketing;

  const SECTION = {
    demoTitle: { tr: "Hastanın gördüğü, sizin gördüğünüz", en: "What patients see, what you see" },
    demoSub: { tr: "Bir tedavi ve saat seçip randevu alın — randevunun klinik paneline düşüşünü canlı izleyin.", en: "Pick a treatment and a time, then book — watch it land on the clinic dashboard, live." },
    featuresTitle: { tr: "Randevu işini yürütmek için gereken her şey", en: "Everything you need to run bookings" },
    featuresSub: { tr: "Randevu sayfası, hekim takvimi, hasta kayıtları ve hatırlatmalar — kutudan çıktığı gibi.", en: "Booking page, dentist calendar, patient records and reminders — out of the box." },
    useTitle: { tr: "Kliniğinizin yapısına göre", en: "Built for your kind of clinic" },
    useSub: { tr: "Tek hekim ya da çok hekimli klinik — seansapp müsaitliği yönetir.", en: "One dentist or many — seansapp manages availability." },
    howTitle: { tr: "Dört adımda yayında", en: "Live in four steps" },
    howSub: { tr: "Tedavileri tanımlayın, linki paylaşın, hastalar randevu alsın, hatırlatma otomatik gitsin.", en: "Set treatments, share the link, patients book, reminders go out." },
    calEyebrow: { tr: "Takvim", en: "Calendar" },
    calTitle: { tr: "Tüm hekimler, tek takvimde", en: "Every dentist, one calendar" },
    calBody: { tr: "Hekim sütunları, tedaviye göre renklenen randevu blokları ve çakışma koruması. Günü tek bakışta okuyun, sürükleyerek düzenleyin.", en: "Dentist columns, appointment blocks colored by treatment, and double-booking protection. Read the day at a glance and drag to rearrange." },
    cxEyebrow: { tr: "Hasta deneyimi", en: "Patient experience" },
    cxTitle: { tr: "Randevu almak iki dokunuş", en: "Booking is two taps" },
    cxBody: { tr: "Hastanız uygulama indirmez, hesap açmaz. Linke dokunur, tedaviyi ve saati seçer — onay SMS'i anında telefonuna gelir. Siz de panelde görürsünüz.", en: "Your patient installs nothing and creates no account. They tap the link, pick a treatment and a time — the confirmation SMS hits their phone instantly. You see it on your dashboard." },
    remEyebrow: { tr: "Hatırlatmalar", en: "Reminders" },
    remTitle: { tr: "Her randevu için akıllı bir akış", en: "A smart sequence for every booking" },
    remSub: { tr: "Onaydan kontrol randevusuna — seansapp doğru anda doğru mesajı gönderir.", en: "From confirmation to recall — seansapp sends the right message at the right moment." },
    intTitle: { tr: "Kullandığınız araçlarla çalışır", en: "Works with the tools you use" },
    intSub: { tr: "Anahtarlarınızı bağlayın; yoksa demo modda çalışmaya devam eder.", en: "Connect your keys; without them it keeps running in demo mode." },
    inclTitle: { tr: "Her pakette dahil", en: "Included on every plan" },
    inclSub: { tr: "Gizli eklenti yok — randevu işini yürütmek için gerekenler kutuda.", en: "No hidden add-ons — what you need to run bookings is in the box." },
    deepEyebrow: { tr: "Gelmeyen hasta", en: "No-shows" },
    deepTitle: { tr: "Boş koltuk kayıptır. seansapp onu doldurur.", en: "An empty chair is a loss. seansapp fills it." },
    deepBody: { tr: "Hatırlatma gönderin, gelemeyen hastanın saatini kolayca değiştirin ve boşalan saatleri bekleme listesinden doldurun. Gelmeyen hasta azalır, takvim dolu kalır.", en: "Send reminders, let patients move their slot easily, and refill openings from the waitlist. No-shows drop, the calendar stays full." },
    compareTitle: { tr: "Randevu defteri, jenerik araç ve seansapp", en: "The appointment book, generic tools, and seansapp" },
    compareSub: { tr: "Neden telefon defterini ya da genel amaçlı bir aracı geride bırakmalısınız.", en: "Why you'll leave the paper book — and the generic tool — behind." },
    testTitle: { tr: "Diş hekimleri kullanıyor", en: "Used by dentists" },
    testSub: { tr: "Gerçek klinikler, gerçek sonuçlar.", en: "Real clinics, real outcomes." },
    pricingTitle: { tr: "Kliniğinizin büyüklüğüne göre", en: "Priced by your clinic" },
    pricingSub: { tr: "Tek hekimle başlayın, büyüdükçe yükseltin. Randevu başına ek ücret yok.", en: "Start with one dentist, upgrade as you grow. No per-booking fee." },
    popular: { tr: "En çok tercih edilen", en: "Most popular" },
    faqTitle: { tr: "Sık sorulanlar", en: "Frequently asked" },
    ctaTitle: { tr: "Bu hafta randevu almaya başlayın", en: "Start taking bookings this week" },
    ctaSub: { tr: "Demo modda hemen deneyin; hazır olduğunuzda hekimlerinizi ve tedavilerinizi birkaç dakikada tanımlayalım.", en: "Try it in demo mode now; when you're ready we'll set up your dentists and treatments in minutes." },
  };

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10" style={{ background: "var(--grad-hero)" }} />
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          {/* copy */}
          <div className="stagger">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-primary pulse-dot" />
              {t(m.badge)}
            </span>
            <h1 className="mt-5 max-w-xl font-display text-[40px] font-bold leading-[1.03] tracking-tight sm:text-[56px]">
              {t(m.heroTitle)}{" "}
              <span className="bg-gradient-to-r from-[oklch(64%_0.15_245)] to-[oklch(52%_0.17_262)] bg-clip-text text-transparent">
                {t(m.heroAccent)}
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">{t(m.heroSubtitle)}</p>

            <ul className="mt-7 space-y-2.5">
              {HERO_BENEFITS.map((b) => (
                <li key={t(b)} className="flex items-start gap-2.5 text-[15px]">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-success/12 text-success">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <span className="text-foreground/85">{t(b)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/signup"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-[15px] font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
              >
                {t(m.heroCtaPrimary)} <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#demo"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-border bg-card px-6 text-[15px] font-semibold text-foreground shadow-pill transition-colors hover:bg-muted"
              >
                {t(m.heroCtaSecondary)}
              </a>
            </div>
            <p className="mt-4 flex items-center gap-2 text-[13px] text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Kart gerekmez · demo modda anında çalışır
            </p>
          </div>

          {/* floating product preview */}
          <div className="relative animate-float-up">
            <span className="blob absolute -right-8 -top-10 -z-10 h-56 w-56 bg-primary/25 drift" aria-hidden />
            <span className="blob absolute -bottom-10 -left-8 -z-10 h-48 w-48 drift" aria-hidden style={{ background: "color-mix(in oklch, var(--seg-2) 30%, transparent)" }} />
            <div className="absolute -left-5 top-10 hidden rotate-[-4deg] rounded-xl border border-border bg-card px-3 py-2 shadow-pop sm:block">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold">
                <CalendarCheck className="h-3.5 w-3.5 text-success" />
                Yeni randevu
              </p>
              <p className="text-[10px] text-muted-foreground">Elif · 10:30</p>
            </div>
            <div className="absolute -right-4 bottom-8 hidden rotate-[5deg] rounded-xl border border-border bg-card px-3 py-2 shadow-pop sm:block">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold">
                <BellRing className="h-3.5 w-3.5 text-primary" />
                9 hatırlatma gönderildi
              </p>
            </div>
            <ProductPreview />
          </div>
        </div>

        {/* trusted-by */}
        <div className="border-y border-border bg-card/60">
          <div className="mx-auto max-w-6xl px-5 py-6">
            <p className="text-center label-mono text-muted-foreground">
              Diş klinikleri randevularını seansapp ile alıyor
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 opacity-90">
              {TRUSTED.map((c) => (
                <CompanyMark key={c} name={c} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Interactive demo ──────────────────────────────────────── */}
      <section id="demo" className="mx-auto max-w-6xl px-5 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="label-mono text-primary">Canlı demo</span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">{t(SECTION.demoTitle)}</h2>
          <p className="mt-3 text-muted-foreground">{t(SECTION.demoSub)}</p>
        </div>
        <div className="mt-10">
          <BookingDemo />
        </div>
        <p className="mt-6 text-center text-sm">
          <Link
            href={appConfig.bookingPath}
            className="font-medium text-primary transition-opacity hover:opacity-80"
          >
            Gerçek randevu sayfasını açın →
          </Link>
        </p>
      </section>

      {/* ── Stats band ────────────────────────────────────────────── */}
      <section className="border-y border-border bg-card/60">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-px overflow-hidden px-5 py-12 sm:grid-cols-4">
          {m.stats.map((s) => (
            <div key={s.value} className="px-4 text-center">
              <div className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{s.value}</div>
              <div className="mt-1.5 text-[13px] text-muted-foreground">{t(s.label)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features grid ─────────────────────────────────────────── */}
      <section id="features" className="border-y border-border bg-muted/40">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{t(SECTION.featuresTitle)}</h2>
            <p className="mt-3 text-muted-foreground">{t(SECTION.featuresSub)}</p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {m.features.map((f) => (
              <div key={t(f.title)} className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-shadow hover:shadow-pop">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon name={f.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-[17px] font-semibold tracking-tight">{t(f.title)}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t(f.body)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Use cases ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{t(SECTION.useTitle)}</h2>
          <p className="mt-3 text-muted-foreground">{t(SECTION.useSub)}</p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {USE_CASES.map((u) => (
            <div key={t(u.title)} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-secondary text-primary">
                <Icon name={u.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-base font-semibold tracking-tight">{t(u.title)}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{t(u.body)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Calendar showcase ─────────────────────────────────────── */}
      <section className="border-y border-border bg-muted/40">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <span className="label-mono text-primary">{t(SECTION.calEyebrow)}</span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">{t(SECTION.calTitle)}</h2>
            <p className="mt-4 text-muted-foreground">{t(SECTION.calBody)}</p>
            <div className="mt-7 space-y-4">
              {CALENDAR_POINTS.map((c) => (
                <div key={t(c.title)} className="flex gap-3.5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon name={c.icon} className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-[15.5px] font-semibold tracking-tight">{t(c.title)}</h3>
                    <p className="mt-0.5 text-[13.5px] leading-relaxed text-muted-foreground">{t(c.body)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* mini schedule mock (inline) */}
          <MiniSchedule />
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────── */}
      <section id="how" className="border-y border-border bg-muted/40">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{t(SECTION.howTitle)}</h2>
            <p className="mt-3 text-muted-foreground">{t(SECTION.howSub)}</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {HOW_STEPS.map((s, i) => (
              <div key={s.n} className="relative rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon name={s.icon} className="h-5 w-5" />
                  </span>
                  <span className="font-display text-3xl font-bold text-primary/15">{s.n}</span>
                </div>
                <h3 className="mt-4 font-display text-[17px] font-semibold tracking-tight">{t(s.title)}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t(s.body)}</p>
                {i < HOW_STEPS.length - 1 && (
                  <span className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 place-items-center text-border lg:grid">
                    <ArrowRight className="h-5 w-5" />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── No-show / deposits deep-dive ──────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="label-mono text-primary">{t(SECTION.deepEyebrow)}</span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">{t(SECTION.deepTitle)}</h2>
            <p className="mt-4 text-muted-foreground">{t(SECTION.deepBody)}</p>
            <ul className="mt-6 space-y-3">
              {DEEP_DIVE_POINTS.map((p) => (
                <li key={t(p)} className="flex items-start gap-2.5 text-[15px]">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-success/12 text-success">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <span className="text-foreground/85">{t(p)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { v: "-%38", l: { tr: "gelmeyen hasta", en: "no-shows" } as L },
                { v: "%92", l: { tr: "doluluk", en: "utilization" } as L },
                { v: "7/24", l: { tr: "randevu alımı", en: "booking" } as L },
              ].map((s) => (
                <div key={s.v} className="rounded-2xl border border-border bg-card p-4 text-center shadow-soft">
                  <p className="font-display text-2xl font-bold tracking-tight">{s.v}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{t(s.l)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Security/deposit cards */}
          <div className="space-y-4">
            {SECURITY.map((s) => (
              <div key={t(s.title)} className="flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <s.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-[16px] font-semibold tracking-tight">{t(s.title)}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t(s.body)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Client experience ─────────────────────────────────────── */}
      <section className="border-t border-border">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <span className="label-mono text-primary">{t(SECTION.cxEyebrow)}</span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">{t(SECTION.cxTitle)}</h2>
            <p className="mt-4 text-muted-foreground">{t(SECTION.cxBody)}</p>
            <div className="mt-7 grid gap-4 sm:grid-cols-3">
              {CX_POINTS.map((c) => (
                <div key={t(c.title)} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Icon name={c.icon} className="h-[18px] w-[18px]" />
                  </span>
                  <h3 className="mt-3 text-[14px] font-semibold">{t(c.title)}</h3>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">{t(c.body)}</p>
                </div>
              ))}
            </div>
          </div>
          <PhoneMock />
        </div>
      </section>

      {/* ── Reminders timeline ────────────────────────────────────── */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <span className="label-mono text-primary">{t(SECTION.remEyebrow)}</span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">{t(SECTION.remTitle)}</h2>
            <p className="mt-3 text-muted-foreground">{t(SECTION.remSub)}</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {REMINDER_TIMELINE.map((r, i) => (
              <div key={t(r.title)} className="relative">
                {/* connector */}
                {i < REMINDER_TIMELINE.length - 1 && (
                  <span className="absolute left-4 top-4 hidden h-px w-[calc(100%+1.5rem)] bg-border md:block" aria-hidden />
                )}
                <span className="relative grid h-8 w-8 place-items-center rounded-full ring-4 ring-background" style={{ background: r.tone }}>
                  <span className="h-2 w-2 rounded-full bg-white" />
                </span>
                <p className="mt-4 label-mono text-muted-foreground">{t(r.when)}</p>
                <h3 className="mt-1 font-display text-[15.5px] font-semibold tracking-tight">{t(r.title)}</h3>
                <p className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">{t(r.body)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison table ──────────────────────────────────────── */}
      <section className="border-y border-border bg-muted/40">
        <div className="mx-auto max-w-5xl px-5 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{t(SECTION.compareTitle)}</h2>
            <p className="mt-3 text-muted-foreground">{t(SECTION.compareSub)}</p>
          </div>
          <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-5 py-4 text-left font-medium text-muted-foreground">Özellik</th>
                    <th className="px-4 py-4 text-center font-medium text-muted-foreground">Telefon / defter</th>
                    <th className="px-4 py-4 text-center font-medium text-muted-foreground">Jenerik araç</th>
                    <th className="px-4 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5 font-display text-[15px] font-bold tracking-tight text-primary">
                        {appConfig.name}
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE.map((row, i) => (
                    <tr key={t(row.feature)} className={cn("border-b border-border/60 last:border-0", i % 2 === 1 && "bg-muted/30")}>
                      <td className="px-5 py-3.5 font-medium">{t(row.feature)}</td>
                      <CompareCell value={row.phone} />
                      <CompareCell value={row.generic} />
                      <CompareCell value={row.seansapp} highlight />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{t(SECTION.testTitle)}</h2>
          <p className="mt-3 text-muted-foreground">{t(SECTION.testSub)}</p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((tm) => (
            <figure key={tm.name} className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft">
              <Stars />
              <blockquote className="mt-3 flex-1 text-[14.5px] leading-relaxed text-foreground/85">“{t(tm.quote)}”</blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-border/60 pt-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-xs font-bold text-white" style={{ backgroundImage: "var(--grad-brand)" }}>
                  {tm.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold leading-tight">{tm.name}</p>
                  <p className="truncate text-[11.5px] text-muted-foreground">{t(tm.role)}</p>
                </div>
                <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">{t(tm.metric)}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────── */}
      <section id="pricing" className="border-y border-border bg-muted/40">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{t(SECTION.pricingTitle)}</h2>
            <p className="mt-3 text-muted-foreground">{t(SECTION.pricingSub)}</p>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {m.pricing.map((tier) => (
              <div
                key={tier.name}
                className={cn(
                  "flex flex-col rounded-2xl border bg-card p-7 shadow-soft",
                  tier.featured ? "border-primary ring-2 ring-primary/30" : "border-border",
                )}
              >
                {tier.featured && (
                  <span className="mb-3 inline-flex w-fit items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
                    <Sparkles className="h-3 w-3" />
                    {t(SECTION.popular)}
                  </span>
                )}
                <h3 className="font-display text-lg font-bold tracking-tight">{tier.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t(tier.tagline)}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold tracking-tight">{tier.price}</span>
                  {tier.period && <span className="text-sm text-muted-foreground">{t(tier.period)}</span>}
                </div>
                <ul className="mt-6 flex-1 space-y-2.5 text-sm">
                  {tier.features.map((f) => (
                    <li key={t(f)} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" strokeWidth={2.5} />
                      <span className="text-foreground/85">{t(f)}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={cn(
                    "mt-7 inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-semibold transition-all",
                    tier.featured
                      ? "bg-primary text-primary-foreground shadow-sm hover:opacity-90"
                      : "border border-border bg-card text-foreground hover:bg-muted",
                  )}
                >
                  {t(tier.cta)}
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-[13px] text-muted-foreground">
            Randevu başına ek ücret yok. İstediğiniz zaman iptal edebilirsiniz.
          </p>
        </div>
      </section>

      {/* ── Integrations ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{t(SECTION.intTitle)}</h2>
          <p className="mt-3 text-muted-foreground">{t(SECTION.intSub)}</p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {INTEGRATIONS.map((it) => (
            <div key={it.name} className="flex items-center gap-3.5 rounded-2xl border border-border bg-card p-5 shadow-soft">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-secondary text-foreground/80">
                <Icon name={it.icon} className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="font-display text-[15px] font-semibold tracking-tight">{it.name}</p>
                <p className="truncate text-[12.5px] text-muted-foreground">{t(it.desc)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Everything included ───────────────────────────────────── */}
      <section className="border-y border-border bg-muted/40">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{t(SECTION.inclTitle)}</h2>
            <p className="mt-3 text-muted-foreground">{t(SECTION.inclSub)}</p>
          </div>
          <div className="mx-auto mt-10 grid max-w-3xl gap-x-8 gap-y-3.5 sm:grid-cols-2">
            {INCLUDED.map((f) => (
              <div key={t(f)} className="flex items-center gap-2.5 text-[14.5px]">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-success/12 text-success">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                <span className="text-foreground/85">{t(f)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      <section id="faq" className="mx-auto max-w-3xl px-5 py-20">
        <h2 className="text-center font-display text-3xl font-bold tracking-tight sm:text-4xl">{t(SECTION.faqTitle)}</h2>
        <div className="mt-10 divide-y divide-border">
          {m.faq.map((f) => (
            <details key={t(f.q)} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                <span>{t(f.q)}</span>
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-transform group-open:rotate-45">
                  <span className="text-lg leading-none">+</span>
                </span>
              </summary>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{t(f.a)}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 pb-24">
        <div className="relative overflow-hidden rounded-3xl px-8 py-16 text-center text-white shadow-pop" style={{ backgroundImage: "var(--grad-brand)" }}>
          <span className="blob absolute -right-10 -top-10 h-52 w-52 bg-white/20 drift" aria-hidden />
          <span className="blob absolute -bottom-12 -left-10 h-48 w-48 bg-black/10 drift" aria-hidden />
          <div className="relative">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{t(SECTION.ctaTitle)}</h2>
            <p className="mx-auto mt-3 max-w-xl text-white/85">{t(SECTION.ctaSub)}</p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-6 text-[15px] font-semibold text-foreground transition-opacity hover:opacity-90"
              >
                {t(m.heroCtaPrimary)} <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#demo"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/30 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-white/10"
              >
                <Link2 className="h-4 w-4" />
                {t(m.heroCtaSecondary)}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ── Comparison cell renderer ──────────────────────────────────────────────── */
function CompareCell({ value, highlight }: { value: boolean | L | string; highlight?: boolean }) {
  const { t } = useLang();
  let content: React.ReactNode;
  if (value === true) {
    content = (
      <span className={cn("inline-grid h-6 w-6 place-items-center rounded-full", highlight ? "bg-primary text-primary-foreground" : "bg-success/12 text-success")}>
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </span>
    );
  } else if (value === false) {
    content = (
      <span className="inline-grid h-6 w-6 place-items-center rounded-full bg-muted text-muted-foreground/50">
        <Minus className="h-3.5 w-3.5" />
      </span>
    );
  } else {
    const text = typeof value === "string" ? value : t(value);
    content = <span className={cn("text-[12.5px] font-medium", highlight ? "text-primary" : "text-muted-foreground")}>{text}</span>;
  }
  return <td className={cn("px-4 py-3.5 text-center", highlight && "bg-primary/[0.03]")}>{content}</td>;
}

/* ── Takvim bölümü için mini hekim-sütunu programı ─────────────────────────── */
function MiniSchedule() {
  const cols = [
    { who: "Dt. Selin", blocks: [{ top: 0, h: 2, c: "var(--svc-muayene)", who: "Elif" }, { top: 3, h: 3, c: "var(--svc-kanal)", who: "Deniz" }] },
    { who: "Dt. Mert", blocks: [{ top: 1, h: 1, c: "var(--svc-temizlik)", who: "Burak" }, { top: 4, h: 1, c: "var(--svc-muayene)", who: "Sıla" }] },
    { who: "Dr. Aylin", blocks: [{ top: 2, h: 2, c: "var(--svc-ortodonti)", who: "Zeynep" }, { top: 5, h: 2, c: "var(--svc-dolgu)", who: "Naz" }] },
    { who: "Dt. Cem", blocks: [{ top: 0, h: 2, c: "var(--svc-implant)", who: "Kerem" }] },
  ];
  const times = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"];
  const rowH = 30;

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-pop">
      <div className="flex items-center justify-between px-1 pb-2">
        <p className="font-display text-sm font-semibold">Bugün · 4 hekim</p>
        <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">
          <span className="h-1.5 w-1.5 rounded-full bg-success pulse-dot" /> canlı
        </span>
      </div>
      <div className="grid" style={{ gridTemplateColumns: `40px repeat(4, 1fr)` }}>
        <div />
        {cols.map((c) => (
          <div key={c.who} className="px-1 pb-1 text-center text-[11px] font-semibold text-muted-foreground">{c.who}</div>
        ))}
      </div>
      <div className="grid" style={{ gridTemplateColumns: `40px repeat(4, 1fr)` }}>
        {/* time gutter */}
        <div className="relative" style={{ height: times.length * rowH }}>
          {times.map((tm, i) => (
            <span key={tm} className="absolute right-1.5 -translate-y-1/2 tnum text-[9px] text-muted-foreground" style={{ top: i * rowH }}>{tm}</span>
          ))}
        </div>
        {cols.map((c) => (
          <div key={c.who} className="relative border-l border-border/50" style={{ height: times.length * rowH }}>
            {times.map((_, i) => (
              <div key={i} className="absolute inset-x-0 border-t border-border/30" style={{ top: i * rowH, height: rowH }} />
            ))}
            {c.blocks.map((b, bi) => (
              <div
                key={bi}
                className="animate-pop absolute inset-x-0.5 overflow-hidden rounded-md border-l-[3px] px-1.5 py-1"
                style={{ top: b.top * rowH + 1, height: b.h * rowH - 2, background: `color-mix(in oklch, ${b.c} 14%, white)`, borderColor: b.c }}
              >
                <p className="truncate text-[10px] font-semibold" style={{ color: `color-mix(in oklch, ${b.c} 70%, black)` }}>{b.who}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Hasta deneyimi bölümü için SMS onaylı telefon maketi ──────────────────── */
function PhoneMock() {
  return (
    <div className="relative mx-auto w-full max-w-[300px]">
      <span className="blob absolute -right-6 top-6 -z-10 h-44 w-44 bg-primary/20 drift" aria-hidden />
      <div className="relative rounded-[2.2rem] border-[7px] border-foreground/85 bg-background shadow-pop">
        {/* notch */}
        <div className="absolute left-1/2 top-0 h-5 w-28 -translate-x-1/2 rounded-b-2xl bg-foreground/85" />
        <div className="space-y-3 px-4 pb-6 pt-8">
          {/* header */}
          <div className="flex items-center gap-2.5 border-b border-border pb-3">
            <span className="grid h-9 w-9 place-items-center rounded-full text-[11px] font-bold text-white" style={{ backgroundImage: "var(--grad-brand)" }}>
              KD
            </span>
            <div>
              <p className="text-[12.5px] font-semibold leading-tight">Özel Karabük Diş Kliniği</p>
              <p className="text-[10px] text-muted-foreground">SMS · şimdi</p>
            </div>
          </div>
          {/* onay balonu */}
          <div className="rounded-2xl rounded-tl-sm bg-muted p-3 text-[12.5px] leading-relaxed">
            <p className="font-semibold">Randevunuz onaylandı ✅</p>
            <p className="mt-1 text-foreground/80">
              Muayene & kontrol · Dt. Selin Aydın · Cuma 10:30
            </p>
          </div>
          {/* hatırlatma balonu */}
          <div className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-tr-sm bg-primary p-3 text-[12.5px] text-primary-foreground">
            Yarınki randevunuzu hatırlatırız 🔔
          </div>
          {/* eylemler */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <span className="rounded-lg border border-border bg-card py-2 text-center text-[11px] font-semibold">
              Takvime ekle
            </span>
            <span className="rounded-lg border border-border bg-card py-2 text-center text-[11px] font-semibold">
              Saati değiştir
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
