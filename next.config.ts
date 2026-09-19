import type { NextConfig } from "next";

const isStaticExport = Boolean(process.env.STATIC_EXPORT);

const nextConfig: NextConfig = {
  // `STATIC_EXPORT=1 npm run build` → uygulamayı `out/` altına statik HTML olarak
  // çıkarır (her sayfa için bir .html + `_next/` varlıkları). Normal
  // `npm run dev` / `npm run build` bundan etkilenmez.
  ...(isStaticExport
    ? { output: "export" as const, images: { unoptimized: true } }
    : {}),

  // ── PWA başlıkları ────────────────────────────────────────────────────────
  // Service worker dosyası ASLA önbellekte tutulmamalı; yoksa yeni sürüm
  // yayına alındığında kullanıcılar eski sw.js ile takılı kalır.
  // `output: export` modunda headers() desteklenmediği için orada atlanır.
  ...(isStaticExport
    ? {}
    : {
        async headers() {
          return [
            {
              source: "/sw.js",
              headers: [
                {
                  key: "Cache-Control",
                  value: "public, max-age=0, must-revalidate",
                },
                { key: "Service-Worker-Allowed", value: "/" },
              ],
            },
            {
              source: "/manifest.webmanifest",
              headers: [
                {
                  key: "Cache-Control",
                  value: "public, max-age=0, must-revalidate",
                },
              ],
            },
          ];
        },
      }),
};

export default nextConfig;
