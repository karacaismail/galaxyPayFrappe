# GalaksiPay × Frappe · DX rehberi v2.1

Core development → MVP → maturity. Bu paket plan ve referanstır; ürün testleri ayrıca uygulanacaktır.

# Quickstart

Kaynak: src/content/v2/quickstart.md

## Bu repoda bugün ne çalışır?

Astro doküman sitesi ve doküman/fixture kontrolleri çalışır. **Frappe ödeme uygulaması, provider adapterı ve ürün E2E testleri henüz yok.** İki yolu ayır: dokümanı şimdi çalıştır; ödeme geliştirmesine Core C01’den başla.

```sh
git clone https://github.com/karacaismail/galaxyPayFrappe.git
cd galaxyPayFrappe/docs-site
npm ci
npm run test:docs
npm run dev
```

Beklenen: doküman testleri yeşil; `http://127.0.0.1:4321/v2/` açılır. Bu, ödeme testi değildir. `npm run verify` test + Astro check + build + link/asset kontrolünü çalıştırır.

## Sandbox entegrasyonunu doğrulama sırası

| Adım | Ne kullanılır? | Başarı kanıtı / ilerleme koşulu |
|---|---|---|
| 1 · Erişim | [Demo](https://testapp.galaksipay.com/demo), yerel `GalaksipayDemo/` ve sağlayıcı API hesabı | Hesap yalnız sunucu/env’de; username/parola client buildine girmez |
| 2 · Auth | [Authenticate](https://karacaismail.github.io/galaxyPayFrappe/v2/api/authenticate/) | Gerçek token cevabı redakte fixturea alınır; Q03 parser/TTL teyidi |
| 3 · Satıcı | [GetSubMerchants](https://karacaismail.github.io/galaxyPayFrappe/v2/api/sub-merchants/) | Dönen gerçek Id, IsActive ve ayarlar doğrulanır; iki dummy hesabın IDsi listeden alınır |
| 4 · Başlat | [Transaction/Add](https://karacaismail.github.io/galaxyPayFrappe/v2/api/create-payment/) | Benzersiz OrderNo, yetkili telefon, gerçek submerchant, erişilebilir HTTPS callback; Id ve PaymentUrl kaydedilir |
| 5 · Hosted checkout | [18 test kartı](https://karacaismail.github.io/galaxyPayFrappe/v2/test-data/) | Kart listeden seçilir; 3DS/SMS ekranında test OTP kullanılır; başarısız kart için listeden başka kart denenir |
| 6 · Sonuç | [Callback](https://karacaismail.github.io/galaxyPayFrappe/v2/callback/) + [GetById](https://karacaismail.github.io/galaxyPayFrappe/v2/api/payment-status/) | OrderNo/Id/tutar/merchant eşleşir; tek sipariş etkisi. Linkin açılması “ödendi” değildir |
| 7 · Hata yolu | [TDD matrisi](https://karacaismail.github.io/galaxyPayFrappe/v2/tdd/) | Tekrar/timeout/kayıp callback/yanlış merchant ayrıca sınanır; happy path tek başına kabul değildir |

Bu adımlar manuel yetkili sandbox çalışması içindir. Doküman sitesi sağlayıcıya istek göndermez. Gerçek callback adresi internetten erişilebilir HTTPS olmalıdır; localhost doğrudan sağlayıcıdan erişilebilir değildir. Tunnel kullanılacaksa yalnız test receiverına yönlendirilir; public doküman/Pages callback alıcısı değildir.

## Ortam değişkenleri — proje taslağı

| Ad | Nerede / nasıl temin edilir? | Eksikse davranış |
|---|---|---|
| `GALAKSIPAY_BASE_URL` | Sandbox: `https://testapi.galaksipay.com/galaksipay`; prod Q11 | Yanlış ortama çağrı yapma |
| `GALAKSIPAY_USERNAME`, `GALAKSIPAY_PASSWORD` | E-postada tanımlanan `IstocAdmin` test hesabı; parola yerel `Views/Payment/Index.cshtml` içinde, prod ayrı teslim | Sunucu start fail-fast; browsera fallback yok |
| `GALAKSIPAY_SUBMERCHANT_ID` | API listesinden; yerel seller mapping ile eşleştir | Örnek UUID veya ana merchant fallback kullanma |
| `PAYMENT_CALLBACK_URL` | Ortama özel sabit HTTPS receiver | Header/hosttan rastgele türetme |
| `TEST_BUYER_PHONE` | Yetkili doğrudan kart test telefonu | Gerçek kişi numarası uydurma |
| `TEST_WALLET_PHONE` | Yazışmadaki kayıtlı cüzdan hesabı; ekip test secret’ı | Cüzdan UAT “bekliyor”; kart akışı ayrı ilerler |
| `FRAPPE_TEST_SITE` | C01’de oluşturulan ayrı test sitesi | Üretim DB’sinde test çalıştırma |

Bu isimler yeni uygulamanın hedef env sözleşmesidir; henüz backend tarafından okunmaz. `.env` örneği değer içermez. Test kartları sağlayıcı dummy verisidir; hesap parolası ve kayıtlı cüzdan telefonu aynı veri sınıfı değildir.

## İlk geliştirme işi

[Core development](https://karacaismail.github.io/galaxyPayFrappe/v2/core-development/) → [C01 kırmızı testleri](https://karacaismail.github.io/galaxyPayFrappe/v2/roadmap/#c01) → en küçük uygulama → gerçek DB/rol testi → review. Sağlayıcı teyidi beklerken deterministic mock ile ilerle; mock sonucunu sandbox sonucu olarak kaydetme.


---

# Test kartları ve sandbox verileri

Kaynak: src/content/v2/test-data.md

## Test kartları

**Kaynak:** kullanıcının sağladığı `GalaksiPay_Test_Kartları.txt`. Aşağıdaki 18 kayıt **yalnız sağlayıcı test ortamı için verilmiştir**. Kaynak dosyadaki `_` ayıracı giriş için çıkarıldı. `SKT (Yıl/Ay) = 2612`, arayüzde **12/26**; ayrı alan varsa ay **12**, yıl **2026**. CVV `000` string olarak korunur.

**Dosyayla doğrulandı; ödeme işlemiyle denenmedi.** Kartların bugün kabul edildiği veya her kartın belirli bir red/başarı senaryosu ürettiği iddia edilmez. Sağlayıcı, geçerliliğin değişebildiğini ve sorun halinde listedeki başka kartın denenmesini belirtmiştir. OTP yalnız bu test kartı listesinin SMS şifresidir; diğer gerçek hesap/işlemler için genellenmez.

<div class="test-card-grid">
<section class="test-card"><h3>CARD-01</h3><div class="pan-row"><code>6060432073705005</code><button type="button" class="button" data-copy-card="6060432073705005" aria-label="CARD-01 numarasını kopyala" hidden>Kopyala</button></div><p>SKT <strong>12/26</strong> · CVV <code>000</code><br>SMS test şifresi <code>123456</code></p></section>
<section class="test-card"><h3>CARD-02</h3><div class="pan-row"><code>5167400000496745</code><button type="button" class="button" data-copy-card="5167400000496745" aria-label="CARD-02 numarasını kopyala" hidden>Kopyala</button></div><p>SKT <strong>12/26</strong> · CVV <code>000</code><br>SMS test şifresi <code>123456</code></p></section>
<section class="test-card"><h3>CARD-03</h3><div class="pan-row"><code>4256691944867646</code><button type="button" class="button" data-copy-card="4256691944867646" aria-label="CARD-03 numarasını kopyala" hidden>Kopyala</button></div><p>SKT <strong>12/26</strong> · CVV <code>000</code><br>SMS test şifresi <code>123456</code></p></section>
<section class="test-card"><h3>CARD-04</h3><div class="pan-row"><code>4284624140544525</code><button type="button" class="button" data-copy-card="4284624140544525" aria-label="CARD-04 numarasını kopyala" hidden>Kopyala</button></div><p>SKT <strong>12/26</strong> · CVV <code>000</code><br>SMS test şifresi <code>123456</code></p></section>
<section class="test-card"><h3>CARD-05</h3><div class="pan-row"><code>4985170000702810</code><button type="button" class="button" data-copy-card="4985170000702810" aria-label="CARD-05 numarasını kopyala" hidden>Kopyala</button></div><p>SKT <strong>12/26</strong> · CVV <code>000</code><br>SMS test şifresi <code>123456</code></p></section>
<section class="test-card"><h3>CARD-06</h3><div class="pan-row"><code>4356292313685179</code><button type="button" class="button" data-copy-card="4356292313685179" aria-label="CARD-06 numarasını kopyala" hidden>Kopyala</button></div><p>SKT <strong>12/26</strong> · CVV <code>000</code><br>SMS test şifresi <code>123456</code></p></section>
<section class="test-card"><h3>CARD-07</h3><div class="pan-row"><code>5218487962459752</code><button type="button" class="button" data-copy-card="5218487962459752" aria-label="CARD-07 numarasını kopyala" hidden>Kopyala</button></div><p>SKT <strong>12/26</strong> · CVV <code>000</code><br>SMS test şifresi <code>123456</code></p></section>
<section class="test-card"><h3>CARD-08</h3><div class="pan-row"><code>5200190005138652</code><button type="button" class="button" data-copy-card="5200190005138652" aria-label="CARD-08 numarasını kopyala" hidden>Kopyala</button></div><p>SKT <strong>12/26</strong> · CVV <code>000</code><br>SMS test şifresi <code>123456</code></p></section>
<section class="test-card"><h3>CARD-09</h3><div class="pan-row"><code>5269737320050521</code><button type="button" class="button" data-copy-card="5269737320050521" aria-label="CARD-09 numarasını kopyala" hidden>Kopyala</button></div><p>SKT <strong>12/26</strong> · CVV <code>000</code><br>SMS test şifresi <code>123456</code></p></section>
<section class="test-card"><h3>CARD-10</h3><div class="pan-row"><code>4446763125813623</code><button type="button" class="button" data-copy-card="4446763125813623" aria-label="CARD-10 numarasını kopyala" hidden>Kopyala</button></div><p>SKT <strong>12/26</strong> · CVV <code>000</code><br>SMS test şifresi <code>123456</code></p></section>
<section class="test-card"><h3>CARD-11</h3><div class="pan-row"><code>6060433087290190</code><button type="button" class="button" data-copy-card="6060433087290190" aria-label="CARD-11 numarasını kopyala" hidden>Kopyala</button></div><p>SKT <strong>12/26</strong> · CVV <code>000</code><br>SMS test şifresi <code>123456</code></p></section>
<section class="test-card"><h3>CARD-12</h3><div class="pan-row"><code>4799150896081734</code><button type="button" class="button" data-copy-card="4799150896081734" aria-label="CARD-12 numarasını kopyala" hidden>Kopyala</button></div><p>SKT <strong>12/26</strong> · CVV <code>000</code><br>SMS test şifresi <code>123456</code></p></section>
<section class="test-card"><h3>CARD-13</h3><div class="pan-row"><code>5377193762823307</code><button type="button" class="button" data-copy-card="5377193762823307" aria-label="CARD-13 numarasını kopyala" hidden>Kopyala</button></div><p>SKT <strong>12/26</strong> · CVV <code>000</code><br>SMS test şifresi <code>123456</code></p></section>
<section class="test-card"><h3>CARD-14</h3><div class="pan-row"><code>5200190059838710</code><button type="button" class="button" data-copy-card="5200190059838710" aria-label="CARD-14 numarasını kopyala" hidden>Kopyala</button></div><p>SKT <strong>12/26</strong> · CVV <code>000</code><br>SMS test şifresi <code>123456</code></p></section>
<section class="test-card"><h3>CARD-15</h3><div class="pan-row"><code>5163103002982563</code><button type="button" class="button" data-copy-card="5163103002982563" aria-label="CARD-15 numarasını kopyala" hidden>Kopyala</button></div><p>SKT <strong>12/26</strong> · CVV <code>000</code><br>SMS test şifresi <code>123456</code></p></section>
<section class="test-card"><h3>CARD-16</h3><div class="pan-row"><code>5486742060635314</code><button type="button" class="button" data-copy-card="5486742060635314" aria-label="CARD-16 numarasını kopyala" hidden>Kopyala</button></div><p>SKT <strong>12/26</strong> · CVV <code>000</code><br>SMS test şifresi <code>123456</code></p></section>
<section class="test-card"><h3>CARD-17</h3><div class="pan-row"><code>5200190011811433</code><button type="button" class="button" data-copy-card="5200190011811433" aria-label="CARD-17 numarasını kopyala" hidden>Kopyala</button></div><p>SKT <strong>12/26</strong> · CVV <code>000</code><br>SMS test şifresi <code>123456</code></p></section>
<section class="test-card"><h3>CARD-18</h3><div class="pan-row"><code>4090700100360047</code><button type="button" class="button" data-copy-card="4090700100360047" aria-label="CARD-18 numarasını kopyala" hidden>Kopyala</button></div><p>SKT <strong>12/26</strong> · CVV <code>000</code><br>SMS test şifresi <code>123456</code></p></section>
</div>

[Test verisini JSON indir](https://karacaismail.github.io/galaxyPayFrappe/downloads/test-cards.json). Kaynak SHA-256: `3b3e4da87dd4acea73abb81dce9330a784e1715010941a596098bdd64ff292f2`. Kaynak kontrol tarihi: 18 Eylül 2026. Test raporunda PAN yerine `CARD-01` gibi referans ve gerekiyorsa son dört rakam kullan.

## Doğrudan kart ve cüzdan birbirinden farklı testlerdir

| Akış | Gerekli veri | Adımlar | Kabul |
|---|---|---|---|
| Doğrudan kart | Yetkili kendi test telefonunuz + listedeki kart | Hosted link → kart bilgisi → sunuluyorsa 3DS/OTP → sonuç | Callback/GetById eşleşmesi ve tek ödeme etkisi |
| Kayıtlı kart / cüzdan | Sağlayıcı test ortamında hesabı bulunan telefon | Yazışmadaki numara `TEST_WALLET_PHONE` olarak ekip test secret’ına alınır → hosted wallet akışı | Kayıtlı kart yolu ayrıca UAT; doğrudan kart başarısından çıkarılmaz |
| Dummy satıcı | Auth hesabıyla `GetSubMerchants` sonucu | İki dummy kaydı listeden belirle, aktif/ayar kontrolü, yerel Seller A/B mapping | ID ve hesabın kapsamı kanıtlı; sabit uydurma UUID kullanılmaz |
| Gerçek satıcı | Entegrasyon belgesi §2.3 ve sağlayıcı aktivasyonu | Alan listesini sağlayıcıdan al, güvenli ilet, onayı bekle | §2.1 bilgisi istenmiyor; §2.3 içeriği elimizde olmadığı için alan uydurulmaz |

Kayıtlı cüzdan telefonu yazışmada mevcut; public portala kişi/test hesabı tanımlayıcısı olarak kopyalanmadı. Test hesabı parolası da yerel demo veya ekip secret store’undan alınır. **Erişim yolu belgelenir; test kartı kataloğu erişilemez bırakılmaz.**

## Tekrar üretilebilir UAT kaydı

```json
{
  "run_id": "UAT-EXAMPLE-001",
  "environment": "sandbox",
  "card_ref": "CARD-01",
  "merchant_ref": "seed-seller-a",
  "order_no": "ORDER-SYNTHETIC-001",
  "payment_id": "<returned-id>",
  "expected": "verified-payment-and-one-business-effect",
  "observed": "not-run",
  "executed_at": null
}
```

Kart reddi tek başına ürün kusuru kanıtı değildir. Kullanılan kart ref, sağlayıcı işlem ref ve maskeli hata sınıfını kaydet; farklı kartla tekrar denemeden önce önceki attemptin belirsiz olmadığını kontrol et. UNKNOWN işlem için yeni tahsilat açma. Test red/timeout/duplicate senaryoları kart listesine yüklenmez; deterministic mock/fault injection ile üretilir.


---

# GalaksiPay API referansı

Kaynak: src/content/v2/api.md

## Sözleşme durumu

Test Swagger 18 Eylül 2026 tekrar HTTP GET ile alındı; **40 path**, önceki SHA-256 ile aynı. Auth/ödeme çağrısı yapılmadı. Aşağıda entegrasyon için seçilmiş 10 operasyon ayrıntılıdır. Diğer 30 path tam snapshotta incelenebilir; hepsi hosted checkout görevi değildir.

[Tam OpenAPI JSON](https://karacaismail.github.io/galaxyPayFrappe/downloads/provider-openapi.json) · [Postman koleksiyonu](https://karacaismail.github.io/galaxyPayFrappe/downloads/galaksipay.postman_collection.json) · [Model referansı](https://karacaismail.github.io/galaxyPayFrappe/v2/api/models/)

## Endpointler

| Yöntem | Yol / referans | Aşama |
|---|---|---|
| POST | [/api/Authentication/Authenticate](https://karacaismail.github.io/galaxyPayFrappe/v2/api/authenticate/) | Core |
| GET | [/api/Merchant/GetSubMerchants](https://karacaismail.github.io/galaxyPayFrappe/v2/api/sub-merchants/) | Core / MVP |
| POST | [/api/Transaction/Add](https://karacaismail.github.io/galaxyPayFrappe/v2/api/create-payment/) | MVP |
| GET | [/api/Transaction/GetById/{id}](https://karacaismail.github.io/galaxyPayFrappe/v2/api/payment-status/) | MVP |
| GET | [/api/Transaction/GetByTransactionNo/{transactionNo}](https://karacaismail.github.io/galaxyPayFrappe/v2/api/transaction-number/) | Operasyon |
| GET | [/api/Transaction/Get/Get](https://karacaismail.github.io/galaxyPayFrappe/v2/api/transaction-query/) | Operasyon |
| GET | [/api/Transaction/GetTransactionsByDateRange/{startDate}/{endDate}](https://karacaismail.github.io/galaxyPayFrappe/v2/api/date-range/) | Finans |
| POST | [/api/MasterpassV2/Refund](https://karacaismail.github.io/galaxyPayFrappe/v2/api/refund/) | MVP sonrası |
| POST | [/api/MasterpassV2/Void](https://karacaismail.github.io/galaxyPayFrappe/v2/api/void/) | MVP sonrası |
| POST | [/api/Transaction/ApplyInstallment](https://karacaismail.github.io/galaxyPayFrappe/v2/api/installment/) | Koşullu |

## Katmanları ayır

Bu yollar **GalaksiPay sağlayıcı API’sidir**. [Frappe iç API önerisi](https://karacaismail.github.io/galaxyPayFrappe/v2/architecture/) `/api/method/galaxy_pay...` yollarından ayrıdır; iç API henüz geliştirilmedi. Callback ise sağlayıcıdan bize gelen POST’tur: [callback referansı](https://karacaismail.github.io/galaxyPayFrappe/v2/callback/).

## Postman kullanımı

Koleksiyonu import et; baseUrl sandbox olarak gelir. `serverToken`, paymentId ve tarih değişkenleri boş tutulur. Request body placeholderlarını yerel environment ile doldur; Authenticate response parserı otomatik yazılmadı çünkü token gövdesi şemada eksik. Koleksiyon örneklerinin hiçbiri bu görevde çalıştırılmadı. ApplyInstallment gövdesi teyit sonrası hazırlanır; varsayılan `{}` istek için hazır değildir.

## Sık karışan alanlar

PaymentId (e-posta), Add Data.Id ve GetById UUID eşliği Q02 ile roundtrip doğrulanacak. TransactionNo ayrı int64 değerdir. Yerel order ID, provider ID ve merchant ID aynı kimlik değildir. Callback IsSuccess veya browser postMessage paid kanıtı değildir.

## cURL değişkenleri

`GP_TOKEN`: doğrulanmış Authenticate cevabından alınan server tokenı. `PAYMENT_ID`: Add cevabındaki Id; Q02 roundtrip teyidi gerekir. `TRANSACTION_NO`: provider int64 iş numarası. `START_DATE` / `END_DATE`: Q09 ile teyit edilmiş format/saat dilimi. Bunlar secret veya gerçek kayıt içermeyen komut şablonlarıdır; boş değişkenle çağrı yapılmaz.


---

# Core development

Kaynak: src/content/v2/core-development.md

## Core’un somut çıktısı

Core yalnız repo/CI kurulumu değildir. Gerçek test DB’sinde sipariş–ödeme niyeti ilişkisi, tek mali etki, rol/nesne izni ve provider sınırı çalışmadan checkout ekranı “tamam” sayılmaz.

| Modül | İlk başarısız test | Geliştirilecek en küçük davranış | Geçiş kanıtı |
|---|---|---|---|
| Para / durum | Negatif tutar kabul edilir; geç pending successi geri alır | Minor-unit/Decimal ve izinli geçiş fonksiyonları | Unit test + sınır değerleri |
| Kimlik / üyelik | Seller A, B’nin kaydını görür | Liste + kayıt + private file yetkisi | Gerçek rollerle HTTP/DB testi; Administrator kullanılmaz |
| Order / Attempt | Aynı order için iki etkin niyet oluşur | MariaDB unique/lock, version ve idempotency record | İki bağlantıyla yarış testi |
| Provider portu | Bozuk 200 yanıtı başarı sanılır | Tipli request/response parser ve fail-safe adapter | Sabit OpenAPI + synthetic/teyitli fixture ayrımı |
| Inbox / effect | Tek event iki fulfillment üretir | Kalıcı inbox ve unique business effect | Concurrency + rollback testi |
| Worker / scheduler | Commit→enqueue arası çöküş işi kaybettirir | Enqueue-after-commit + kalıcı pending taraması | Süreç öldürme/fault test |
| UI client | Browser amount/merchant değiştirir | Backend kaynaklı DTO ve ortak hata sözlüğü | HTTP negatif test + UI E2E |
| Adaptive temel | 320 px’de desktop chunk indirilir | Ayrı entry ve koşullu import/CSS asseti | Production build network kaydı |

## Yapılacaklar sırası

1. Frappe/Bench/Python/Node/MariaDB/Redis compatibility matrisini seçilen sürümün resmi gereksinimleriyle sabitle. Bu repoda Frappe kurulumu bulunmadığı için sürüm varsayılmaz.
2. İzole test sitesi, custom app, migration ve Buyer A/B / Seller A/B / Ops / Finance seedini oluştur.
3. C01 testlerini **önce kırmızı** çalıştır: para, durum, nesne izinleri; implementasyonu küçük domain komutlarıyla ekle.
4. C02’de provider portu + deterministic mock + contract fixtureları; backend testleri gerçek sağlayıcıya çıkmaz.
5. Buyer/seller TypeScript/Vite entryleri, Vue admin ayrı build; framework içermeyen contracts ve design tokens paketi.
6. CI’da unit → DB/permission → contract → production frontend build/E2E; sandbox UAT ayrı manuel/korumalı iş.

## Sınırlar

Frappe core fork edilmez; custom app kullanılır. ERPNext ancak mevcut iş sistemi gerektiriyorsa bağlanır. Domain kodunun testinde her şey mocklanmaz: unique/transaction/permission davranışı MariaDB ve Frappe test site üzerinde doğrulanır. Test amaçlı provider portu yalnız network sınırını taklit eder.

## C01/C02 bitiş kontrolü

Temiz kurulum + seed tekrar üretilebilir; role göre veri izolasyonu kanıtlı; bozuk provider yanıtı kontrollü hata; secret browser bundle’da yok; 320 px’de desktop asset yok. Bu kapıdan sonra [MVP M01](https://karacaismail.github.io/galaxyPayFrappe/v2/roadmap/#m01) başlar. Açık callback imzası/ID/idempotency konuları mock ilerlemesini durdurmaz, canlı geçişi engeller.


---

# Core → maturity yol haritası

Kaynak: src/content/v2/roadmap.md

## Çalışma sırası

**Core development → MVP → post-MVP → finans → dayanıklılık → güvenlik/DX → enterprise → maturity.** Güvenlik ve finansal doğruluğun temeli core/MVP’dedir; sonraki fazlar ileri kabiliyetleri ekler.

Sprintler takvim vaadi değildir. Bir sprintte en fazla üç dikey dilim; ekip kapasitesi C01/C02 sonunda ölçülür. Canlı bağımlılığı olan iş mockla ilerleyebilir, canlı gate açık kalır. Önceki 18–20 gün ve 26 sprint takvimleri bu planın tahmini değildir.

## Faz 0 · Core development

**Faz çıkışı:** Gerçek test DB’sinde domain/izin invariantları; deterministic mock ve repeatable seed; CI negatif testi yakalıyor.

<span id="c01"></span>
### C01 · Domain ve yetki çekirdeği

**Sahip:** BE + QA · **Önkoşul:** ürün/sürüm/test ortamı kararı · **Durum:** planlandı.

**Geliştirilecek:**

- Payment Order / Attempt / Membership DocType ve migration
- Minor-unit para, durum makinesi, sipariş versiyonu, rol/nesne kontrolü
- Tekrarlanabilir test site/seed ve DB test katmanı

**Önce başarısız olacak testler:**

| Test / katman | Given | When | Then |
|---|---|---|---|
| `UT_money_exact` · unit | 12550 kuruş ve bozuk/negatif değerler | Tutar normalize edilir | 125.50 kayıpsız; bozuk/negatif reddedilir |
| `IT_seller_isolation` · integration / MariaDB | Seller A ve B aynı sitede | A, B’nin liste/detay/dosyasını ister | Veri dönmez; doğrudan method da reddeder |
| `UT_state_monotonic` · unit | SUCCEEDED attempt | Geç PENDING uygulanır | Durum ve sipariş etkisi değişmez |

**Test verisi:** Buyer A/B; Seller A/B; paid/pending/unknown orders

**Teslim kanıtı:** Test fail/pass logu + migration/rollback + izin matrisi

<span id="c02"></span>
### C02 · Provider portu ve test düzeneği

**Sahip:** BE + FE + QA · **Önkoşul:** C01 · **Durum:** planlandı.

**Geliştirilecek:**

- Python GalaksiPay adapter arayüzü + deterministic mock
- Auth/body/error parser; secret/env doğrulama ve snapshot pin
- FE shared DTO/client, ayrı Vite/Vue entry ve 320 profile loader

**Önce başarısız olacak testler:**

| Test / katman | Given | When | Then |
|---|---|---|---|
| `CT_auth_shape` · contract | Onaylı olmayan/bozuk token gövdesi | Auth parser çalışır | Token var sanılmaz; contract error |
| `CT_add_shape` · contract | 200 fakat Id/PaymentUrl eksik | Add sonucu okunur | Başarı kabul edilmez |
| `UI_desktop_asset_leak` · browser / build | 320 CSS px yeni context | Public route açılır ve menü kullanılır | Desktop JS/CSS ve Vue admin artifacti 0 |

**Test verisi:** Schema snapshot + synthetic auth/add/status fixtures; gerçek UAT fixture ayrı

**Teslim kanıtı:** Contract raporu + build asset manifesti/HAR; C01/C02 sürüm matrisi

## Faz 1 · MVP

**Faz çıkışı:** Alıcı tahsilat → satıcı görünürlüğü → ops recovery çalışır. Kritik negatif testler ve ayrı sandbox UAT/pilot kabulü tamam.

<span id="m01"></span>
### M01 · İdempotent ödeme başlatma

**Sahip:** BE + FE + QA · **Önkoşul:** C02 · **Durum:** planlandı.

**Geliştirilecek:**

- Sipariş sahibi/CSRF/server tutarı/aktif merchant doğrulaması
- Durable intent + DB unique key + commit sonrası worker
- Hosted PaymentUrl yönlendirmesi ve aynı attempti sürdürme

**Önce başarısız olacak testler:**

| Test / katman | Given | When | Then |
|---|---|---|---|
| `IT_double_start` · concurrency / MariaDB | Aynı order/version, 20 eşzamanlı istek | Start çağrılır | 1 intent; en fazla 1 provider dispatch |
| `IT_unknown_add` · fault injection | Provider Add işlendi, cevap veya worker kayboldu | Job yeniden çalışır | UNKNOWN; kör ikinci Add yok |
| `IT_start_authorization` · HTTP integration | Başka buyer IDsi veya geçersiz CSRF | Start çağrılır | Provider çağrısı 0 |

**Test verisi:** Mock success/timeout; CARD-01 yalnız sandboxta; aktif/pasif merchant

**Teslim kanıtı:** DB/spy assertion + Add crash matrisi + 320 checkout E2E

<span id="m02"></span>
### M02 · Callback, doğrulama ve kurtarma

**Sahip:** BE + FE + QA · **Önkoşul:** M01 · **Durum:** planlandı.

**Geliştirilecek:**

- Durable inbox + schema/kaynak doğrulama + hızlı ACK sınırı
- GetById ile kimlik/tutar/merchant kontrolü + unique effect/outbox
- Scheduler: enqueue kaybı, kayıp callback, UNKNOWN/review

**Önce başarısız olacak testler:**

| Test / katman | Given | When | Then |
|---|---|---|---|
| `IT_callback_duplicate` · concurrency / MariaDB | Aynı event 100 kez | Aynı anda teslim edilir | Tek iş etkisi; inbox kanıtı korunur |
| `IT_callback_mismatch` · integration | Amount/merchant/order çelişkili | Callback + provider sorgu işlenir | REVIEW_REQUIRED; fulfillment 0 |
| `IT_queue_gap` · fault injection | DB commit oldu, enqueue öncesi süreç öldü | Scheduler çalışır | İş bulunur; Add tekrar edilmez |

**Test verisi:** callback synthetic JSON + bozuk payload + pending/success ters sıra

**Teslim kanıtı:** Commit/rollback + crash recovery logu; Q01/Q02/Q06 kanıtları

<span id="m03"></span>
### M03 · Üç rolün minimum ekranı

**Sahip:** BE + FE + QA · **Önkoşul:** M02 · **Durum:** planlandı.

**Geliştirilecek:**

- Buyer: özet/redirect/pending/sonuç; yenileme desteği
- Seller: aktivasyon/liste/detay/destek
- Vue ops: mapping/işlem/review/refresh/kill switch

**Önce başarısız olacak testler:**

| Test / katman | Given | When | Then |
|---|---|---|---|
| `UI_buyer_resume` · E2E mock | 3DS sonrası sekme yenilenir | Sonuç tekrar açılır | Aynı attempt; duplicate ödeme yok |
| `UI_role_scope` · E2E + permission | Aynı işlem IDsi üç rolle | Ekran ve API açılır | Sadece izinli alan/eylem görünür ve çalışır |
| `UI_ops_refresh` · E2E mock | UNKNOWN kayıt | Ops tekrar sorgula seçer | GetById; Add çağrısı 0 |

**Test verisi:** 3 rol seed; unknown/pending/success; uzun Türkçe etiket

**Teslim kanıtı:** Rol E2E + 320/390/768/1280 screenshot + keyboard/focus

<span id="m04"></span>
### M04 · Sandbox kabulü ve dar pilot

**Sahip:** BE + FE + QA · **Önkoşul:** M03 · **Durum:** planlandı.

**Geliştirilecek:**

- Doğrudan kart ve gerekiyorsa kayıtlı kart UAT
- TLS/domain/secret/merchant aktivasyon; alarm ve kill switch
- Manuel iade/itiraz yolu; backup/restore/rollback ve destek devri

**Önce başarısız olacak testler:**

| Test / katman | Given | When | Then |
|---|---|---|---|
| `UAT_hosted_payment` · sandbox / manuel kontrollü | Güncel listedeki test kartı, yetkili hesap | Hosted ödeme tamamlanır | Add ID/callback/GetById roundtrip aynı işlemi gösterir |
| `OPS_restore` · restore rehearsal | Açık attempt içeren yedek | Staginge restore edilir | Kayıp tahsilat yok; sorgu ile toparlanır |
| `OPS_kill_switch` · integration + ops | Yeni start kapalı | Start ve callback aynı anda gelir | Start durur; callback/recovery sürer |

**Test verisi:** CARD-01…18; iki dummy merchant; gerçek satıcı pilot için ayrıca aktif

**Teslim kanıtı:** UAT run ID + kullanılan maskeli kart ref + provider teyitleri + iş sahibi kabulü

## Faz 2 · Post-MVP

**Faz çıkışı:** Onboarding/cüzdan ve teyitli iade/iptal uçları testli; platform etkileri auditli.

<span id="p01"></span>
### P01 · Satıcı self-service ve cüzdan

**Sahip:** BE + FE + QA · **Önkoşul:** M04 · **Durum:** planlandı.

**Geliştirilecek:**

- §2.3 teyitli onboarding, private belge ve durum
- Satıcı davet/rol iptali ve hesap kurtarma deneyimi
- Kayıtlı kart ile doğrudan kart ayrı akış ve feature flag

**Önce başarısız olacak testler:**

| Test / katman | Given | When | Then |
|---|---|---|---|
| `IT_membership_revocation` · integration | Üye erişimi iptal edildi | Liste/detay/dosya yeniden istenir | Üçü de reddedilir |
| `UAT_wallet` · sandbox | Yetkili kayıtlı kart test telefonu | Cüzdanla ödeme yapılır | Kart kaydı bizde tutulmadan doğrulanmış sonuç |
| `IT_private_file` · HTTP integration | Seller B belgesi | Seller A indirme URLsi kullanır | Dosya baytı dönmez |

**Test verisi:** Davet/revoke seed; §2.3 form fixture; TEST_WALLET_PHONE erişimi

**Teslim kanıtı:** UAT + dosya izin testi; onboarding red/onay senaryosu

<span id="p02"></span>
### P02 · İade ve iptal operasyonu

**Sahip:** BE + Finans + QA · **Önkoşul:** M04 · **Durum:** planlandı.

**Geliştirilecek:**

- Refund Request ve requester/approver ayrımı
- Teyitli Refund/Void adapterı, ayrı idempotency
- İade belirsizliği inceleme ve müşteri durum ekranı

**Önce başarısız olacak testler:**

| Test / katman | Given | When | Then |
|---|---|---|---|
| `IT_refund_duplicate` · concurrency | Aynı onaylı iade | 20 tekrar/eşzamanlı komut | Tek mali etki; toplam iade sınırı |
| `IT_refund_unknown` · fault injection | İade kabul edildi, yanıt kayıp | Worker retry | İkinci iade yok; sorgu/manual case |
| `IT_void_window` · contract + domain | İzinli pencere dışı işlem | Void istenir | Açık hata; sipariş iptalini banka iptali sanmaz |

**Test verisi:** Q07 kanıtlı success/refused/timeout fixture; kısmi iade yalnız teyitle

**Teslim kanıtı:** Finans onaylı senaryo + fault test + audit trail

## Faz 3 · Finansal doğruluk

**Faz çıkışı:** Sipariş/provider/settlement ayrımı ve tüm farkların sahibi belli; net/brüt raporu kanıtla yeniden üretilebilir.

<span id="f01"></span>
### F01 · Mutabakat ve raporlama

**Sahip:** BE + Finans + QA · **Önkoşul:** P02 · **Durum:** planlandı.

**Geliştirilecek:**

- Provider tarih sorgusu + teyitli settlement importu
- Fark, komisyon/net ve geç kayıt kuyruğu
- Maskeli CSV, chargeback kanıt dosyası ve dönem kapanışı

**Önce başarısız olacak testler:**

| Test / katman | Given | When | Then |
|---|---|---|---|
| `IT_reconcile_late` · integration | Geç settlement + UTC sınırı | Aynı dönem iki kez işlenir | Eksik/fazla fark doğru, duplicate 0 |
| `IT_csv_formula` · security | Formül ile başlayan satıcı alanı | CSV indirilir | Formül çalıştıran değer üretilmez |
| `IT_finance_scope` · permission | Finans A kapsamı | B raporu istenir | Yetkisiz satır yok |

**Test verisi:** Q09 teyitli dosya/sorgu + brüt/net/farklı komisyon seed

**Teslim kanıtı:** Kaynak toplamları ile rapor eşitliği; finans sign-off

## Faz 4 · Dayanıklılık

**Faz çıkışı:** Hedef yük ve arıza altında kabul edilmiş SLO/RPO/RTO ölçülür; on-call sorumlusu ve replay prosedürü belli.

<span id="r01"></span>
### R01 · Yük, kuyruk ve kurtarma

**Sahip:** Platform + BE + QA · **Önkoşul:** M04 · **Durum:** planlandı.

**Geliştirilecek:**

- Rate limit/backpressure, DLQ ve güvenli replay
- İşlem korelasyonu, metriği/alarmı ve incident runbook
- Yedek/anahtar geri yükleme ve rollout/rollback otomasyonu

**Önce başarısız olacak testler:**

| Test / katman | Given | When | Then |
|---|---|---|---|
| `LOAD_queue_limit` · load / mock | Kararlaştırılmış 2x tepe yük | Worker yavaşlatılır | Bellek/kuyruk sınırlı; kayıp olay yok |
| `OPS_restore_key` · ops | DB ve encryption key yedeği | Kayıp ortam kurtarılır | Secret/işler açılır; RPO/RTO raporlu |
| `IT_replay_effect` · integration | DLQda tamamlanmış event | Replay yapılır | Para etkisi yinelenmez |

**Test verisi:** Mock provider, kontrollü Redis/DB/worker faultları

**Teslim kanıtı:** Yük grafiği + restore süresi + alarm/tatbikat kaydı

## Faz 5 · Güvenlik ve DX olgunluğu

**Faz çıkışı:** Bağımsız güvenlik incelemesi, retention/rotasyon ve sözleşme drift kapısı çalışır; kritik açık canlıyı engeller.

<span id="dx01"></span>
### DX01 · Güvenlik ve geliştirici akışı

**Sahip:** BE + Güvenlik + DX · **Önkoşul:** M04 · **Durum:** planlandı.

**Geliştirilecek:**

- Bağımsız izin/ödeme incelemesi; retention ve secret rotation
- OpenAPI diff + fixture/schema uyum kapısı
- Tek komut mock onboarding ve sürüm yükseltme provası

**Önce başarısız olacak testler:**

| Test / katman | Given | When | Then |
|---|---|---|---|
| `SEC_rotate_secret` · integration | Yeni/iptal edilmiş credential | Çağrı ve eski token denenir | Yeni çalışır; eski yetki kalkar |
| `CT_breaking_change` · CI contract | Required alan/enum kırıcı değişmiş | Snapshot PR açılır | CI kırıcı farkı yakalar |
| `DX_clean_checkout` · developer smoke | Temiz ortam | Kurulum + seed + mock akış | Belgelendiği biçimde tekrar üretilebilir |

**Test verisi:** Redakte snapshot pair, retention expiry seed, kurulum matrisi

**Teslim kanıtı:** Pentest kapanışı + CI failure sample + onboarding süre kaydı

## Faz 6 · Enterprise readiness

**Faz çıkışı:** Sözleşme/ölçek ihtiyacı varsa SSO/MFA, görev ayrılığı ve izolasyon ayrı kanıtla kabul edilir.

<span id="e01"></span>
### E01 · Kurumsal erişim ve izolasyon

**Sahip:** Platform + Güvenlik + QA · **Önkoşul:** DX01, R01 · **Durum:** planlandı.

**Geliştirilecek:**

- SSO/MFA ve erişim gözden geçirme; SCIM yalnız ihtiyaçla
- Gerekirse site-per-tenant ve geçiş stratejisi
- Audit exportu, görev ayrılığı ve destek sorumlulukları

**Önce başarısız olacak testler:**

| Test / katman | Given | When | Then |
|---|---|---|---|
| `IT_sso_revocation` · integration | IdP kullanıcısı devre dışı | Eski session/API kullanılır | Kabul edilen süre içinde erişim biter |
| `IT_tenant_escape` · security | Tenant A yönetici IDsi | B API/file/export istenir | Veri/yan etki yok |
| `IT_approval_separation` · domain | Talep sahibi onay vermeye çalışır | Finans komutu çalışır | Aynı kişi kendi işlemini onaylayamaz |

**Test verisi:** Test IdP + iki tenant + rol matrisi

**Teslim kanıtı:** Müşteri kapsamına göre kabul raporu; SSO/izolasyon testleri

## Faz 7 · Maturity / sürekli gelişim

**Faz çıkışı:** Olgunluk iddiası gözlem ve tekrar eden kontrollerle desteklenir; eksik kanıt varsa tarih yerine açık eksik raporlanır.

<span id="mt01"></span>
### MT01 · Kanıta dayalı olgunluk döngüsü

**Sahip:** Hizmet sahibi + Finans + QA · **Önkoşul:** F01, R01, DX01 · **Durum:** planlandı.

**Geliştirilecek:**

- SLO, maliyet, incident ve finans farkları için dönem incelemesi
- Restore/revoke/finans kapanışı tatbikatlarını tekrar et
- İş değerine göre çoklu provider/taksit/abonelik keşfi

**Önce başarısız olacak testler:**

| Test / katman | Given | When | Then |
|---|---|---|---|
| `OPS_maturity_evidence` · audit sample | Projenin kararlaştırdığı en az 90 günlük kayıt hedefi | Örnek olay ve işlem izlenir | Kaynak → durum → finans → sorumlu zinciri kopmaz |
| `OPS_repeat_restore` · ops | Yeni sürüm ve güncel yedek | Bağımsız kişi restore eder | RPO/RTO tekrar sağlanır |
| `EXP_provider_flag` · contract + E2E | İkinci provider denemesi kapatıldı | Yeni ödeme ve açık attempt işlenir | Yeni trafik durur; açık işler doğru adapterda sürer |

**Test verisi:** Gerçek dönemden maskeli kanıt; sentetik tatbikat vakaları

**Teslim kanıtı:** Dönem değerlendirmesi + bağımsız reviewer; dış sertifika iddiası değil

## Her sprintin Definition of Done

İlgili testin RED kaydı ve GREEN komutu; gerçek DB/rol sınırı gereken yerde testli; fixture ve doküman güncel; migration/rollback varsa prova; UI’da 320/keyboard/network; reviewer; açık Q ve UAT durumları doğru etiketli. Finansal yanlış etki veya izolasyon ihlali varken sonraki faza geçilmez.


---

# Test first / TDD çalışma sözleşmesi

Kaynak: src/content/v2/tdd.md

## Döngü

**RED:** kullanıcı davranışını ihlal eden bir test yaz; neden başarısız olduğunu gör. Import/syntax hatası yerine hedef davranışın eksikliği ölçülmeli; yeni modülde ilk scaffold hatası geçince davranış assertionının da kırmızı olduğu görülür. **GREEN:** yalnız testi geçiren en küçük domain/adapter/UI değişikliği. **REFACTOR:** davranışı koruyarak tekrarları/sınırları düzenle; aynı test paketi yeniden yeşil. Testi uygulamadan sonra eklemek test-first değildir.

Her PR: senaryo ID → kırmızı test adı/logu → küçük diff → yeşil test → gerekiyorsa refactor → reviewer. Kullanıcı yolunu bitiren küçük dikey dilim; ilk hedef daha çok dosya üretmek değildir.

## Test katmanı seçimi

| Katman | Ne sınanır? | Gerçek bağımlılık | Ne kanıtlamaz? |
|---|---|---|---|
| Unit | Para, durum geçişi, hata sınıflaması | Saf fonksiyon | DB kilidi, banka kabulü |
| Contract | Endpoint/body/DTO/parser, schema drift | Sabit OpenAPI + redakte fixture | Hesap yetkisi, sağlayıcı idempotency garantisi |
| Integration | Unique intent, business effect, izin, commit/rollback | Frappe test sitesi + MariaDB; Redis gerektiğinde | Hosted 3DS ekranı |
| Fault injection | Add sonrası crash, queue gap, DB hatası | Gerçek transaction + kontrollü provider stub | Gerçek sağlayıcının kesinti SLA’sı |
| Browser E2E | Buyer/seller/ops akışı, 320 yükleme, focus | Production frontend + test backend/mock | Gerçek banka sonucu |
| Sandbox UAT | Test kartı/cüzdan/3DS ve callback roundtrip | Yetkili gerçek test sağlayıcısı | Üretim limit/performans garantisi |
| Operasyon | Restore, rollback, alarm, revoke | İzole staging, yedek ve sahipli tatbikat | Dış sertifikasyon |

## Örnek: tek mali etki

Aşağıdaki Python test sözleşmesi **uygulanacak Frappe test modülü için şablondur; bu repoda çalışır backend testi değildir**. `seed_order`, `deliver_verified_callback` ve `count_effects` C01/M02 test yardımcıları olarak yazılacaktır.

```python
def test_callback_duplicate_has_one_effect(self):
    order = self.seed_order(amount_minor=12550, seller="seller-a")
    event = self.verified_callback(order)
    self.deliver_verified_callback(event)
    self.deliver_verified_callback(event)
    self.assertEqual(self.count_effects(order), 1)
```

RED: iki teslim iki etki ürettiğinde `2 != 1`. GREEN: event hashine tek başına güvenmeden business effect unique constrainti ve atomik transaction. REFACTOR: callback doğrulama ve domain uygulamasını ayır. Ardından **iki ayrı DB bağlantısıyla gerçek eşzamanlı** varyantı çalıştır; ardışık örnek yarış testi yerine geçmez.

## Çalıştırma matrisi

| Komut / iş | Durum | Beklenen kullanım |
|---|---|---|
| `npm run test:docs` | Bu repoda uygulanmış | Test kartı kaynağı, kritik DX sayfaları, roadmap test kapsamı, endpoint/schema referansları |
| `npm run verify` | Bu repoda uygulanmış | Yukarıdaki testler + Astro/TS + statik build + link/asset kontrolleri |
| `bench --site <test-site> run-tests --app galaxy_pay` | Frappe app kurulduğunda | Backend unit/integration; modül yolları seçilen sürümde doğrulanır |
| `test:contract`, `test:e2e`, `test:mobile-network` | C02’de kurulacak hedef görevler | CI provider fixture ve production frontend işleri |
| Sandbox UAT | Manuel/korumalı iş | Sağlayıcı hesabı, test kartı ve gerçek callback; normal PR CI’da otomatik tahsilat yok |

[Frappe test rehberi](https://docs.frappe.io/framework/user/en/testing). Test siteyi üretimden ayır; CI seedleri gerçek alıcı/satıcı verisi içermez.

## Coverage ve çıkış ölçüsü

Para, idempotency, auth/record izinleri ve durum geçişlerinde tanımlı tüm olumlu/olumsuz invariantlar test edilir. Satır yüzdesi tek geçiş kapısı değildir. DB concurrency, crash ve provider bozuk yanıt testleri olmadan yüksek unit coverage “hazır” anlamına gelmez. Kritik mutasyon örnekleri: unique constrainti kaldırınca duplicate testi; ownership filtresini kaldırınca isolation testi kırılmalı.

## Kanıt kaydı

```text
Test ID / senaryo ID / commit / ortam / seed-fixture SHA
RED: hangi assertion neden başarısız?
GREEN: gerçek komut, çıkış kodu, rapor yolu
REFACTOR: davranış korundu mu?
Sandbox: not-run | blocked | passed | failed; UAT run ve maskeli referans
Reviewer / açık Q / rollback
```

Bu doküman güncellemesinde 5 DX sözleşme testi önce eksik dosya/veri nedeniyle kırmızı çalıştırıldı. Bunlar doküman kabul testleridir; ödeme domaininin TDD ile uygulanmış olduğu iddia edilmez. [Güncel test matrisi ve sprint çıktıları](https://karacaismail.github.io/galaxyPayFrappe/v2/roadmap/).


---

# Kimlik doğrulama

Kaynak: src/content/v2/api/authenticate.md

## POST /api/Authentication/Authenticate

**Base URL:** `https://testapi.galaksipay.com/galaksipay` · **Aşama:** Core · **Kanıt:** OpenAPI şeması; gerçek hesap çağrısı yapılmadı.

**Auth:** Server kullanıcı/parola gövdesi; token response shape Q03.

## İstek

Model: `AuthenticationStandardLogonParameters`. Required durumu sağlayıcı şemasıdır; projenin server-side ek kuralları ayrıca uygulanır.

| Alan | Tür | Required | Kısıt / not |
|---|---|---|---|
| `UserName` | string / nullable | Hayır | — |
| `Password` | string / nullable | Hayır | — |

### Şematik JSON — gerçek credential/merchant içermez

```json
{
  "UserName": "<server-secret-user>",
  "Password": "<server-secret-password>"
}
```

Bu gövdeyi yerel `request.json` dosyasına koy; placeholderları yetkili sandbox değerleriyle değiştir. Dosyayı public repoya credentialla ekleme.

## cURL

Örnekler sunucu/yerel terminal içindir. Token ve ID env değerleri önce temin edilir; bu sitede çalıştırılmaz.

```sh
GP_BASE="https://testapi.galaksipay.com/galaksipay"
curl --fail-with-body --request POST \
  "$GP_BASE/api/Authentication/Authenticate" \
  --header "Accept: application/json" \
  --header "Content-Type: application/json" \
  --data @request.json
```

## Yanıt

200 token gövdesi şemada tanımlı değil. Demo parser adayları resmi sözleşme sayılmaz. Başarılı ve hatalı sandbox fixture bekleniyor.

200 response body için şema verilmemiş. Token alanı/örnek başarılı response uydurulmadı; Q03 cevabı ile redakte fixture eklenecek.

## Hata ve tekrar davranışı

Şema ayrıntılı hata/limit garantisi vermiyor. Proje kuralı: 401/403 yetki incelemesi; 429 varsa Retry-After ve sınırlı okumalar; bozuk 200 contract violation. Güvenli okumalar sınırlı backoff ile tekrar edilebilir; 404 anlamı teyit edilmeden kesin başarısız ödeme çıkarılmaz.

## Önce yazılacak testler

| Test | Given | When | Then |
|---|---|---|---|
| `CT_auth_shape` | 200 response token alanı eksik/bozuk | Parser çalışır | Token var sanılmaz; contract error |
| `CT_auth_failure` | 401/403 veya success=false fixture | Auth adapter çalışır | Token cachelenmez; güvenli hata |

## Açık sağlayıcı teyidi

Q03 — [soru kaydı](https://karacaismail.github.io/galaxyPayFrappe/docs/acik-sorular/). Bu endpointin şemada bulunması hesabınızın bu işleme yetkili olduğunu kanıtlamaz.


---

# Ödeme başlat

Kaynak: src/content/v2/api/create-payment.md

## POST /api/Transaction/Add

**Base URL:** `https://testapi.galaksipay.com/galaksipay` · **Aşama:** MVP · **Kanıt:** OpenAPI şeması; gerçek hesap çağrısı yapılmadı.

**Auth:** `Authorization: Bearer <server-token>`; fiili hesap/merchant yetkisi ayrıca test edilir. Token browsera taşınmaz.

## İstek

Model: `TransactionAddRequest`. Required durumu sağlayıcı şemasıdır; projenin server-side ek kuralları ayrıca uygulanır.

| Alan | Tür | Required | Kısıt / not |
|---|---|---|---|
| `TransactionNo` | integer / int64 | Hayır | — |
| `OrderNo` | string / nullable | Hayır | — |
| `Amount` | number / double | Hayır | — |
| `CustomerFirstName` | string | Evet | minLength=1 |
| `CustomerLastName` | string | Evet | minLength=1 |
| `CustomerPhone` | string | Evet | minLength=1 |
| `SubMerchantId` | string / uuid / nullable | Hayır | — |
| `CallbackUrl` | string / nullable | Hayır | — |
| `TransactionDetails` | array[TransactionDetailDto] / nullable | Hayır | — |

### Şematik JSON — gerçek credential/merchant içermez

```json
{
  "OrderNo": "ORDER-SYNTHETIC-001",
  "Amount": 125.5,
  "CustomerFirstName": "Test",
  "CustomerLastName": "Musteri",
  "CustomerPhone": "<authorized-sandbox-phone>",
  "SubMerchantId": "00000000-0000-4000-8000-000000000001",
  "CallbackUrl": "https://sandbox.example.com/payments/callback"
}
```

Bu gövdeyi yerel `request.json` dosyasına koy; placeholderları yetkili sandbox değerleriyle değiştir. Dosyayı public repoya credentialla ekleme.

## cURL

Örnekler sunucu/yerel terminal içindir. Token ve ID env değerleri önce temin edilir; bu sitede çalıştırılmaz.

```sh
GP_BASE="https://testapi.galaksipay.com/galaksipay"
curl --fail-with-body --request POST \
  "$GP_BASE/api/Transaction/Add" \
  --header "Accept: application/json" \
  --header "Authorization: Bearer $GP_TOKEN" \
  --header "Content-Type: application/json" \
  --data @request.json
```

## Yanıt

TransactionDtoApiResult. HTTP 200 tahsilat başarısı değildir; Data.Id ve PaymentUrl doğrulanır. Örnek UUID atanmış merchant değildir.

200 şeması: [`TransactionDtoApiResult`](https://karacaismail.github.io/galaxyPayFrappe/v2/api/models/#transactiondtoapiresult).

| Alan | Tür | Required | Kısıt / not |
|---|---|---|---|
| `IsSuccess` | boolean | Hayır | — |
| `Message` | string / nullable | Hayır | — |
| `MessageJson` | string / nullable | Hayır | — |
| `Code` | integer / int32 | Hayır | — |
| `ErrorCode` | string / nullable | Hayır | — |
| `StackTrace` | string / nullable | Hayır | — |
| `Data` | TransactionDto | Hayır | — |

### Synthetic yanıt örneği

Şematik ve kısaltılmıştır; **sağlayıcıdan alınmış başarılı cevap değildir**. Gerçek casing/hata/enumlar fixturela teyit edilir.

```json
{
  "IsSuccess": true,
  "Data": {
    "Id": "00000000-0000-4000-8000-000000000002",
    "OrderNo": "ORDER-SYNTHETIC-001",
    "Amount": 125.5,
    "IsPaid": false,
    "PaymentUrl": "<provider-returned-https-url>"
  }
}
```

## Hata ve tekrar davranışı

Şema ayrıntılı hata/limit garantisi vermiyor. Proje kuralı: 401/403 yetki incelemesi; 429 varsa Retry-After ve sınırlı okumalar; bozuk 200 contract violation. Add/Refund/Void gibi mali yan etkili çağrı timeoutta otomatik tekrarlanmaz; UNKNOWN/review ve sağlayıcı sorgusu gerekir.

## Önce yazılacak testler

| Test | Given | When | Then |
|---|---|---|---|
| `IT_double_start` | 20 eşzamanlı start | Aynı order/version işlenir | Tek etkin intent / dispatch |
| `IT_unknown_add` | Provider kabulünden sonra timeout/crash | Worker tekrar başlar | Kör Add retry yok; UNKNOWN |
| `CT_add_shape` | Id veya PaymentUrl olmayan 200 | Add parser çalışır | Başarılı link üretilmez |

## Açık sağlayıcı teyidi

Q02, Q04, Q08 — [soru kaydı](https://karacaismail.github.io/galaxyPayFrappe/docs/acik-sorular/). Bu endpointin şemada bulunması hesabınızın bu işleme yetkili olduğunu kanıtlamaz.


---

# Tarih aralığı işlemleri

Kaynak: src/content/v2/api/date-range.md

## GET /api/Transaction/GetTransactionsByDateRange/{startDate}/{endDate}

**Base URL:** `https://testapi.galaksipay.com/galaksipay` · **Aşama:** Finans · **Kanıt:** OpenAPI şeması; gerçek hesap çağrısı yapılmadı.

**Auth:** `Authorization: Bearer <server-token>`; fiili hesap/merchant yetkisi ayrıca test edilir. Token browsera taşınmaz.

## İstek

| Parametre | Yer | Tür | Required |
|---|---|---|---|
| `startDate` | path | string / date-time | Evet |
| `endDate` | path | string / date-time | Evet |

## cURL

Örnekler sunucu/yerel terminal içindir. Token ve ID env değerleri önce temin edilir; bu sitede çalıştırılmaz.

```sh
GP_BASE="https://testapi.galaksipay.com/galaksipay"
curl --fail-with-body --request GET \
  "$GP_BASE/api/Transaction/GetTransactionsByDateRange/${START_DATE}/${END_DATE}" \
  --header "Accept: application/json" \
  --header "Authorization: Bearer $GP_TOKEN"
```

## Yanıt

TransactionDtoListApiResult. Tarih sınırları, saat dilimi, sayfalama ve settlement kaynağı kesinleşmedi.

200 şeması: [`TransactionDtoListApiResult`](https://karacaismail.github.io/galaxyPayFrappe/v2/api/models/#transactiondtolistapiresult).

| Alan | Tür | Required | Kısıt / not |
|---|---|---|---|
| `IsSuccess` | boolean | Hayır | — |
| `Message` | string / nullable | Hayır | — |
| `MessageJson` | string / nullable | Hayır | — |
| `Code` | integer / int32 | Hayır | — |
| `ErrorCode` | string / nullable | Hayır | — |
| `StackTrace` | string / nullable | Hayır | — |
| `Data` | array[TransactionDto] / nullable | Hayır | — |

## Hata ve tekrar davranışı

Şema ayrıntılı hata/limit garantisi vermiyor. Proje kuralı: 401/403 yetki incelemesi; 429 varsa Retry-After ve sınırlı okumalar; bozuk 200 contract violation. Güvenli okumalar sınırlı backoff ile tekrar edilebilir; 404 anlamı teyit edilmeden kesin başarısız ödeme çıkarılmaz.

## Önce yazılacak testler

| Test | Given | When | Then |
|---|---|---|---|
| `IT_reconcile_late` | Geç kayıt ve sınır timestamp | Aynı dönem iki kez çekilir | Fark bulunur; duplicate rapor yok |
| `CT_date_range` | Teyitli UTC/sınır/paging fixture | Tarih aralığı sorgulanır | Kayıp/çift kayıt yok; max aralık ihlali kontrollü |

## Açık sağlayıcı teyidi

Q09 — [soru kaydı](https://karacaismail.github.io/galaxyPayFrappe/docs/acik-sorular/). Bu endpointin şemada bulunması hesabınızın bu işleme yetkili olduğunu kanıtlamaz.


---

# Taksit uygula

Kaynak: src/content/v2/api/installment.md

## POST /api/Transaction/ApplyInstallment

**Base URL:** `https://testapi.galaksipay.com/galaksipay` · **Aşama:** Koşullu · **Kanıt:** OpenAPI şeması; gerçek hesap çağrısı yapılmadı.

**Auth:** `Authorization: Bearer <server-token>`; fiili hesap/merchant yetkisi ayrıca test edilir. Token browsera taşınmaz.

## İstek

Model: `TransactionApplyInstallmentRequest`. Required durumu sağlayıcı şemasıdır; projenin server-side ek kuralları ayrıca uygulanır.

| Alan | Tür | Required | Kısıt / not |
|---|---|---|---|
| `TransactionId` | string / uuid | Hayır | — |
| `InstallmentCount` | integer / int32 / nullable | Hayır | — |
| `Bin` | string / nullable | Hayır | — |

## cURL

Örnekler sunucu/yerel terminal içindir. Token ve ID env değerleri önce temin edilir; bu sitede çalıştırılmaz.

```sh
GP_BASE="https://testapi.galaksipay.com/galaksipay"
curl --fail-with-body --request POST \
  "$GP_BASE/api/Transaction/ApplyInstallment" \
  --header "Accept: application/json" \
  --header "Authorization: Bearer $GP_TOKEN" \
  --header "Content-Type: application/json" \
  --data @request.json
```

`request.json` yukarıdaki modelden, sağlayıcı teyidi sonrası oluşturulur; koşullu operasyon için hazır iş akışı varsayılmaz.

## Yanıt

Şemada var; hosted checkout içindeki sorumluluğu ve iş yetkisi teyit edilmeden çağrılmaz.

200 şeması: [`TransactionDtoApiResult`](https://karacaismail.github.io/galaxyPayFrappe/v2/api/models/#transactiondtoapiresult).

| Alan | Tür | Required | Kısıt / not |
|---|---|---|---|
| `IsSuccess` | boolean | Hayır | — |
| `Message` | string / nullable | Hayır | — |
| `MessageJson` | string / nullable | Hayır | — |
| `Code` | integer / int32 | Hayır | — |
| `ErrorCode` | string / nullable | Hayır | — |
| `StackTrace` | string / nullable | Hayır | — |
| `Data` | TransactionDto | Hayır | — |

### Synthetic yanıt örneği

Şematik ve kısaltılmıştır; **sağlayıcıdan alınmış başarılı cevap değildir**. Gerçek casing/hata/enumlar fixturela teyit edilir.

```json
{
  "IsSuccess": true,
  "Data": {
    "Id": "00000000-0000-4000-8000-000000000002",
    "OrderNo": "ORDER-SYNTHETIC-001",
    "Amount": 125.5,
    "IsPaid": false
  }
}
```

## Hata ve tekrar davranışı

Şema ayrıntılı hata/limit garantisi vermiyor. Proje kuralı: 401/403 yetki incelemesi; 429 varsa Retry-After ve sınırlı okumalar; bozuk 200 contract violation. Add/Refund/Void gibi mali yan etkili çağrı timeoutta otomatik tekrarlanmaz; UNKNOWN/review ve sağlayıcı sorgusu gerekir.

## Önce yazılacak testler

| Test | Given | When | Then |
|---|---|---|---|
| `CT_installment_scope` | Taksit feature flag kapalı/teyitsiz | İstemci taksit ister | Provider çağrısı yok |

## Açık sağlayıcı teyidi

Q07, Q08 — [soru kaydı](https://karacaismail.github.io/galaxyPayFrappe/docs/acik-sorular/). Bu endpointin şemada bulunması hesabınızın bu işleme yetkili olduğunu kanıtlamaz.


---

# İstek ve yanıt modelleri

Kaynak: src/content/v2/api/models.md

## Şema alanlarını okuma

Aşağıdaki tablolar indirilen OpenAPI’den üretilmiştir. Required=Hayır, uygulamanın alanı boş göndermesi gerektiği anlamına gelmez; yerel iş kuralı daha sıkı olabilir. Nullable ve required farklıdır. Örneklerdeki UUID ve statüler gerçek sağlayıcı kaydı değildir.

## AuthenticationStandardLogonParameters

| Alan | Tür | Required | Kısıt / not |
|---|---|---|---|
| `UserName` | string / nullable | Hayır | — |
| `Password` | string / nullable | Hayır | — |

## ObjectApiResult

| Alan | Tür | Required | Kısıt / not |
|---|---|---|---|
| `IsSuccess` | boolean | Hayır | — |
| `Message` | string / nullable | Hayır | — |
| `MessageJson` | string / nullable | Hayır | — |
| `Code` | integer / int32 | Hayır | — |
| `ErrorCode` | string / nullable | Hayır | — |
| `StackTrace` | string / nullable | Hayır | — |
| `Data` | belirtilmemiş / nullable | Hayır | — |

## RefundRequest

| Alan | Tür | Required | Kısıt / not |
|---|---|---|---|
| `AccessToken` | string | Evet | minLength=1 |
| `GalaksipayTransactionId` | string / uuid | Evet | — |

## SubMerchantDto

| Alan | Tür | Required | Kısıt / not |
|---|---|---|---|
| `Id` | string / uuid | Hayır | — |
| `Name` | string / nullable | Hayır | — |
| `Code` | string / nullable | Hayır | — |
| `Description` | string / nullable | Hayır | — |
| `IsActive` | boolean | Hayır | — |
| `HasMasterpassSetting` | boolean | Hayır | — |

## SubMerchantDtoListApiResult

| Alan | Tür | Required | Kısıt / not |
|---|---|---|---|
| `IsSuccess` | boolean | Hayır | — |
| `Message` | string / nullable | Hayır | — |
| `MessageJson` | string / nullable | Hayır | — |
| `Code` | integer / int32 | Hayır | — |
| `ErrorCode` | string / nullable | Hayır | — |
| `StackTrace` | string / nullable | Hayır | — |
| `Data` | array[SubMerchantDto] / nullable | Hayır | — |

## TransactionAddRequest

| Alan | Tür | Required | Kısıt / not |
|---|---|---|---|
| `TransactionNo` | integer / int64 | Hayır | — |
| `OrderNo` | string / nullable | Hayır | — |
| `Amount` | number / double | Hayır | — |
| `CustomerFirstName` | string | Evet | minLength=1 |
| `CustomerLastName` | string | Evet | minLength=1 |
| `CustomerPhone` | string | Evet | minLength=1 |
| `SubMerchantId` | string / uuid / nullable | Hayır | — |
| `CallbackUrl` | string / nullable | Hayır | — |
| `TransactionDetails` | array[TransactionDetailDto] / nullable | Hayır | — |

## TransactionApplyInstallmentRequest

| Alan | Tür | Required | Kısıt / not |
|---|---|---|---|
| `TransactionId` | string / uuid | Hayır | — |
| `InstallmentCount` | integer / int32 / nullable | Hayır | — |
| `Bin` | string / nullable | Hayır | — |

## TransactionDetailDto

| Alan | Tür | Required | Kısıt / not |
|---|---|---|---|
| `Key` | string / nullable | Hayır | — |
| `Value` | string / nullable | Hayır | — |

## TransactionDto

| Alan | Tür | Required | Kısıt / not |
|---|---|---|---|
| `Id` | string / uuid | Hayır | — |
| `TransactionNo` | integer / int64 | Hayır | — |
| `TransactionDate` | string / date-time | Hayır | — |
| `MerchantId` | string / uuid | Hayır | — |
| `MerchantName` | string / nullable | Hayır | — |
| `ApplicationUserId` | string / uuid | Hayır | — |
| `ApplicationUserName` | string / nullable | Hayır | — |
| `IsPaid` | boolean | Hayır | — |
| `TransactionStatusId` | string / uuid | Hayır | — |
| `TransactionStatusName` | string / nullable | Hayır | — |
| `OrderNo` | string / nullable | Hayır | — |
| `MpOrderNo` | string / nullable | Hayır | — |
| `Amount` | number / double | Hayır | — |
| `NetAmount` | number / double | Hayır | — |
| `InstallmentCount` | integer / int32 / nullable | Hayır | — |
| `CommissionRate` | number / double | Hayır | — |
| `CustomerFirstName` | string / nullable | Hayır | — |
| `CustomerLastName` | string / nullable | Hayır | — |
| `CustomerPhone` | string / nullable | Hayır | — |
| `StartDate` | string / date-time / nullable | Hayır | — |
| `CompleteDate` | string / date-time / nullable | Hayır | — |
| `PaymentDate` | string / date-time / nullable | Hayır | — |
| `CanceledDate` | string / date-time / nullable | Hayır | — |
| `CancelType` | string / nullable | Hayır | — |
| `CancelMasterpassResponseCode` | string / nullable | Hayır | — |
| `CancelMasterpassResponseMessage` | string / nullable | Hayır | — |
| `CancelMasterpassResponseRawJson` | string / nullable | Hayır | — |
| `CancelMasterpassErrorMessage` | string / nullable | Hayır | — |
| `GalaksipayPaymentToken` | string / nullable | Hayır | — |
| `GalaksipayPaymentTokenVoid` | string / nullable | Hayır | — |
| `Description` | string / nullable | Hayır | — |
| `RrnNo` | string / nullable | Hayır | — |
| `SlipNo` | string / nullable | Hayır | — |
| `SmsTraceId` | string / nullable | Hayır | — |
| `MasterpassResponseCode` | string / nullable | Hayır | — |
| `MasterpassResponseMessage` | string / nullable | Hayır | — |
| `MasterpassResponseRawJson` | string / nullable | Hayır | — |
| `MasterpassErrorMessage` | string / nullable | Hayır | — |
| `SubMerchantId` | string / uuid / nullable | Hayır | — |
| `SubMerchantName` | string / nullable | Hayır | — |
| `EffectiveMerchantId` | string / uuid | Hayır | — |
| `EffectiveMerchantName` | string / nullable | Hayır | — |
| `PaymentUrl` | string / nullable | Hayır | — |
| `TransactionDetailDtos` | array[TransactionDetailDto] / nullable | Hayır | — |

## TransactionDtoApiResult

| Alan | Tür | Required | Kısıt / not |
|---|---|---|---|
| `IsSuccess` | boolean | Hayır | — |
| `Message` | string / nullable | Hayır | — |
| `MessageJson` | string / nullable | Hayır | — |
| `Code` | integer / int32 | Hayır | — |
| `ErrorCode` | string / nullable | Hayır | — |
| `StackTrace` | string / nullable | Hayır | — |
| `Data` | TransactionDto | Hayır | — |

## TransactionDtoListApiResult

| Alan | Tür | Required | Kısıt / not |
|---|---|---|---|
| `IsSuccess` | boolean | Hayır | — |
| `Message` | string / nullable | Hayır | — |
| `MessageJson` | string / nullable | Hayır | — |
| `Code` | integer / int32 | Hayır | — |
| `ErrorCode` | string / nullable | Hayır | — |
| `StackTrace` | string / nullable | Hayır | — |
| `Data` | array[TransactionDto] / nullable | Hayır | — |

## VoidRequest

| Alan | Tür | Required | Kısıt / not |
|---|---|---|---|
| `AccessToken` | string | Evet | minLength=1 |
| `GalaksipayTransactionId` | string / uuid | Evet | — |



---

# ID ile ödeme durumu

Kaynak: src/content/v2/api/payment-status.md

## GET /api/Transaction/GetById/{id}

**Base URL:** `https://testapi.galaksipay.com/galaksipay` · **Aşama:** MVP · **Kanıt:** OpenAPI şeması; gerçek hesap çağrısı yapılmadı.

**Auth:** `Authorization: Bearer <server-token>`; fiili hesap/merchant yetkisi ayrıca test edilir. Token browsera taşınmaz.

## İstek

| Parametre | Yer | Tür | Required |
|---|---|---|---|
| `id` | path | string / uuid | Evet |

## cURL

Örnekler sunucu/yerel terminal içindir. Token ve ID env değerleri önce temin edilir; bu sitede çalıştırılmaz.

```sh
GP_BASE="https://testapi.galaksipay.com/galaksipay"
curl --fail-with-body --request GET \
  "$GP_BASE/api/Transaction/GetById/${PAYMENT_ID}" \
  --header "Accept: application/json" \
  --header "Authorization: Bearer $GP_TOKEN"
```

## Yanıt

TransactionDtoApiResult. IsPaid, OrderNo, Amount, SubMerchantId/EffectiveMerchantId eşleşmeden yerel paid etkisi uygulanmaz.

200 şeması: [`TransactionDtoApiResult`](https://karacaismail.github.io/galaxyPayFrappe/v2/api/models/#transactiondtoapiresult).

| Alan | Tür | Required | Kısıt / not |
|---|---|---|---|
| `IsSuccess` | boolean | Hayır | — |
| `Message` | string / nullable | Hayır | — |
| `MessageJson` | string / nullable | Hayır | — |
| `Code` | integer / int32 | Hayır | — |
| `ErrorCode` | string / nullable | Hayır | — |
| `StackTrace` | string / nullable | Hayır | — |
| `Data` | TransactionDto | Hayır | — |

### Synthetic yanıt örneği

Şematik ve kısaltılmıştır; **sağlayıcıdan alınmış başarılı cevap değildir**. Gerçek casing/hata/enumlar fixturela teyit edilir.

```json
{
  "IsSuccess": true,
  "Data": {
    "Id": "00000000-0000-4000-8000-000000000002",
    "OrderNo": "ORDER-SYNTHETIC-001",
    "Amount": 125.5,
    "IsPaid": false
  }
}
```

## Hata ve tekrar davranışı

Şema ayrıntılı hata/limit garantisi vermiyor. Proje kuralı: 401/403 yetki incelemesi; 429 varsa Retry-After ve sınırlı okumalar; bozuk 200 contract violation. Güvenli okumalar sınırlı backoff ile tekrar edilebilir; 404 anlamı teyit edilmeden kesin başarısız ödeme çıkarılmaz.

## Önce yazılacak testler

| Test | Given | When | Then |
|---|---|---|---|
| `IT_callback_duplicate` | 100 aynı callback | Eşzamanlı işlenir | Tek sipariş etkisi |
| `CT_status_map` | Bilinmeyen status/IsPaid çelişkisi | Yerel statee çevrilir | Fail-safe review; terminal durum uydurulmaz |

## Açık sağlayıcı teyidi

Q02, Q06 — [soru kaydı](https://karacaismail.github.io/galaxyPayFrappe/docs/acik-sorular/). Bu endpointin şemada bulunması hesabınızın bu işleme yetkili olduğunu kanıtlamaz.


---

# İade

Kaynak: src/content/v2/api/refund.md

## POST /api/MasterpassV2/Refund

**Base URL:** `https://testapi.galaksipay.com/galaksipay` · **Aşama:** MVP sonrası · **Kanıt:** OpenAPI şeması; gerçek hesap çağrısı yapılmadı.

**Auth:** `Authorization: Bearer <server-token>`; fiili hesap/merchant yetkisi ayrıca test edilir. Token browsera taşınmaz.

## İstek

Model: `RefundRequest`. Required durumu sağlayıcı şemasıdır; projenin server-side ek kuralları ayrıca uygulanır.

| Alan | Tür | Required | Kısıt / not |
|---|---|---|---|
| `AccessToken` | string | Evet | minLength=1 |
| `GalaksipayTransactionId` | string / uuid | Evet | — |

### Şematik JSON — gerçek credential/merchant içermez

```json
{
  "AccessToken": "<provider-refund-token>",
  "GalaksipayTransactionId": "00000000-0000-4000-8000-000000000002"
}
```

Bu gövdeyi yerel `request.json` dosyasına koy; placeholderları yetkili sandbox değerleriyle değiştir. Dosyayı public repoya credentialla ekleme.

## cURL

Örnekler sunucu/yerel terminal içindir. Token ve ID env değerleri önce temin edilir; bu sitede çalıştırılmaz.

```sh
GP_BASE="https://testapi.galaksipay.com/galaksipay"
curl --fail-with-body --request POST \
  "$GP_BASE/api/MasterpassV2/Refund" \
  --header "Accept: application/json" \
  --header "Authorization: Bearer $GP_TOKEN" \
  --header "Content-Type: application/json" \
  --data @request.json
```

## Yanıt

ObjectApiResult; Data için iş sonucu şeması ayrıntılı değil. Tutar alanı yok; kısmi iade desteği çıkarılamaz. AccessToken kimliği ayrıca teyitli olmalı.

200 şeması: [`ObjectApiResult`](https://karacaismail.github.io/galaxyPayFrappe/v2/api/models/#objectapiresult).

| Alan | Tür | Required | Kısıt / not |
|---|---|---|---|
| `IsSuccess` | boolean | Hayır | — |
| `Message` | string / nullable | Hayır | — |
| `MessageJson` | string / nullable | Hayır | — |
| `Code` | integer / int32 | Hayır | — |
| `ErrorCode` | string / nullable | Hayır | — |
| `StackTrace` | string / nullable | Hayır | — |
| `Data` | belirtilmemiş / nullable | Hayır | — |

## Hata ve tekrar davranışı

Şema ayrıntılı hata/limit garantisi vermiyor. Proje kuralı: 401/403 yetki incelemesi; 429 varsa Retry-After ve sınırlı okumalar; bozuk 200 contract violation. Add/Refund/Void gibi mali yan etkili çağrı timeoutta otomatik tekrarlanmaz; UNKNOWN/review ve sağlayıcı sorgusu gerekir.

## Önce yazılacak testler

| Test | Given | When | Then |
|---|---|---|---|
| `IT_refund_duplicate` | Onaylı aynı talep 20 tekrar | Refund komutu | Tek mali etki |
| `IT_refund_unknown` | İade/iptal kabulü sonrası yanıt kayıp | Retry/scheduler | İkinci mali komut yok; sorgu veya case |

## Açık sağlayıcı teyidi

Q07 — [soru kaydı](https://karacaismail.github.io/galaxyPayFrappe/docs/acik-sorular/). Bu endpointin şemada bulunması hesabınızın bu işleme yetkili olduğunu kanıtlamaz.


---

# Alt satıcıları listele

Kaynak: src/content/v2/api/sub-merchants.md

## GET /api/Merchant/GetSubMerchants

**Base URL:** `https://testapi.galaksipay.com/galaksipay` · **Aşama:** Core / MVP · **Kanıt:** OpenAPI şeması; gerçek hesap çağrısı yapılmadı.

**Auth:** `Authorization: Bearer <server-token>`; fiili hesap/merchant yetkisi ayrıca test edilir. Token browsera taşınmaz.

## İstek

İstek gövdesi/parametre şeması bu operasyonda tanımlı değil.

## cURL

Örnekler sunucu/yerel terminal içindir. Token ve ID env değerleri önce temin edilir; bu sitede çalıştırılmaz.

```sh
GP_BASE="https://testapi.galaksipay.com/galaksipay"
curl --fail-with-body --request GET \
  "$GP_BASE/api/Merchant/GetSubMerchants" \
  --header "Accept: application/json" \
  --header "Authorization: Bearer $GP_TOKEN"
```

## Yanıt

SubMerchantDtoListApiResult. Id/IsActive/HasMasterpassSetting alanları şemada var; hesap kapsamı ve boş liste semantiği teyit bekliyor.

200 şeması: [`SubMerchantDtoListApiResult`](https://karacaismail.github.io/galaxyPayFrappe/v2/api/models/#submerchantdtolistapiresult).

| Alan | Tür | Required | Kısıt / not |
|---|---|---|---|
| `IsSuccess` | boolean | Hayır | — |
| `Message` | string / nullable | Hayır | — |
| `MessageJson` | string / nullable | Hayır | — |
| `Code` | integer / int32 | Hayır | — |
| `ErrorCode` | string / nullable | Hayır | — |
| `StackTrace` | string / nullable | Hayır | — |
| `Data` | array[SubMerchantDto] / nullable | Hayır | — |

### Synthetic yanıt örneği

Şematik ve kısaltılmıştır; **sağlayıcıdan alınmış başarılı cevap değildir**. Gerçek casing/hata/enumlar fixturela teyit edilir.

```json
{
  "IsSuccess": true,
  "Data": [
    {
      "Id": "00000000-0000-4000-8000-000000000001",
      "Name": "Synthetic seller — gerçek atanmış ID değil",
      "Code": null,
      "Description": null,
      "IsActive": true,
      "HasMasterpassSetting": true
    }
  ]
}
```

## Hata ve tekrar davranışı

Şema ayrıntılı hata/limit garantisi vermiyor. Proje kuralı: 401/403 yetki incelemesi; 429 varsa Retry-After ve sınırlı okumalar; bozuk 200 contract violation. Güvenli okumalar sınırlı backoff ile tekrar edilebilir; 404 anlamı teyit edilmeden kesin başarısız ödeme çıkarılmaz.

## Önce yazılacak testler

| Test | Given | When | Then |
|---|---|---|---|
| `CT_merchant_shape` | Id/IsActive/HasMasterpassSetting fixtureları | Liste normalize edilir | Eksik/pasif/ayarsız kayıtla start açılmaz |
| `IT_seller_isolation` | Seller A/B üyeliği | A B kaydını okur/başlatır | Veri ve provider çağrısı yok |

## Açık sağlayıcı teyidi

Q05 — [soru kaydı](https://karacaismail.github.io/galaxyPayFrappe/docs/acik-sorular/). Bu endpointin şemada bulunması hesabınızın bu işleme yetkili olduğunu kanıtlamaz.


---

# İşlem numarasıyla sorgula

Kaynak: src/content/v2/api/transaction-number.md

## GET /api/Transaction/GetByTransactionNo/{transactionNo}

**Base URL:** `https://testapi.galaksipay.com/galaksipay` · **Aşama:** Operasyon · **Kanıt:** OpenAPI şeması; gerçek hesap çağrısı yapılmadı.

**Auth:** `Authorization: Bearer <server-token>`; fiili hesap/merchant yetkisi ayrıca test edilir. Token browsera taşınmaz.

## İstek

| Parametre | Yer | Tür | Required |
|---|---|---|---|
| `transactionNo` | path | integer / int64 | Evet |

## cURL

Örnekler sunucu/yerel terminal içindir. Token ve ID env değerleri önce temin edilir; bu sitede çalıştırılmaz.

```sh
GP_BASE="https://testapi.galaksipay.com/galaksipay"
curl --fail-with-body --request GET \
  "$GP_BASE/api/Transaction/GetByTransactionNo/${TRANSACTION_NO}" \
  --header "Accept: application/json" \
  --header "Authorization: Bearer $GP_TOKEN"
```

## Yanıt

TransactionNo int64, Id UUID ile aynı kavram değildir. Frontend numarayı string taşımalı; JS yuvarlamasıyla sorgu kurulmamalı.

200 şeması: [`TransactionDtoApiResult`](https://karacaismail.github.io/galaxyPayFrappe/v2/api/models/#transactiondtoapiresult).

| Alan | Tür | Required | Kısıt / not |
|---|---|---|---|
| `IsSuccess` | boolean | Hayır | — |
| `Message` | string / nullable | Hayır | — |
| `MessageJson` | string / nullable | Hayır | — |
| `Code` | integer / int32 | Hayır | — |
| `ErrorCode` | string / nullable | Hayır | — |
| `StackTrace` | string / nullable | Hayır | — |
| `Data` | TransactionDto | Hayır | — |

### Synthetic yanıt örneği

Şematik ve kısaltılmıştır; **sağlayıcıdan alınmış başarılı cevap değildir**. Gerçek casing/hata/enumlar fixturela teyit edilir.

```json
{
  "IsSuccess": true,
  "Data": {
    "Id": "00000000-0000-4000-8000-000000000002",
    "OrderNo": "ORDER-SYNTHETIC-001",
    "Amount": 125.5,
    "IsPaid": false
  }
}
```

## Hata ve tekrar davranışı

Şema ayrıntılı hata/limit garantisi vermiyor. Proje kuralı: 401/403 yetki incelemesi; 429 varsa Retry-After ve sınırlı okumalar; bozuk 200 contract violation. Güvenli okumalar sınırlı backoff ile tekrar edilebilir; 404 anlamı teyit edilmeden kesin başarısız ödeme çıkarılmaz.

## Önce yazılacak testler

| Test | Given | When | Then |
|---|---|---|---|
| `CT_int64` | JS güvenli integer sınırını aşan TransactionNo | Parser → DTO → URL | Rakamlar aynen korunur |
| `CT_status_map` | Bilinmeyen status/IsPaid çelişkisi | Yerel statee çevrilir | Fail-safe review; terminal durum uydurulmaz |

## Açık sağlayıcı teyidi

Q02, Q06 — [soru kaydı](https://karacaismail.github.io/galaxyPayFrappe/docs/acik-sorular/). Bu endpointin şemada bulunması hesabınızın bu işleme yetkili olduğunu kanıtlamaz.


---

# Alternatif işlem sorgusu

Kaynak: src/content/v2/api/transaction-query.md

## GET /api/Transaction/Get/Get

**Base URL:** `https://testapi.galaksipay.com/galaksipay` · **Aşama:** Operasyon · **Kanıt:** OpenAPI şeması; gerçek hesap çağrısı yapılmadı.

**Auth:** `Authorization: Bearer <server-token>`; fiili hesap/merchant yetkisi ayrıca test edilir. Token browsera taşınmaz.

## İstek

| Parametre | Yer | Tür | Required |
|---|---|---|---|
| `id` | query | string / uuid | Hayır |
| `transactionNo` | query | integer / int64 | Hayır |

## cURL

Örnekler sunucu/yerel terminal içindir. Token ve ID env değerleri önce temin edilir; bu sitede çalıştırılmaz.

```sh
GP_BASE="https://testapi.galaksipay.com/galaksipay"
curl --fail-with-body --request GET \
  "$GP_BASE/api/Transaction/Get/Get" \
  --header "Accept: application/json" \
  --header "Authorization: Bearer $GP_TOKEN" \
  --get --data-urlencode "id=$PAYMENT_ID"
```

## Yanıt

Şemadaki çift Get yazımı aynen korunur. Query id/transactionNo seçimi ve birlikte gönderme kuralı teyit edilir.

200 şeması: [`TransactionDtoApiResult`](https://karacaismail.github.io/galaxyPayFrappe/v2/api/models/#transactiondtoapiresult).

| Alan | Tür | Required | Kısıt / not |
|---|---|---|---|
| `IsSuccess` | boolean | Hayır | — |
| `Message` | string / nullable | Hayır | — |
| `MessageJson` | string / nullable | Hayır | — |
| `Code` | integer / int32 | Hayır | — |
| `ErrorCode` | string / nullable | Hayır | — |
| `StackTrace` | string / nullable | Hayır | — |
| `Data` | TransactionDto | Hayır | — |

### Synthetic yanıt örneği

Şematik ve kısaltılmıştır; **sağlayıcıdan alınmış başarılı cevap değildir**. Gerçek casing/hata/enumlar fixturela teyit edilir.

```json
{
  "IsSuccess": true,
  "Data": {
    "Id": "00000000-0000-4000-8000-000000000002",
    "OrderNo": "ORDER-SYNTHETIC-001",
    "Amount": 125.5,
    "IsPaid": false
  }
}
```

## Hata ve tekrar davranışı

Şema ayrıntılı hata/limit garantisi vermiyor. Proje kuralı: 401/403 yetki incelemesi; 429 varsa Retry-After ve sınırlı okumalar; bozuk 200 contract violation. Güvenli okumalar sınırlı backoff ile tekrar edilebilir; 404 anlamı teyit edilmeden kesin başarısız ödeme çıkarılmaz.

## Önce yazılacak testler

| Test | Given | When | Then |
|---|---|---|---|
| `CT_query_parameters` | id/transactionNo parametre varyantları | Query oluşturulur | Şema isimleri doğru; birlikte kullanım teyitsizse gönderilmez |

## Açık sağlayıcı teyidi

Q02, Q06 — [soru kaydı](https://karacaismail.github.io/galaxyPayFrappe/docs/acik-sorular/). Bu endpointin şemada bulunması hesabınızın bu işleme yetkili olduğunu kanıtlamaz.


---

# İptal

Kaynak: src/content/v2/api/void.md

## POST /api/MasterpassV2/Void

**Base URL:** `https://testapi.galaksipay.com/galaksipay` · **Aşama:** MVP sonrası · **Kanıt:** OpenAPI şeması; gerçek hesap çağrısı yapılmadı.

**Auth:** `Authorization: Bearer <server-token>`; fiili hesap/merchant yetkisi ayrıca test edilir. Token browsera taşınmaz.

## İstek

Model: `VoidRequest`. Required durumu sağlayıcı şemasıdır; projenin server-side ek kuralları ayrıca uygulanır.

| Alan | Tür | Required | Kısıt / not |
|---|---|---|---|
| `AccessToken` | string | Evet | minLength=1 |
| `GalaksipayTransactionId` | string / uuid | Evet | — |

### Şematik JSON — gerçek credential/merchant içermez

```json
{
  "AccessToken": "<provider-void-token>",
  "GalaksipayTransactionId": "00000000-0000-4000-8000-000000000002"
}
```

Bu gövdeyi yerel `request.json` dosyasına koy; placeholderları yetkili sandbox değerleriyle değiştir. Dosyayı public repoya credentialla ekleme.

## cURL

Örnekler sunucu/yerel terminal içindir. Token ve ID env değerleri önce temin edilir; bu sitede çalıştırılmaz.

```sh
GP_BASE="https://testapi.galaksipay.com/galaksipay"
curl --fail-with-body --request POST \
  "$GP_BASE/api/MasterpassV2/Void" \
  --header "Accept: application/json" \
  --header "Authorization: Bearer $GP_TOKEN" \
  --header "Content-Type: application/json" \
  --data @request.json
```

## Yanıt

ObjectApiResult; izinli zaman penceresi ve tekrar güvenliği bilinmiyor. Siparişi iptal etmek banka işlemini iptal etmez.

200 şeması: [`ObjectApiResult`](https://karacaismail.github.io/galaxyPayFrappe/v2/api/models/#objectapiresult).

| Alan | Tür | Required | Kısıt / not |
|---|---|---|---|
| `IsSuccess` | boolean | Hayır | — |
| `Message` | string / nullable | Hayır | — |
| `MessageJson` | string / nullable | Hayır | — |
| `Code` | integer / int32 | Hayır | — |
| `ErrorCode` | string / nullable | Hayır | — |
| `StackTrace` | string / nullable | Hayır | — |
| `Data` | belirtilmemiş / nullable | Hayır | — |

## Hata ve tekrar davranışı

Şema ayrıntılı hata/limit garantisi vermiyor. Proje kuralı: 401/403 yetki incelemesi; 429 varsa Retry-After ve sınırlı okumalar; bozuk 200 contract violation. Add/Refund/Void gibi mali yan etkili çağrı timeoutta otomatik tekrarlanmaz; UNKNOWN/review ve sağlayıcı sorgusu gerekir.

## Önce yazılacak testler

| Test | Given | When | Then |
|---|---|---|---|
| `IT_void_window` | Yetkisiz veya zaman penceresi dışı fixture | Void | Kontrollü red; yerel sipariş statusu banka sonucu sanılmaz |
| `IT_refund_unknown` | İade/iptal kabulü sonrası yanıt kayıp | Retry/scheduler | İkinci mali komut yok; sorgu veya case |

## Açık sağlayıcı teyidi

Q07 — [soru kaydı](https://karacaismail.github.io/galaxyPayFrappe/docs/acik-sorular/). Bu endpointin şemada bulunması hesabınızın bu işleme yetkili olduğunu kanıtlamaz.


---

# Mimari ve iç API

Kaynak: src/content/v2/architecture.md

## 02 · Teknoloji sınırları ve entegrasyon

| Katman | Seçim | Sorumluluk | Yükleme sınırı |
|---|---|---|---|
| Backend | Frappe custom app: `galaxy_pay` / Python | Kimlik, izin, sipariş, ödeme niyeti, provider adaptörü, callback, audit | Sunucuda çalışır |
| Veri ve işler | Sürüm uyumlu MariaDB, Redis, Frappe worker + scheduler | Kalıcı gerçek DB’de; Redis iş yürütme/cache içindir | Frontende doğrudan erişim yok |
| Platform admin | Vue 3 + TypeScript + Vite; headless | Merchant eşleştirme, inceleme kuyruğu, güvenli durum sorgusu | Yalnızca `/admin/`; route ve yetenek bazlı lazy import |
| Buyer/seller frontpages | TypeScript + Vite + Tailwind + Flowbite + Alpine.js | Hafif HTML öncelikli checkout, sonuç, satıcı listesi | `/pay/`, `/account/`, `/seller/` ayrı entry |
| UI sahipliği | Alpine küçük yerel davranış; Flowbite seçilmiş bileşenler | Her DOM alt ağacının tek davranış sahibi | Vue bundle public frontpages’e taşınmaz |
| Dokümantasyon | Mevcut Astro | Bu plan, API kaydı, kabul ve istemler | GitHub Pages statik yayın |

Kullanıcının “alphineJs” ifadesi **Alpine.js** olarak yorumlandı. Admin içinde Vue state yönetir; Alpine ve Flowbite JS aynı Vue DOM’unu birlikte yönetmez. Admin için Tailwind görsel tokenları ve Vue uyumlu bileşenler seçilir; buyer/seller tarafında yalnızca gereken Flowbite sınıfı import edilir. Bütün `initFlowbite()` ile her sayfayı taramak veya global CDN paketi yüklemek varsayılan değildir. [Flowbite TypeScript rehberi](https://flowbite.com/docs/getting-started/typescript/).

### Üretim yerleşimi — öneri

```text
https://app.example.com/pay/...      -> buyer frontend (Vite)
https://app.example.com/seller/...   -> seller frontend (Vite)
https://app.example.com/admin/...    -> Vue admin (ayrı build)
https://app.example.com/api/...      -> reverse proxy -> Frappe
https://app.example.com/payments/callback -> dar provider alım yolu

Frappe -> GalaksiPay auth / Add / GetById
        -> MariaDB: intent + inbox + durum + audit
        -> Redis / worker: doğrulama ve sorgu
        -> scheduler: açık işler ve kayıp enqueue kurtarma
```

Bu domain ve route şeması örnektir. Aynı origin reverse proxy oturum/CSRF sınırını sadeleştirir. Statik dosyalar CDN’de olabilir, `/api` Frappe’ye gider. GitHub Pages Frappe/Python/Redis çalıştırmaz; bu projede **doküman barındırır**. Gerçek ödeme uygulamasının API’sini Pages originine rastgele CORS açarak bağlamak MVP varsayımı değildir.

### ADR özeti

- **V2-ADR01 — Kabul edildi, kullanıcı yönlendirmesi:** Frappe backend ve headless Vue admin. .NET demo yalnızca provider davranışı referansı. Sonuç: Python adaptör/DocType/izin testleri yazılacak; C# controller taşınmayacak.
- **V2-ADR02 — Öneri, C01’de kesinleşir:** tek Frappe site içinde platform + merchant üyelik modeli. Bir satıcı = bir tenant site varsayımı yok. Bağımsız kurumsal müşteriler gerekirse site-per-tenant değerlendirilir; merchant iş sınırı ile altyapı tenantı farklıdır.
- **V2-ADR03 — Öneri:** minimum özel Payment Order; ERPNext bağımlılığı yalnızca mevcut ERPNext muhasebe/sipariş sistemi varsa. Hazır olmayan ERP projesi ödeme MVP’sinin önkoşulu yapılmaz.
- **V2-ADR04 — Kabul edildi, kullanıcı yönlendirmesi:** 320 CSS px taban, ortak + seçilen profil modülü; masaüstüne özel kod dar ekran açılışında sıfır ağ isteği.
- **V2-ADR05 — Öneri:** tek satıcı/sipariş, hosted checkout, server-side para ve idempotency. Çoklu satıcı dağıtımı, taksit ve kısmi iade ayrı sağlayıcı teyidi ister.

Alternatif değerlendirmesi: mikroservis/broker eklemek ilk teslimi ve operasyon yükünü artırır; başlangıçta Frappe worker ve kalıcı inbox yeterli hedef olarak seçildi. Mevcut büyük sipariş sistemi varsa Payment Order kopyası yerine adapter seçilir. C01/C02 sonunda TL ürün sınırı, ekip bilgisi ve desteklenen sürümleri ADR’ye kaydeder.

## 06 · Roller, Frappe modeli ve güven sınırı

### Önerilen rol matrisi

| Kaynak / komut | Buyer | Seller Member | Platform Ops | Finance | System Admin |
|---|---|---|---|---|---|
| Sipariş görüntüle | Kendi | Üyesi olduğu satıcı | Gerekli kapsam | Finans kapsamı | Açık atanmış rol kadar |
| Ödeme başlat | Kendi, uygun sipariş | Satıcı adına başlatma ayrı iş kuralı | Varsayılan yok | Yok | Varsayılan yok |
| İşlem listele | Kendi | Üyelik filtresi | Maskeli operasyon | Finans kapsamı | Otomatik tüm yetki yok |
| Durum sorgulat | Kendi, limitli | Kendi, limitli | İzinli kayıt, limitli | İzinli kayıt | Ayrı rol gerekir |
| Merchant mapping | Yok | Salt okunur | Özel izinli ops | Salt okunur | Konfigürasyon rolü |
| İade talep / onay | Talep sonrası faz | Talep | Yalnızca vaka | Yürütme/onay ayrımı | Varsayılan yok |
| Secret / üyelik | Yok | Kendi ekip işi sonraki faz | Yetkisi kadar | Yok | Ayrı, auditli izin |

Frappe’nin rol izinleri tek başına özel method içindeki nesne sahipliğini kurmaz. Her custom method session user → platform/seller membership → order/attempt kapsamını doğrular. Liste tarafında permission query conditions, belge erişiminde has_permission/check_permission ve ayrıca iş kuralı kontrolleri gerekir. `frappe.get_all` izinleri uygulamaz; buyer/seller sorgusunda kolaylık amacıyla kullanma. [Frappe izin hookları](https://docs.frappe.io/framework/user/en/python-api/hooks), [Database API](https://docs.frappe.io/framework/user/en/api/database).

### DocType taslağı — C01’de migration tasarımına dönüşür

| DocType | Ana alanlar | Kısıt / not |
|---|---|---|
| Platform Account | status, owner, policy | İlk sürüm tek platform; kapsamı her kayıtta taşınır |
| Seller Membership | user, seller, platform, role, active | user + seller + platform unique; revoke derhal etkili |
| Merchant Mapping | seller, platform, provider ID, active, verified_at | Provider hesabı/ortamı kapsamında eşleştirme |
| Payment Order | buyer, seller, amount_minor, currency, version, external_order_id | Sunucu tutarı; tek satıcı; kaynak sipariş ilişkisi |
| Payment Attempt | order, provider_id, state, amount_minor, version, operation_key | Ortam + provider_id unique; etkin niyet için DB garantisi |
| Idempotency Record | scoped_key, request_hash, attempt, safe_response | platform + key unique; eşit key/farklı hash conflict |
| Provider Inbox | event_key?, body_hash, provider_id, state, received_at, retry_at | Kalıcı alım; event dedup ve iş etkisi dedup ayrı |
| Payment Effect / Outbox | attempt, effect_type, target, state, lease | Tek sipariş etkisi; retry-safe consumer |
| Review Case | attempt, reason, owner, evidence, status | Kanıtsız finansal düzeltme yok |
| Refund Request | attempt, amount, key, state, requester, approver | MVP sonrası; toplam iade ≤ doğrulanmış tutar |

Auth ve para alanlarında genel `/api/resource/Payment Attempt` yazma erişimi açma. Frappe DocType statülerini payment state ile karıştırma: `docstatus=1` ödeme alındı demek değildir. Finansal durum sadece domain komutuyla değişir; admin formunda read-only görünüm yeterli güvenlik değildir, backend de engeller.

Yerel para kuruş integer; hesap gerekiyorsa Python `Decimal`. Provider sınırında iki ondalık JSON sayısına dönüştür; JS float üzerinden toplam alma. Frappe Currency alanının görüntüleme hassasiyeti tek başına finansal invariant değildir. `TransactionNo` int64 değeri frontend DTO’da string tutulabilir. UTC sakla, İstanbul saat diliminde göster. MariaDB unique/lock davranışı test edilir; PostgreSQL partial index örneği aynen kopyalanmaz.

### Oturum ve API güvenliği

Üç ayrı arayüz aynı kullanıcı kimlik altyapısını paylaşır; kimlik bilgisi kodu yeniden icat edilmez. Frappe session cookie ve aynı-origin istekler önerilir; state-changing requestlerde sürüme uygun CSRF token aktarımı gerekir. C02 auth adapterı token edinme/bootstrap akışını doğrular; `ignore_csrf` genel ayarıyla çözüm üretilmez. Kullanıcı ekranına uzun ömürlü Frappe API secretı veya GalaksiPay JWT koyma. [Frappe REST auth](https://docs.frappe.io/framework/user/en/api/rest).

Dosya/§2.3 onboarding belgeleri private file olarak saklanmalı; indirmede de üyelik/rol kontrolü olmalı. Tablodaki System Admin önerilen uygulama rolüdür; Frappe Administrator superuser hesabıyla aynı değildir. Administrator ayrı kontrollü bakım hesabı olarak sınırlandırılır; yetki testleri gerçek Buyer/Seller/Finance rolleriyle yapılır. Secret store ve Frappe encryption key/backup anahtarları için kurtarma/rotasyon prosedürü gerekir.

## 07 · Bizim API sözleşmemiz ve ödeme akışı

**Aşağıdaki yollar taslaktır; hazır Frappe veya GalaksiPay endpointi değildir.** Custom app method adları implementationda bu sözleşmeyle oluşturulacak. Standart Frappe RPC deseni `/api/method/<python.path>` kullanılır; dönüşteki `message` zarfını shared TypeScript client tek yerde açar.

| Önerilen method | Yöntem | Girdi / sonuç | Yetki |
|---|---|---|---|
| `galaxy_pay.api.checkout.get_order` | GET | order_id → maskeli özet, tutar, sürüm, kullanılabilir eylem | Buyer ownership |
| `galaxy_pay.api.checkout.start` | POST | order_id, order_version, idempotency_key → attempt_id, status, payment_url? | Buyer ownership + CSRF |
| `galaxy_pay.api.checkout.status` | GET | attempt_id → safe status, updated_at, support_ref | Buyer veya ilgili Seller |
| `galaxy_pay.api.seller.list_payments` | GET | izinli filtre/cursor → sınırlı DTO listesi | Seller Membership |
| `galaxy_pay.api.ops.refresh_status` | POST | attempt_id, reason → job/attempt referansı | Ops/Finance; limitli |
| `galaxy_pay.api.ops.set_merchant` | POST | yerel seller + provider ID + gerekçe | Açık mapping yetkisi |
| `galaxy_pay.api.refunds.request` | POST | attempt, key, reason → refund_request | Sonraki faz; tutar/kapsam teyidi |

Şematik checkout command. Amount ve SubMerchantId istemciden alınmaz:

```json
{
  "order_id": "ORDER-SYNTHETIC-001",
  "order_version": 3,
  "idempotency_key": "client-generated-attempt-key"
}
```

Başarılı transport finansal success değildir. `start` sonucu CREATED/PENDING/UNKNOWN olabilir; worker akışı kullanılıyorsa UI kendi `status` yolunu sorgular, payment_url hazır olduğunda yönlendirme sunar. Tipli hata sözlüğü: `AUTH_REQUIRED`, `FORBIDDEN`, `ORDER_CHANGED`, `IDEMPOTENCY_CONFLICT`, `MERCHANT_UNAVAILABLE`, `PROVIDER_UNCERTAIN`, `RATE_LIMITED`. Bunlar **bizim** hata kodlarımızdır; provider ham mesajını aynen kullanıcıya geçirme. Şema doğrulaması hem Python hem TypeScript sınırında test edilir.

### Kritik transaction sırası

1. Start requestinde siparişi/üyeliği kilit kapsamı ve DB constraintleriyle doğrula; intent ve idempotency kaydını yaz. Sağlayıcı çağrısı bu kalıcı kayıt olmadan yapılmaz.
2. Requestin başarılı transactionı commit olduktan sonra provider işi çalışır. `enqueue_after_commit=True` kullanımı ve job transaction davranışı seçilen sürümde test edilir. Intent için scheduler taraması eklenir: commit ile enqueue arasındaki süreç ölümü iş kaybettirmemeli. [Frappe background jobs](https://docs.frappe.io/framework/user/en/api/background_jobs).
3. Worker provider çağrısından **önce** benzersiz operation/lease durumunu kalıcılaştırır. Dış HTTP çağrısı ile DB commit atomik değildir; buna uygun kısa transaction sınırları tasarlanır. Add timeout, worker ölümü veya Add sonrası DB yazma hatası UNKNOWN üretir; retry Add’i tekrar çağırmaz.
4. Bilinen UUID ile GetById; UUID yoksa sağlayıcının OrderNo/idempotency/recovery sözleşmesi. Q04 kapanmadan otomatik yeniden tahsilat yok.
5. Callback ayrı dar public alım yolu: imza protokolü teyitliyse doğrula; body boyutu/şema/replay sınırlarını uygula; inboxu kalıcılaştır. Callback için genel CSRF veya auth korumasını kapatma.
6. Inbox workerı kendi provider credentialıyla sorgular; ID, OrderNo, tutar, merchant eşleşir. Sipariş etkisi + audit/outbox aynı transactionda, unique business effect kısıtıyla uygulanır.
7. Frappe POST ve jobların otomatik commit/rollback modeli dikkate alınır. Dış sağlayıcı başarılıyken yakalanan exceptionın kalıcı intenti kaybettirmemesi ve sonsuz Add retry yaratmaması fault injection ile test edilir. [Frappe transaction modeli](https://docs.frappe.io/framework/user/en/api/database).

Provider yol haritası değişmedi: `Authenticate → GetSubMerchants → Transaction/Add → hosted link → callback → GetById`. Callback zarfının `isSuccess` veya tarayıcı mesajının `success` değeri tek başına tahsilat kanıtı değil. Sağlayıcı kimlik/durum/retry soruları [Q01–Q12 kaydında](https://karacaismail.github.io/galaxyPayFrappe/docs/acik-sorular/) devam eder.

Durumlar: CREATED → PENDING → SUCCEEDED veya teyitli FAILED. UNKNOWN/REVIEW_REQUIRED ayrı dallardır; yerel timeout veya sekme kapanması başarısızlık sayılmaz. Geç pending successi geri almaz. Geç başarı ve ikinci attempt çakışması finans inceleme vakasıdır. Satıcı veya ops kendi kararıyla ödeme durumunu yazamaz.


---

# Eksik ve gereksiz içerik analizi

Kaynak: src/content/v2/audit.md

## Sonuç

Önceki içerik güvenlik ve uzun vadeli plan açısından ayrıntılıydı; **geliştiricinin ilk entegrasyonu çalıştırması açısından eksikti**. Test kartlarını sırf PAN/CVV alanı içeriyor diye tamamen dışlamak, sağlayıcının dummy verisini gerçek ödeme verisiyle karıştırdı. Yerel dosyada 18 test kartı vardı. Şimdi kaynakla birebir eşlenen ayrı referans ve JSON olarak sunulur; fiili kart geçerliliği denenmiş değildir.

## Atlanan veya yetersiz kalanlar

| Eksik | Kaynakta ne vardı? | Düzeltme / kalan durum |
|---|---|---|
| Kart kataloğu | 18 PAN, `2612`, `000`, `123456` | [Test verisi](https://karacaismail.github.io/galaxyPayFrappe/v2/test-data/), SKT dönüşümü, kart refleri ve UAT kaydı |
| Telefon akışları | Cüzdan için kayıtlı test hesabı; doğrudan kart için kendi telefonları | İki ayrı UAT; wallet telefonunun yerel secret erişim yolu |
| Dummy merchant kullanımı | İki dummy satıcı tanımlanmış | GetSubMerchants → active/ayar → mapping adımları; gerçek IDler erişim gerektiriyor |
| İlk çalıştırma sırası | Demo linki, yerel kaynak, auth, Add, callback, sorgu | [Quickstart](https://karacaismail.github.io/galaxyPayFrappe/v2/quickstart/) ve env matrisi; demo erişimi otomatik ödeme onayı değildir |
| Endpoint ayrıntısı | Swagger, model/alan bilgisi | [Endpoint başına referans](https://karacaismail.github.io/galaxyPayFrappe/v2/api/), request/response şeması, cURL, hata/retry/test/Q |
| Tam taşınabilir sözleşme | Erişilebilir OpenAPI | Tam 40 path snapshot + Postman koleksiyonu; önceki dosya yalnız seçilmiş excerpt idi |
| Callback örneği | C# callback modeli | [Synthetic fixture](https://karacaismail.github.io/galaxyPayFrappe/v2/callback/) ve negatif test vektörleri; imza/ACK hâlâ Q01 |
| Core development | Domain ilkeleri dağınıktı | [C01/C02](https://karacaismail.github.io/galaxyPayFrappe/v2/core-development/); para/izin/intent/adapter/test zemini MVP’den önce |
| Sprintin testleri | Genel TC listesi vardı | Her sprintte Given/When/Then, test katmanı, seed, sahip, çıkış kanıtı |
| TDD disiplini | “AI önce test yazsın” tavsiyesi vardı | RED/GREEN/REFACTOR kanıt formatı, concurrency ve mutation negatif kontrolleri |
| DX bilgi mimarisi | Uzun tek sayfa + eski stack ana sayfası | Güncel rehber kökten erişilir; kısa görev sayfaları + ayrı API referansı; v1 arşiv |

## Gereksiz veya yanlış yerde olanlar

| İçerik | Neden yük oluşturdu? | Yeni yer / karar |
|---|---|---|
| Büyük tanıtım hero’su, sloganlar ve teknoloji rozetleri | İlk istek/kart/API yolunu aşağı itiyordu | Ana sayfa görev ve referans girişine dönüştü |
| 26 sprint/78 kart ve 24 kartlı ikinci takvim | İki planın hangisinin güncel olduğu belirsizdi | Tek güncel Core→maturity planı; v1 tarihsel arşiv |
| .NET/PostgreSQL yönlendirmesi | Frappe kararı sonrası aktif geliştirme rotasına uymuyor | V1 üzerinde arşiv uyarısı; yeni DB testleri Frappe/MariaDB |
| 18–20 günlük bitiş tahmini | Ekip, mevcut auth/order ve provider teyidi bilinmiyor | İlk core spike ve çevrim süresi sonrası yeniden tahmin; tarih taahhüdü yok |
| Sayfanın CSS/asset mekanizması ana anlatıda | Doküman aracının detayı ödeme entegrasyonunu gölgeliyordu | [Mobile](https://karacaismail.github.io/galaxyPayFrappe/v2/mobile/) ve teknik doğrulama kaydında |
| Genel enterprise etiketleri / tekrar eden uyarılar | Geliştirilecek modül/test yerine kavram tekrarına dönüşüyordu | Faz başına somut modül ve ölçülebilir gate; güven sınırı ilgili referansta |
| Çoklu provider/abonelik/mikroservis varsayımları | MVP’de teyitli kullanıcı ihtiyacı değil | Koşullu keşif; core teslimine bağımlılık yapılmaz |

İdempotency, callback doğrulama, rol izolasyonu, UNKNOWN yönetimi, manuel iade ve restore **gereksiz değildir**; ödeme doğruluğu için core/MVP kapsamındadır. Azaltılan şey bu kontrollerin tekrarı ve önceliksiz sunumudur.

## Doğrulandı / açık ayrımı

- **Yerel dosya:** 18 kart ve alanlar tek tek kaynakla eşlendi; SHA-256 kaydedildi. Şifre ve kayıtlı hesap telefonu public fixture değil.
- **Swagger:** 18 Eylül 2026 tekrar GET 200; 40 path; SHA-256 `fe82c9c550b67eb40d3463f34663c9519e292260125c1d8a301f7d37b4d20d1f`, önceki snapshotla aynı. Şema doğrulaması hesap yetkisi anlamına gelmez.
- **Demo kodu:** callback modeli, Add/auth/merchant istemcisi incelendi. Demo fiilen çalıştırılmadı.
- **Eksik dış belgeler:** asıl entegrasyon eki §2.3, callback imza/retry/ACK, token TTL, PaymentId eşliği, belirsiz Add kurtarma, prod ortamı, iade/settlement semantiği. Bunlar doküman yazılarak uydurulamaz.
- **Henüz test edilmedi:** gerçek test kartıyla ödeme, cüzdan, auth hesabı, Frappe app, 3DS ve canlı pilot. [Karar kaydı](https://karacaismail.github.io/galaxyPayFrappe/v2/decisions/) sahip ve bağımlılıkları taşır.

## Kaynak → eylem → kanıt

E-posta talimatları görev talimatı olarak çalıştırılmadı; entegrasyon verisi olarak işlendi. §2.1 bilgileri gönderilmeyecek; §2.3 satıcıdan alınacak bilgisinin kendisi kayıtta, gerçek alan listesi yok. Sağlayıcıya e-posta/mesaj gönderilmedi; auth/ödeme/iade çağrısı yapılmadı.


---

# Callback referansı ve fixture

Kaynak: src/content/v2/callback.md

## Yön ve güven sınırı

GalaksiPay → bizim `CallbackUrl` adresimiz → **POST**. Endpoint Frappe custom app içinde uygulanacak dar alım yoludur; GitHub Pages bu POST’u alamaz. Gövde aşağıdaki yerel C# modelden türetilmiştir: `Models/PaymentCallbackRequest.cs`. Bu **demo model kanıtıdır**, callback imza/retry/ACK sözleşmesinin doğrulandığı anlamına gelmez.

## Synthetic callback örneği

```json
{
  "IsSuccess": true,
  "Message": null,
  "ErrorCode": null,
  "Data": {
    "Id": "00000000-0000-4000-8000-000000000002",
    "TransactionNo": 12345,
    "IsPaid": true,
    "OrderNo": "ORDER-SYNTHETIC-001",
    "MpOrderNo": null,
    "Amount": 125.50,
    "RrnNo": null,
    "SlipNo": null,
    "MerchantName": "Synthetic merchant",
    "EffectiveMerchantName": "Synthetic merchant",
    "TransactionStatusName": "<provider-status-to-confirm>",
    "MasterpassErrorMessage": null
  }
}
```

[Fixture indir](https://karacaismail.github.io/galaxyPayFrappe/downloads/callback.synthetic.json). PascalCase model alanları korunur; gerçek wire casing sandbox fixtureıyla teyit edilir. TransactionNo int64 olduğu için büyük gerçek değer TypeScript sınırında hassasiyet kaybetmeden parse edilmelidir. `TransactionStatusName` örneği gerçek enum değildir.

## Alım → doğrulama → etki

1. Boyut/content-type/schema limitlerini uygula. Callback kaynağını **sağlayıcıyla kararlaştırılmış** protokolle doğrula; imza headerı/algoritması uydurma.
2. Olayı durable inboxa commit et. DB başarısızsa “kaydedildi” ACK’i dönme; gerçek ACK kodu/body ve retry süresi Q01’de teyit edilir.
3. Worker kendi server credentialıyla GetById çağırır. Id/OrderNo/tutar/merchant beklenenle eşleşir; callback içindeki `IsPaid` tek başına yetmez.
4. İş etkisi + audit/outbox aynı transaction içinde unique constraintle uygulanır. Tekrarlı teslim tek sipariş etkisi üretir.
5. Çelişki REVIEW_REQUIRED; kayıp callback scheduler sorgusuyla tamamlanır. UUID bilinmeyen Add için Q04 çözümü veya manuel vaka gerekir.

Demo callback modeli SubMerchantId alanını taşımıyor; merchant doğrulaması yalnız callback ismine bakılarak yapılamaz. Yetkili status DTO’su ve yerel mapping kullanılmalıdır.

## Test vektörleri — M02’den önce kırmızı

| Vektör | Değişiklik | Beklenen invariant |
|---|---|---|
| duplicate ×100 | Aynı body eşzamanlı teslim | 1 business effect |
| out-of-order | Success sonrası pending | Success geriye dönmez |
| wrong amount | Amount 125.50 yerine 1.00 | Review, fulfillment 0 |
| wrong merchant | GetById başka merchant döner | Review, fulfillment 0 |
| invalid identity | Bilinmeyen ID/order | Kayıt eşleştirilmez, paid yok |
| DB unavailable | Inbox commit başarısız | Success ACK yok |
| queue unavailable | Inbox var, enqueue yok | Scheduler kurtarır |
| spoofed postMessage | Sahte browser mesajı | En fazla yetkili status refresh; paid etkisi yok |

İlgili sprint: [M02](https://karacaismail.github.io/galaxyPayFrappe/v2/roadmap/#m02). Q01 kapanmadan canlı alım protokolü “hazır” sayılmaz.


---

# Açık kararlar ve kaynaklar

Kaynak: src/content/v2/decisions.md

## 13 · Açık kararlar ve kaynak kaydı

### İlk sprintte kapatılacak kararlar

| ID | Karar | Sahip / etkisi |
|---|---|---|
| V2-Q1 | Mevcut Frappe/ERPNext var mı, sürüm ve barındırma nedir? | TL/ops; compatibility matrix ve kurulum |
| V2-Q2 | Sipariş kaynağı ve alıcı oturumu hazır mı; misafir şart mı? | PO/BE; kapsam/takvim |
| V2-Q3 | Bir sipariş tek satıcılı mı; platform kendi hesabına mı yoksa merchant adına mı hareket ediyor? | PO/finans; para ve yetki modeli |
| V2-Q4 | Vue admini kim kullanacak; satıcılar için ayrı lightweight portal yeterli mi? | PO; bu plan ayrı seller portalını varsayar |
| V2-Q5 | Ortam domainleri, callback erişimi, sağlayıcı Q01–Q12 cevapları? | Platform/sağlayıcı; canlı kapı |
| V2-Q6 | Gerçek ekip, beklenen hacim, hizmet saatleri, hedef budget? | PO/TL; sprint kapasitesi ve teslim tahminini belirler |

### V1 → V2 izlenebilirliği

| V1 kanıt / kapsam | V2 karşılığı |
|---|---|
| GalaksiPay demo + Swagger | Python adapterın provider sözleşmesi; C# kodu üretim backend seçimi değil |
| GP/S01–S04 | C01/C02 → M01–M04 dikey MVP, Frappe izin/transaction ve adaptive acceptance ile |
| Post-MVP/finans | P01/P02/F01; gerekli manual operasyon pilot öncesinde |
| Dayanıklılık/güvenlik/DX | Temeller G0–G1, ileri ölçümler R01/DX01 |
| Enterprise/maturity | E01/MT01 gereksinimle tetiklenir; 90 gün kanıt şartı korunur |
| Min 1rem | Korunur; 320 px, input/focus ve network ayrımı eklenir |

### Birincil kaynaklar — 18 Eylül 2026 incelemesi

- [Frappe REST](https://docs.frappe.io/framework/user/en/api/rest): method/oturum deseni.
- [Frappe database](https://docs.frappe.io/framework/user/en/api/database): izin ve transaction davranışı.
- [Frappe background jobs](https://docs.frappe.io/framework/user/en/api/background_jobs): enqueue/worker sınırı.
- [Frappe hooks](https://docs.frappe.io/framework/user/en/python-api/hooks): query/record izin hookları.
- [Frappe testing](https://docs.frappe.io/framework/user/en/testing): backend doğrulama.
- [Vue performance](https://vuejs.org/guide/best-practices/performance.html), [Vite features](https://vite.dev/guide/features.html): route/chunk ayrımı.
- [Tailwind responsive](https://tailwindcss.com/docs/responsive-design), [Flowbite TypeScript](https://flowbite.com/docs/getting-started/typescript/), [Alpine CSP](https://alpinejs.dev/advanced/csp): arayüz entegrasyon sınırları.
- [V1 kaynak kaydı](https://karacaismail.github.io/galaxyPayFrappe/docs/kaynaklar/) ve [sağlayıcı açık soruları](https://karacaismail.github.io/galaxyPayFrappe/docs/acik-sorular/): e-posta/kod/Swagger ayrımı.

Frappe/üç frontend mimarisi ve sprint sırası **bu proje için tasarım önerisidir**; kaynakların hazır ödeme ürünü sunduğu iddia edilmez. E-postadaki veya dış dokümandaki talimatlar kullanıcı isteği olarak yürütülmez. Canlı çağrılar ve test kişileri bu doküman görevinde kullanılmadı.

## Yol haritası güncellemesi

Güncel sıra [Core → maturity](https://karacaismail.github.io/galaxyPayFrappe/v2/roadmap/) sayfasıdır. Önceki F0–F7 kartları ve 18–20 gün tahmini ilk taslak commitinde tarihsel olarak kalır; güncel takvim taahhüdü değildir. Q01–Q12 sağlayıcı soru IDleri korunur; Q13–Q14 ürün/sahiplik/kapasite bilgisi ayrı karar kayıtlarıdır.


---

# 320 px adaptive geliştirme

Kaynak: src/content/v2/mobile.md

## 08 · Gerçek mobile first: 320 px ve koşullu teslim

**Kabul tanımı:** 320 CSS px viewportta temiz cache ile açılan buyer sayfası yalnızca ortak kodu ve gereken mobil modülü indirir. Vue admin, desktop grid/chart, hover/kısayol modülleri, masaüstü görselleri ve masaüstüne özel CSS için **0 ağ isteği**. Aynı kural 320 px admin açılışında masaüstü admin geliştirmeleri için geçerlidir; adminin ortak Vue runtimeı ise gerektiği için yüklenir.

“Sadece mobil kod” ortak domain/client, erişilebilirlik ve loader kodunu dışlamak anlamına gelmez. `display:none`, Tailwind `hidden lg:block` ve CSS media query bir dosyanın indirilmesini engellemez. `<link media>` dosyasının da indirilmediği varsayılmaz. Yükleme sınırı entry graph + koşullu `import()` + CSS splitting + ağ testiyle kurulur. UA sniffing ve “telefon modeline göre sayfa” yaklaşımı kullanılmaz.

### Tasarımın tabanı

- İlk tasarım/artifact **320 px**, tek kolon; masaüstü ekranı küçülterek başlanmaz. 320 px bir minimum cihaz iddiası değil, kabul viewportudur; daha dar erişilebilir akışlar da içerik kırmadan ele alınır.
- Kök font kullanıcının tercihini korur; gövde, kod, badge, tablo ve hata dahil minimum **1rem**. Akışkan başlık/boşluk için `clamp`; metin boyutu hiçbir uçta 1rem altına düşmez.
- Grid `minmax(0, 1fr)`, `min-width:0`, mantıksal padding, taşan referanslarda `overflow-wrap:anywhere`. Sabit 100vw genişliği ve ölçekleyip küçültme yok.
- Kart → içerik uygunluğuna göre genişleyen düzen; tablo gerekiyorsa mobile label/value veya tek kayıt görünümü. Desktop tablo bileşeni mobile gizlenmiş ikinci DOM ağacı olarak gönderilmez.
- Birincil eylem minimum 44×44, tercihen 48 px; safe-area inset, sanal klavye, yatay/dikey dönüş ve reduced-motion ele alınır. Hover tek erişim yolu olamaz.
- `inputmode`, `autocomplete`, yerel klavye ve alanla ilişkili hata; hata özeti focusu doğru alana taşır. 3DS dönüşünde focus/scroll ve devam eden attempt korunur.
- Görseller varsa `<picture>`/`srcset`/`sizes`, boyut/aspect-ratio ve uygun codec; mobilde masaüstü hero downloadı yok. Sistem fontu ilk seçenek; gerekli font subseti budgeta dahil.

### Profil politikası

Ortak HTML + CSS 320 px için tek başına kullanılabilir. Küçük yükleyici `(min-width: 64rem) and (pointer: fine)` eşleşince desktop geliştirmesini, diğer durumda compact/mobile geliştirmesini import eder. Bu eşik ürünün içerik testiyle değişebilir; touch-tablet geniş ekranda da hafif profilde kalabilir. Feature flag/rol ve route kontrolü eklenir; her büyük ekran bütün admin modüllerini indirmez.

Alttaki örnek **ürün için uygulama şablonudur**. Gerçek v2 doküman portalı da ayrı compact/desktop modülleri kullanır; henüz Vue ödeme admininin ağı ölçülmüş değildir.

```ts
// Shared entry: route + permission sonucu belirlendikten sonra.
// İki UI aynı state/store ve API clientı kullanır.
const desktop = matchMedia('(min-width: 64rem) and (pointer: fine)');
let revision = 0;
let dispose: (() => void) | undefined;

async function loadProfile() {
  const current = ++revision;
  const module = desktop.matches
    ? await import('./profiles/desktop')
    : await import('./profiles/compact');
  if (current !== revision) return; // resize yarışında eski sonuç bağlanmaz
  dispose?.();
  dispose = module.mount(); // event listener/observer cleanup döndürür
}

desktop.addEventListener('change', loadProfile);
void loadProfile();
```

CSS ilgili modülün içinden import edilir; shared entry masaüstü CSS dosyasını statik import etmez. Vite `cssCodeSplit` açık tutulur. Async chunk CSS’i o chunk yüklenince gelir; statik importlar için oluşturulan preloadlar incelenir. Sırf bu ayarı yazmak yeterli kanıt değildir: çıktıdaki modulepreload/prefetch ve service worker precache graphı test edilir. [Vite CSS splitting](https://vite.dev/guide/features.html#css-code-splitting).

**Bu Astro portalında doğrulanan ayrıntı:** normal CSS importu, dinamik JS modülünün içinden gelse bile Astro tarafından ortak HTML stiline taşınabildi. Bu nedenle profil CSS’leri `?url` ile ayrı asset olarak derlenir, yalnızca seçilen modül mount olduğunda stylesheet linki eklenir; dispose sırasında kaldırılır. `assetsInlineLimit: 0` ve build kontrolü ayrı CSS dosyasını korur. Ürün Vite buildinde de çıktıyı ölç; framework davranışını varsayma.

Vue admin route’u ve ağır bileşenleri dinamik importla ayır; `v-if` aynı bundle içindeyse indirmeyi önlemez. Router prefetchi desktop rotalarını mobilde çağırmamalı. [Vue performans/code splitting](https://vuejs.org/guide/best-practices/performance.html). Tailwind responsive utilityler ortak akışkan görsel düzen içindir; JS seçiminin yerini tutmaz. Desktop-only utilityler için ayrı stylesheet entry ve dar source taraması gerekir. [Tailwind responsive tasarım](https://tailwindcss.com/docs/responsive-design).

Alpine bir checkout açıklaması/menü gibi küçük alanın davranışını yönetebilir; global state ödeme gerçeği değildir. Sıkı CSP için `@alpinejs/csp` seçeneğini değerlendirmek, standart build yüzünden ödeme sayfasında `unsafe-eval` açmaktan daha iyi başlangıçtır; desteklenen ifade sınırlarını C02’de doğrula. [Alpine CSP](https://alpinejs.dev/advanced/csp).

### Yeniden boyutlandırma ve anlamlı sınır

İlk açılış mobilken desktop modülü yüklenmez. Kullanıcı pencereyi büyütürse gerektikçe yüklenir; tekrar küçültünce listener ve desktop DOM temizlenir. İndirilmiş byte browser cacheinden “geri alınamaz”. Kabul testi **temiz mobil açılış**, **mobil etkileşim**, **desktopa büyüme**, **tekrar mobile dönüş** durumlarını ayrı raporlar. Form statei DOM modülünde tutulmaz, profil geçişinde ödeme yinelenmez.

### Ölçülebilir budget — başlangıç hedefi

| Ölçüm | Buyer/seller hedefi | Vue admin hedefi | Kanıt |
|---|---|---|---|
| Başlangıç first-party JS, gzip | ≤60 KiB | ≤120 KiB | Vite output + gzip; route bazlı |
| Başlangıç CSS, gzip | ≤25 KiB | ≤35 KiB | Ortak + seçilen profil toplamı |
| 320 px desktop-only istek | 0 | 0 | Cold-cache network/HAR, JS ve CSS |
| Public rotada Vue/admin artifacti | 0 | Uygulanmaz | Import graph + network |
| 320 px sayfa taşması | 0 px | 0 px | scrollWidth ≤ clientWidth |
| Metin / dokunma | ≥1rem / ≥44 px | Aynı | Computed style + pointer/klavye |
| CWV hedefi | LCP ≤2,5 sn, INP ≤200 ms, CLS ≤0,1 | Aynı başlangıç hedefi | Lab ve pilot gerçek kullanıcı p75 ayrı |

Budgetlar provider hosted ekranı ve bankanın 3DS bekleme süresini kapsamaz; bunlar ayrı ölçülür. Font/görsel/analitik toplam ağı ayrıca raporlanır. Gerçek trafik verisi yokken p75 başarı iddiası yazılmaz. Cihaz matrisi: 320, 360, 390, 768 ve 1280 CSS px; touch/fine pointer; 200% zoom; yavaş ağ/CPU; reduced-motion; JS hatası ve offline dönüş. Kütüphane importunu optimize etmeden budgetı büyütme.


## Test önce

İlk kırmızı test `UI_desktop_asset_leak`: production manifestten desktop-only JS/CSS kümesini çıkar; 320 CSS px boş contextte public route aç, menü/formu kullan, prefetch penceresini izle. İstek kümesiyle kesişim boş olmalı. Sonra 1280/fine pointerda desktop modülünün gerçekten yüklendiğini göster. Tek başına dosya isminde desktop kelimesi aramak yeterli kabul değildir.

Viewport ayarının gerçekten 320 CSS px verdiğini `document.documentElement.clientWidth` ile ölç; tarayıcı zoomu sonucu değiştirebilir. Form statei profil dışında kalır. Zoom, klavye, orientation ve touch cihaz testleri ayrı satırlar olarak raporlanır.


---

# Alıcı, satıcı ve platform

Kaynak: src/content/v2/scenarios.md

## 03 · Alıcının senaryoları

| ID / aşama | Tetikleyici ve ekran | Sunucu davranışı | Kabul / istisna |
|---|---|---|---|
| B01 · MVP | Kimliği doğrulanmış alıcı sipariş linkini açar | Sahiplik, aktif satıcı, fiyat/sipariş sürümü okunur | Başkasının siparişini ID değiştirerek açamaz |
| B02 · MVP | 320 px sipariş özeti, tutar, satıcı ve ödeme eylemi | Tutar kaynağı backend; istemci amount alanı kabul edilmez | Uzun satıcı adı, 200% zoom ve ekran klavyesi eylemi kapatmaz |
| B03 · MVP | Öde’ye dokunur, iki sekmede tekrarlar | Aynı sipariş/version için tek aktif attempt + idempotency | Tek Add etkisi; aynı key farklı gövde conflict |
| B04 · MVP | Hosted checkout / 3DS’ye geçer | PaymentUrl hostu allowlistten; URL tokenı loglanmaz | Mobilde aynı sekme yönlendirme varsayılan; popup tek seçenek değildir |
| B05 · MVP | Bankadan döner veya sayfayı yeniler | Kendi backend durumunu okur; provider sorgusu server-side | Return URL / postMessage paid kanıtı değildir |
| B06 · MVP | Sonuç gecikir, internet kesilir, sekme kapanır | PENDING / UNKNOWN korunur, scheduler sorgular | Tekrar tahsilata yönlendirme yok; destek referansı ve yeniden kontrol |
| B07 · MVP | Kesin başarı veya kesin red | Eşleşen provider kanıtı sonrası tek sipariş etkisi | Bildirim hatası ödemeyi geri almaz; gerçek başarısızlık ayrı yeni attempt |
| B08 · MVP sonrası | Kayıtlı kart/cüzdan ile öder | Sağlayıcı cüzdan akışı; bizim sistem PAN/CVV tutmaz | Yetkili test hesabıyla ayrı UAT; hesap yoksa doğrudan kart |
| B09 · MVP sonrası | Ödeme geçmişi ve iade talebi | Sadece kendi siparişleri; iade talebi finans onayına gider | İade isteği anında banka iadesi gibi gösterilmez |
| B10 · Koşullu | Misafir alıcı linkten öder | Kısa ömürlü, tek kapsamlı, iptal edilebilir checkout oturumu tasarlanır | UUID bilmek yetki değildir; oturum modeli test edilmeden guest açılmaz |

MVP kullanıcı yolculuğu: **sipariş özeti → sağlayıcı ödeme sayfası → doğrulanıyor → sonuç**. Ad/soyad/telefon yalnızca sağlayıcının gerekli kıldığı kadar işlenir. Hata mesajı kullanıcıya ne yapacağını söyler; banka ham hatası, token veya callback gövdesi gösterilmez. Ödeme oturumunu offline kuyruğa alıp bağlantı gelince otomatik tahsil etme; PWA varsa yalnızca güvenli statik kabuk cachelenir.

## 04 · Satıcının senaryoları

| ID / aşama | Tetikleyici ve ekran | Backend / platform ilişkisi | Kabul / istisna |
|---|---|---|---|
| S01 · MVP öncesi | Satıcı pilot katılımı | Sağlayıcının gerçek §2.3 alan listesi temin edilir; güvenli kanal kullanılır | Eksik belgeden vergi/IBAN/kimlik alanı uydurulmaz |
| S02 · MVP | Platform satıcıya kullanıcı/üyelik atar | Seller Membership + yerel Merchant Mapping | Kullanıcının gönderdiği merchant ID yetki kaynağı değildir |
| S03 · MVP | Aktivasyon durumunu görür | GetSubMerchants sonucu + IsActive + ayar/sahiplik kontrolü | Pasif/eksik ayarlı satıcıdan yeni ödeme açılmaz |
| S04 · MVP | Kendi ödeme/sipariş listesini açar | Server filtreli, sayfalı, field allowlistli sorgu | Mobil kart listesi; diğer merchantın kaydı/ham PII görünmez |
| S05 · MVP | İşlem detayında sonuç takip eder | Yetkili read; manual refresh yalnızca sorgu tetikler | Refresh Add çağırmaz; rate limit uygulanır |
| S06 · MVP | Bekleyen tahsilat için destek ister | Attempt referansı ile review case | Satıcı kendi kaydını paid yapamaz |
| S07 · MVP sonrası | İade talebi oluşturur | Gerekçe, tutar sınırı ve idempotent talep; finans rolü yürütür | Tam/kısmi destek teyidine göre UI; yetkisiz onay yok |
| S08 · MVP sonrası | Ekip üyesi ve rol yönetir | Davet, iptal, rol matrisi, erişim audit | Davet edilen rol verilen kapsamı aşamaz |
| S09 · MVP sonrası | Dönem/net/komisyon raporu indirir | Tarih/tenant filtresi, maskeli CSV, export audit | Brüt tahsilat ile settlement farklı kavramlardır |

Satıcıya ilk sürümde özel bir ERP paneli yapılmaz. `/seller/` Vite frontpages içinde **liste + detay + aktivasyon durumu + destek** yeterli başlangıçtır. Platformun Vue adminine satıcı rolüyle sınırsız erişim vermek yerine aynı Frappe servis kuralları üzerine dar arayüz kurulur.

## 05 · Platform sağlayıcının senaryoları

Buradaki platform sağlayıcı, sizin uygulamanızın işletmecisidir; **GalaksiPay ödeme hizmeti sağlayıcısı** ayrı aktördür.

| ID / aşama | Vue admin ekranı / iş | Yetkili operasyon | Kabul / istisna |
|---|---|---|---|
| P01 · MVP öncesi | Ortam ve provider ayarları | Test/prod secretları güvenli sunucu alanında; erişim/rotasyon sahibi | Credential API yanıtında/HTML’de yok |
| P02 · MVP | Merchant mapping ve üyelik | Yerel satıcıyı sağlayıcı SubMerchantId ile eşleştir, doğrula, devre dışı bırak | Ana merchant fallback sessizce devreye girmez |
| P03 · MVP | Ödeme listesi + olay zaman çizgisi | İzinli rol için maskeli işlem/durum/audit | Sadece read; veri doğrudan CRUD ile para durumuna dönüştürülemez |
| P04 · MVP | İnceleme kuyruğu | UNKNOWN, sync_error, tutar/merchant çelişkisini sahiplen | Tek tuşla paid değil; kanıta bağlı düzeltme komutu |
| P05 · MVP | Tekrar sorgula | Rate-limitli GetById işini kuyruğa al | İdempotent; yeni tahsilat yaratmaz |
| P06 · MVP | Kill switch ve olay takibi | Yeni start durur; callback ve kurtarma hattı sürer | Kim, neden, ne zaman audit; kontrollü yeniden açılış |
| P07 · MVP sonrası | İade/iptal onayı | Teyitli provider yetkisiyle, talep/onanma ayrımı | Timeout otomatik ikinci iade oluşturmaz |
| P08 · MVP sonrası | Günlük mutabakat | Sipariş, provider ve settlement kayıtlarını karşılaştır | Farklar sahipli vaka; satırları silerek fark kapatılmaz |
| P09 · Olgunlaşma | Kurumsal erişim/denetim | SSO/MFA, görev ayrılığı, retention, export ve access review | Erişim iptali, audit ve restore tatbikatı kanıtlı |

MVP Vue ekranları: **giriş, merchant eşleştirme, işlem listesi, işlem detayı, inceleme kuyruğu**. Grafik ve sürükle-bırak dashboard ilk tahsilat için gerekli değildir. Mobil admin aynı kritik yetenekleri kart/tek kayıt eylemleriyle sunar; toplu seçim ve büyük tablo geliştirmesi yalnızca masaüstü modülünde olabilir. Her kritik görev mobilde alternatif yola sahip olmalı.


## Senaryodan teste iz

B01/B02 → C01 izin/para + M03 UI; B03/B04 → M01; B05–B07 → M02/M03; B08 → P01; B09 → P02. S01–S06 → C01/M03/M04; S07–S09 → P01/P02/F01. P01–P06 → C02/M02/M03/M04; P07/P08 → P02/F01; P09 → E01/MT01. [Her sprintin Given/When/Then testi](https://karacaismail.github.io/galaxyPayFrappe/v2/roadmap/) aynı davranışın kabul kanıtını tanımlar.
