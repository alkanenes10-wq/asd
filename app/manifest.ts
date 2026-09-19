import type { MetadataRoute } from "next";
import appConfig from "@/app.config";
import { DEFAULT_LANG } from "@/lib/i18n/config";

/**
 * PWA manifest — /manifest.webmanifest adresinde Next.js tarafından üretilir.
 * Metinler app.config.ts'ten okunur, böylece tek kaynak kuralı bozulmaz.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${appConfig.name} — ${appConfig.tagline[DEFAULT_LANG]}`,
    short_name: appConfig.name,
    description: appConfig.description[DEFAULT_LANG],
    lang: DEFAULT_LANG,
    dir: "ltr",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#ffffff",
    theme_color: "#2b90e8",
    categories: ["business", "medical", "productivity"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/maskable-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Takvim",
        short_name: "Takvim",
        url: "/calendar",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Hastalar",
        short_name: "Hastalar",
        url: "/clients",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Randevu sayfası",
        short_name: "Randevu",
        url: appConfig.bookingPath,
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
