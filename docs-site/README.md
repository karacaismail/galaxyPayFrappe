# GalaksiPay DX docs v2.1

23 güncel doküman, 8 faz, 13 sprint ve 39 planlanmış RED test senaryosu. V1’in 42 sayfası tarihsel referanstır. Ürün kodu yok; bu repo Astro sitesi ve doküman kabul testlerini içerir.

## Çalıştır

Node 24 ve lockfile kullanılır.

```sh
npm ci
npm run test:docs
npm run dev
npm run verify
SITE_BASE=/galaxyPayFrappe npm run verify
SITE_BASE=/galaxyPayFrappe npm run preview -- --port 4322
```

Yerel `/v2/`; Pages benzeri preview `http://127.0.0.1:4322/galaxyPayFrappe/v2/`.

## Kaynak düzeni

| Kaynak | Amaç |
|---|---|
| `src/content/v2/` | Quickstart, test verisi, core, TDD, roadmap, callback, audit, mimari ve API sayfaları |
| `src/data/development-plan.json` | Güncel faz/sprint/build/RED/fixture/evidence kaynağı; roadmap Markdown aynı değişiklikte güncellenir |
| `src/data/test-cards.json` | Kaynak checksumuyla 18 sağlayıcı dummy kartı |
| `src/data/api-reference.json` | 10 seçilmiş endpointin path/method/example/test/unknown kaydı |
| `public/downloads/` | Tam OpenAPI, Postman, synthetic callback, test kartları, Markdown paketleri |
| `src/layouts/DxLayout.astro` | Ortak görev odaklı doküman kabuğu |
| `src/scripts/adaptive/` | Koşullu compact/desktop import; CSS `?url` ile mountta yüklenir |
| `src/scripts/dx-search.ts` | Talep üzerine indeks yükler; güncel DX sayfalarını arar |
| `tests/dx-contract.test.mjs` | Kaynak kartları, kritik DX görevleri, RED test kapsamı, endpoint/şema ve referans bütünlüğü |
| `scripts/verify.mjs` | Build sonrası link/anchor, sprint/test izi, arama ve adaptive artifact kontrolleri |

Kök rota güncel `/v2/` merkezine yönlendirir. `/v1/` ve `/docs/` eski stack/takvim içeriklerini arşiv uyarısıyla korur. Aktif rota Frappe/MariaDB, Vue headless admin ve TypeScript/Vite/Flowbite/Tailwind/Alpine frontpages’tir.

## Test-first değişiklik

Önce kullanıcı gereksiniminin eksik olduğu durumda başarısız kabul testi yazıldı; ardından kart verisi, referanslar ve plan eklendi. `test:docs` gerçek ödeme testi değildir. Backend TDD ve sandbox UAT işleri `v2/tdd/` ile yol haritasında planlanmıştır.

Kartlar yalnız kullanıcının verdiği sağlayıcı dummy test listesidir; finansal canlı veri değildir. Parola/token/kayıtlı cüzdan telefonu public fixturea eklenmez. Source checksum ve normalize kart hash’i verinin kazara değişmesini yakalar; yeni sağlayıcı listesi gelirse kaynak/metadata/test birlikte güncellenir.

## Adaptive kontrol

Production buildi servis et; gerçekten 320 CSS px viewport olduğuna bak. `/v2/mobile/` sayfasındaki dosya inceleme alanını aç: ortak + compact beklenir, desktop JS/CSS olmamalıdır. 1280/fine pointerda ek gezinme gerçekten yüklenir; küçültmede DOM/listener/CSS kaldırılır. Önce indirilmiş byte geri alınmaz. Kaynak kayıtları cache hitlerini de içerir; bu inceleme tam izole HAR testinin yerine geçmez.
