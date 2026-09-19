import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Çevrimdışısınız — seansapp",
  description: "İnternet bağlantısı yok.",
};

/**
 * Service worker, ağ yokken ve sayfa önbellekte de bulunamadığında bu sayfayı
 * gösterir. Tamamen statik olmalı — veri çekmemeli.
 */
export default function OfflinePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/icons/icon-192.png"
          alt=""
          width={56}
          height={56}
          className="mx-auto mb-5 rounded-xl"
        />
        <h1 className="font-display text-xl font-semibold">Bağlantı yok</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          seansapp şu anda internete ulaşamıyor. Bağlantınız geri geldiğinde
          kaldığınız yerden devam edebilirsiniz.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          Yeniden dene
        </Link>
      </div>
    </main>
  );
}
