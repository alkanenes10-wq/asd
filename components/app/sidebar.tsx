"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Settings, LifeBuoy, LogOut } from "lucide-react";
import appConfig from "@/app.config";
import { Icon } from "@/components/ui/icon";
import { useLang } from "@/components/i18n/language-provider";
import { bookingPage } from "@/lib/demo/data";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useLang();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <aside className="hidden w-[260px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
      {/* Aktif klinik. Ürün adı (seansapp) her sayfada üst çubukta duruyor,
          burada tekrar etmiyoruz — bkz. components/app/topbar.tsx. */}
      <div className="flex h-14 items-center px-5">
        <Link href="/dashboard" className="inline-flex min-w-0 items-center gap-1.5">
          <span className="truncate font-display text-[15px] font-bold tracking-[-0.02em]">
            {bookingPage.business}
          </span>
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden>
            <path d="M5 6l3 3 3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </Link>
      </div>

      {/* Hasta / randevu arama */}
      <div className="px-3 pb-2">
        <button className="flex w-full items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <Search className="h-4 w-4 text-primary" />
          <span>Hasta ara</span>
          <kbd className="ml-auto rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
        </button>
      </div>

      {/* Grouped nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        {appConfig.navGroups.map((group) => (
          <div key={t(group.label)} className="mb-4">
            <p className="label-mono px-3 pb-1.5 pt-2 text-sidebar-muted">{t(group.label)}</p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = !item.muted && isActive(item.href);
                const inner = (
                  <>
                    <Icon
                      name={item.icon}
                      className={cn("h-[17px] w-[17px] shrink-0", active ? "text-primary" : "text-muted-foreground")}
                    />
                    <span className="truncate">{t(item.label)}</span>
                    {item.muted && (
                      <span className="ml-auto rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
                        yakında
                      </span>
                    )}
                    {item.badge && (
                      <span className="ml-auto rounded-full bg-destructive/10 px-1.5 py-0.5 text-[10px] font-semibold text-destructive">
                        {t(item.badge)}
                      </span>
                    )}
                  </>
                );
                if (item.muted) {
                  return (
                    <span
                      key={t(item.label)}
                      className="group flex cursor-default items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] font-medium text-sidebar-muted"
                    >
                      {inner}
                    </span>
                  );
                }
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] font-medium transition-colors",
                      active ? "nav-pill-active text-foreground" : "text-foreground/70 hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {inner}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Settings + Support */}
      <div className="space-y-0.5 px-3 pb-2">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] font-medium transition-colors",
            isActive("/settings") ? "nav-pill-active text-foreground" : "text-foreground/70 hover:bg-muted hover:text-foreground",
          )}
        >
          <Settings className="h-[17px] w-[17px] text-muted-foreground" />
          Ayarlar
        </Link>
        <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] font-medium text-foreground/70 transition-colors hover:bg-muted hover:text-foreground">
          <LifeBuoy className="h-[17px] w-[17px] text-muted-foreground" />
          Destek
        </button>
      </div>

      {/* Pinned user card */}
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-2.5 py-2 shadow-pill">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold text-white" style={{ backgroundImage: "var(--grad-brand)" }}>
            SA
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold">Dt. Selin Aydın</p>
            <p className="truncate text-[11.5px] text-muted-foreground">info@karabukdis.com</p>
          </div>
          <Link
            href="/login"
            aria-label="Çıkış"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
