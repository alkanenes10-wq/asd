# 👋 Buradan başla — seansapp

Bu klasör **çalışan bir uygulama**: diş klinikleri için online randevu sistemi.
Örnek bir klinik günüyle gelir ve önizlemek için **hiçbir kurulum
gerektirmez**.

---

## 1) Hemen önizleyin

```bash
npm install
npm run dev      # → http://localhost:3000
```

Gezilecek sayfalar: `/` (tanıtım), `/login`, `/dashboard`, `/calendar`,
`/clients`, `/settings`.

## 2) Bir kliniğe özel hale getirin

Değiştirilecek yerler:

| Ne | Nerede |
|---|---|
| Ürün adı, sloganlar, S.S.S., abonelik paketleri | `app.config.ts` |
| Renkler (mavi tonu, nötrler) | `app/globals.css` — `@theme` bloğu |
| Logo | `components/ui/logo.tsx`, `public/logo.svg`, `app/icon.svg` |
| Örnek klinik, hekimler, tedaviler | `lib/demo/data.ts` |
| Ödeme/gelir arayüzünü açma | `app.config.ts` → `features` |

## 3) Yayına alın

| Adım | Görsel | Ne olur |
|---|---|---|
| 0 · Genel bakış | `setup-guide/0-overview.png` | Akışın tamamı |
| 1 · Markalama | `setup-guide/1-build-with-claude.png` | İsim, logo, renk, metin |
| 2 · Supabase | `setup-guide/2-connect-supabase.png` | Veritabanı + giriş |
| 3 · GitHub | `setup-guide/3-push-to-github.png` | Kodu buluta kaydedin |
| 4 · Vercel | `setup-guide/4-deploy-to-vercel.png` | Uygulama canlıya çıkar |

Stripe adımı **şimdilik atlanır** — uygulamanın tek işi randevu almak. Abonelik
tahsilatına geçerken `app.config.ts` içindeki `features.payments` bayrağını
`true` yapıp `.env.local`'a Stripe anahtarlarını ekleyin.
