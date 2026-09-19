import type { Metadata, Viewport } from "next";
// ── YAZI TİPLERİ ──────────────────────────────────────────────────────────
// seansapp başlıklar ve arayüz için Bricolage Grotesque'i, saat/rakam ve
// etiketler için JetBrains Mono'yu kullanır. CSS değişken adlarını
// (--font-sans-app / --font-display-app / --font-mono-app) koruyun; globals.css
// bunları okur.
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/i18n/language-provider";
import { PWA } from "@/components/pwa/pwa";
import appConfig from "@/app.config";
import { DEFAULT_LANG } from "@/lib/i18n/config";

const sans = Bricolage_Grotesque({
  variable: "--font-sans-app",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const display = Bricolage_Grotesque({
  variable: "--font-display-app",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono-app",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${appConfig.name} — ${appConfig.tagline[DEFAULT_LANG]}`,
  description: appConfig.description[DEFAULT_LANG],
  applicationName: appConfig.name,
  // ── PWA ──────────────────────────────────────────────────────────────────
  // manifest app/manifest.ts tarafından /manifest.webmanifest adresinde üretilir.
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: appConfig.name,
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  formatDetection: { telephone: false },
};

/**
 * viewport-fit=cover + safe-area, uygulama telefonda tam ekran (standalone)
 * açıldığında içeriğin çentik/ev çubuğu altında kalmamasını sağlar.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2b90e8" },
    { media: "(prefers-color-scheme: dark)", color: "#2b90e8" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang={DEFAULT_LANG}
      suppressHydrationWarning
      className={`${sans.variable} ${display.variable} ${mono.variable} h-full`}
    >
      <body className="min-h-full bg-background text-foreground antialiased font-sans">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <LanguageProvider>
            {children}
            <PWA />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
