# GalaksiPay Developer Hub

[V2 / Frappe planı](https://karacaismail.github.io/galaxyPayFrappe/v2/) ve [V1 / referans seti](https://karacaismail.github.io/galaxyPayFrappe/), Astro ile GitHub Pages üzerinde yayınlanır. Bu repo **plan ve doküman sitesi** içerir; üretim ödeme uygulaması değildir.

## Çalıştırma

Node 24 kullanılır; minimum sürüm `package.json` içinde. Bağımlılıklar lockfile ile sabittir.

```sh
npm ci
npm run dev
npm run verify
```

Yerel: http://127.0.0.1:4321/v2/

```sh
SITE_BASE=/galaxyPayFrappe npm run verify
SITE_BASE=/galaxyPayFrappe npm run preview -- --port 4322
```

Pages benzeri önizleme: http://127.0.0.1:4322/galaxyPayFrappe/v2/

## Düzenleme

| Kaynak | Amaç |
|---|---|
| `src/content/v2/playbook.md` | Güncel Frappe mimarisi, 28 senaryo, 24 kart, mobil ve canlı kapıları |
| `src/pages/v2/index.astro` | Ayrı V2 sayfası; başlıklardan üretilen gezinme |
| `src/styles/v2.css` | 320 px ortak taban; her metin ≥1rem |
| `src/scripts/adaptive/` | Küçük loader; koşullu compact/desktop import; resize cleanup |
| `src/styles/adaptive/` | Profil CSS’leri; `?url` ile modül seçildikten sonra yüklenir |
| `src/content/docs/*.md` | V1’in 42 referans dokümanı |
| `src/data/roadmap.json` | V1’in 9 faz / 26 sprint / 78 kartı |
| `src/lib/urls.ts`, `astro.config.mjs` | Astro ve Markdown bağlantılarında Pages base path |
| `public/downloads/provider-contract.json` | Seçilmiş provider snapshotı; tam OpenAPI değil |
| `scripts/export-docs.mjs` | V1 ve V2 Markdown indirilebilir paketleri |
| `scripts/verify.mjs` | Link/anchor, kart/arama tutarlılığı, adaptive asset ayrımı |

V1 genel araması Cmd/Ctrl+K ile V2 içeriğini de bulur. V2’de 13 bölümlük içerik listesi ve geniş ekranda ek gezinme vardır. V1 checklistleri tarayıcıya yereldir; resmi sprint kabulü değildir.

## Adaptive teslimi kontrol et

Üretim buildini servis et. 320 px viewportu **sayfayı açmadan önce** seç; V2’de “Yüklenen dosyaları incele” düğmesine bas. Ortak JS/CSS + compact JS/CSS beklenir; desktop dosyaları olmamalıdır. 1280 px/fine pointer açılışında bunun tersi geçerlidir. Genişletip küçültme sonrası desktop DOM/listener kaldırılır; önceki indirmeler kaynak kaydında kalır.

Astro’nun CSS toplamasını önlemek için modüller CSS’i statik yan etki importu olarak kullanmaz; `?url` assetini mount aşamasında ekler. Yalnız `media query` veya `cssCodeSplit` ayarına güvenilmez. Derleme kontrolü HTML’e profil CSS’inin sızmasını, ayrı JS/CSS artifactlerini ve her modülün kendi CSS URL’sini içerdiğini denetler. Ürün için tam cold-cache/HAR kabul testi V2 S0/S3 kapsamındadır.

## Güven sınırı

Kaynak ve Pages herkese açıktır. Bu statik site GalaksiPay hesabına giriş yapmaz ve ödeme/iade çağrısı göndermez. Orijinal demo, credentiallar ve test kartları git/build dışındadır. Noindex erişim kontrolü değildir. Ödeme API’si ve gerçek sandbox UAT gelecekteki sprint kapsamındadır; doküman build başarısı ödeme entegrasyonunun doğrulandığı anlamına gelmez.
