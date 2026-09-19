"use client";

import { useEffect, useState } from "react";

/**
 * PWA kancası — kök layout'ta bir kez render edilir.
 *
 *  1. Service worker'ı kaydeder (yalnızca üretimde; dev'de kayıt yapılmaz ki
 *     yerelde bayat önbellek yüzünden kafa karıştırıcı davranış olmasın).
 *  2. Tarayıcı "yüklenebilir" dediğinde (beforeinstallprompt) küçük, kapatılabilir
 *     bir "Uygulamayı yükle" düğmesi gösterir. Uygulama zaten standalone modda
 *     açıksa hiçbir şey göstermez.
 *
 * Görsel olarak hiçbir şey render etmediği durumda DOM'a da hiçbir şey eklemez.
 */

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "seansapp:install-dismissed";

export function PWA() {
  const [deferred, setDeferred] = useState<InstallPromptEvent | null>(null);
  const [hidden, setHidden] = useState(true);

  // ── Service worker kaydı ────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Kayıt başarısız olursa uygulama normal çalışmaya devam eder.
      });
    };

    if (document.readyState === "complete") register();
    else window.addEventListener("load", register);

    return () => window.removeEventListener("load", register);
  }, []);

  // ── Yükleme daveti ──────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Zaten yüklü / standalone açıldıysa davet gösterme.
    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      // iOS Safari
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (standalone) return;

    let dismissed = false;
    try {
      dismissed = window.localStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      // localStorage kapalıysa sorun değil, daveti göstermeye devam ederiz.
    }
    if (dismissed) return;

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setDeferred(event as InstallPromptEvent);
      setHidden(false);
    };

    const onInstalled = () => {
      setDeferred(null);
      setHidden(true);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const dismiss = () => {
    setHidden(true);
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // yok sayılır
    }
  };

  const install = async () => {
    if (!deferred) return;
    setHidden(true);
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  };

  if (hidden || !deferred) return null;

  return (
    <div
      role="dialog"
      aria-label="Uygulamayı yükle"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-sm items-center gap-3 rounded-xl border border-border bg-card/95 p-3 shadow-lg backdrop-blur sm:left-auto sm:right-4 sm:mx-0"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icons/icon-192.png" alt="" width={36} height={36} className="rounded-lg" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">seansapp&apos;i yükle</p>
        <p className="truncate text-xs text-muted-foreground">
          Ana ekrana ekle, uygulama gibi kullan.
        </p>
      </div>
      <button
        type="button"
        onClick={install}
        className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
      >
        Yükle
      </button>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Kapat"
        className="shrink-0 rounded-lg px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground"
      >
        ✕
      </button>
    </div>
  );
}

export default PWA;
