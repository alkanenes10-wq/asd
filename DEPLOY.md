# Yayına alma — GitHub + Vercel

Bu dosya seansapp'i sıfırdan yayına almanın adımlarını anlatır. Uygulama
**demo modda** çalışır; hiçbir ortam değişkeni (env var) girmeden deploy
edebilirsiniz.

---

## 1. GitHub'a yükleme

En kritik nokta: **`app/`, `components/`, `package.json` repo'nun kökünde
olmalı.** Fazladan bir üst klasörün içinde kalırlarsa Vercel build sırasında
şu hatayı verir:

```
Couldn't find any `pages` or `app` directory
```

Zip'i açtıktan sonra oluşan klasörün **içine girin** ve oradaki dosyaları
push edin.

```bash
cd seansapp          # zip'ten çıkan klasörün İÇİ
ls                   # app/ components/ lib/ package.json görünmeli

git init
git add .
git commit -m "seansapp"
git branch -M main
git remote add origin https://github.com/KULLANICI/REPO.git
git push -u origin main
```

Push'tan sonra GitHub'da repo ana sayfasında doğrudan `app/` klasörünü
görüyor olmalısınız. Tek bir klasör görüyorsanız yapı yanlıştır.

---

## 2. Vercel'e bağlama

1. [vercel.com/new](https://vercel.com/new) → GitHub reposunu seçin.
2. **Framework Preset:** Next.js (otomatik algılanır).
3. **Root Directory:** boş bırakın (`./`). Buraya bir alt klasör yazılırsa
   yukarıdaki "app directory bulunamadı" hatası çıkar.
4. **Environment Variables:** hiçbiri zorunlu değil — boş geçebilirsiniz.
5. **Deploy**.

Build komutu `npm run build`, output dizini `.next` — hepsi varsayılan.

### İsteğe bağlı ortam değişkenleri

`.env.example` içindeki anahtarların **hepsi opsiyoneldir**. Hiçbiri yokken
uygulama örnek bir klinik günüyle demo modda açılır. Supabase / Google Calendar
/ Twilio bağlamak isterseniz Vercel > Settings > Environment Variables'a
ekleyin ve yeniden deploy edin.

Canlıya çıktıktan sonra `NEXT_PUBLIC_APP_URL` değerini gerçek alan adınızla
güncellemeniz önerilir.

---

## 3. PWA (ana ekrana ekleme)

Uygulama yüklenebilir bir PWA olarak yapılandırıldı. İlgili dosyalar:

| Dosya | İşi |
|---|---|
| `app/manifest.ts` | `/manifest.webmanifest` üretir — ad, ikonlar, tema rengi, kısayollar |
| `public/sw.js` | Service worker — çevrimdışı destek ve varlık önbelleği |
| `components/pwa/pwa.tsx` | Service worker kaydı + "Uygulamayı yükle" daveti |
| `app/offline/page.tsx` | İnternet kesikken gösterilen sayfa |
| `public/icons/` | 192/512 px normal ve maskable ikonlar |

**Önemli:** Service worker yalnızca **üretim** derlemesinde ve **HTTPS**
üzerinde kaydolur. Vercel otomatik HTTPS verdiği için canlıda sorunsuz çalışır;
`npm run dev` sırasında bilerek devre dışıdır (yerelde bayat önbellek
yaşamamak için).

### Test etme

Deploy sonrası sitenizi Chrome'da açın:

* **DevTools → Application → Manifest** — ad, ikonlar, "Installability" bölümü
  hatasız görünmeli.
* **Application → Service Workers** — `sw.js` "activated and running" olmalı.
* Adres çubuğunun sağındaki **yükle** simgesi ya da sayfanın altındaki
  "seansapp'i yükle" kartı ile kurun.
* Android: Chrome menü → "Uygulamayı yükle".
* iPhone: Safari → Paylaş → "Ana Ekrana Ekle". (iOS'ta `beforeinstallprompt`
  yoktur, bu yüzden davet kartı çıkmaz — normaldir.)

### Service worker güncellemesi

Yeni bir sürüm yayınladığınızda kullanıcıların eski önbellekte takılı
kalmaması için `public/sw.js` içindeki sürüm satırını artırın:

```js
const VERSION = "seansapp-v1";   // → "seansapp-v2"
```

Bu satır değişince eski önbellekler otomatik silinir.

---

## 4. Sık karşılaşılan sorunlar

**`Couldn't find any pages or app directory`**
`app/` klasörü repo kökünde değil, ya da Vercel'de Root Directory yanlış.
Bkz. Adım 1 ve 2.

**`Failed to fetch Bricolage Grotesque from Google Fonts`**
Build ortamının `fonts.googleapis.com` adresine erişimi yok. Vercel'de bu
sorun çıkmaz; yalnızca ağı kısıtlı ortamlarda görülür.

**Yükle düğmesi görünmüyor**
Site HTTPS değilse, manifest hatalıysa, uygulama zaten kuruluysa ya da davet
daha önce kapatıldıysa çıkmaz. Kapatma kaydını temizlemek için DevTools →
Application → Local Storage → `seansapp:install-dismissed` anahtarını silin.

**Değişiklikler canlıda görünmüyor**
Service worker eski sürümü sunuyor olabilir. DevTools → Application →
Service Workers → "Unregister", sonra sayfayı yenileyin. Kalıcı çözüm için
`VERSION` sabitini artırın.
