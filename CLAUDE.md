# Bu projede çalışmak (önce beni oku)

Bu **seansapp** — **diş klinikleri için online randevu sistemi**. Karabük'te
yerel satış için hazırlandı; ilk satıştan sonra SaaS modeline geçilecek.
**Uygulamanın tek işi randevu almak.**

**Tasarım dili:** AÇIK, beyaz + mavi. Saf beyaz yüzeyler, serin gri nötrler
(hue ≈ 250), kıl payı kenarlıklar, **mavi** marka rengi
(`oklch(56% 0.16 252)`), tabular rakamlar (Bricolage Grotesque + JetBrains
Mono), üstte soluk mavi bir yıkama. Açık tema varsayılan — `<html>` üzerinde
`dark` sınıfı **yok**. Panel bir randevu kokpiti: beyaz gruplu sidebar
(Klinik / Kurulum) · istatistik satırı · **gün programı** (hekim sütunları ×
saat satırları, tedaviye göre renklenen bloklar) · randevu listesi → sağ detay
çekmecesi · tedavi/hekim panelleri · hastalar · randevu eğilimi grafiği ·
randevu sayfası önizlemesi · yaklaşan/gelmeyen paneli. Tüm görseller inline
SVG (grafikler `components/app/charts.tsx`, randevu widget'ı
`components/marketing/`), logo `components/ui/logo.tsx` — **fotoğraf yok,
grafik kütüphanesi yok**.

## Marka her sayfanın üstünde

İstenen kural: **ürün adı her sayfada üstte görünür.**
- Panel sayfaları → `components/app/topbar.tsx` solunda `<Logo />` + ayraç +
  aktif sayfa başlığı (her ekran boyutunda).
- Tanıtım sayfası → `app/(marketing)/layout.tsx` header ve footer.
- Giriş/kayıt → `components/auth/auth-screen.tsx` (geniş ekranda marka paneli,
  dar ekranda formun üstünde logo).

Bir sayfa eklerken bu kuralı bozmayın.

## Tek doğruluk kaynağı

`app.config.ts` markayı, tanıtım sayfasını, panel navigasyonunu
(`navGroups` = gruplu sidebar; `nav` = topbar başlığı için düz liste), TL
abonelik paketlerini ve entegrasyon listesini sürer. UI metnini değiştirmeden
önce burayı okuyun.

## Kapsam bayrakları

```ts
features: { payments: false, revenue: false }
```

Ödeme / depozito / gelir arayüzleri **kaldırılmadı, gizlendi**. SaaS'a geçerken
bayrağı `true` yapın ve `.env.local`'a Stripe anahtarlarını ekleyin.
`lib/utils.ts` içindeki `formatPrice` / `formatMoney` ve `lib/demo/data.ts`
içindeki `price` / `deposit` / `spend` alanları bu yüzden duruyor (hepsi 0).

## Dil: Türkçe

Arayüz tek dilli. Dil `lib/i18n/config.ts` içindeki `DEFAULT_LANG = "tr"` ile
sabit; `LanguageProvider` artık localStorage'dan dil geri yüklemiyor ve TR/EN
toggle hiçbir yerde render edilmiyor (`components/ui/language-toggle.tsx`
dosyası ileride lazım olur diye duruyor). Yeni metinler yine `{ tr, en }`
tipinde yazılır — `en` alanını doldurun, arayüzde görünmez.

## Giriş

`/login` ve `/signup` gerçek ekranlar ama **demo geçişi** çalışıyor — Supabase
bağlı değil, form gönderimi doğrudan panele düşürür.

## Demo modu

`.env.local` boşken uygulama `lib/demo/data.ts`'ten render eder (bir günlük
randevu, hekimler, tedaviler, hastalar). Bu bilinçli — herkes uygulamayı anında
açabilsin diye. Anahtarlar geldiğinde gerçek veri demo verinin yerini alır.

<!-- BEGIN:nextjs-agent-rules -->
## Bu, bildiğiniz Next.js olmayabilir

Bu Next.js 16 (App Router, React 19, Tailwind v4). API'ler ve kurallar eski
eğitim verisinden farklı olabilir. Bir Next.js API'sinden emin değilseniz kod
yazmadan önce `node_modules/next/dist/docs/` altına bakın ve kullanımdan
kaldırma uyarılarını dikkate alın.
<!-- END:nextjs-agent-rules -->
