/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │  app.config.ts — the single source of truth for this app.                │
 * │                                                                          │
 * │  seansapp: diş klinikleri için online randevu sistemi. Uygulamanın tek   │
 * │  işi randevu almak — ödeme/gelir tarafı `features` bayrakları ile        │
 * │  arayüzden gizli (kod duruyor, SaaS'a geçişte tek satırla açılır).       │
 * │                                                                          │
 * │  Arayüz Türkçe. Metinler yine { tr, en } tipinde tutulur; `en` alanı     │
 * │  ileride EN sürüm gerekirse hazır olsun diye doldurulmuştur.             │
 * └──────────────────────────────────────────────────────────────────────────┘
 */
import type { L } from "@/lib/i18n/config";

export type IconName = string;

export interface NavItem {
  label: L;
  href: string;
  icon: IconName;
  badge?: L;
  /** "Coming soon" items render non-navigating and dimmed. */
  muted?: boolean;
}

export interface NavGroup {
  label: L;
  items: NavItem[];
}

export interface Feature {
  icon: IconName;
  title: L;
  body: L;
}

export interface Stat {
  value: string;
  label: L;
}

export interface PricingTier {
  name: string;
  price: string;
  period?: L;
  tagline: L;
  features: L[];
  cta: L;
  featured?: boolean;
}

export interface FaqItem {
  q: L;
  a: L;
}

export interface Integration {
  key: string;
  name: string;
  envVars: string[];
  required: boolean;
  docsUrl: string;
  purpose: string;
}

/**
 * Ürün kapsamı bayrakları. seansapp'in tek işi randevu almak: ödeme, depozito ve
 * gelir arayüzleri kodda duruyor ama render edilmiyor. SaaS'a geçerken burayı
 * `true` yapmak yeterli.
 */
export interface FeatureFlags {
  /** Depozito / ödeme alma, ödendi rozetleri, no-show ücreti. */
  payments: boolean;
  /** Gelir grafikleri, ciro kartları, tutar sütunları. */
  revenue: boolean;
}

export interface AppConfig {
  name: string;
  tagline: L;
  description: L;
  domain: string;
  logoText: string;
  accentName: string;
  /** Kliniğin hastalarıyla paylaştığı halka açık randevu sayfasının yolu. */
  bookingPath: string;
  features: FeatureFlags;
  marketing: {
    badge: L;
    heroTitle: L;
    heroAccent: L;
    heroSubtitle: L;
    heroCtaPrimary: L;
    heroCtaSecondary: L;
    features: Feature[];
    stats: Stat[];
    pricing: PricingTier[];
    faq: FaqItem[];
  };
  /** Flat list — used by the topbar to resolve the current page title. */
  nav: NavItem[];
  /** Grouped list — drives the sidebar. */
  navGroups: NavGroup[];
  integrations: Integration[];
}

export const appConfig: AppConfig = {
  name: "seansapp",
  tagline: { tr: "Hastalarınız 7/24 randevu alsın.", en: "Let patients book 24/7." },
  description: {
    tr: "Diş klinikleri için online randevu sistemi. Paylaşılabilir bir randevu sayfası, hekim bazlı takvim, hasta kayıtları ve otomatik hatırlatmalar — tek işi randevu almak.",
    en: "Online appointment booking for dental clinics. A shareable booking page, per-dentist calendar, patient records and automatic reminders — booking, and nothing else.",
  },
  domain: "seansapp.com",
  logoText: "S",
  accentName: "blue",
  bookingPath: "/randevu",

  // Randevu dışındaki her şey kapalı. SaaS'a geçerken buradan açılır.
  features: {
    payments: false,
    revenue: false,
  },

  marketing: {
    badge: { tr: "Randevu, otomatik", en: "Bookings, on autopilot" },
    heroTitle: {
      tr: "Hastalarınız",
      en: "Let patients book",
    },
    heroAccent: {
      tr: "7/24 randevu alsın.",
      en: "24/7.",
    },
    heroSubtitle: {
      tr: "seansapp kliniğinize paylaşılabilir bir randevu sayfası, hekim bazlı bir takvim, hasta kayıtları ve otomatik SMS hatırlatmaları verir — telefon trafiğine ve gelmeyen hastalara son.",
      en: "seansapp gives your clinic a shareable booking page, a per-dentist calendar, patient records and automatic SMS reminders — no more phone tag or no-shows.",
    },
    heroCtaPrimary: { tr: "Ücretsiz dene", en: "Try it free" },
    heroCtaSecondary: { tr: "Canlı demoyu gör", en: "See the live demo" },
    features: [
      { icon: "globe", title: { tr: "Online randevu sayfası", en: "Online booking page" }, body: { tr: "Kliniğinizin adını taşıyan, paylaşılabilir bir sayfa. Hasta tedaviyi, hekimi ve saati kendisi seçer — mesai dışında bile.", en: "A shareable page branded with your clinic. Patients pick a treatment, a dentist and a time — even after hours." } },
      { icon: "calendar-days", title: { tr: "Hekim bazlı takvim", en: "Per-dentist calendar" }, body: { tr: "Her hekim kendi sütununda. Tedavi süreleri, hazırlık payları ve çakışma koruması hazır gelir.", en: "Each dentist gets a column. Treatment durations, buffer times and double-booking protection come built in." } },
      { icon: "users", title: { tr: "Hekim ve ünit yönetimi", en: "Dentist & chair management" }, body: { tr: "Her hekimin kendi tedavileri, çalışma saatleri ve doluluğu. İzin ve kongre günlerini tek tıkla blokla.", en: "Each dentist gets their own treatments, hours and utilization. Block leave days in one click." } },
      { icon: "clock", title: { tr: "Tedaviye göre süre", en: "Duration per treatment" }, body: { tr: "Muayene 20 dk, kanal 60 dk — her tedavinin süresi tanımlı olduğu için takvim kendiliğinden doğru dolar.", en: "A check-up is 20 min, a root canal 60 — each treatment carries its own duration, so the day fills correctly." } },
      { icon: "bell-ring", title: { tr: "Otomatik hatırlatmalar", en: "Automatic reminders" }, body: { tr: "Randevudan bir gün önce SMS. Gelmeyen hasta oranı düşer, sekreterin telefon trafiği azalır.", en: "An SMS the day before. Fewer no-shows, and far less phone traffic at the desk." } },
      { icon: "contact", title: { tr: "Hasta kayıtları", en: "Patient records" }, body: { tr: "Geliş geçmişi, hekim notları, telefon ve tercihler — her hasta için tek bir kart.", en: "Visit history, clinical notes, phone and preferences — one card per patient." } },
    ],
    stats: [
      { value: "7/24", label: { tr: "online randevu", en: "online booking" } },
      { value: "-38%", label: { tr: "gelmeyen hasta", en: "fewer no-shows" } },
      { value: "5 dk", label: { tr: "kurulum", en: "to set up" } },
      { value: "0", label: { tr: "telefon kuyruğu", en: "phone queue" } },
    ],
    // TODO: fiyatları netleştir — aşağıdakiler ilk sürüm için placeholder.
    pricing: [
      {
        name: "Tek Hekim",
        price: "₺499",
        period: { tr: "/ay", en: "/mo" },
        tagline: { tr: "Tek hekimli muayenehaneler için.", en: "For single-dentist practices." },
        features: [
          { tr: "1 hekim", en: "1 dentist" },
          { tr: "Online randevu sayfası", en: "Online booking page" },
          { tr: "Takvim & hasta kayıtları", en: "Calendar & patient records" },
          { tr: "E-posta hatırlatmaları", en: "Email reminders" },
        ],
        cta: { tr: "14 gün ücretsiz dene", en: "Start 14-day trial" },
      },
      {
        name: "Klinik",
        price: "₺999",
        period: { tr: "/ay", en: "/mo" },
        tagline: { tr: "Çok hekimli klinikler için.", en: "For multi-dentist clinics." },
        features: [
          { tr: "5 hekime kadar", en: "Up to 5 dentists" },
          { tr: "SMS hatırlatmaları", en: "SMS reminders" },
          { tr: "Hasta geçmişi & notlar", en: "Patient history & notes" },
          { tr: "Sınırsız randevu", en: "Unlimited appointments" },
          { tr: "Takvim senkronu", en: "Calendar sync" },
        ],
        cta: { tr: "14 gün ücretsiz dene", en: "Start 14-day trial" },
        featured: true,
      },
      {
        name: "Çoklu Şube",
        price: "₺1.999",
        period: { tr: "/ay", en: "/mo" },
        tagline: { tr: "Birden fazla şubesi olan klinikler için.", en: "For multi-location clinics." },
        features: [
          { tr: "Sınırsız hekim", en: "Unlimited dentists" },
          { tr: "Çoklu şube", en: "Multiple locations" },
          { tr: "Roller & yetkiler", en: "Roles & permissions" },
          { tr: "Doluluk raporları", en: "Utilization reports" },
          { tr: "Öncelikli destek", en: "Priority support" },
        ],
        cta: { tr: "Bizimle görüşün", en: "Talk to us" },
      },
    ],
    faq: [
      { q: { tr: "Denemek için kart bilgisi gerekiyor mu?", en: "Do I need a card to try it?" }, a: { tr: "Hayır. seansapp örnek bir klinik günüyle demo modda açılır — hemen gezebilirsiniz.", en: "No. seansapp boots in demo mode with a sample clinic day — click around immediately." } },
      { q: { tr: "Hastalar nasıl randevu alır?", en: "How do patients book?" }, a: { tr: "Kliniğinizin randevu sayfası bağlantısını paylaşırsınız; hasta tedaviyi, hekimi ve boş saati seçer. Uygulama indirmesine gerek yok.", en: "You share your clinic's booking page link; the patient picks a treatment, a dentist and an open slot. No app to install." } },
      { q: { tr: "Telefondan gelen randevuyu nasıl girerim?", en: "How do I enter a phone booking?" }, a: { tr: "Panelden \"Randevu\" düğmesiyle elle eklersiniz; telefonla, kapıdan ve online gelen randevular aynı takvimde birleşir.", en: "Add it by hand with the \"New booking\" button; phone, walk-in and online bookings all land on the same calendar." } },
      { q: { tr: "Kaç hekim ekleyebilirim?", en: "How many dentists can I add?" }, a: { tr: "Pakete göre 1, 5 veya sınırsız. Her hekim takvimde kendi sütununda, kendi tedavileri ve çalışma saatleriyle görünür.", en: "1, 5 or unlimited depending on the plan. Each dentist gets their own calendar column, treatments and hours." } },
      { q: { tr: "Mevcut hasta listemi aktarabilir miyim?", en: "Can I import my patient list?" }, a: { tr: "Evet. Ad, telefon ve geliş geçmişini içeren bir Excel/CSV dosyasını kurulumda birlikte aktarıyoruz.", en: "Yes. We import an Excel/CSV of names, phones and visit history together during setup." } },
      { q: { tr: "Hasta verileri nerede tutuluyor? KVKK?", en: "Where is patient data stored?" }, a: { tr: "Veriler kliniğe ait ayrı bir veritabanında tutulur; yalnızca randevu için gereken ad, telefon ve not alanları saklanır. Tedavi/tıbbi kayıt tutulmaz.", en: "Data sits in a database that belongs to the clinic; only the name, phone and note fields a booking needs are stored. No clinical records." } },
      { q: { tr: "İnternet kesilirse ne olur?", en: "What if the internet goes down?" }, a: { tr: "Randevular sunucuda durur; bağlantı gelince panel kaldığı yerden açılır. Günün listesini yazdırabilirsiniz.", en: "Bookings live on the server; the dashboard picks up where it left off. You can print the day's list." } },
      { q: { tr: "Kurulum ne kadar sürer?", en: "How long does setup take?" }, a: { tr: "Hekimler, tedaviler ve çalışma saatleri girildiğinde klinik aynı gün kullanmaya başlayabilir.", en: "Once dentists, treatments and hours are entered, the clinic can start the same day." } },
    ],
  },

  nav: [
    { label: { tr: "Panel", en: "Dashboard" }, href: "/dashboard", icon: "layout-dashboard" },
    { label: { tr: "Takvim", en: "Calendar" }, href: "/calendar", icon: "calendar-days" },
    { label: { tr: "Hastalar", en: "Patients" }, href: "/clients", icon: "users" },
    { label: { tr: "Ayarlar", en: "Settings" }, href: "/settings", icon: "settings" },
  ],

  navGroups: [
    {
      label: { tr: "Klinik", en: "Clinic" },
      items: [
        { label: { tr: "Panel", en: "Dashboard" }, href: "/dashboard", icon: "layout-dashboard" },
        { label: { tr: "Takvim", en: "Calendar" }, href: "/calendar", icon: "calendar-days" },
        { label: { tr: "Hastalar", en: "Patients" }, href: "/clients", icon: "users" },
      ],
    },
    {
      label: { tr: "Kurulum", en: "Setup" },
      items: [
        { label: { tr: "Tedaviler", en: "Treatments" }, href: "/dashboard", icon: "stethoscope", muted: true },
        { label: { tr: "Hekimler", en: "Dentists" }, href: "/dashboard", icon: "user-cog", muted: true },
        { label: { tr: "Randevu sayfası", en: "Booking page" }, href: "/randevu", icon: "globe" },
      ],
    },
  ],

  integrations: [
    {
      key: "supabase",
      name: "Supabase",
      envVars: ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"],
      required: false,
      docsUrl: "https://supabase.com/dashboard/project/_/settings/api",
      purpose: "Veritabanı & giriş — hastalar, randevular, hekimler. Bağlı değilse uygulama demo modda çalışır.",
    },
    {
      key: "calendar",
      name: "Google Calendar",
      envVars: ["GOOGLE_CALENDAR_CLIENT_ID", "GOOGLE_CALENDAR_CLIENT_SECRET"],
      required: false,
      docsUrl: "https://console.cloud.google.com/apis/credentials",
      purpose: "Çift yönlü takvim senkronu — hekimlerin kişisel takvimleriyle müsaitliği aynı tutar.",
    },
    {
      key: "twilio",
      name: "Twilio",
      envVars: ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER"],
      required: false,
      docsUrl: "https://console.twilio.com",
      purpose: "SMS hatırlatma — randevu hatırlatması ve yeniden randevu bağlantısı göndererek gelmeyen hasta oranını düşürür.",
    },
  ],
};

export default appConfig;
