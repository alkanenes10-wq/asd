import Link from "next/link";
import appConfig from "@/app.config";
import { Logo } from "@/components/ui/logo";

/**
 * Herkese açık randevu sayfasının çerçevesi.
 *
 * Bu yüzey ne tanıtım (nav/footer istemez) ne panel (sidebar/topbar istemez) —
 * hastaya açık, tek amaçlı bir sayfa. Marka kuralı burada uygulanır: ürün adı
 * her sayfanın üstünde, `components/ui/logo.tsx` üzerinden.
 */
export default function BookingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-3xl items-center px-5">
          <Link href="/" aria-label={appConfig.name}>
            <Logo />
          </Link>
          <span className="ml-auto text-[12.5px] text-muted-foreground">
            Online randevu
          </span>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-3xl px-5 py-6 text-center text-[12px] text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">
            {appConfig.name}
          </Link>{" "}
          ile güçlendirilmiştir · {appConfig.domain}
        </div>
      </footer>
    </div>
  );
}
