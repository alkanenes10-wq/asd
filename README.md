# seansapp

**Diş klinikleri için online randevu sistemi.** Paylaşılabilir bir randevu
sayfası, hekim bazlı takvim, hasta kayıtları ve otomatik hatırlatmalar.
Uygulamanın tek işi randevu almak.

> _"Hastalarınız 7/24 randevu alsın."_

**Next.js 16** üzerine kurulu, üretime hazır bir uygulama.

## Hızlı başlangıç

```bash
npm install
npm run dev          # → http://localhost:3000  (demo modda, anahtar gerekmez)
```

Uygulama örnek bir klinik günüyle açılır — randevular, hekimler, tedaviler ve
hastalar hazırdır; ürünün tamamını hemen gezebilirsiniz.

## Kapsam: sadece randevu

Ödeme, depozito ve gelir arayüzleri **kodda duruyor ama render edilmiyor**.
`app.config.ts` içindeki bayraklar kontrol eder:

```ts
features: {
  payments: false,   // depozito, ödeme, no-show ücreti
  revenue: false,    // ciro kartları, tutar sütunları
}
```

SaaS modeline geçerken bu bayrakları `true` yapıp `.env.local`'a Stripe
anahtarlarını eklemek yeterli.

## Dil

Arayüz **Türkçe**. Metinler yine `{ tr, en }` tipinde tutuluyor ve dil
`lib/i18n/config.ts` içindeki `DEFAULT_LANG` ile sabitlenmiş durumda; ileride
İngilizce sürüm gerekirse `LanguageToggle` bileşenini geri takmak yeterli.

## İçerik

```
app.config.ts            ← tek doğruluk kaynağı (marka, metinler, nav, paketler, bayraklar)
app/(marketing)/         ← tanıtım sayfası (hero, canlı demo, paketler, S.S.S.)
app/(app)/dashboard/     ← randevu paneli (gün programı, randevu listesi, detay çekmecesi)
app/(app)/calendar/      ← hekim × saat takvimi
app/(app)/clients/       ← hasta listesi + geçmişiyle hasta kartı
app/(app)/settings/      ← marka + entegrasyon durumu
components/app/          ← sidebar, topbar, inline-SVG grafikler
components/marketing/    ← etkileşimli randevu demosu, ürün önizlemesi
lib/demo/data.ts         ← randevular, tedaviler, hekimler, hastalar (demo modu besler)
.env.example             ← kullanılabilecek anahtarlar (hepsi isteğe bağlı)
```

## Entegrasyonlar

Hepsi isteğe bağlı — anahtar yokken uygulama demo modda kalır.

| Servis | Ne yapar |
|---|---|
| **Supabase** | Veritabanı & giriş (hastalar, randevular, hekimler) |
| **Google Calendar** | Hekim takvimi çift yönlü senkron |
| **Twilio** | SMS randevu hatırlatmaları |

## Teknoloji

Next.js 16 (App Router) · React 19 · Tailwind v4 · lucide-react. Tüm grafikler
ve avatarlar **inline SVG** — grafik kütüphanesi ve fotoğraf yok. Çalıştırmak
için veritabanı gerekmez.
