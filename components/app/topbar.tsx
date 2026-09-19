"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Bell, Plus } from "lucide-react";
import appConfig from "@/app.config";
import { Logo } from "@/components/ui/logo";
import { useLang } from "@/components/i18n/language-provider";

/**
 * Uygulama üst çubuğu. Marka adı her ekran boyutunda ve her sayfada solda durur
 * (istenen "üstte isim" kuralı); yanında ince bir ayraçla aktif sayfanın başlığı
 * gelir. Sağda tek eylem: yeni randevu.
 */
export function Topbar() {
  const pathname = usePathname();
  const { t } = useLang();
  const current =
    appConfig.nav.find((n) => pathname === n.href || pathname.startsWith(n.href + "/")) ??
    appConfig.navGroups.flatMap((g) => g.items).find((n) => pathname === n.href || pathname.startsWith(n.href + "/"));

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-5 backdrop-blur lg:px-8">
      <Link href="/dashboard" className="inline-flex shrink-0 items-center" aria-label={appConfig.name}>
        <Logo />
      </Link>

      {current && (
        <>
          <span aria-hidden className="h-4 w-px shrink-0 bg-border" />
          <span className="truncate text-[14px] font-medium text-muted-foreground">
            {t(current.label)}
          </span>
        </>
      )}

      <div className="ml-auto flex items-center gap-1.5">
        <button className="hidden h-9 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-[13px] font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 sm:inline-flex">
          <Plus className="h-4 w-4" />
          Randevu
        </button>
        <button
          aria-label="Bildirimler"
          className="relative grid h-9 w-9 cursor-pointer place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-primary ring-2 ring-background" />
        </button>
      </div>
    </header>
  );
}
