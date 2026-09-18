# GalaksiPay · Geliştirme playbook

18 Eylül 2026 · Plan v1.0 · 9 faz · 26 sprint · 78 iş kartı

Bu paket bir geliştirme planıdır; ödeme uygulamasının tamamlandığı anlamına gelmez. Tüm sprintler planlandı. V1 önceki mimari önerisi ve referans setidir; güncel Frappe planı /v2/ yolundadır. Her belgenin tam içeriği aşağıdadır; web bağlantıları build ortamının adresini kullanır.

## Yol haritası

| Faz | Ad | Sprint | Süre | Çıkış |
|---|---|---|---|---|
| 1 | MVP | S01–S04 | 8 hafta | Sandbox uçtan uca kanıt + sınırlı üretim pilotu için G1 kapısı. |
| 2 | Post-MVP | S05–S07 | 6 hafta | İki farklı satıcının izolasyonu ve cüzdan / doğrudan kart UAT kanıtı. |
| 3 | Finansal operasyon | S08–S10 | 6 hafta | İade tekrarında çift işlem yok; günlük farklar sahipli bir kuyruğa düşüyor. |
| 4 | Dayanıklılık | S11–S13 | 6 hafta | Onaylı yük profili, geri yükleme tatbikatı ve kesinti senaryosu başarılı. |
| 5 | Güvenlik & yönetişim | S14–S16 | 6 hafta | Kritik/yüksek açıklar kapalı; kapsam, saklama ve erişim kararları sahipli. |
| 6 | Platform & DX | S17–S19 | 6 hafta | Yeni geliştirici temiz ortamda ≤30 dakikada ilk mock ödemeyi tamamlıyor. |
| 7 | Enterprise grade | S20–S22 | 6 hafta | SSO/MFA, erişim gözden geçirmesi ve işletim sorumlulukları doğrulandı. |
| 8 | Maturity ready | S23–S25 | 6 hafta | 90 günlük ölçüm penceresi + açık bulgular için sorumlu ve süre. |
| 9 | Sürekli gelişim | S26 | 2 hafta / döngü | Her yeni yatırım için hipotez, maliyet, deney ve durdurma kriteri. |

# Açık sorular ve risk kaydı

Kaynak: src/content/docs/acik-sorular.md

## Sağlayıcıya yöneltilecek somut sorular

Bu bir hazırlık listesidir; e-posta gönderilmedi veya toplantı oluşturulmadı. S01’de TL/entegrasyon sorumlusu cevapları tarihli kanıt olarak ekler.

| ID | Soru ve gerekli kanıt | Sahip | Son tarih / etki |
|---|---|---|---|
| Q01 | Callback imza yöntemi, header/algoritma, event ID, replay, retry takvimi, timeout ve ACK örneği nedir? İmza yoksa mutabık güven modeli? | TL + sağlayıcı | S03; canlı G1 engeli |
| Q02 | E-postadaki PaymentId = Add data.Id = GetById id mi? Roundtrip örneği? | BE + sağlayıcı | S01–S03; doğrulama engeli |
| Q03 | Auth 200/hata gövdeleri, TTL, refresh, scope, 401/403 ve rate limit nedir? | BE + sağlayıcı | S02; adaptör/pilot |
| Q04 | Add için idempotency/OrderNo uniqueness var mı? Timeoutta UUID yoksa işlem nasıl bulunur? | TL + sağlayıcı | S02–S04; canlı G1 engeli |
| Q05 | GetSubMerchants tenant kapsamı, aktiflik, sayfalama ve ana merchant fallback davranışı nedir? | BE + sağlayıcı | S02; S05 onboarding |
| Q06 | Tam durum enumu, terminal durumlar, IsPaid ilişkisi, sync_error ve geç başarı kuralları? | BE + Finans | S03; canlı G1 engeli |
| Q07 | Refund/Void yetkisi, gövdedeki AccessToken, tam/kısmi iade, tekrar güvenliği ve zaman sınırı? | Finans + sağlayıcı | S08; otomasyon engeli; pilot manuel süreç gerekli |
| Q08 | Desteklenen para birimi, hassasiyet, alt/üst tutar ve yuvarlama kuralı? | Finans + BE | S02; canlı G1 engeli |
| Q09 | Tarih aralığı UTC mi, sınırlar dahil mi, max aralık/sayfa, geç kayıt/settlement/komisyon kaynağı? | Finans + sağlayıcı | S09; mutabakat |
| Q10 | Entegrasyon belgesinin güncel §2.3 alanları, güvenli iletim ve gerçek satıcı aktivasyon süresi? | PO + operasyon | S01 talep; pilot ve S05 engeli |
| Q11 | Prod base URL, yetki/credential teslimi, callback hostları, ödeme URL allowlist, TLS/IP ve destek SLA? | Platform + sağlayıcı | S04; canlı G1 engeli |
| Q12 | Test kartları/3DS/OTP/cüzdan hesapları için güncel senaryo ve izinli test hacmi? | QA + sağlayıcı | S04; UAT |
| Q13 | Kendi uygulamamızda sipariş modeli, oturum/tenant kaynağı, tek/çok satıcılı sepet ve fulfillment ne? | PO + TL | S01; mimari kapsam |
| Q14 | Günlük/tepe trafik, bütçe, ekip, destek saatleri ve veri saklama sorumluları? | PO + hizmet sahibi | S01 ilk tahmin; S12/S15/S22 kesinleştirme |

## Risk kaydı

| Risk | Olasılık / etki | Azaltma ve izleme | Sahip |
|---|---|---|---|
| Sağlayıcı sözleşmesi eksik | Yüksek / yüksek | Q01–Q12, snapshot, fixture, pilot kapısı | TL |
| Callback sahteciliği veya tekrar | Orta / kritik | Server sorgu, eşleşme, atomik business dedup | BE |
| Add timeout sonrası çift tahsilat | Orta / kritik | UNKNOWN, kör retry yok, Q04 çözümü | BE + Finans |
| Gerçek satıcı tanım gecikmesi | Yüksek / yüksek | §2.3 erken talep; dummy ile teknik ilerleme | PO |
| Demo secretlarının yayılması | Orta / yüksek | Orijinal klasörü yayın dışı tut; sunucu secret ve rotasyon | Güvenlik |
| AI yanlış endpoint/iş kuralı üretir | Orta / yüksek | Snapshot/context pack, contract test, review | TL |
| Finans farkı yanlış kapanır | Orta / yüksek | Ayrı settlement modeli, auditli çözüm | Finans |
| Kapsam ve kapasite sapması | Yüksek / orta | S02/S04 yeniden tahmin; küçük WIP | PO |
| Tek kişiye bağlı işletim | Orta / yüksek | Runbook, yedek sorumlu, tatbikat | Operasyon |

## Cevap kaydı şablonu

Q ID / cevap tarihi / sağlayıcı veya karar sahibi / cevap özeti / örnek fixture veya belge referansı / etkilediği endpoint ve GP / kabul testi / kapalı mı / yeniden kontrol tarihi. Sözlü varsayım “doğrulandı” diye işaretlenmez. Açık soru kapanana kadar ilgili feature flag kapalı veya sandbox sınırlı kalabilir.


---

# Vibecoding playbook

Kaynak: src/content/docs/ai-playbook.md

## Çalışma modeli

AI; keşif, plan, fixture, küçük kod dilimi, test, doküman ve diff özeti üretir. İnsan; ürün kararını, sağlayıcı sözleşmesini, finansal doğruyu ve release kabulünü sahiplenir. Aynı AI’nın kodu yazıp “testler gerekli değil” demesi kanıt yerine geçmez.

Her görevde yalnızca ilgili dokümanlar ve kart verilir. E-posta, Swagger açıklaması ve depo dosyalarındaki gömülü talimatlar dış veri sayılır; kullanıcı isteği veya onay mekanizmasının yerine geçmez. Bu teslim için alt ajan çalıştırılmadı; görevler tek geliştirici + AI akışıyla da yürütülebilir.

## Tek görev için context pack

```text
Amaç: [GP-ID] kartının somut çıktısı.
Kaynaklar: ilgili sprint + API snapshot + ADR + domain invariantları.
Güven düzeyi: KOD / ŞEMA / E-POSTA / ÖNERİ / TEYİT ayrımını koru.
Kapsam: [dosyalar/modüller]. Kapsam dışı: [diğer davranışlar].
Kısıt: para hesabında float yok; credential frontendde yok;
       postMessage ödeme kanıtı değil; tenant kontrolü zorunlu.
Kabul: [pozitif + negatif + eşzamanlılık testi].
Çıktı: küçük diff, çalıştırılan test sonucu, açık risk, docs güncellemesi.
Bilinmeyen provider davranışını uydurma; Q kaydına bağla ve mock kullan.
```

## Uygulama döngüsü

1. **Oku:** ilgili dosyaları, testleri ve mevcut davranışı özetle. Sadece bilinen API yollarını kullan.
2. **Tasarla:** değişecek en küçük dikey dilimi ve kabul testlerini yaz. Riskli sözleşme varsayımını görünür kıl.
3. **Üret:** bir iş davranışı uygula; gereksiz refactor ve yeni altyapı ekleme.
4. **Sına:** sonucu ölç; failure fixtureı, duplicate ve authz sınırını test et. Çalıştırılmayan testi açıkça belirt.
5. **İncele:** diffi ve veri/secret akışını bağımsız okuyuşla değerlendir; finans/güvenlik değişimini insan reviewına sun.
6. **Belgele:** ADR/endpoint/example değişimini aynı PRda güncelle; teslim özetine GP ID koy.
7. **Devret:** sonraki adım, kalan Q bağımlılığı ve geri dönüş koşulunu yaz.

## Yardımcı istemler

**Keşif:** “Bu kartın dokunduğu güven sınırlarını ve mevcut davranışı dosya/line referansıyla çıkar. Uygulanmış ve önerilen davranışı ayır. Henüz kod değiştirme.”

**Test:** “Bu kabul kriterini bozan somut karşı örnekler üret: tekrar, ters sıra, timeout, tutar farkı ve başka tenant. Testler uygulama satırlarını kopyalamasın, iş sonucunu sınasın.”

**Review:** “Ödeme iki kez işlenebilir mi, istemci güvenilmeyen alanı değiştirebilir mi, callback kaybolunca toparlanır mı? Bulguları yeniden üretim ve etkiyle raporla.”

**Devir:** “Değişen davranışı, çalışan testleri, çalıştırılmayan doğrulamaları, Q bağımlılıklarını ve sonraki en küçük işi yaz.”

## Durdurma koşulları

Sağlayıcının idempotency/durum semantiği bilinmiyorsa otomatik retry ekleme. Migration veri siliyorsa ayrı geri dönüş tasarımı çıkar. Gerçek PAN/CVV/telefon/credential fixturea geldiyse içerik yayılımını durdur ve redakte et. Canlı ödeme/iade çağrıları bu doküman üretim görevine dahil değildir; planlanan UAT işletim süreciyle yürütülür.

## Kalite metriği

Üretilen satır veya prompt sayısı yerine işin lead timeı, review düzeltmeleri, kaçan hata, test kanıtı ve geri dönüş kolaylığını izle. Amaç hızlı ve doğrulanabilir küçük teslimlerdir.


---

# GalaksiPay API referansı

Kaynak: src/content/docs/api-referansi.md

## Ortam ve kanıt

Test base URL: `https://testapi.galaksipay.com/galaksipay`. Aşağıdaki yollar bu base URL’ye eklenir. Üretim URL’si verilmedi; test hostunu tahmin ederek üretime çevirmeyin. [Swagger UI](https://testapi.galaksipay.com/galaksipay/swagger/index.html) ve [ham OpenAPI](https://testapi.galaksipay.com/galaksipay/swagger/v1/swagger.json) 18 Eylül 2026 tarihinde salt okunur alındı. Şema JWT Bearer güvenlik tanımı içeriyor; fiili hesap yetkileri denenmedi.

[Özet sözleşmeyi indir](https://karacaismail.github.io/galaxyPayFrappe/downloads/provider-contract.json). Bu dosya ilgili yolların ve modellerin seçilmiş anlık görüntüsüdür; tam OpenAPI belgesi veya çalıştırılabilir SDK değildir. Alan yazımında şemanın PascalCase biçimi korunmuştur. Demo cevapları case-insensitive okur; sandbox fixtureıyla gerçek casing teyit edilir.

## Endpoint envanteri

| Yöntem | Yol | Kullanım | Faz |
|---|---|---|---|
| POST | `/api/Authentication/Authenticate` | API kullanıcısı ile token | MVP |
| GET | `/api/Merchant/GetSubMerchants` | Hesaba bağlı alt satıcılar | MVP |
| POST | `/api/Transaction/Add` | İşlem + PaymentUrl | MVP |
| GET | `/api/Transaction/GetById/{id}` | UUID ile durum | MVP |
| GET | `/api/Transaction/Get/Get?id=…` | id / transactionNo alternatif sorgusu | İhtiyaç halinde |
| GET | `/api/Transaction/GetByTransactionNo/{transactionNo}` | int64 numarayla sorgu | Operasyon |
| GET | `/api/Transaction/GetTransactionsByDateRange/{startDate}/{endDate}` | Tarih aralığı listesi | S09 |
| POST | `/api/MasterpassV2/Refund` | İade; yetki/semantik teyidi gerekir | S08 |
| POST | `/api/MasterpassV2/Void` | İptal; yetki/zaman penceresi teyidi gerekir | S08 |
| POST | `/api/Transaction/ApplyInstallment` | Taksit tanımı şemada var; kapsam dışı | Sonraki keşif |

`Transaction/Complete` ve Masterpass complete uçları şemada var; hosted checkout entegrasyonunda kendiliğinden çağrılacak uçlar değildir. Kart/3DS tamamlamasını sağlayıcının akışına bırak; rollerini Q kaydıyla netleştir.

## Authentication

```json
{
  "UserName": "<server-side-secret>",
  "Password": "<server-side-secret>"
}
```

Şema 200 cevabının token gövdesini tanımlamıyor. Demo `token`, `accessToken`, `data.token`, `data.accessToken` veya ham string okumayı deniyor. Bu toleransı resmi sözleşme gibi kabul etme. S01 başarılı/başarısız fixtureları alıp tek doğrulanmış parser oluşturur. Token TTL, refresh, kapsam ve hata kodları **Q03** teyidine bağlı. Token sunucuda tutulur; loga ve tarayıcıya dönmez.

## Transaction/Add

| Alan | Şema | Proje kuralı |
|---|---|---|
| CustomerFirstName / CustomerLastName | string, required, minLength 1 | Trim + izinli uzunluk; kişisel veri minimize edilir |
| CustomerPhone | string, required, minLength 1 | Sağlayıcı formatına normalize; demo 90 ile 12 rakam bekliyor |
| Amount | number/double; required listesinde değil | Pozitif, sunucu siparişinden; decimal ile doğrulanır |
| OrderNo | nullable string | Bizim uygulamada zorunlu, kalıcı, kapsamı tenant ile tanımlı |
| SubMerchantId | nullable UUID | Yetkili mappingden; istemci seçimi tek başına güvenilmez |
| CallbackUrl | nullable string | Bizim ortamımızda sabit, HTTPS, allowlist |
| TransactionNo | integer/int64 | Demo göndermiyor; sağlayıcı kullanımını teyit et |
| TransactionDetails | nullable array | Demo göndermiyor; MVP tek satıcı kapsamı |

Örnek **şematik** istek; credential, gerçek telefon veya gerçek merchant içermez:

```json
{
  "OrderNo": "ORDER-SANDBOX-0001",
  "Amount": 125.50,
  "CustomerFirstName": "Test",
  "CustomerLastName": "Musteri",
  "CustomerPhone": "<authorized-sandbox-phone>",
  "SubMerchantId": "00000000-0000-4000-8000-000000000001",
  "CallbackUrl": "https://sandbox.example.com/payments/callback"
}
```

Şema `TransactionDtoApiResult` döndürür. Demo `isSuccess` ve `data.id` / `data.paymentUrl` üzerinden sonuç çıkarır. UUID ve ödeme URL’si boşsa başarısız/şema uyuşmazlığı olarak ele al. HTTP 2xx tek başına iş başarısı değildir. `PaymentUrl` capability token taşıyabilir: URL’yi loglama, analitik sistemine veya referrer üzerinden başka siteye aktarma.

## Durum sorgusu ve ID eşleştirme

```http
GET /galaksipay/api/Transaction/GetById/{id}
Authorization: Bearer <server-token>
Accept: application/json
```

E-postada `PaymentId`, demo modelinde `TransactionId`, şemada `TransactionDto.Id` geçiyor. Add cevabının `data.id` değeri GetById için güçlü adaydır; **Q02: aynı kimlik olduğunun sağlayıcı teyidi** ve sandbox roundtrip testi gerekir. `TransactionNo` int64 ayrı bir iş numarasıdır; JavaScript safe integer sınırına dikkat et, gerektiğinde string olarak taşı.

Sorgu sonucunda Id, OrderNo, Amount, IsPaid, TransactionStatusName, SubMerchantId, EffectiveMerchantId ve referansları incele. Kendi kayıtlarınla eşleştirmeden siparişi paid yapma. DTO token ve ham Masterpass alanları da içeriyor; UIya yalnızca allowlist DTO dön.

## GetSubMerchants

Şema: `Id`, `Name`, `Code`, `Description`, `IsActive`, `HasMasterpassSetting`. Demo yalnızca Masterpass ayarı olmayanı UI’da kapatıyor. Yeni backend ayrıca aktiflik, tenant sahipliği ve yerel mapping kontrolü yapmalı. Sayfalama, tenant kapsamı ve boş liste anlamı belgede net değil (**Q05**).

## İade ve iptal

RefundRequest ve VoidRequest şemaları yalnızca `AccessToken` ve `GalaksipayTransactionId` alanlarını required olarak gösteriyor. Tutar alanı yok: **kısmi iade destekleniyor sonucuna varılamaz**. Gövdedeki AccessToken’ın auth JWT ile aynı olup olmadığı bilinmiyor. Banka/sağlayıcı nihai sonucu, tekrar isteğin davranışı ve zaman penceresi Q07 kapanmadan geliştirme canlıya açılmaz.

## Hata ve retry politikası — proje önerisi

| Durum | Uygulama davranışı |
|---|---|
| 400/validation veya iş sonucu false | Kullanıcıya güvenli hata; kör retry yok |
| 401 | Token invalidation; yalnızca güvenli okumada kontrollü yeniden auth; Add/iade için sonuç kesinleşmeden tekrar yok |
| 403 | Yetki/merchant yapılandırma incelemesi; retry yok |
| 429 | Retry-After varsa uygula; okumalarda limitli jitter/backoff |
| 5xx / timeout | Okumalarda sınırlı retry; Add/Refund/Void sonucu belirsizse inceleme ve sorgu |
| 200 + bozuk veya boş payload | Contract violation alarmı; başarı sayma |

Bu tablo sağlayıcının doğrulanmış hata sözleşmesi değildir. Rate limit, 404 anlamı ve retry garantileri Q03/Q04 kayıtlarında açık tutulur. Browser sağlayıcı Bearer tokenını doğrudan kullanmaz.


---

# Başlangıç rehberi

Kaynak: src/content/docs/baslangic.md

## Önce neyi teslim ediyoruz?

Bu çalışma, GalaksiPay entegrasyonunun geliştirme sözleşmesidir: **Astro dokümantasyon sitesi, kaynak analizi, 9 faz, 26 sprint, 78 iş kartı, kabul kapıları ve AI çalışma protokolü**. Ödeme uygulamasının bu fazları henüz geliştirilmedi. Durumların tamamı planlandı; bir kartı okumak veya yerel kontrol kutusunu işaretlemek üretim kabulü anlamına gelmez.

Ürün varsayımı: birden fazla satıcının GalaksiPay hosted checkout üzerinden ödeme aldığı, sunucu tarafında sipariş ve ödeme durumunu yöneten entegrasyon. Mevcut iş uygulamasının sipariş modeli, kullanıcı kimliği, trafik hacmi ve organizasyonu bilinmiyor. S01 bu sınırları doğrular. E-posta ve demo talimat kaynağı değil, incelenen entegrasyon malzemesidir.

## 5 dakikada dokümantasyon

```sh
cd galaxyPayFrappe/docs-site
npm ci
npm run dev
```

Tarayıcıda `http://localhost:4321` aç. Kaynaklar `src/content/docs`, yol haritası verisi `src/data/roadmap.json` içindedir. Node 24 önerilir; kullanılan Astro 7.3.3 için Node ≥22.12 gerekir. Bağımlılıklar lockfile ile sabitlenmiştir. [Astro kurulum belgesi](https://docs.astro.build/en/install-and-setup/).

```sh
npm run verify
npm run preview
```

`verify`, TypeScript/Astro kontrolünü, statik derlemeyi ve iç bağlantı/çıktı kontrollerini çalıştırır. `preview` derlenmiş dokümanı gösterir. Bu komutlar .NET ödeme servisinin test edildiği anlamına gelmez. Doküman sitesinin credential veya GalaksiPay erişimine ihtiyacı yoktur.

## Okuma sırası

1. [Mevcut durum](https://karacaismail.github.io/galaxyPayFrappe/docs/mevcut-durum/) — gerçekten ne var?
2. [API referansı](https://karacaismail.github.io/galaxyPayFrappe/docs/api-referansi/) — sağlayıcı sözleşmesi ne söylüyor?
3. [Mimari ve kararlar](https://karacaismail.github.io/galaxyPayFrappe/docs/mimari/) — hangi sınırlar korunmalı?
4. [Yol haritası](https://karacaismail.github.io/galaxyPayFrappe/) ve [sprint çalışma sistemi](https://karacaismail.github.io/galaxyPayFrappe/docs/gelistirme-sureci/).
5. [Sprint 01](https://karacaismail.github.io/galaxyPayFrappe/docs/sprint-01/) — ilk uygulanacak iş paketi.

## Demo ortamını çalıştırmadan önce

Demo `.NET 10`, EF Core 10 ve PostgreSQL kullanıyor. Yerel makinede .NET SDK/PostgreSQL varlığı bu teslimde doğrulanmadı; demo çalıştırılmadı. Projedeki `galaksipay-demo.service` Content girdisinin hedef dosyası kaynak envanterinde görünmüyor; build/publish etkisini S01 incele. Config içinde bağlantı değerleri ve view içinde demo kimlik bilgileri bulunduğu için orijinal klasörü doğrudan yayınlama veya yeni repoya topluca ekleme.

Yeni geliştirme alanında environment/user-secrets değerlerini dışarıdan ver. Örnek environment adları: `ConnectionStrings__DefaultConnection`, `PaymentDemo__GalaksipayApiBaseUrl`, `PaymentDemo__CallbackUrl`. Kimlik bilgileri için yeni adaptörde secret store kullan; örnek değeri dokümana koyma. Development profili TLS doğrulamasını kaldırıyor; güvenilir yerel sertifika kullanacak şekilde düzeltmeden dış sisteme bağlama.

Ortamlar: **local/mock → sandbox → staging → sınırlı pilot → production**. Localhost callback sağlayıcı tarafından erişilemez; sandbox callback için erişilebilir HTTPS alanı veya onaylı tünel gerekir. Ortama özel veri, merchant ve credential ayrı tutulur.

## Repo sınırları

- `GalaksipayDemo/`: incelenen sağlayıcı örneği; bu teslimde değiştirilmedi.
- `docs-site/`: çalışan Astro sitesi, Markdown dokümanlar ve plan verisi.
- Test kartı dosyası: özel test materyali; build içine kopyalanmaz.
- Önerilen sonraki ürün klasörleri: `apps/web`, `services/payments`, `tests/contracts`, `infra`. Bunlar henüz oluşturulmuş servisler değildir.

[Doküman paketini Markdown olarak indir](https://karacaismail.github.io/galaxyPayFrappe/downloads/galaksipay-playbook.md). Paket entegrasyon secretları içermez; yine de mimari bilgi taşıdığı için dış yayında erişim politikasını belirle.


---

# Callback güvenliği ve kurtarma

Kaynak: src/content/docs/callback.md

## İki farklı kanal

**Sunucudan callback** finansal değişimi tetikleyebilen dış girdidir; kimlik ve eşleşme doğrulaması gerektirir. **Tarayıcı postMessage** güvenilir finansal kayıt değildir. `event.origin` izin listesi, `event.source === popupRef` ve aktif attempt bağlantısı kontrol edilse de mesaj yalnızca kendi durum endpointini yeniletir. İstemciden gelen `isPaid` hiçbir sipariş durumunu doğrudan güncellemez.

## Callback sözleşmesinin bilinen bölümü

Demo modeli aşağıdaki zarfı tüketiyor; örnek sentetiktir ve resmi teslim garantisi değildir:

```json
{
  "isSuccess": true,
  "message": null,
  "errorCode": null,
  "data": {
    "id": "00000000-0000-4000-8000-000000000002",
    "isPaid": true,
    "orderNo": "ORDER-SANDBOX-0001",
    "amount": 125.50,
    "transactionStatusName": "PaymentReceived"
  }
}
```

`isSuccess` zarf sonucu ile `data.isPaid` tahsilat durumunu karıştırma. Kimlik, event ID, imza başlığı, algoritma, canonicalization, zaman toleransı, key rotation, retry süresi, ACK kodu ve timeout **belgelenmemiştir**. HMAC varmış gibi bir header adı uydurulmaz.

## Önerilen alım algoritması

1. HTTPS, izinli method/content-type, payload boyutu ve yapısal doğrulama uygula.
2. Sağlayıcı imza protokolü varsa **ham body** üzerinden resmi algoritmayla doğrula; replay/timestamp/key rotation kontrollerini uygula.
3. Doğrulanmış imza yoksa callbacki ödeme kanıtı sayma. Sağlayıcıyla mutabık bir teslim kontrolü + bilinen attempt için yetkili durum sorgusu kullan; internetten rastgele UUID sorgusuna rate limit uygula. IP allowlist ek savunmadır, tek başına ödeme doğrulaması değildir.
4. Inbox olayını atomik olarak kalıcılaştır. DB yazılamadıysa başarı ACK dönme. Teyit edilen başarı ACK’i yalnızca kalıcı alımdan sonra dön; mevcut demo 200 JSON dönüyor ama sağlayıcının beklediği sözleşme Q01 ile netleşecek.
5. Worker kendi provider tokenı ile sorgular. OrderNo/UUID/tutar/merchant eşleşmezse karantinaya al.
6. Domain geçişi ve sipariş yan etkisini aynı transaction/outbox sınırında tekilleştir.
7. Kontrollü retry bittiğinde DLQ/inceleme vakası oluştur; backlog yaşı için alarm üret.

## Yarış durumları

Callback, Add cevabı yerel DB’ye yazılmadan gelebilir. Yetkisiz sipariş yaratmak yerine “eşleşme bekliyor” inbox kaydı tut; kayıt penceresinden sonra provider referansıyla yeniden dene. Bilinmeyen OrderNo veya tenant sadece callbacke dayanarak oluşturulmaz.

Callback ile polling aynı anda success bulursa optimistic concurrency / satır kilidi + unique business effect tek güncelleme üretir. Success sonrasında gelen pending/failed bildirimleri durumu geri almaz; çelişki audit ve gerekirse inceleme doğurur.

## Kurtarma ve canlı çıkış

Kayıp callback: süresi gelen açık attemptleri kontrollü sorgula. Önerilen sorgu aralıkları (sağlayıcı limit teyidine bağlı) 5, 15, 30, 60 saniye; ardından operasyonel uzun aralıklı job. Müşteri tarayıcısı doğrudan provider polling yapmaz; uygulama endpointi rate-limit edilir. Süre eşiği sonunda otomatik fail yerine inceleme durumu kullan.

Q01/Q04/Q06 çözümlenmeden internetten bildirim kabul eden akış “üretime hazır” olarak işaretlenmez. Mock çalışması ve sandbox E2E bu kararlardan bağımsız ilerleyebilir. [Test matrisi](https://karacaismail.github.io/galaxyPayFrappe/docs/test-stratejisi/) ve [güvenlik](https://karacaismail.github.io/galaxyPayFrappe/docs/guvenlik/) sayfaları ilgili kanıtları tanımlar.


---

# Sprint çalışma sistemi

Kaynak: src/content/docs/gelistirme-sureci.md

## Sprint ritmi

2 haftalık sprint. Gün 1: kapasite, DoR, risk ve demo hedefi; gün 2–7: küçük dikey dilimler + review; gün 8: entegrasyon ve negatif senaryolar; gün 9: UAT, docs ve release provası; gün 10: demo, kabul, retrospektif ve sonraki sprintin hazırlığı. Her gün kısa engel kontrolü; sprint ortasında scope değişirse eşdeğer kapasite çıkarılır.

S01–S04 kritik yol: **sözleşme → güvenli start → doğrulanmış sonuç → pilot kabul**. İleri fazlar önceki kapı kanıtını kullanır. Sağlayıcı cevabı beklenirken mock/test/docs işi devam eder; kapı gereksinimi tamamlandı gibi sayılmaz.

## Definition of Ready

- İş kartı tek kullanıcı/developer sonucuna odaklı; kapsam dışı yazılı.
- Girdi sözleşmesi, dosya sınırı ve en az bir negatif senaryo tanımlı.
- Kabul kriteri ölçülebilir; owner ve reviewer rolleri belli.
- Secret gereksinimi güvenli kanalda; test fixtureları sentetik.
- Bağımlılıklar linkli; blokaj varsa çalışma için mock sınırı belirli.
- İş 1–3 günlük dilimlere bölünebilir; karttaki 4 günlük iş gerekirse iki PR olur.

## Definition of Done

Kod review edildi; ilgili unit/contract/integration/E2E kanıtı geçti; para/tenant/callback negatif testleri korundu; secret/dependency taraması geçti; docs ve ADR güncellendi; loglar maskeli; migration/rollback etkisi yazılı; gerçek kapsam ve bilinen limitler belirtildi. Üretim davranışı değiştiren kartta gözlem metriği ve rollback tetikleyicisi vardır. “AI tamam dedi” kabul kanıtı değildir.

## PR ve CI

Önerilen branch biçimi `feat/GP-011-contract-baseline`. Bir PR bir davranışı değiştirir; üretilmiş dosyalar ayrı anlaşılır bölümde tutulur. PR açıklaması: sorun → sonuç → test kanıtı → risk/geri dönüş → GP/ADR bağlantısı. Para ve kimlik değişikliklerinde ikinci bir yetkin reviewer gerekir; küçük doküman düzeltmelerinde normal review yeterlidir.

CI sırası: format/type → secret/SAST/dependency → unit → DB integration/migration → provider contract fixture → docs build/link → kritik mock E2E. Sandbox UAT ayrı credentiallı korumalı ortamda çalışır; her PR sağlayıcıya gerçek ödeme göndermemelidir. Yük testi yalnızca onaylı hedefte.

## İş durumu ve sahiplik

Backlog → Ready → In progress → Review → Verified → Accepted. Blocked bir bayraktır; neden, bağımlı Q kaydı ve sonraki kontrol tarihi içerir. Portalın kontrol kutuları sadece o tarayıcıdaki kişisel hazırlık notlarıdır, bu iş akışının paylaşılan kaydı değildir.

| Karar | Yapan | Hesap veren | Danışılan |
|---|---|---|---|
| Scope ve sıra | PO + TL | PO | Finans, destek |
| Mimari/sözleşme | BE + TL | TL | Sağlayıcı, güvenlik |
| Test kabulü | QA | TL | PO |
| Finansal eşleştirme/iade | BE + Finans | Finans sahibi | Sağlayıcı |
| Canlı çıkış | Platform + TL | Ürün/hizmet sahibi | Güvenlik, finans |
| Veri/saklama/PCI kapsamı | Hukuk + Güvenlik | İlgili kontrol sahibi | Sağlayıcı/uzman |

İsimler henüz atanmadı; S01 kickoffta bu rol tablosu gerçek isimlerle tamamlanır.

## Sprint kapanışı ve yeniden tahmin

Planlanan/bitirilen kart, taşınan iş, bekleme günü, defect ve gerçek kişi-gün kaydedilir. Demo kayıtları ve test raporları evidence klasörüne bağlanır. S02/S04’te 10 kişi-günlük sprint tahmini gerçek hızla yenilenir. Eksik kapı varsa bir sonraki sprintin bağımsız keşfi yapılabilir, ancak kapıya bağlı yayına geçilmez.


---

# Güvenlik ve veri sınırları

Kaynak: src/content/docs/guvenlik.md

## MVPden başlayan kontroller

- Credential, token ve API çağrıları sunucuda; environment secret store; test/prod ayrımı ve rotasyon.
- Backend authentication/authorization, order ownership, tenant filtresi ve merchant allowlist.
- Callback doğrulama/sorgu, replay ve duplicate koruması; browser mesajı güven sinyali değildir.
- Sunucu tutar hesabı, decimal para, eşzamanlılık ve idempotency.
- HTTPS sertifika doğrulaması; güvenilir proxy listesi; sabit callback URL; PaymentUrl host allowlist.
- Input boyut/şema sınırı; session tabanlı komutlarda CSRF politikası; CORS origin sınırı.
- Log/response field allowlist; raw body erişim sınırı ve asgari saklama; dependency/secret taraması.
- Yedek, restore provası, alarm sorumlusu ve deployment geri dönüşü.

S14 güvenliğe başlama tarihi değildir; S01–S04 kontrollerinin bağımsız test ve yönetişimle derinleştirilmesidir. HTTPS, erişim kontrolü, veri doğrulama ve güvenli hata tasarımı için [OWASP REST rehberi](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html) referanstır.

## Kart ve kişisel veri

Kart PAN/CVV saklama veya kendi formunda toplama bu tasarımda yok. Hosted checkout kullanımı PCI yükümlülüklerini kendiliğinden ortadan kaldırmaz; doğru kapsamı sağlayıcı, banka ve ilgili uzmanla teyit et. [PCI SSC merchant kaynakları](https://www.pcisecuritystandards.org/merchants/) değerlendirmeye başlangıçtır; bu plan PCI sertifikasyonu beyanı değildir.

Telefon, ad/soyad ve işlem referansları amaç ve rol bazlı işlenir. Dokümanlarda gerçek kişi/test hesabı telefonları çoğaltılmaz. Uygulanacak KVKK, saklama, aktarım ve veri sorumluluğu kararları hukuk/veri sahibi tarafından alınmalıdır; burada hukuki uygunluk hükmü veya keyfi zorunlu saklama süresi verilmez.

## Uygulama önerileri

PaymentUrl token taşıyabilir; `Referrer-Policy: no-referrer`, üçüncü taraf script minimizasyonu ve token redaction kullan. API response’da ham MasterpassResponseRawJson, credential veya auth token dönme. Cookie kullanılıyorsa Secure/HttpOnly ve iş akışına uygun SameSite belirle. Callbackin CSRF istisnası kullanıcı komutlarına yayılmamalı; callback ayrı kimlik doğrulama modeline sahip.

Portal statik ve herkese açık bir geliştirme planıdır; GitHub Pages üzerinde yayınlanır. Robots noindex erişim kontrolü sayılmaz. Özel dokümanlar için host seviyesinde kimlik/erişim politikası gerekir. Demo credentialları ve özel kaynak dosyaları yayına dahil değildir. Sağlayıcının 18 dummy test kartı v2 test verisi referansında açıkça sandbox olarak etiketlidir; gerçek kart verisi yayımlanmaz.

## Erişilebilirlik kalite hedefi

Metin, kod, badge, tablo ve gezinme dahil **minimum 1rem**; root varsayılanı 16px, kullanıcı font tercihi korunur. Klavye odağı, atla bağlantısı, başlık sırası, yeterli kontrast, responsive tablolar ve azaltılmış hareket desteği. WCAG 2.2 AA hedefi bir denetim sonucuyla desteklenmelidir; yalnızca font boyutu uyum kanıtı değildir. [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/).


---

# Faz kabul kapıları

Kaynak: src/content/docs/kabul-kapilari.md

## Kapılar ve çıkış kanıtı

| Kapı | Sprint | Asgari kanıt | Karar sahibi |
|---|---|---|---|
| G1 · MVP | S04 | TC01–16, callback güven modeli, idempotency/UNKNOWN çözümü, secret sınırı, merchant aktivasyonu, alarm/restore/rollback | TL + PO + Operasyon + Finans |
| G2 · Post-MVP | S07 | İki merchant izolasyonu, cüzdan/doğrudan UAT, erişilebilirlik ve destek vaka çözümü | PO + QA + Operasyon |
| G3 · Finans | S10 | İade/iptal kontrollü senaryo, günlük mutabakat ve örnek dönem kapanışı | Finans + TL |
| G4 · Dayanıklılık | S13 | Worker recovery, 2x hedef yük, ölçülen restore, kademeli rollout | Platform + TL |
| G5 · Yönetişim | S16 | Açık kritik/yüksek güvenlik bulgusu 0, retention, erişim review, SBOM ve audit | Güvenlik + veri sahibi |
| G6 · DX | S19 | Contract breaking gate, derlenen SDK örneği, ≤30 dk onboarding, docs görev testi | TL + DX |
| G7 · Enterprise | S22 | SSO/MFA, görev ayrılığı, tenant izolasyonu, hizmet sahipliği ve kabul | Hizmet sahibi + Güvenlik |
| G8 · Maturity | S25 | ≥90 gün metrik, bağımsız örnekleme, 5 alanda ≥2/3, kritik açık 0 | PO + bağımsız reviewer |
| G9 · Sürekli gelişim | S26 ve sonrası | Ölçülen deney, maliyet/değer kararı, sonraki iki sprintin DoR’ı | PO + TL |

## G1 iki ayrı karardır

**Sandbox MVP kabulü:** kritik ödeme/test akışı sandbox veya açıkça belirtilen mockta çalışıyor; sağlayıcı eksikleri görünür. **Canlı pilot kabulü:** Q01/02/03/04/05/06/08/10/11/12 gereksinimleri gerekli kapsamda teyitli; prod credential, satıcı, limitler ve erişilebilir callback hazır; operasyon ve finans sorumlusu var. Sandbox kabulü otomatik üretim izni değildir. İlk pilot sınırlı satıcı/hacim ve kill switch ile açılır.

## Maturity skoru

0 = tanımlı değil/kanıt yok. 1 = dokümante ve sahipli. 2 = uygulanmış, test edilmiş, en az 90 günlük gözlemle destekli. 3 = düzenli ölçülen, tatbikat ve bağımsız review ile iyileştirilen. Alanlar: ödeme/finans doğruluğu, güvenlik/veri, güvenilirlik/işletim, teslim/DX, ürün/yönetişim. Ortalamayla kritik zayıflık gizlenmez; her alan en az 2 olmalıdır. “Enterprise grade” ve “maturity ready” bu projenin ölçütleridir, dış sertifika değildir.

## Karar tutanağı

Kapı ID, sürüm/commit, ortam, kanıt bağlantıları, açık risk/istisna, karar (go/no-go/koşullu sandbox), karar sahipleri, tarih, gözlem penceresi ve geri dönüş tetikleri. Hiçbir kart şimdiden kabul edilmiş değildir. Sonraki faz keşfi yapılabilir ama karşılanmayan kapıdan canlı özellik sızdırılmaz.


---

# Ürün kapsamı ve başarı ölçütleri

Kaynak: src/content/docs/kapsam.md

## Ürün hedefi

Yetkili bir satıcı için ödeme oluştur; müşteriyi GalaksiPay ödeme sayfasına yönlendir; sonucu güvenilir biçimde siparişe işle; belirsiz ve başarısız durumları operasyonun çözebileceği şekilde izle. İlk sürüm **hosted checkout** yaklaşımıyla kart verisini bizim UI/API katmanımızdan uzak tutar.

## Kullanıcılar ve temel işler

| Rol | Yapacağı iş | Başarı kanıtı |
|---|---|---|
| Müşteri | Öde, geri dön, sonucu öğren | İki kez tıklama tek attempt; yenileme doğru sonucu gösterir |
| Satıcı | Kendi ödemelerini gör | Başka satıcı/tenant işlemi erişilemez |
| Destek | Sonucu araştır | Korelasyon ve sağlayıcı ID ile takip edilebilir |
| Finans | İade, fark ve dönem raporu | Onay, tutar sınırı ve kaynak eşleşmesi |
| Geliştirici | Akışı yerelde üret, küçük değişiklik teslim et | Mock, contract, test ve docs tek görevde |
| Operasyon | Kesinti ve gecikme yönet | Alarm sahibi, kill switch ve restore kanıtı |

## Faz 1 kapsamı

Dahil: sipariş sahibi doğrulama; sunucu tutar hesabı; merchant izin kontrolü; idempotent start; PaymentUrl allowlist; hosted ödeme; kalıcı inbox; doğrulanmış durum sorgusu; UI pending/success/failure/review; basit reconciliation; maskeli gözlemlenebilirlik; CI testleri; pilot runbook; geri yükleme provası.

Kapsam dışı: bizim kart saklamamız, kendi cüzdanımız, çoklu ödeme sağlayıcı yönlendirmesi, abonelik, otomatik parçalı dağıtım, kredi verme, çoklu para birimi, gelişmiş BI ve müşteri destek sistemi inşası. Bunlar gelecekte doğrulanmış ihtiyaç ve sağlayıcı desteği ile ele alınır. MVP iade otomasyonu içermez; canlı pilot öncesi sağlayıcı/finans üzerinden kontrollü manuel iade sorumlusu ve prosedürü gerekir.

## Varsayımlar ve karar ihtiyacı

- **A01**: Hosted checkout + tek ödeme sağlayıcı. Ürün sahibi S01 sonunda onaylar.
- **A02**: Sipariş başına tek satıcı/tek para birimi (TRY önerisi). Çok satıcılı sepet varsa ödeme parçalama/atomiklik yeniden tasarlanır.
- **A03**: Mevcut .NET bilgisinden yararlanmak için yeni payment backend .NET 10 + PostgreSQL. Astro bu teslimde dokümantasyon katmanıdır; ödeme backendini statik siteye taşımıyoruz.
- **A04**: Kullanıcı/tenant kimliği mevcut iş uygulamasından güvenilir sunucu oturumu ile gelir; uygulama yoksa kimlik epic’i S01 planına eklenir ve tahmin yenilenir.
- **A05**: 2 tam zamanlı geliştirici + 0,5 QA + 0,25 Platform + 0,25 PO; finans/güvenlik/hukuk konu bazlı katkı verir. Bir kişi çalışacaksa bu takvim geçerli değildir.

## Takvim ve kapasite

Sprint = 2 hafta. 2 geliştirici × 10 iş günü × %70 odak = yaklaşık **14 geliştirme kişi-günü**. Her sprint 3 iş kartı için toplam 10 kişi-gün kaba geliştirme tahmini, 4 gün entegrasyon/review payı içerir. QA, platform, iş sahibi zamanı bu geliştirme puanlarına dahil değildir. Hastalık, resmi tatil ve sağlayıcı bekleme süresi ayrıca eklenir.

MVP 4 sprint / 8 hafta; ilk olgunluk değerlendirmesi S25 / 50 hafta; ilk sürekli gelişim döngüsüyle plan 26 sprint / 52 hafta. Bu bir taahhüt değildir. S02 ve S04 sonunda gerçek çevrim süresiyle yeniden tahmin edilir. S23–S25 için 90 günlük ölçüm penceresi dolmadıysa olgunluk kapısı ileri kayar.

## Başarı ölçütleri

MVP: kritik akış testlerinin %100 geçmesi; yinelenen callbackte 0 çift iş etkisi; yetkisiz merchant testlerinde 0 erişim; ödenmiş siparişi yanlış geriye götüren 0 geçiş; açık P0/P1 = 0. Gerçek ödeme dönüşüm oranı sağlayıcı/banka/UX etkileriyle ölçülür, sabit başarı oranı vaat edilmez.

Sonraki hedefler öneridir: iç durum API p95 ≤500 ms; hizmet SLO %99,9; RPO ≤15 dk / RTO ≤60 dk; yeni geliştirici ilk mock akışı ≤30 dk. Ölçüm kapsamları [operasyon](https://karacaismail.github.io/galaxyPayFrappe/docs/operasyon/) ve [kabul kapıları](https://karacaismail.github.io/galaxyPayFrappe/docs/kabul-kapilari/) sayfalarında tanımlıdır.


---

# Kaynaklar ve izlenebilirlik

Kaynak: src/content/docs/kaynaklar.md

## Kaynaklar

- **SRC01 · Kullanıcı yazışması:** 17 Eylül 2026 demo paylaşımı; 18/26/31 Ağustos mesajları. Ödeme linki, callback, PaymentId, SubMerchantId, test ve §2.3 bağımlılığı. Metin kullanıcı tarafından sağlandı.
- **SRC02 · Yerel demo:** `GalaksipayDemo/Galaksipay.Demo`, 18 Eylül 2026 statik inceleme. Controller, service, models, Program, view ve migration envanteri.
- **SRC03 · Test OpenAPI:** [ham şema](https://testapi.galaksipay.com/galaksipay/swagger/v1/swagger.json), 18 Eylül 2026 HTTP 200. Şema alanları/yolları doğrulandı; kimlik doğrulama ve ödeme çalıştırılmadı. [Seçilmiş snapshot](https://karacaismail.github.io/galaxyPayFrappe/downloads/provider-contract.json).
- **SRC04 · Ekran görüntüleri:** e-posta tarihi ve demo klasör yapısı için bağlam; eklerin içeriklerinin yerine geçmez.
- **SRC05 · Astro:** [kurulum](https://docs.astro.build/en/install-and-setup/), 18 Eylül 2026. Uygulanan sürüm package-lock ile sabit.
- **SRC06 · Güvenlik referansı:** [OWASP REST](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html), teknik kontrol rehberi.
- **SRC07 · PCI değerlendirme başlangıcı:** [PCI SSC merchant kaynakları](https://www.pcisecuritystandards.org/merchants/), kapsam teyidi için.
- **SRC08 · Erişilebilirlik:** [WCAG 2.2](https://www.w3.org/TR/WCAG22/), kalite hedefi için.

## İhtiyaç → iş → kanıt

| İhtiyaç | Kaynak | Sprint / test |
|---|---|---|
| Ödeme linki oluştur/aç | SRC01/02/03 | S02 / TC01, TC04, TC15 |
| Callback POST al | SRC01/02 | S03 / TC06–TC10, TC12 |
| PaymentId ile ayrıca sorgula | SRC01/03 | S03 / Q02 + TC08 |
| Sub-merchant listele ve yönlendir | SRC01/02/03 | S02, S05 / TC14 |
| Satıcı §2.3 bilgilerini temin et | SRC01; asıl belge eksik | S01 talep, S05 / Q10 |
| Cüzdan ve doğrudan kart | SRC01/02 | S04, S06 / ayrı UAT |
| İade ve iptal | SRC03; ürün önerisi | S08 / Q07 |
| Astro ve min 1rem | Kullanıcı talebi | Bu portal; S19 ürün DX genişlemesi |
| Vibecoding sprint akışı | Kullanıcı talebi | AI playbook + her sprint istemi |
| Enterprise / maturity | Kullanıcı talebi; proje önerisi | S20–S25 / G7, G8 |

## Bilinen eksikler

Entegrasyon dokümanının asıl eki, sağlayıcı üretim sözleşmesi, erişim/limit/SLA bilgileri, gerçek satıcı tanımları ve mevcut iş uygulaması kaynakları yok. Plan bunları açık bağımlılık olarak taşır. Roadmap kapsamı mevcut kanıtlarla olabildiğince tamamlandı; bilinmeyen sağlayıcı davranışları kesin bilgi gibi yazılmadı.

## Güncelleme disiplini

API snapshot ve dokümanlar değişen sözleşmeyle aynı PRda güncellenir. Her Q cevabı kaynak/tarih taşır; her release kapısı kanıta bağlanır. Roadmap verisinin tek kaynağı `src/data/roadmap.json`; sprint sayfalarının güncellenmesinde aynı ID/tarih korunur. İndirilebilir Markdown build sırasında mevcut içerikten üretilir.


---

# Mevcut durum ve boşluklar

Kaynak: src/content/docs/mevcut-durum.md

## Kanıt düzeyleri

**KOD**: yerel kaynakta görüldü; çalıştırma kanıtı değildir. **ŞEMA**: 18 Eylül 2026 tarihinde test Swagger JSON üzerinden görüldü; hesabın yetkisi veya iş kuralı garantisi değildir. **E-POSTA**: kullanıcı tarafından sağlanan 17 Eylül yazışması ve önceki mesajlar. **ÖNERİ**: bu projeye ait tasarım/plan. **TEYİT**: sağlayıcı veya ürün sahibi kararı bekleniyor.

## Kaynak envanteri

| Kaynak | Bulgular | Sınır |
|---|---|---|
| `GalaksipayDemo/Galaksipay.Demo/Services/GalaksipayApiClient.cs` | Auth, Transaction/Add, GetSubMerchants; Bearer, 30 sn timeout | Durum sorgulama metodu yok |
| `Controllers/PaymentController.cs` | Start, sub-merchants proxy, callback kaydı | Authz, callback imzası, tekilleştirme görünmüyor |
| `Models/PaymentCallbackRequest.cs` | IsSuccess + Data; Id, IsPaid, OrderNo, Amount ve referanslar | Callback resmi imza/yeniden teslim sözleşmesi yok |
| `Views/Payment/Index.cshtml` | Popup, postMessage, callback fallback; hazır demo credential alanları | Üretime taşınacak güven sınırı değil |
| `Program.cs` | PostgreSQL, başlangıç migration, Development TLS bypass, geniş proxy güveni | Üretim sertleştirmesi gerekli |
| `Models/StartPaymentRequest.cs` | Amount double; SubMerchantId nullable UUID | Para hesabında decimal/minor unit modeli gerekli |
| `Data/ApplicationDbContext.cs` | Callback record tablosu | Order/Attempt/Inbox/Outbox domaini bulunmuyor |
| Test kartı dosyası | Dosya mevcut | 18 dummy kart v2 test verisi referansında; fiili geçerliliği denenmedi |
| Entegrasyon dokümanı §2.1 / §2.3 | E-postada referans var | Asıl belge çalışma klasöründe yok |

## Öncelikli geliştirme boşlukları

| ID | Bulgu / etkisi | Plan |
|---|---|---|
| GAP01 | Credential view içinde hazır ve tarayıcıdan APIye taşınıyor; üretimde gizli veri sınırı yanlış | S01–S02, sunucu secret store ve rotasyon |
| GAP02 | Callback yalnızca Data/Id kontrolüyle kayıt alıyor; kaynağı ve sipariş eşleşmesi doğrulanmıyor | S03, inbox + yetkili sorgu |
| GAP03 | postMessage `event.origin` / `event.source` kontrol etmiyor; fallback `isPaid: true` üretebiliyor | S02–S03, mesaj yalnızca refresh tetikleyicisi |
| GAP04 | Her callback yeni GUID ile insert; yinelenen bildirimler çoğalıyor | S03, atomik tekilleştirme + iş etkisi benzersizliği |
| GAP05 | Amount istemciden geliyor; double→decimal dönüşümü var | S01–S02, sunucu sipariş toplamı ve kesin para tipi |
| GAP06 | OrderNo rastgele/zaman tabanlı; kalıcı ödeme niyeti ve idempotency yok | S02, unique key + request hash + attempt |
| GAP07 | Durum sorgulama demoda yok; callback kaybında kurtarma yok | S03, GetById ve sınırlandırılmış reconciliation |
| GAP08 | Development TLS doğrulaması kapalı; proxy listeleri temizlenmiş; hosttan callback türetilebiliyor | S01–S04, doğrulanmış TLS/proxy/host ve sabit callback |
| GAP09 | RawJson ve hata gövdeleri aktarılıyor; PII/token için allowlist yok | S01–S04, maskeleme + retention + güvenli hata |
| GAP10 | Migration uygulama açılışında; ayrı yetki/deploy aşaması yok | S04 asgari, S13 ileri release akışı |
| GAP11 | Merchant için UI kontrolü var; backend tenant/sahiplik yetkisi görünmüyor | S02 zorunlu, S05 ileri onboarding |
| GAP12 | Otomatik test ve pipeline dosyası kaynak envanterinde yok | S01–S04, contract/integration/E2E kapıları |

Bu bulgular statik incelemeye dayanır. Canlı sisteme saldırı, giriş yapma veya ödeme işlemi yapılmadı. Demo davranışı sağlayıcının üretim sisteminin güvenlik niteliği hakkında sonuç vermez.

## Yazışmadan doğrulanan iş bağlamı

Ödeme başlatınca dönen link açılır; sonuç CallbackUrl adresine POST edilir; PaymentId ile ayrıca sorgu yapılabilir. SubMerchantId gönderilirse ilgili satıcı kullanılır. İki dummy satıcı tanımlandığı, cüzdan için test hesabı olan telefon gerektiği ve test kartlarının zamanla değişebildiği belirtilmiş.

26 Ağustos mesajı: §2.1 bilgileri gönderilmeyecek, §2.3 bilgileri satıcılardan alınacak. Asıl alan listesi elimizde yok; KYC/IBAN/vergi alanlarını zorunlu sağlayıcı gereksinimi gibi uydurmuyoruz. 31 Ağustos mesajı gerçek satıcının sanal POS bilgilerini beklediklerini bildiriyor. Bu, S05 ve canlı pilot için dış bağımlılık.


---

# Mimari ve karar kayıtları

Kaynak: src/content/docs/mimari.md

## Hedef bileşenler — henüz geliştirilmedi

```text
Müşteri / Satıcı UI ──→ Uygulama API (kimlik + tenant + sipariş)
                             │
                      Payment Application
                      /        |         \
                PostgreSQL  Provider     Worker
                Order       Adapter      Inbox / sorgu / outbox
                Attempt        │             ↑
                Inbox          ↓             │
                Outbox      GalaksiPay ──→ Callback alımı
```

Astro portalı ayrı statik builddir ve bu finansal veri yolunda bulunmaz. Hosted checkout tarayıcıda açılır; provider auth ve muhasebe etkileri sunucudadır. Başlangıçta modüler monolit + PostgreSQL tercih edilir; çalışan modüllerin ölçülmüş ölçek ihtiyacı olmadan mikroservis/kuyruk kümesi eklenmez. Inbox/outbox ilk fazda DB tablosu ve worker olabilir.

## Sorumluluklar

| Modül | Sahip olduğu davranış | Bağımlılık sınırı |
|---|---|---|
| Orders | Sipariş toplamı, müşteri ve satıcı yetkisi | Provider DTO bilmez |
| Payments | Attempt, idempotency ve durum geçişleri | Provider arayüzünü kullanır |
| GalaksipayAdapter | Auth, Add, GetById ve hata dönüşümü | Domaini ham API yanıtıyla kirletmez |
| Callbacks | Dış girdi, doğrulama ve inbox | Siparişi doğrudan paid yapmaz |
| Reconciliation | Açık/belirsiz işlem ve finans farkları | Read-only provider sorgu + auditli domain komutu |
| Operations | Destek/finans rolleri ve kayıt erişimi | Tenant ve field allowlist zorunlu |

## ADR-001 · Hosted checkout

**Öneri / S01 onayı bekliyor.** Kart bilgisi sağlayıcının hosted arayüzünde girilir. Gerekçe: mevcut demo sözleşmesi, kart verisi temasını sınırlama ve daha küçük MVP. Bedel: sağlayıcı UX/erişilebilirliği ve yönlendirme davranışına bağımlılık. Kendi kart formu ve cüzdan saklama kapsam dışıdır. PCI kapsamı ayrıca değerlendirilir.

## ADR-002 · .NET + PostgreSQL, Astro dokümantasyon

**Öneri.** Demo .NET 10 ve EF/Npgsql kullanır; backend ekibi bu yoldan devam edebilir. Astro 7.3.3 statik doküman içindir. Yeni backend TypeScript istenirse yalnızca dosya çevirisi değil sözleşme/para/eşzamanlılık testleriyle yeni ADR gerekir. Veritabanı sürümü altyapı ve EF uyumluluk testiyle S01’de sabitlenir.

## ADR-003 · Sunucu doğrulaması ve yerel idempotency

**Öneri / MVP zorunlu kabul koşulu.** Finansal gerçek provider sorgusu + yerel sipariş eşleşmesiyle belirlenir. Idempotency atomik DB kısıtlarıyla sağlanır. Bedel: ek sorgu/worker ve belirsizliği yönetme ihtiyacı. Sağlayıcı idempotency garantisi olmadan “exactly once” vaat edilmez.

## ADR-004 · Kalıcı inbox/outbox

**Öneri.** Callback önce kalıcı yazılır; iş etkisi ve outbox aynı transactionda kaydolur. Ayrı broker başlangıçta şart değildir. Worker lease ve event/business dedup gerekir. S11’de gerçek trafik ve backlog gerekçe oluşturursa broker değerlendirilir.

## Karar değişikliği şablonu

Başlık / durum / tarih / karar sahibi / bağlam / değerlendirilen seçenekler / karar / sonuçlar / doğrulama testi / geri dönüş planı. Her ADR ilgili GP iş kartına bağlanır; superseded karar silinmez. Auth, para, tenant, callback veya prod secret sınırını değiştiren AI diff’i insan incelemesinden geçer.


---

# Ödeme akışı ve durum modeli

Kaynak: src/content/docs/odeme-akisi.md

## Hedef akış — önerilen tasarım

1. Müşteri mevcut sipariş için ödemeyi başlatır; backend oturum, tenant ve sahiplik doğrular.
2. Backend tutarı/satıcıyı kendi siparişinden hesaplar; kalıcı attempt + idempotency kaydı oluşturur.
3. Sunucu credential ile auth alır; `Transaction/Add` çağırır; UUID ve PaymentUrl saklanır.
4. Tarayıcı izinli sağlayıcı linkini açar. Popup engellenirse aynı linke üst pencere yönlendirme sunulur.
5. Sağlayıcı callback gönderir; backend kalıcı inbox kaydı alır. Tarayıcı postMessage yalnızca durum yenileme sinyalidir.
6. Worker yetkili `GetById` sorgusuyla kimlik, sipariş, tutar ve satıcı eşleşmesini doğrular.
7. Yerel transaction içinde attempt güncellenir; sipariş etkisi/outbox tekilleştirilir. UI kendi backendinden sonucu okur.
8. Callback kaybı veya belirsizlik varsa zamanlanmış sorgu aynı doğrulama hattından geçer.

## Durumlar — yerel domain, sağlayıcı enumu değil

| Durum | Anlamı | Çıkış |
|---|---|---|
| CREATED | Kalıcı intent var, sağlayıcı çağrısı henüz kesin değil | PENDING / UNKNOWN / FAILED |
| PENDING | Sağlayıcı işlem IDsi biliniyor, sonuç bekleniyor | SUCCEEDED / FAILED / REVIEW_REQUIRED |
| UNKNOWN | Add cevabı kayboldu; işlem oluşmuş olabilir | Sağlayıcı kanıtıyla PENDING / SUCCEEDED / FAILED / REVIEW_REQUIRED |
| SUCCEEDED | Yetkili sorgu + eşleşme ile ödeme doğrulandı | Yalnızca ayrı iade/iptal süreci; geç pending geriye taşımaz |
| FAILED | Sağlayıcının teyitli nihai başarısızlığı | Yeni ödeme girişimi ayrı attempt olarak açılır |
| REVIEW_REQUIRED | Çelişki, sync_error, eşleşmeyen tutar/satıcı veya tanımsız durum | Yetkili kanıt + kontrollü çözüm |

İade durumu ayrı aggregate/alan olarak tutulur; SUCCEEDED tahsilat tarihçesi silinmez. Link süresi dolması veya müşteri popupı kapatması finansal FAILED kanıtı değildir. Yerel zaman aşımı `UNKNOWN/REVIEW_REQUIRED` doğurabilir. FAILED sonrası gecikmiş doğrulanmış başarı varsa sıradan geçişle gizleme: reconciliation vakası aç, diğer denemeleri kontrol et, finansal gerçeği auditli düzelt.

## Sağlayıcı durum eşleştirmesi

Demoda `PaymentReceived`, `PaymentPending`, `PaymentStarted`, `ErrorReceived` isimleri görülüyor. Tam ve terminal enum listesi doğrulanmadı (**Q06**). `IsPaid=false` tek başına başarısızlık kanıtı olamaz. RRN/slip varlığı da tek başına başarı değildir; demodaki `sync_error` yorumu ihtilaf işaretidir. Q06 kapanana kadar bilinmeyen durumları incelemeye yönlendir.

## Idempotency ve atomiklik

Yerel benzersizlik: `(tenant_id, idempotency_key)`. Request hash sunucunun hesapladığı sipariş/satıcı/tutar/para birimi sürümünü içerir. Aynı anahtar + aynı hash mevcut sonucu döndürür; farklı hash conflict olur. SIPARIŞ başına etkin attempt kısıtı, satır kilidi veya eşdeğer DB mekanizmasıyla eşzamanlı startı engeller. Yalnızca butonu kapatmak yeterli değildir.

İstek sağlayıcıya gitti ama cevap gelmediyse, sağlayıcının idempotency desteği doğrulanmadan Add yeniden çağrılmaz. Önce bilinen UUID ile sorgu; UUID yoksa OrderNo ile arama garantisi olmadığı için sağlayıcı destek/reconciliation yolu gerekir. Bu, **Q04** için kritik canlı çıkış konusu.

Callback teslimi en az bir kez olabilir; exactly-once network varsayımı yapılmaz. Olay keyi mevcutsa kullan; yoksa doğrulanmış kimlik + olay tipi/sürümü gibi teyitli alanlardan dedup tasarla. Ham body hash yalnızca aynı gövdeyi ayırır, iş etkisini tek başına korumaz. Siparişe ödeme etkisi ve outbox için ayrıca benzersiz DB kısıtı gerekir. Sadece PaymentId üzerinden bütün bildirimleri tekilleştirmek pending→success güncellemesini kaybettirebilir.

## Güvenli kullanıcı mesajları

- Pending: “Ödeme sonucu doğrulanıyor. Bu sayfayı yenileyebilirsiniz.”
- Belirsiz: “Sonuç henüz doğrulanamadı. Yeniden ödeme başlatmadan önce durum kontrol ediliyor.”
- Başarılı: yalnızca backend doğruladıktan sonra “Ödemeniz alındı.”
- Doğrulanmış başarısız: güvenli sebep + yeni deneme eylemi; banka/secret içeriği yok.
- İnceleme: destek referansı göster; otomatik yeniden tahsilat yapma.


---

# Operasyon ve runbooklar

Kaynak: src/content/docs/operasyon.md

## İzlenecek sinyaller

| Sinyal | Neden | Önerilen başlangıç eşiği |
|---|---|---|
| Pending/unknown yaşı | Kayıp callback veya sağlayıcı gecikmesi | İş süresine göre belirle; ilk öneri 15 dk operasyon incelemesi |
| Callback inbox gecikmesi | Worker/DB problemi | p95 ve en yaşlı iş; pilotta baz ölçüm |
| Add timeout / şema hatası | Belirsiz tahsilat riski | Her UNKNOWN vaka; kümelenme P1 değerlendirmesi |
| İşlem/tutar/merchant farkı | Finansal doğruluk | Her fark vaka oluşturur |
| Duplicate business effect | Kritik invariant ihlali | 0 hedef; tek olay bile durdurma nedeni |
| DLQ ve queue age | İş kaybı/tekrar sorunu | Sahipli alarm ve artış hızı |
| 401/403/429/5xx | Kimlik, limit veya kesinti | Ortam ve merchant bazlı oran |

Log alanları: correlation_id, internal_attempt_id, masked provider reference, tenant context, operation, duration, safe error class. Telefon/ad, token, PaymentUrl, PAN/CVV ve ham provider gövdesi loga yazılmaz. Trace başlıklarının PII taşımaması gerekir.

## Runbook A · Callback gelmiyor

Tetikleyici: açık attempt yaşı eşiği aştı. Önce sağlayıcı ID, inbox ve worker sağlığını kontrol et. Bilinen UUID ile yetkili GetById sorgusu başlat; eşleştirme hattını kullan. Callback DNS/TLS/route/ACK ve proxy loglarını hassas veri göstermeden kontrol et. Otomatik Add retry yapma. Sorgu da belirsizse destek vakasını referansla sağlayıcıya taşımak için hizmet sahibine devret. Kapanış: yerel/provider durum eşleşti, neden ve gecikme kaydı var.

## Runbook B · sync_error veya tutar farkı

Tetikleyici: referans var ama tahsilat doğrulanamıyor / Amount farklı. Siparişin fulfillment ve yeni tahsilatını durdur; REVIEW_REQUIRED oluştur. Yetkili sorgu, provider referansı ve finans kaynağını karşılaştır. RRN/slip var diye success atama. Finans sahibi auditli düzeltme kararı verir. Kapanışta hiçbir önceki kanıt silinmez.

## Runbook C · Sağlayıcı kesintisi

Hata oranı ve circuit breaker sinyalini doğrula. Yeni payment startı feature flag ile durdur; callback alımını, açık iş sorgusunu ve veri kaydını koru. Kullanıcıya belirsiz sonucu açık göster. Sağlayıcı toparlanınca küçük hacimle aç; backlog ve karşılaştırmayı tamamla. Ana metrik normalleşmeden otomatik tam açılış yapma.

## Runbook D · Secret sızıntısı

Etkilenen credential/ortamı belirle, revoke/rotate et, erişim kapsamını azalt. İlgili secretı loglardan ve artifactlerden güvenli şekilde temizle; kanıt ve etki değerlendirmesini koru. Repo geçmişi varsa ayrı temizleme planı ve erişim incelemesi yap. Yeni credentialın yalnızca secret storeda bulunduğunu test et. Olayı güvenlik sahibine devret.

## Runbook E · Hatalı release / DB kaybı

Yeni tahsilatları durdur; webhook ingestion mümkünse sürsün. Son bilinen uygulama artifactine dön; DB şemasının eski sürümle uyumunu kontrol et. Veri kaybettiren down migration çalıştırma. DB kaybında yedekten izole geri yükle, commit/watermark ve açık attemptleri sağlayıcı ile yeniden uzlaştır. Restore sonrası çift yan etki testi yap ve hizmet sahibi kademeli açsın.

## Ölçüm hedeflerinin kapsamı

SLO önerisi %99,9: kullanıcının yetkili ödeme başlatma/durum sorgu isteklerinde hizmetin geçerli yanıt verebilmesi; ölçüm penceresi 30 gün. Banka reddi hizmet arızası sayılmaz; provider kesintisinin kullanıcı etkisi ayrı gösterilir. p95 ≤500 ms iç durum API için; auth/Add/3DS/banka bekleme zamanı ayrı metrik. RPO ≤15 dk ve RTO ≤60 dk önerisi altyapı ile kanıtlanmadan taahhüt edilmez. Maliyet metriği başarılı ödeme başına compute/DB/log ve operasyon yükünü kapsar.

## Yayın kararı

Pilot öncesi test/prod credential ayrımı, aktif merchant, callback erişimi, finans manuel iade yolu, alarm nöbetçisi, restore ve rollback kanıtı gerekir. Rollback tetikleri: doğruluk ihlali, tenant sızıntısı, yükselen UNKNOWN, başarısız migration veya kararlaştırılmış hata bütçesi aşımı. [G1 kapısı](https://karacaismail.github.io/galaxyPayFrappe/docs/kabul-kapilari/) eksikse sürüm sandboxta kalır.


---

# S01 · Sözleşme, sınırlar ve geliştirme temeli

Kaynak: src/content/docs/sprint-01.md

## Sprint hedefi

Yerel mock ödeme, CI çıktısı, 4 ADR ve açık soru kaydı. **Planlandı · henüz geliştirilmedi.** Faz 1: MVP. Süre 2 hafta; 10 geliştirme kişi-günü kapsam + 4 gün entegrasyon/review kapasitesi önerisi. [Kapasite varsayımları](https://karacaismail.github.io/galaxyPayFrappe/docs/kapsam/).

| Alan | Karar |
|---|---|
| Önkoşul | Başlangıç ve ilgili kapının kanıtı |
| Birincil roller | BE + FE / TL |
| Dış bağımlılık | Güncel doküman 2.3 ve sağlayıcı soru listesi; cevap beklerken mock ile ilerlenir. |
| Teslim | Yerel mock ödeme, CI çıktısı, 4 ADR ve açık soru kaydı. |

## İş kartları

### GP-011 · Sözleşme envanteri

**İş:** OpenAPI anlık görüntüsünü sürümle; auth, Add, GetById ve callback fixture sınırlarını kaydet.

**Kabul:** Şema değişikliği diff olarak görülebilir; bilinmeyenler Q kayıtlarına bağlı.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-012 · Repo ve secret sınırı

**İş:** Yeni uygulama katmanlarını planla; credential alanlarını üretim tasarımından çıkar; config, mock ve CI iskeletini kur.

**Kabul:** Temiz checkout kurulabilir; tarayıcı bundle ve log taramasında test secret değeri bulunmaz.

**Kaba tahmin:** 4 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-013 · Domain ve veri sözlüğü

**İş:** Order, PaymentAttempt, MerchantMapping ve Inbox modellerini; para hassasiyeti ve durum geçişlerini tanımla.

**Kabul:** İki eşzamanlı denemede sipariş başına aktif girişim kısıtı tasarımı ve migration testi var.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

## Sprint kabulü

Her GP kartının yukarıdaki kabul kriteri kanıtlanmalı. [Ortak Definition of Done](https://karacaismail.github.io/galaxyPayFrappe/docs/gelistirme-sureci/) uygulanır; [test matrisindeki](https://karacaismail.github.io/galaxyPayFrappe/docs/test-stratejisi/) ilgili senaryolar çalışır. Çalışmayan/dış bağımlılığa takılan testler açık bırakılır. Kanıt paketi: commit, ortam, fixture sürümü, test çıktısı, demo kaydı, reviewer ve açık Q bağlantıları. Faz çıkışı gerekiyorsa [kapı tutanağı](https://karacaismail.github.io/galaxyPayFrappe/docs/kabul-kapilari/) eklenir.

## Sprint içi çalışma

Gün 1: sözleşme/DoR ve sahiplik. Gün 2–7: GP kartlarını küçük dilimlerle uygula. Gün 8: entegrasyon/negatif senaryolar. Gün 9: UAT/doküman/release provası. Gün 10: demo ve kabul. Sağlayıcı cevabı gecikirse mock ve bağımsız işleri ilerlet; teyit gerektiren kabiliyeti canlıya açma.

## AI görev istemi

Aşağıdaki metin ilgili sprint bağlamını taşır; uygulama sırasında sıradaki tek GP kartına daralt. Kod bloklarının sağ üstündeki düğmeyle kopyalanabilir.

```text
S01 / Sözleşme, sınırlar ve geliştirme temeli sprintini uygula.
Önce mevcut repo, docs/mimari, docs/api-referansi, docs/odeme-akisi,
docs/test-stratejisi ve bu sprintin GP kartlarını oku.
Bağımlılık: Başlangıç. Teyit ihtiyacı: Güncel doküman 2.3 ve sağlayıcı soru listesi; cevap beklerken mock ile ilerlenir.
İş kartları: GP-011, GP-012, GP-013.
Her seferinde tek kartın küçük dikey dilimini ele al.
Provider davranışını uydurma; bilinmeyeni Q kaydına bağla.
Credentialı istemciye/loga taşıma; para/tenant/idempotency kurallarını koru.
Kabul kriterini önce test senaryosuna dönüştür, sonra kodu uygula.
Çalıştırılan testleri ve çalıştırılamayan doğrulamaları ayrı raporla.
Diff, docs güncellemesi, kanıt ve açık riskleri sun.
Bu prompt tek başına canlı ödeme, iade veya üretim deploy yetkisi değildir.
```

## Hazırlık kontrolü

- [ ] Önceki sprint kanıtı ve bağımlılıklar okundu.
- [ ] Her GP kartı için sorumlu/reviewer belirlendi.
- [ ] Pozitif ve negatif kabul senaryoları hazır.
- [ ] Test verisi sentetik; secretlar güvenli kanalda.
- [ ] Demo, test kanıtı ve açık risk kaydı eklendi.

Bu kutular yalnızca bu tarayıcıda tutulan kişisel notlardır; paylaşılan görev durumu veya resmi kabul kaydı değildir.

## Sonraki adım

[S02 sprintine geç](https://karacaismail.github.io/galaxyPayFrappe/docs/sprint-02/).


---

# S02 · Ödemeyi güvenle başlat

Kaynak: src/content/docs/sprint-02.md

## Sprint hedefi

Dummy merchant ile ödeme linki ve kalıcı attempt kaydı. **Planlandı · henüz geliştirilmedi.** Faz 1: MVP. Süre 2 hafta; 10 geliştirme kişi-günü kapsam + 4 gün entegrasyon/review kapasitesi önerisi. [Kapasite varsayımları](https://karacaismail.github.io/galaxyPayFrappe/docs/kapsam/).

| Alan | Karar |
|---|---|
| Önkoşul | S01 ve ilgili kapının kanıtı |
| Birincil roller | BE + FE |
| Dış bağımlılık | Auth yanıtı, token TTL ve izinli ödeme hostları teyidi. |
| Teslim | Dummy merchant ile ödeme linki ve kalıcı attempt kaydı. |

## İş kartları

### GP-021 · Sunucu auth adaptörü

**İş:** Test secret store, kısıtlı token cache, timeout ve hata sınıflandırmasını uygula.

**Kabul:** Token istemciye dönmez; bozuk auth cevabı başarı sayılmaz; 401 döngüsü oluşmaz.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-022 · Idempotent ödeme oluşturma

**İş:** Sipariş toplamını sunucudan al; merchant eşleşmesini doğrula; intenti önce kaydet; Add sonucunu ilişkilendir.

**Kabul:** Aynı anahtar ve gövde aynı attempti döndürür; farklı gövde 409; belirsiz Add otomatik tekrarlanmaz.

**Kaba tahmin:** 4 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-023 · Hosted checkout UX

**İş:** PaymentUrl allowlist, popup engeli için aynı linke yönlendirme ve pending ekranını uygula.

**Kabul:** Popup kapanması başarısız ödeme sayılmaz; tekrar tıklama ikinci işlem oluşturmaz.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

## Sprint kabulü

Her GP kartının yukarıdaki kabul kriteri kanıtlanmalı. [Ortak Definition of Done](https://karacaismail.github.io/galaxyPayFrappe/docs/gelistirme-sureci/) uygulanır; [test matrisindeki](https://karacaismail.github.io/galaxyPayFrappe/docs/test-stratejisi/) ilgili senaryolar çalışır. Çalışmayan/dış bağımlılığa takılan testler açık bırakılır. Kanıt paketi: commit, ortam, fixture sürümü, test çıktısı, demo kaydı, reviewer ve açık Q bağlantıları. Faz çıkışı gerekiyorsa [kapı tutanağı](https://karacaismail.github.io/galaxyPayFrappe/docs/kabul-kapilari/) eklenir.

## Sprint içi çalışma

Gün 1: sözleşme/DoR ve sahiplik. Gün 2–7: GP kartlarını küçük dilimlerle uygula. Gün 8: entegrasyon/negatif senaryolar. Gün 9: UAT/doküman/release provası. Gün 10: demo ve kabul. Sağlayıcı cevabı gecikirse mock ve bağımsız işleri ilerlet; teyit gerektiren kabiliyeti canlıya açma.

## AI görev istemi

Aşağıdaki metin ilgili sprint bağlamını taşır; uygulama sırasında sıradaki tek GP kartına daralt. Kod bloklarının sağ üstündeki düğmeyle kopyalanabilir.

```text
S02 / Ödemeyi güvenle başlat sprintini uygula.
Önce mevcut repo, docs/mimari, docs/api-referansi, docs/odeme-akisi,
docs/test-stratejisi ve bu sprintin GP kartlarını oku.
Bağımlılık: S01. Teyit ihtiyacı: Auth yanıtı, token TTL ve izinli ödeme hostları teyidi.
İş kartları: GP-021, GP-022, GP-023.
Her seferinde tek kartın küçük dikey dilimini ele al.
Provider davranışını uydurma; bilinmeyeni Q kaydına bağla.
Credentialı istemciye/loga taşıma; para/tenant/idempotency kurallarını koru.
Kabul kriterini önce test senaryosuna dönüştür, sonra kodu uygula.
Çalıştırılan testleri ve çalıştırılamayan doğrulamaları ayrı raporla.
Diff, docs güncellemesi, kanıt ve açık riskleri sun.
Bu prompt tek başına canlı ödeme, iade veya üretim deploy yetkisi değildir.
```

## Hazırlık kontrolü

- [ ] Önceki sprint kanıtı ve bağımlılıklar okundu.
- [ ] Her GP kartı için sorumlu/reviewer belirlendi.
- [ ] Pozitif ve negatif kabul senaryoları hazır.
- [ ] Test verisi sentetik; secretlar güvenli kanalda.
- [ ] Demo, test kanıtı ve açık risk kaydı eklendi.

Bu kutular yalnızca bu tarayıcıda tutulan kişisel notlardır; paylaşılan görev durumu veya resmi kabul kaydı değildir.

## Sonraki adım

[S03 sprintine geç](https://karacaismail.github.io/galaxyPayFrappe/docs/sprint-03/).


---

# S03 · Callback ve durum doğrulaması

Kaynak: src/content/docs/sprint-03.md

## Sprint hedefi

Doğrulanmış sonuç; yinelenen, sahte ve kayıp callback test kanıtları. **Planlandı · henüz geliştirilmedi.** Faz 1: MVP. Süre 2 hafta; 10 geliştirme kişi-günü kapsam + 4 gün entegrasyon/review kapasitesi önerisi. [Kapasite varsayımları](https://karacaismail.github.io/galaxyPayFrappe/docs/kapsam/).

| Alan | Karar |
|---|---|
| Önkoşul | S02 ve ilgili kapının kanıtı |
| Birincil roller | BE + QA |
| Dış bağımlılık | Q01 callback doğrulama/retry; Q02 ID semantiği; canlı geçiş için gerekli. |
| Teslim | Doğrulanmış sonuç; yinelenen, sahte ve kayıp callback test kanıtları. |

## İş kartları

### GP-031 · Callback inbox

**İş:** Boyut ve şema kontrolü; kalıcı inbox; olay tekilleştirme; ham gövde için kontrollü erişim uygula.

**Kabul:** Aynı bildirim 100 kez gelince 1 iş etkisi; DB yazımı başarısızsa başarı ACK verilmez.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-032 · Yetkili durum doğrulaması

**İş:** GetById ile OrderNo, Amount, merchant ve ID eşleşmesini kontrol et; onaylı durum makinesini uygula.

**Kabul:** Sahte callback/postMessage siparişi paid yapamaz; eşleşmeyen tutar inceleme kuyruğuna gider.

**Kaba tahmin:** 4 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-033 · Kayıp/ters sıralı olay kurtarma

**İş:** Sınırlı backoff, jitter ve reconciliation job; read-only müşteri durum endpointi ekle.

**Kabul:** Callback yokken sorgu ile sonuç bulunur; geç pending başarılı ödemeyi geriye götürmez.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

## Sprint kabulü

Her GP kartının yukarıdaki kabul kriteri kanıtlanmalı. [Ortak Definition of Done](https://karacaismail.github.io/galaxyPayFrappe/docs/gelistirme-sureci/) uygulanır; [test matrisindeki](https://karacaismail.github.io/galaxyPayFrappe/docs/test-stratejisi/) ilgili senaryolar çalışır. Çalışmayan/dış bağımlılığa takılan testler açık bırakılır. Kanıt paketi: commit, ortam, fixture sürümü, test çıktısı, demo kaydı, reviewer ve açık Q bağlantıları. Faz çıkışı gerekiyorsa [kapı tutanağı](https://karacaismail.github.io/galaxyPayFrappe/docs/kabul-kapilari/) eklenir.

## Sprint içi çalışma

Gün 1: sözleşme/DoR ve sahiplik. Gün 2–7: GP kartlarını küçük dilimlerle uygula. Gün 8: entegrasyon/negatif senaryolar. Gün 9: UAT/doküman/release provası. Gün 10: demo ve kabul. Sağlayıcı cevabı gecikirse mock ve bağımsız işleri ilerlet; teyit gerektiren kabiliyeti canlıya açma.

## AI görev istemi

Aşağıdaki metin ilgili sprint bağlamını taşır; uygulama sırasında sıradaki tek GP kartına daralt. Kod bloklarının sağ üstündeki düğmeyle kopyalanabilir.

```text
S03 / Callback ve durum doğrulaması sprintini uygula.
Önce mevcut repo, docs/mimari, docs/api-referansi, docs/odeme-akisi,
docs/test-stratejisi ve bu sprintin GP kartlarını oku.
Bağımlılık: S02. Teyit ihtiyacı: Q01 callback doğrulama/retry; Q02 ID semantiği; canlı geçiş için gerekli.
İş kartları: GP-031, GP-032, GP-033.
Her seferinde tek kartın küçük dikey dilimini ele al.
Provider davranışını uydurma; bilinmeyeni Q kaydına bağla.
Credentialı istemciye/loga taşıma; para/tenant/idempotency kurallarını koru.
Kabul kriterini önce test senaryosuna dönüştür, sonra kodu uygula.
Çalıştırılan testleri ve çalıştırılamayan doğrulamaları ayrı raporla.
Diff, docs güncellemesi, kanıt ve açık riskleri sun.
Bu prompt tek başına canlı ödeme, iade veya üretim deploy yetkisi değildir.
```

## Hazırlık kontrolü

- [ ] Önceki sprint kanıtı ve bağımlılıklar okundu.
- [ ] Her GP kartı için sorumlu/reviewer belirlendi.
- [ ] Pozitif ve negatif kabul senaryoları hazır.
- [ ] Test verisi sentetik; secretlar güvenli kanalda.
- [ ] Demo, test kanıtı ve açık risk kaydı eklendi.

Bu kutular yalnızca bu tarayıcıda tutulan kişisel notlardır; paylaşılan görev durumu veya resmi kabul kaydı değildir.

## Sonraki adım

[S04 sprintine geç](https://karacaismail.github.io/galaxyPayFrappe/docs/sprint-04/).


---

# S04 · MVP kabulü ve kontrollü pilot

Kaynak: src/content/docs/sprint-04.md

## Sprint hedefi

MVP sürüm paketi; G1 karar tutanağı ve pilot gözlem raporu. **Planlandı · henüz geliştirilmedi.** Faz 1: MVP. Süre 2 hafta; 10 geliştirme kişi-günü kapsam + 4 gün entegrasyon/review kapasitesi önerisi. [Kapasite varsayımları](https://karacaismail.github.io/galaxyPayFrappe/docs/kapsam/).

| Alan | Karar |
|---|---|
| Önkoşul | S03 ve ilgili kapının kanıtı |
| Birincil roller | QA + TL + PO / Platform |
| Dış bağımlılık | G1 için satıcı aktivasyonu, üretim kimliği ve güvenlik mutabakatı. |
| Teslim | MVP sürüm paketi; G1 karar tutanağı ve pilot gözlem raporu. |

## İş kartları

### GP-041 · E2E ve UAT

**İş:** Doğrudan kart, 3DS, başarısız işlem, ağ kaybı, popup engeli ve yetkisiz satıcı senaryolarını çalıştır.

**Kabul:** TC01–TC16 kabul paketi geçer; unresolved P0/P1 yok; gerçek ödeme testi ayrı kontrollü UAT planında.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-042 · İşletim asgarisi

**İş:** Dashboard, korelasyon ID, callback gecikme alarmı, yedek ve geri alma yönergesi hazırla.

**Kabul:** Nöbet sorumlusu alarmı alır; yedekten test geri yükleme ve eski sürüme dönüş gösterilir.

**Kaba tahmin:** 4 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-043 · Go/no-go ve pilot

**İş:** G1 kanıtlarını topla; düşük limitli tek satıcı pilotu ve kill switch prosedürünü hazırla.

**Kabul:** PO/TL/operasyon onayı kayıtlı; kapı eksikse sürüm sandbox MVP olarak kalır.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

## Sprint kabulü

Her GP kartının yukarıdaki kabul kriteri kanıtlanmalı. [Ortak Definition of Done](https://karacaismail.github.io/galaxyPayFrappe/docs/gelistirme-sureci/) uygulanır; [test matrisindeki](https://karacaismail.github.io/galaxyPayFrappe/docs/test-stratejisi/) ilgili senaryolar çalışır. Çalışmayan/dış bağımlılığa takılan testler açık bırakılır. Kanıt paketi: commit, ortam, fixture sürümü, test çıktısı, demo kaydı, reviewer ve açık Q bağlantıları. Faz çıkışı gerekiyorsa [kapı tutanağı](https://karacaismail.github.io/galaxyPayFrappe/docs/kabul-kapilari/) eklenir.

## Sprint içi çalışma

Gün 1: sözleşme/DoR ve sahiplik. Gün 2–7: GP kartlarını küçük dilimlerle uygula. Gün 8: entegrasyon/negatif senaryolar. Gün 9: UAT/doküman/release provası. Gün 10: demo ve kabul. Sağlayıcı cevabı gecikirse mock ve bağımsız işleri ilerlet; teyit gerektiren kabiliyeti canlıya açma.

## AI görev istemi

Aşağıdaki metin ilgili sprint bağlamını taşır; uygulama sırasında sıradaki tek GP kartına daralt. Kod bloklarının sağ üstündeki düğmeyle kopyalanabilir.

```text
S04 / MVP kabulü ve kontrollü pilot sprintini uygula.
Önce mevcut repo, docs/mimari, docs/api-referansi, docs/odeme-akisi,
docs/test-stratejisi ve bu sprintin GP kartlarını oku.
Bağımlılık: S03. Teyit ihtiyacı: G1 için satıcı aktivasyonu, üretim kimliği ve güvenlik mutabakatı.
İş kartları: GP-041, GP-042, GP-043.
Her seferinde tek kartın küçük dikey dilimini ele al.
Provider davranışını uydurma; bilinmeyeni Q kaydına bağla.
Credentialı istemciye/loga taşıma; para/tenant/idempotency kurallarını koru.
Kabul kriterini önce test senaryosuna dönüştür, sonra kodu uygula.
Çalıştırılan testleri ve çalıştırılamayan doğrulamaları ayrı raporla.
Diff, docs güncellemesi, kanıt ve açık riskleri sun.
Bu prompt tek başına canlı ödeme, iade veya üretim deploy yetkisi değildir.
```

## Hazırlık kontrolü

- [ ] Önceki sprint kanıtı ve bağımlılıklar okundu.
- [ ] Her GP kartı için sorumlu/reviewer belirlendi.
- [ ] Pozitif ve negatif kabul senaryoları hazır.
- [ ] Test verisi sentetik; secretlar güvenli kanalda.
- [ ] Demo, test kanıtı ve açık risk kaydı eklendi.

Bu kutular yalnızca bu tarayıcıda tutulan kişisel notlardır; paylaşılan görev durumu veya resmi kabul kaydı değildir.

## Sonraki adım

[S05 sprintine geç](https://karacaismail.github.io/galaxyPayFrappe/docs/sprint-05/).


---

# S05 · Satıcı onboarding ve izolasyon

Kaynak: src/content/docs/sprint-05.md

## Sprint hedefi

Onboarding kontrol listesi ve iki satıcılı izolasyon kanıtı. **Planlandı · henüz geliştirilmedi.** Faz 2: Post-MVP. Süre 2 hafta; 10 geliştirme kişi-günü kapsam + 4 gün entegrasyon/review kapasitesi önerisi. [Kapasite varsayımları](https://karacaismail.github.io/galaxyPayFrappe/docs/kapsam/).

| Alan | Karar |
|---|---|
| Önkoşul | S04 ve ilgili kapının kanıtı |
| Birincil roller | BE + FE / Operasyon |
| Dış bağımlılık | Eksik 2.3 belgesi ve sağlayıcı gerçek satıcı tanımı. |
| Teslim | Onboarding kontrol listesi ve iki satıcılı izolasyon kanıtı. |

## İş kartları

### GP-051 · Onboarding akışı

**İş:** 2.3 alanlarını teyitli şemayla topla; taslak, gönderildi, incelemede ve aktif durumları oluştur.

**Kabul:** Alan listesi uydurulmaz; eksik evrak ve red gerekçesi görünür.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-052 · Merchant eşleşmesi

**İş:** Tenant–yerel satıcı–SubMerchantId bağını ve IsActive/HasMasterpassSetting kontrollerini ekle.

**Kabul:** Başka tenant ID’siyle ödeme ve listeleme reddedilir; ana merchant fallback sessiz çalışmaz.

**Kaba tahmin:** 4 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-053 · Aktivasyon UAT

**İş:** İki gerçek veya onaylı dummy satıcıyla ayrık ödeme ve audit akışını çalıştır.

**Kabul:** Her işlem doğru effective merchant ile eşleşir; deaktivasyon yeni girişimi durdurur.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

## Sprint kabulü

Her GP kartının yukarıdaki kabul kriteri kanıtlanmalı. [Ortak Definition of Done](https://karacaismail.github.io/galaxyPayFrappe/docs/gelistirme-sureci/) uygulanır; [test matrisindeki](https://karacaismail.github.io/galaxyPayFrappe/docs/test-stratejisi/) ilgili senaryolar çalışır. Çalışmayan/dış bağımlılığa takılan testler açık bırakılır. Kanıt paketi: commit, ortam, fixture sürümü, test çıktısı, demo kaydı, reviewer ve açık Q bağlantıları. Faz çıkışı gerekiyorsa [kapı tutanağı](https://karacaismail.github.io/galaxyPayFrappe/docs/kabul-kapilari/) eklenir.

## Sprint içi çalışma

Gün 1: sözleşme/DoR ve sahiplik. Gün 2–7: GP kartlarını küçük dilimlerle uygula. Gün 8: entegrasyon/negatif senaryolar. Gün 9: UAT/doküman/release provası. Gün 10: demo ve kabul. Sağlayıcı cevabı gecikirse mock ve bağımsız işleri ilerlet; teyit gerektiren kabiliyeti canlıya açma.

## AI görev istemi

Aşağıdaki metin ilgili sprint bağlamını taşır; uygulama sırasında sıradaki tek GP kartına daralt. Kod bloklarının sağ üstündeki düğmeyle kopyalanabilir.

```text
S05 / Satıcı onboarding ve izolasyon sprintini uygula.
Önce mevcut repo, docs/mimari, docs/api-referansi, docs/odeme-akisi,
docs/test-stratejisi ve bu sprintin GP kartlarını oku.
Bağımlılık: S04. Teyit ihtiyacı: Eksik 2.3 belgesi ve sağlayıcı gerçek satıcı tanımı.
İş kartları: GP-051, GP-052, GP-053.
Her seferinde tek kartın küçük dikey dilimini ele al.
Provider davranışını uydurma; bilinmeyeni Q kaydına bağla.
Credentialı istemciye/loga taşıma; para/tenant/idempotency kurallarını koru.
Kabul kriterini önce test senaryosuna dönüştür, sonra kodu uygula.
Çalıştırılan testleri ve çalıştırılamayan doğrulamaları ayrı raporla.
Diff, docs güncellemesi, kanıt ve açık riskleri sun.
Bu prompt tek başına canlı ödeme, iade veya üretim deploy yetkisi değildir.
```

## Hazırlık kontrolü

- [ ] Önceki sprint kanıtı ve bağımlılıklar okundu.
- [ ] Her GP kartı için sorumlu/reviewer belirlendi.
- [ ] Pozitif ve negatif kabul senaryoları hazır.
- [ ] Test verisi sentetik; secretlar güvenli kanalda.
- [ ] Demo, test kanıtı ve açık risk kaydı eklendi.

Bu kutular yalnızca bu tarayıcıda tutulan kişisel notlardır; paylaşılan görev durumu veya resmi kabul kaydı değildir.

## Sonraki adım

[S06 sprintine geç](https://karacaismail.github.io/galaxyPayFrappe/docs/sprint-06/).


---

# S06 · Cüzdan ve ödeme deneyimi

Kaynak: src/content/docs/sprint-06.md

## Sprint hedefi

Mobil/masaüstü ödeme deneyimi ve erişilebilirlik kabul raporu. **Planlandı · henüz geliştirilmedi.** Faz 2: Post-MVP. Süre 2 hafta; 10 geliştirme kişi-günü kapsam + 4 gün entegrasyon/review kapasitesi önerisi. [Kapasite varsayımları](https://karacaismail.github.io/galaxyPayFrappe/docs/kapsam/).

| Alan | Karar |
|---|---|
| Önkoşul | S05 ve ilgili kapının kanıtı |
| Birincil roller | FE + QA / BE |
| Dış bağımlılık | Sağlayıcıya ait test cüzdan hesabı ve erişim desteği. |
| Teslim | Mobil/masaüstü ödeme deneyimi ve erişilebilirlik kabul raporu. |

## İş kartları

### GP-061 · Cüzdan UAT

**İş:** İzinli test hesabıyla kayıtlı kart ve doğrudan kart yollarını ayır; kart verisini uygulamada toplama.

**Kabul:** Her iki yol ayrı test sonucu üretir; test telefonları yayınlanan fixturelara girmez.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-062 · Dayanıklı müşteri UX

**İş:** Mobil yönlendirme, sekme kapanması, geri dönüş ve sayfa yenilemede attempt devamlılığını uygula.

**Kabul:** Kullanıcı pending sonucu görür; başarısızlık ve bilinmeyen durum farklı açıklanır.

**Kaba tahmin:** 4 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-063 · Erişilebilirlik

**İş:** Klavye, focus dönüşü, ekran okuyucu, 200% zoom ve minimum 1rem metni doğrula.

**Kabul:** Ödeme eylemleri klavyeyle tamamlanır; küçük ekranlarda kontroller örtüşmez.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

## Sprint kabulü

Her GP kartının yukarıdaki kabul kriteri kanıtlanmalı. [Ortak Definition of Done](https://karacaismail.github.io/galaxyPayFrappe/docs/gelistirme-sureci/) uygulanır; [test matrisindeki](https://karacaismail.github.io/galaxyPayFrappe/docs/test-stratejisi/) ilgili senaryolar çalışır. Çalışmayan/dış bağımlılığa takılan testler açık bırakılır. Kanıt paketi: commit, ortam, fixture sürümü, test çıktısı, demo kaydı, reviewer ve açık Q bağlantıları. Faz çıkışı gerekiyorsa [kapı tutanağı](https://karacaismail.github.io/galaxyPayFrappe/docs/kabul-kapilari/) eklenir.

## Sprint içi çalışma

Gün 1: sözleşme/DoR ve sahiplik. Gün 2–7: GP kartlarını küçük dilimlerle uygula. Gün 8: entegrasyon/negatif senaryolar. Gün 9: UAT/doküman/release provası. Gün 10: demo ve kabul. Sağlayıcı cevabı gecikirse mock ve bağımsız işleri ilerlet; teyit gerektiren kabiliyeti canlıya açma.

## AI görev istemi

Aşağıdaki metin ilgili sprint bağlamını taşır; uygulama sırasında sıradaki tek GP kartına daralt. Kod bloklarının sağ üstündeki düğmeyle kopyalanabilir.

```text
S06 / Cüzdan ve ödeme deneyimi sprintini uygula.
Önce mevcut repo, docs/mimari, docs/api-referansi, docs/odeme-akisi,
docs/test-stratejisi ve bu sprintin GP kartlarını oku.
Bağımlılık: S05. Teyit ihtiyacı: Sağlayıcıya ait test cüzdan hesabı ve erişim desteği.
İş kartları: GP-061, GP-062, GP-063.
Her seferinde tek kartın küçük dikey dilimini ele al.
Provider davranışını uydurma; bilinmeyeni Q kaydına bağla.
Credentialı istemciye/loga taşıma; para/tenant/idempotency kurallarını koru.
Kabul kriterini önce test senaryosuna dönüştür, sonra kodu uygula.
Çalıştırılan testleri ve çalıştırılamayan doğrulamaları ayrı raporla.
Diff, docs güncellemesi, kanıt ve açık riskleri sun.
Bu prompt tek başına canlı ödeme, iade veya üretim deploy yetkisi değildir.
```

## Hazırlık kontrolü

- [ ] Önceki sprint kanıtı ve bağımlılıklar okundu.
- [ ] Her GP kartı için sorumlu/reviewer belirlendi.
- [ ] Pozitif ve negatif kabul senaryoları hazır.
- [ ] Test verisi sentetik; secretlar güvenli kanalda.
- [ ] Demo, test kanıtı ve açık risk kaydı eklendi.

Bu kutular yalnızca bu tarayıcıda tutulan kişisel notlardır; paylaşılan görev durumu veya resmi kabul kaydı değildir.

## Sonraki adım

[S07 sprintine geç](https://karacaismail.github.io/galaxyPayFrappe/docs/sprint-07/).


---

# S07 · Destek ve operasyon görünürlüğü

Kaynak: src/content/docs/sprint-07.md

## Sprint hedefi

Destek paneli ve G2 post-MVP kabul paketi. **Planlandı · henüz geliştirilmedi.** Faz 2: Post-MVP. Süre 2 hafta; 10 geliştirme kişi-günü kapsam + 4 gün entegrasyon/review kapasitesi önerisi. [Kapasite varsayımları](https://karacaismail.github.io/galaxyPayFrappe/docs/kapsam/).

| Alan | Karar |
|---|---|
| Önkoşul | S06 ve ilgili kapının kanıtı |
| Birincil roller | FE + BE / Destek |
| Dış bağımlılık | Rol matrisi ve veri görüntüleme yetkileri. |
| Teslim | Destek paneli ve G2 post-MVP kabul paketi. |

## İş kartları

### GP-071 · İşlem arama

**İş:** Maskeli sipariş, attempt, merchant, zaman ve durum filtreleri oluştur.

**Kabul:** Tenant filtreleri sunucuda zorunlu; telefon/token arama sonucunda sızmaz.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-072 · Güvenli yeniden sorgu

**İş:** Yetkili operatöre sadece durum yenileme; gerekçe ve audit kaydı ekle.

**Kabul:** Yeniden sorgu Add veya tahsilat çağırmaz; yetkisiz rol 403 alır.

**Kaba tahmin:** 4 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-073 · Destek playbook

**İş:** Pending, sync_error, mükerrer şüphe ve müşteri iletişim şablonlarını yaz.

**Kabul:** Destek örnek vakayı sağlayıcı referansı ve korelasyon ID ile takip edebilir.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

## Sprint kabulü

Her GP kartının yukarıdaki kabul kriteri kanıtlanmalı. [Ortak Definition of Done](https://karacaismail.github.io/galaxyPayFrappe/docs/gelistirme-sureci/) uygulanır; [test matrisindeki](https://karacaismail.github.io/galaxyPayFrappe/docs/test-stratejisi/) ilgili senaryolar çalışır. Çalışmayan/dış bağımlılığa takılan testler açık bırakılır. Kanıt paketi: commit, ortam, fixture sürümü, test çıktısı, demo kaydı, reviewer ve açık Q bağlantıları. Faz çıkışı gerekiyorsa [kapı tutanağı](https://karacaismail.github.io/galaxyPayFrappe/docs/kabul-kapilari/) eklenir.

## Sprint içi çalışma

Gün 1: sözleşme/DoR ve sahiplik. Gün 2–7: GP kartlarını küçük dilimlerle uygula. Gün 8: entegrasyon/negatif senaryolar. Gün 9: UAT/doküman/release provası. Gün 10: demo ve kabul. Sağlayıcı cevabı gecikirse mock ve bağımsız işleri ilerlet; teyit gerektiren kabiliyeti canlıya açma.

## AI görev istemi

Aşağıdaki metin ilgili sprint bağlamını taşır; uygulama sırasında sıradaki tek GP kartına daralt. Kod bloklarının sağ üstündeki düğmeyle kopyalanabilir.

```text
S07 / Destek ve operasyon görünürlüğü sprintini uygula.
Önce mevcut repo, docs/mimari, docs/api-referansi, docs/odeme-akisi,
docs/test-stratejisi ve bu sprintin GP kartlarını oku.
Bağımlılık: S06. Teyit ihtiyacı: Rol matrisi ve veri görüntüleme yetkileri.
İş kartları: GP-071, GP-072, GP-073.
Her seferinde tek kartın küçük dikey dilimini ele al.
Provider davranışını uydurma; bilinmeyeni Q kaydına bağla.
Credentialı istemciye/loga taşıma; para/tenant/idempotency kurallarını koru.
Kabul kriterini önce test senaryosuna dönüştür, sonra kodu uygula.
Çalıştırılan testleri ve çalıştırılamayan doğrulamaları ayrı raporla.
Diff, docs güncellemesi, kanıt ve açık riskleri sun.
Bu prompt tek başına canlı ödeme, iade veya üretim deploy yetkisi değildir.
```

## Hazırlık kontrolü

- [ ] Önceki sprint kanıtı ve bağımlılıklar okundu.
- [ ] Her GP kartı için sorumlu/reviewer belirlendi.
- [ ] Pozitif ve negatif kabul senaryoları hazır.
- [ ] Test verisi sentetik; secretlar güvenli kanalda.
- [ ] Demo, test kanıtı ve açık risk kaydı eklendi.

Bu kutular yalnızca bu tarayıcıda tutulan kişisel notlardır; paylaşılan görev durumu veya resmi kabul kaydı değildir.

## Sonraki adım

[S08 sprintine geç](https://karacaismail.github.io/galaxyPayFrappe/docs/sprint-08/).


---

# S08 · İade ve iptal iş kuralları

Kaynak: src/content/docs/sprint-08.md

## Sprint hedefi

Sağlayıcı teyitli iade/iptal akışı veya kapalı feature flag ve blokaj kaydı. **Planlandı · henüz geliştirilmedi.** Faz 3: Finansal operasyon. Süre 2 hafta; 10 geliştirme kişi-günü kapsam + 4 gün entegrasyon/review kapasitesi önerisi. [Kapasite varsayımları](https://karacaismail.github.io/galaxyPayFrappe/docs/kapsam/).

| Alan | Karar |
|---|---|
| Önkoşul | S07 ve ilgili kapının kanıtı |
| Birincil roller | BE + Finans / QA |
| Dış bağımlılık | Q07 Refund/Void yetkisi, AccessToken anlamı, zaman pencereleri. |
| Teslim | Sağlayıcı teyitli iade/iptal akışı veya kapalı feature flag ve blokaj kaydı. |

## İş kartları

### GP-081 · Sözleşmeyi kapat

**İş:** Refund/Void için token, tutar, tam/kısmi kapsam ve nihai sonuç sorgusunu teyit et.

**Kabul:** Kısmi iade desteği kanıt yoksa arayüzde yer almaz; onaylı test fixtureı mevcut.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-082 · Kontrollü talep modeli

**İş:** İade niyeti, yetki, gerekçe ve idempotency anahtarını kaydet; onay mekanizmasını tasarla.

**Kabul:** İade toplamı ödenmiş tutarı aşamaz; iki eşzamanlı talep sınırı aşamaz.

**Kaba tahmin:** 4 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-083 · Sandbox yürütme

**İş:** Tam iade veya iptal için doğrulanmış adaptör ve pending sonucu uygula.

**Kabul:** Timeout yeni iade oluşturmaz; finans sonucu sorgu/uzlaşma ile kesinleştirir.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

## Sprint kabulü

Her GP kartının yukarıdaki kabul kriteri kanıtlanmalı. [Ortak Definition of Done](https://karacaismail.github.io/galaxyPayFrappe/docs/gelistirme-sureci/) uygulanır; [test matrisindeki](https://karacaismail.github.io/galaxyPayFrappe/docs/test-stratejisi/) ilgili senaryolar çalışır. Çalışmayan/dış bağımlılığa takılan testler açık bırakılır. Kanıt paketi: commit, ortam, fixture sürümü, test çıktısı, demo kaydı, reviewer ve açık Q bağlantıları. Faz çıkışı gerekiyorsa [kapı tutanağı](https://karacaismail.github.io/galaxyPayFrappe/docs/kabul-kapilari/) eklenir.

## Sprint içi çalışma

Gün 1: sözleşme/DoR ve sahiplik. Gün 2–7: GP kartlarını küçük dilimlerle uygula. Gün 8: entegrasyon/negatif senaryolar. Gün 9: UAT/doküman/release provası. Gün 10: demo ve kabul. Sağlayıcı cevabı gecikirse mock ve bağımsız işleri ilerlet; teyit gerektiren kabiliyeti canlıya açma.

## AI görev istemi

Aşağıdaki metin ilgili sprint bağlamını taşır; uygulama sırasında sıradaki tek GP kartına daralt. Kod bloklarının sağ üstündeki düğmeyle kopyalanabilir.

```text
S08 / İade ve iptal iş kuralları sprintini uygula.
Önce mevcut repo, docs/mimari, docs/api-referansi, docs/odeme-akisi,
docs/test-stratejisi ve bu sprintin GP kartlarını oku.
Bağımlılık: S07. Teyit ihtiyacı: Q07 Refund/Void yetkisi, AccessToken anlamı, zaman pencereleri.
İş kartları: GP-081, GP-082, GP-083.
Her seferinde tek kartın küçük dikey dilimini ele al.
Provider davranışını uydurma; bilinmeyeni Q kaydına bağla.
Credentialı istemciye/loga taşıma; para/tenant/idempotency kurallarını koru.
Kabul kriterini önce test senaryosuna dönüştür, sonra kodu uygula.
Çalıştırılan testleri ve çalıştırılamayan doğrulamaları ayrı raporla.
Diff, docs güncellemesi, kanıt ve açık riskleri sun.
Bu prompt tek başına canlı ödeme, iade veya üretim deploy yetkisi değildir.
```

## Hazırlık kontrolü

- [ ] Önceki sprint kanıtı ve bağımlılıklar okundu.
- [ ] Her GP kartı için sorumlu/reviewer belirlendi.
- [ ] Pozitif ve negatif kabul senaryoları hazır.
- [ ] Test verisi sentetik; secretlar güvenli kanalda.
- [ ] Demo, test kanıtı ve açık risk kaydı eklendi.

Bu kutular yalnızca bu tarayıcıda tutulan kişisel notlardır; paylaşılan görev durumu veya resmi kabul kaydı değildir.

## Sonraki adım

[S09 sprintine geç](https://karacaismail.github.io/galaxyPayFrappe/docs/sprint-09/).


---

# S09 · Günlük mutabakat

Kaynak: src/content/docs/sprint-09.md

## Sprint hedefi

Günlük mutabakat raporu ve fark çözüm akışı. **Planlandı · henüz geliştirilmedi.** Faz 3: Finansal operasyon. Süre 2 hafta; 10 geliştirme kişi-günü kapsam + 4 gün entegrasyon/review kapasitesi önerisi. [Kapasite varsayımları](https://karacaismail.github.io/galaxyPayFrappe/docs/kapsam/).

| Alan | Karar |
|---|---|
| Önkoşul | S08 ve ilgili kapının kanıtı |
| Birincil roller | BE + Finans |
| Dış bağımlılık | Tarih aralığı API timezone/limit ve settlement dosyası erişimi. |
| Teslim | Günlük mutabakat raporu ve fark çözüm akışı. |

## İş kartları

### GP-091 · Eşleştirme modeli

**İş:** Sipariş, sağlayıcı tahsilatı ve banka/settlement hareketini ayrı kaynak olarak modelle.

**Kabul:** Payment success ile banka settlementı aynı şey sayılmaz; ID, tarih ve tutar izlenir.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-092 · Mutabakat işi

**İş:** Tarih aralığı pencereleri, watermark ve geç gelen kayıtlar için yeniden tarama uygula.

**Kabul:** Tekrar çalıştırma aynı farkı çoğaltmaz; limit ve saat dilimi sınır testleri geçer.

**Kaba tahmin:** 4 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-093 · Fark kuyruğu

**İş:** Eksik, fazla, tutar farkı ve zaman farkını sorumluya ata.

**Kabul:** Seed verisindeki bütün kasıtlı farklar bulunur; kapanış gerekçesi audit kaydına girer.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

## Sprint kabulü

Her GP kartının yukarıdaki kabul kriteri kanıtlanmalı. [Ortak Definition of Done](https://karacaismail.github.io/galaxyPayFrappe/docs/gelistirme-sureci/) uygulanır; [test matrisindeki](https://karacaismail.github.io/galaxyPayFrappe/docs/test-stratejisi/) ilgili senaryolar çalışır. Çalışmayan/dış bağımlılığa takılan testler açık bırakılır. Kanıt paketi: commit, ortam, fixture sürümü, test çıktısı, demo kaydı, reviewer ve açık Q bağlantıları. Faz çıkışı gerekiyorsa [kapı tutanağı](https://karacaismail.github.io/galaxyPayFrappe/docs/kabul-kapilari/) eklenir.

## Sprint içi çalışma

Gün 1: sözleşme/DoR ve sahiplik. Gün 2–7: GP kartlarını küçük dilimlerle uygula. Gün 8: entegrasyon/negatif senaryolar. Gün 9: UAT/doküman/release provası. Gün 10: demo ve kabul. Sağlayıcı cevabı gecikirse mock ve bağımsız işleri ilerlet; teyit gerektiren kabiliyeti canlıya açma.

## AI görev istemi

Aşağıdaki metin ilgili sprint bağlamını taşır; uygulama sırasında sıradaki tek GP kartına daralt. Kod bloklarının sağ üstündeki düğmeyle kopyalanabilir.

```text
S09 / Günlük mutabakat sprintini uygula.
Önce mevcut repo, docs/mimari, docs/api-referansi, docs/odeme-akisi,
docs/test-stratejisi ve bu sprintin GP kartlarını oku.
Bağımlılık: S08. Teyit ihtiyacı: Tarih aralığı API timezone/limit ve settlement dosyası erişimi.
İş kartları: GP-091, GP-092, GP-093.
Her seferinde tek kartın küçük dikey dilimini ele al.
Provider davranışını uydurma; bilinmeyeni Q kaydına bağla.
Credentialı istemciye/loga taşıma; para/tenant/idempotency kurallarını koru.
Kabul kriterini önce test senaryosuna dönüştür, sonra kodu uygula.
Çalıştırılan testleri ve çalıştırılamayan doğrulamaları ayrı raporla.
Diff, docs güncellemesi, kanıt ve açık riskleri sun.
Bu prompt tek başına canlı ödeme, iade veya üretim deploy yetkisi değildir.
```

## Hazırlık kontrolü

- [ ] Önceki sprint kanıtı ve bağımlılıklar okundu.
- [ ] Her GP kartı için sorumlu/reviewer belirlendi.
- [ ] Pozitif ve negatif kabul senaryoları hazır.
- [ ] Test verisi sentetik; secretlar güvenli kanalda.
- [ ] Demo, test kanıtı ve açık risk kaydı eklendi.

Bu kutular yalnızca bu tarayıcıda tutulan kişisel notlardır; paylaşılan görev durumu veya resmi kabul kaydı değildir.

## Sonraki adım

[S10 sprintine geç](https://karacaismail.github.io/galaxyPayFrappe/docs/sprint-10/).


---

# S10 · Finans raporları ve kapanış

Kaynak: src/content/docs/sprint-10.md

## Sprint hedefi

G3 finans operasyon kabulü ve örnek kapanış paketi. **Planlandı · henüz geliştirilmedi.** Faz 3: Finansal operasyon. Süre 2 hafta; 10 geliştirme kişi-günü kapsam + 4 gün entegrasyon/review kapasitesi önerisi. [Kapasite varsayımları](https://karacaismail.github.io/galaxyPayFrappe/docs/kapsam/).

| Alan | Karar |
|---|---|
| Önkoşul | S09 ve ilgili kapının kanıtı |
| Birincil roller | Finans + BE + FE |
| Dış bağımlılık | Komisyon/net tutar ve mali belge sorumluluğu teyidi. |
| Teslim | G3 finans operasyon kabulü ve örnek kapanış paketi. |

## İş kartları

### GP-101 · Finans raporu

**İş:** Brüt, net, komisyon, iade ve açık farkları kaynak referanslarıyla göster.

**Kabul:** Hesaplama decimal ile yapılır; örnek dönem toplamları kaynaklarla eşleşir.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-102 · Güvenli dışa aktarım

**İş:** Rol kapsamlı CSV, formül enjeksiyonu koruması ve export audit uygula.

**Kabul:** Yetkisiz dışa aktarım engellenir; kişisel veri minimize edilir.

**Kaba tahmin:** 4 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-103 · Kapanış kontrolü

**İş:** Ay kapanışı, geç kayıt düzeltmesi ve dönem kilidi politikası yaz.

**Kabul:** Finans örnek dönemi kapatır; düzeltme iz bırakır ve geçmişi sessiz değiştirmez.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

## Sprint kabulü

Her GP kartının yukarıdaki kabul kriteri kanıtlanmalı. [Ortak Definition of Done](https://karacaismail.github.io/galaxyPayFrappe/docs/gelistirme-sureci/) uygulanır; [test matrisindeki](https://karacaismail.github.io/galaxyPayFrappe/docs/test-stratejisi/) ilgili senaryolar çalışır. Çalışmayan/dış bağımlılığa takılan testler açık bırakılır. Kanıt paketi: commit, ortam, fixture sürümü, test çıktısı, demo kaydı, reviewer ve açık Q bağlantıları. Faz çıkışı gerekiyorsa [kapı tutanağı](https://karacaismail.github.io/galaxyPayFrappe/docs/kabul-kapilari/) eklenir.

## Sprint içi çalışma

Gün 1: sözleşme/DoR ve sahiplik. Gün 2–7: GP kartlarını küçük dilimlerle uygula. Gün 8: entegrasyon/negatif senaryolar. Gün 9: UAT/doküman/release provası. Gün 10: demo ve kabul. Sağlayıcı cevabı gecikirse mock ve bağımsız işleri ilerlet; teyit gerektiren kabiliyeti canlıya açma.

## AI görev istemi

Aşağıdaki metin ilgili sprint bağlamını taşır; uygulama sırasında sıradaki tek GP kartına daralt. Kod bloklarının sağ üstündeki düğmeyle kopyalanabilir.

```text
S10 / Finans raporları ve kapanış sprintini uygula.
Önce mevcut repo, docs/mimari, docs/api-referansi, docs/odeme-akisi,
docs/test-stratejisi ve bu sprintin GP kartlarını oku.
Bağımlılık: S09. Teyit ihtiyacı: Komisyon/net tutar ve mali belge sorumluluğu teyidi.
İş kartları: GP-101, GP-102, GP-103.
Her seferinde tek kartın küçük dikey dilimini ele al.
Provider davranışını uydurma; bilinmeyeni Q kaydına bağla.
Credentialı istemciye/loga taşıma; para/tenant/idempotency kurallarını koru.
Kabul kriterini önce test senaryosuna dönüştür, sonra kodu uygula.
Çalıştırılan testleri ve çalıştırılamayan doğrulamaları ayrı raporla.
Diff, docs güncellemesi, kanıt ve açık riskleri sun.
Bu prompt tek başına canlı ödeme, iade veya üretim deploy yetkisi değildir.
```

## Hazırlık kontrolü

- [ ] Önceki sprint kanıtı ve bağımlılıklar okundu.
- [ ] Her GP kartı için sorumlu/reviewer belirlendi.
- [ ] Pozitif ve negatif kabul senaryoları hazır.
- [ ] Test verisi sentetik; secretlar güvenli kanalda.
- [ ] Demo, test kanıtı ve açık risk kaydı eklendi.

Bu kutular yalnızca bu tarayıcıda tutulan kişisel notlardır; paylaşılan görev durumu veya resmi kabul kaydı değildir.

## Sonraki adım

[S11 sprintine geç](https://karacaismail.github.io/galaxyPayFrappe/docs/sprint-11/).


---

# S11 · Worker, inbox ve outbox dayanıklılığı

Kaynak: src/content/docs/sprint-11.md

## Sprint hedefi

Kesinti ve worker restart kanıtı; queue age dashboardu. **Planlandı · henüz geliştirilmedi.** Faz 4: Dayanıklılık. Süre 2 hafta; 10 geliştirme kişi-günü kapsam + 4 gün entegrasyon/review kapasitesi önerisi. [Kapasite varsayımları](https://karacaismail.github.io/galaxyPayFrappe/docs/kapsam/).

| Alan | Karar |
|---|---|
| Önkoşul | S10 ve ilgili kapının kanıtı |
| Birincil roller | BE + Platform |
| Dış bağımlılık | Ölçülen backlog ve iş hacmi. |
| Teslim | Kesinti ve worker restart kanıtı; queue age dashboardu. |

## İş kartları

### GP-111 · Kalıcı iş yürütme

**İş:** İş lease, retry sayacı ve outbox teslimini kur; mevcut DB inboxı kullan.

**Kabul:** Worker işlem ortasında ölürse iş kaybolmaz; aynı yan etki iki kez oluşmaz.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-112 · Zehirli mesaj yönetimi

**İş:** Backoff/jitter, dead-letter ve yetkili replay ekle.

**Kabul:** Bozuk mesaj sağlıklı işleri durdurmaz; replay gerekçesi audit edilir.

**Kaba tahmin:** 4 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-113 · Backpressure

**İş:** Sağlayıcı limitine göre concurrency ve circuit breaker uygula.

**Kabul:** Sağlayıcı kesintisinde sınırsız kuyruk/istek fırtınası oluşmaz.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

## Sprint kabulü

Her GP kartının yukarıdaki kabul kriteri kanıtlanmalı. [Ortak Definition of Done](https://karacaismail.github.io/galaxyPayFrappe/docs/gelistirme-sureci/) uygulanır; [test matrisindeki](https://karacaismail.github.io/galaxyPayFrappe/docs/test-stratejisi/) ilgili senaryolar çalışır. Çalışmayan/dış bağımlılığa takılan testler açık bırakılır. Kanıt paketi: commit, ortam, fixture sürümü, test çıktısı, demo kaydı, reviewer ve açık Q bağlantıları. Faz çıkışı gerekiyorsa [kapı tutanağı](https://karacaismail.github.io/galaxyPayFrappe/docs/kabul-kapilari/) eklenir.

## Sprint içi çalışma

Gün 1: sözleşme/DoR ve sahiplik. Gün 2–7: GP kartlarını küçük dilimlerle uygula. Gün 8: entegrasyon/negatif senaryolar. Gün 9: UAT/doküman/release provası. Gün 10: demo ve kabul. Sağlayıcı cevabı gecikirse mock ve bağımsız işleri ilerlet; teyit gerektiren kabiliyeti canlıya açma.

## AI görev istemi

Aşağıdaki metin ilgili sprint bağlamını taşır; uygulama sırasında sıradaki tek GP kartına daralt. Kod bloklarının sağ üstündeki düğmeyle kopyalanabilir.

```text
S11 / Worker, inbox ve outbox dayanıklılığı sprintini uygula.
Önce mevcut repo, docs/mimari, docs/api-referansi, docs/odeme-akisi,
docs/test-stratejisi ve bu sprintin GP kartlarını oku.
Bağımlılık: S10. Teyit ihtiyacı: Ölçülen backlog ve iş hacmi.
İş kartları: GP-111, GP-112, GP-113.
Her seferinde tek kartın küçük dikey dilimini ele al.
Provider davranışını uydurma; bilinmeyeni Q kaydına bağla.
Credentialı istemciye/loga taşıma; para/tenant/idempotency kurallarını koru.
Kabul kriterini önce test senaryosuna dönüştür, sonra kodu uygula.
Çalıştırılan testleri ve çalıştırılamayan doğrulamaları ayrı raporla.
Diff, docs güncellemesi, kanıt ve açık riskleri sun.
Bu prompt tek başına canlı ödeme, iade veya üretim deploy yetkisi değildir.
```

## Hazırlık kontrolü

- [ ] Önceki sprint kanıtı ve bağımlılıklar okundu.
- [ ] Her GP kartı için sorumlu/reviewer belirlendi.
- [ ] Pozitif ve negatif kabul senaryoları hazır.
- [ ] Test verisi sentetik; secretlar güvenli kanalda.
- [ ] Demo, test kanıtı ve açık risk kaydı eklendi.

Bu kutular yalnızca bu tarayıcıda tutulan kişisel notlardır; paylaşılan görev durumu veya resmi kabul kaydı değildir.

## Sonraki adım

[S12 sprintine geç](https://karacaismail.github.io/galaxyPayFrappe/docs/sprint-12/).


---

# S12 · Performans ve kapasite

Kaynak: src/content/docs/sprint-12.md

## Sprint hedefi

Tekrarlanabilir yük raporu ve kapasite eşiği. **Planlandı · henüz geliştirilmedi.** Faz 4: Dayanıklılık. Süre 2 hafta; 10 geliştirme kişi-günü kapsam + 4 gün entegrasyon/review kapasitesi önerisi. [Kapasite varsayımları](https://karacaismail.github.io/galaxyPayFrappe/docs/kapsam/).

| Alan | Karar |
|---|---|
| Önkoşul | S11 ve ilgili kapının kanıtı |
| Birincil roller | Platform + BE + QA |
| Dış bağımlılık | Hedef trafik, p95 bütçesi ve sağlayıcı sandbox yük izni. |
| Teslim | Tekrarlanabilir yük raporu ve kapasite eşiği. |

## İş kartları

### GP-121 · Yük modeli

**İş:** Ölçülen baz trafik ve 2x tepe profili; mock ve canlı limitlerini ayır.

**Kabul:** Sağlayıcıya izinsiz yük gönderilmez; workload dağılımı belgeli.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-122 · Profil ve iyileştirme

**İş:** DB index, sorgu planı, connection pool ve kontrollü token refreshi optimize et.

**Kabul:** 2x yükte iç API p95 ≤500 ms hedefi ölçülür; sağlayıcı/3DS süresi ayrı raporlanır.

**Kaba tahmin:** 4 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-123 · Süreklilik testi

**İş:** Soak, ani yükselme ve kapasite alarmı ekle.

**Kabul:** Kaynak tüketimi dengelenir; hata bütçesi aşımı otomatik rollout durdurur.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

## Sprint kabulü

Her GP kartının yukarıdaki kabul kriteri kanıtlanmalı. [Ortak Definition of Done](https://karacaismail.github.io/galaxyPayFrappe/docs/gelistirme-sureci/) uygulanır; [test matrisindeki](https://karacaismail.github.io/galaxyPayFrappe/docs/test-stratejisi/) ilgili senaryolar çalışır. Çalışmayan/dış bağımlılığa takılan testler açık bırakılır. Kanıt paketi: commit, ortam, fixture sürümü, test çıktısı, demo kaydı, reviewer ve açık Q bağlantıları. Faz çıkışı gerekiyorsa [kapı tutanağı](https://karacaismail.github.io/galaxyPayFrappe/docs/kabul-kapilari/) eklenir.

## Sprint içi çalışma

Gün 1: sözleşme/DoR ve sahiplik. Gün 2–7: GP kartlarını küçük dilimlerle uygula. Gün 8: entegrasyon/negatif senaryolar. Gün 9: UAT/doküman/release provası. Gün 10: demo ve kabul. Sağlayıcı cevabı gecikirse mock ve bağımsız işleri ilerlet; teyit gerektiren kabiliyeti canlıya açma.

## AI görev istemi

Aşağıdaki metin ilgili sprint bağlamını taşır; uygulama sırasında sıradaki tek GP kartına daralt. Kod bloklarının sağ üstündeki düğmeyle kopyalanabilir.

```text
S12 / Performans ve kapasite sprintini uygula.
Önce mevcut repo, docs/mimari, docs/api-referansi, docs/odeme-akisi,
docs/test-stratejisi ve bu sprintin GP kartlarını oku.
Bağımlılık: S11. Teyit ihtiyacı: Hedef trafik, p95 bütçesi ve sağlayıcı sandbox yük izni.
İş kartları: GP-121, GP-122, GP-123.
Her seferinde tek kartın küçük dikey dilimini ele al.
Provider davranışını uydurma; bilinmeyeni Q kaydına bağla.
Credentialı istemciye/loga taşıma; para/tenant/idempotency kurallarını koru.
Kabul kriterini önce test senaryosuna dönüştür, sonra kodu uygula.
Çalıştırılan testleri ve çalıştırılamayan doğrulamaları ayrı raporla.
Diff, docs güncellemesi, kanıt ve açık riskleri sun.
Bu prompt tek başına canlı ödeme, iade veya üretim deploy yetkisi değildir.
```

## Hazırlık kontrolü

- [ ] Önceki sprint kanıtı ve bağımlılıklar okundu.
- [ ] Her GP kartı için sorumlu/reviewer belirlendi.
- [ ] Pozitif ve negatif kabul senaryoları hazır.
- [ ] Test verisi sentetik; secretlar güvenli kanalda.
- [ ] Demo, test kanıtı ve açık risk kaydı eklendi.

Bu kutular yalnızca bu tarayıcıda tutulan kişisel notlardır; paylaşılan görev durumu veya resmi kabul kaydı değildir.

## Sonraki adım

[S13 sprintine geç](https://karacaismail.github.io/galaxyPayFrappe/docs/sprint-13/).


---

# S13 · Felaket kurtarma ve release güvenliği

Kaynak: src/content/docs/sprint-13.md

## Sprint hedefi

G4 dayanıklılık raporu ve kurtarma süreleri. **Planlandı · henüz geliştirilmedi.** Faz 4: Dayanıklılık. Süre 2 hafta; 10 geliştirme kişi-günü kapsam + 4 gün entegrasyon/review kapasitesi önerisi. [Kapasite varsayımları](https://karacaismail.github.io/galaxyPayFrappe/docs/kapsam/).

| Alan | Karar |
|---|---|
| Önkoşul | S12 ve ilgili kapının kanıtı |
| Birincil roller | Platform + TL |
| Dış bağımlılık | RPO/RTO işletme kararı ve yedek altyapısı. |
| Teslim | G4 dayanıklılık raporu ve kurtarma süreleri. |

## İş kartları

### GP-131 · Geri yükleme

**İş:** Şifreli yedek, PITR varsa doğrulama, restore otomasyonu kur.

**Kabul:** Hedef RPO ≤15 dk / RTO ≤60 dk test ortamında ölçülür; desteklenmeyen hedef kaydedilir.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-132 · Release stratejisi

**İş:** Expand/contract migration, kademeli rollout ve geri dönüş prova et.

**Kabul:** Eski/yeni uygulama şemayla birlikte çalışır; veri yıkıcı rollback kullanılmaz.

**Kaba tahmin:** 4 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-133 · Kesinti tatbikatı

**İş:** DB/sağlayıcı/ağ kesintisi ve açık ödemeleri kurtarma akışını prova et.

**Kabul:** Yeni tahsilat durdurulurken callback alımı ve mutabakat korunur.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

## Sprint kabulü

Her GP kartının yukarıdaki kabul kriteri kanıtlanmalı. [Ortak Definition of Done](https://karacaismail.github.io/galaxyPayFrappe/docs/gelistirme-sureci/) uygulanır; [test matrisindeki](https://karacaismail.github.io/galaxyPayFrappe/docs/test-stratejisi/) ilgili senaryolar çalışır. Çalışmayan/dış bağımlılığa takılan testler açık bırakılır. Kanıt paketi: commit, ortam, fixture sürümü, test çıktısı, demo kaydı, reviewer ve açık Q bağlantıları. Faz çıkışı gerekiyorsa [kapı tutanağı](https://karacaismail.github.io/galaxyPayFrappe/docs/kabul-kapilari/) eklenir.

## Sprint içi çalışma

Gün 1: sözleşme/DoR ve sahiplik. Gün 2–7: GP kartlarını küçük dilimlerle uygula. Gün 8: entegrasyon/negatif senaryolar. Gün 9: UAT/doküman/release provası. Gün 10: demo ve kabul. Sağlayıcı cevabı gecikirse mock ve bağımsız işleri ilerlet; teyit gerektiren kabiliyeti canlıya açma.

## AI görev istemi

Aşağıdaki metin ilgili sprint bağlamını taşır; uygulama sırasında sıradaki tek GP kartına daralt. Kod bloklarının sağ üstündeki düğmeyle kopyalanabilir.

```text
S13 / Felaket kurtarma ve release güvenliği sprintini uygula.
Önce mevcut repo, docs/mimari, docs/api-referansi, docs/odeme-akisi,
docs/test-stratejisi ve bu sprintin GP kartlarını oku.
Bağımlılık: S12. Teyit ihtiyacı: RPO/RTO işletme kararı ve yedek altyapısı.
İş kartları: GP-131, GP-132, GP-133.
Her seferinde tek kartın küçük dikey dilimini ele al.
Provider davranışını uydurma; bilinmeyeni Q kaydına bağla.
Credentialı istemciye/loga taşıma; para/tenant/idempotency kurallarını koru.
Kabul kriterini önce test senaryosuna dönüştür, sonra kodu uygula.
Çalıştırılan testleri ve çalıştırılamayan doğrulamaları ayrı raporla.
Diff, docs güncellemesi, kanıt ve açık riskleri sun.
Bu prompt tek başına canlı ödeme, iade veya üretim deploy yetkisi değildir.
```

## Hazırlık kontrolü

- [ ] Önceki sprint kanıtı ve bağımlılıklar okundu.
- [ ] Her GP kartı için sorumlu/reviewer belirlendi.
- [ ] Pozitif ve negatif kabul senaryoları hazır.
- [ ] Test verisi sentetik; secretlar güvenli kanalda.
- [ ] Demo, test kanıtı ve açık risk kaydı eklendi.

Bu kutular yalnızca bu tarayıcıda tutulan kişisel notlardır; paylaşılan görev durumu veya resmi kabul kaydı değildir.

## Sonraki adım

[S14 sprintine geç](https://karacaismail.github.io/galaxyPayFrappe/docs/sprint-14/).


---

# S14 · Tehdit modeli ve bağımsız test

Kaynak: src/content/docs/sprint-14.md

## Sprint hedefi

Tehdit modeli v2 ve yeniden test raporu. **Planlandı · henüz geliştirilmedi.** Faz 5: Güvenlik & yönetişim. Süre 2 hafta; 10 geliştirme kişi-günü kapsam + 4 gün entegrasyon/review kapasitesi önerisi. [Kapasite varsayımları](https://karacaismail.github.io/galaxyPayFrappe/docs/kapsam/).

| Alan | Karar |
|---|---|
| Önkoşul | S13 ve ilgili kapının kanıtı |
| Birincil roller | Güvenlik + BE + QA |
| Dış bağımlılık | Test kapsamı ve yetkilendirilmiş ortam. |
| Teslim | Tehdit modeli v2 ve yeniden test raporu. |

## İş kartları

### GP-141 · Tehdit modelini genişlet

**İş:** Trust boundary, webhook replay, IDOR, XSS, SSRF ve supply chain senaryolarını işle.

**Kabul:** Her kritik varlık ve saldırı yolu bir kontrol/test ile eşleşir.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-142 · İleri saldırı testleri

**İş:** Yetki aşımı, tenant kaçışı, eşzamanlılık ve payment link sızıntısını test et.

**Kabul:** Açıklar tekrar üretilebilir kanıt ve risk sahibiyle kaydedilir.

**Kaba tahmin:** 4 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-143 · Bulguları kapat

**İş:** Kritik/yüksek bulguları düzelt ve yeniden test et.

**Kabul:** Açık kritik/yüksek risk kalmaz; süreli istisna sürüm engelini sessiz kaldırmaz.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

## Sprint kabulü

Her GP kartının yukarıdaki kabul kriteri kanıtlanmalı. [Ortak Definition of Done](https://karacaismail.github.io/galaxyPayFrappe/docs/gelistirme-sureci/) uygulanır; [test matrisindeki](https://karacaismail.github.io/galaxyPayFrappe/docs/test-stratejisi/) ilgili senaryolar çalışır. Çalışmayan/dış bağımlılığa takılan testler açık bırakılır. Kanıt paketi: commit, ortam, fixture sürümü, test çıktısı, demo kaydı, reviewer ve açık Q bağlantıları. Faz çıkışı gerekiyorsa [kapı tutanağı](https://karacaismail.github.io/galaxyPayFrappe/docs/kabul-kapilari/) eklenir.

## Sprint içi çalışma

Gün 1: sözleşme/DoR ve sahiplik. Gün 2–7: GP kartlarını küçük dilimlerle uygula. Gün 8: entegrasyon/negatif senaryolar. Gün 9: UAT/doküman/release provası. Gün 10: demo ve kabul. Sağlayıcı cevabı gecikirse mock ve bağımsız işleri ilerlet; teyit gerektiren kabiliyeti canlıya açma.

## AI görev istemi

Aşağıdaki metin ilgili sprint bağlamını taşır; uygulama sırasında sıradaki tek GP kartına daralt. Kod bloklarının sağ üstündeki düğmeyle kopyalanabilir.

```text
S14 / Tehdit modeli ve bağımsız test sprintini uygula.
Önce mevcut repo, docs/mimari, docs/api-referansi, docs/odeme-akisi,
docs/test-stratejisi ve bu sprintin GP kartlarını oku.
Bağımlılık: S13. Teyit ihtiyacı: Test kapsamı ve yetkilendirilmiş ortam.
İş kartları: GP-141, GP-142, GP-143.
Her seferinde tek kartın küçük dikey dilimini ele al.
Provider davranışını uydurma; bilinmeyeni Q kaydına bağla.
Credentialı istemciye/loga taşıma; para/tenant/idempotency kurallarını koru.
Kabul kriterini önce test senaryosuna dönüştür, sonra kodu uygula.
Çalıştırılan testleri ve çalıştırılamayan doğrulamaları ayrı raporla.
Diff, docs güncellemesi, kanıt ve açık riskleri sun.
Bu prompt tek başına canlı ödeme, iade veya üretim deploy yetkisi değildir.
```

## Hazırlık kontrolü

- [ ] Önceki sprint kanıtı ve bağımlılıklar okundu.
- [ ] Her GP kartı için sorumlu/reviewer belirlendi.
- [ ] Pozitif ve negatif kabul senaryoları hazır.
- [ ] Test verisi sentetik; secretlar güvenli kanalda.
- [ ] Demo, test kanıtı ve açık risk kaydı eklendi.

Bu kutular yalnızca bu tarayıcıda tutulan kişisel notlardır; paylaşılan görev durumu veya resmi kabul kaydı değildir.

## Sonraki adım

[S15 sprintine geç](https://karacaismail.github.io/galaxyPayFrappe/docs/sprint-15/).


---

# S15 · Veri yaşam döngüsü ve gizlilik

Kaynak: src/content/docs/sprint-15.md

## Sprint hedefi

Veri envanteri ve doğrulanmış yaşam döngüsü kontrolleri. **Planlandı · henüz geliştirilmedi.** Faz 5: Güvenlik & yönetişim. Süre 2 hafta; 10 geliştirme kişi-günü kapsam + 4 gün entegrasyon/review kapasitesi önerisi. [Kapasite varsayımları](https://karacaismail.github.io/galaxyPayFrappe/docs/kapsam/).

| Alan | Karar |
|---|---|
| Önkoşul | S14 ve ilgili kapının kanıtı |
| Birincil roller | Veri sahibi + Hukuk + BE |
| Dış bağımlılık | Kişisel veri envanteri ve saklama gereksinimleri. |
| Teslim | Veri envanteri ve doğrulanmış yaşam döngüsü kontrolleri. |

## İş kartları

### GP-151 · Veri haritası

**İş:** Telefon/ad/log/callback/destek/export akışlarını amaç ve erişim rolüyle envanterle.

**Kabul:** Her alanın sahibi, saklama süresi ve aktarım noktası kayıtlı.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-152 · Saklama ve silme

**İş:** Onaylı retention, legal hold ve anonimleştirme görevlerini uygula.

**Kabul:** Süre dolan örnek veri silinir; muhasebe kayıt bütünlüğü korunur.

**Kaba tahmin:** 4 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-153 · İlgili kişi süreçleri

**İş:** Erişim/düzeltme/silme talepleri için kimlik doğrulama ve kayıt akışı tasarla.

**Kabul:** Deneme talebi uçtan uca izlenir; süreler hukuk tarafından onaylanır.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

## Sprint kabulü

Her GP kartının yukarıdaki kabul kriteri kanıtlanmalı. [Ortak Definition of Done](https://karacaismail.github.io/galaxyPayFrappe/docs/gelistirme-sureci/) uygulanır; [test matrisindeki](https://karacaismail.github.io/galaxyPayFrappe/docs/test-stratejisi/) ilgili senaryolar çalışır. Çalışmayan/dış bağımlılığa takılan testler açık bırakılır. Kanıt paketi: commit, ortam, fixture sürümü, test çıktısı, demo kaydı, reviewer ve açık Q bağlantıları. Faz çıkışı gerekiyorsa [kapı tutanağı](https://karacaismail.github.io/galaxyPayFrappe/docs/kabul-kapilari/) eklenir.

## Sprint içi çalışma

Gün 1: sözleşme/DoR ve sahiplik. Gün 2–7: GP kartlarını küçük dilimlerle uygula. Gün 8: entegrasyon/negatif senaryolar. Gün 9: UAT/doküman/release provası. Gün 10: demo ve kabul. Sağlayıcı cevabı gecikirse mock ve bağımsız işleri ilerlet; teyit gerektiren kabiliyeti canlıya açma.

## AI görev istemi

Aşağıdaki metin ilgili sprint bağlamını taşır; uygulama sırasında sıradaki tek GP kartına daralt. Kod bloklarının sağ üstündeki düğmeyle kopyalanabilir.

```text
S15 / Veri yaşam döngüsü ve gizlilik sprintini uygula.
Önce mevcut repo, docs/mimari, docs/api-referansi, docs/odeme-akisi,
docs/test-stratejisi ve bu sprintin GP kartlarını oku.
Bağımlılık: S14. Teyit ihtiyacı: Kişisel veri envanteri ve saklama gereksinimleri.
İş kartları: GP-151, GP-152, GP-153.
Her seferinde tek kartın küçük dikey dilimini ele al.
Provider davranışını uydurma; bilinmeyeni Q kaydına bağla.
Credentialı istemciye/loga taşıma; para/tenant/idempotency kurallarını koru.
Kabul kriterini önce test senaryosuna dönüştür, sonra kodu uygula.
Çalıştırılan testleri ve çalıştırılamayan doğrulamaları ayrı raporla.
Diff, docs güncellemesi, kanıt ve açık riskleri sun.
Bu prompt tek başına canlı ödeme, iade veya üretim deploy yetkisi değildir.
```

## Hazırlık kontrolü

- [ ] Önceki sprint kanıtı ve bağımlılıklar okundu.
- [ ] Her GP kartı için sorumlu/reviewer belirlendi.
- [ ] Pozitif ve negatif kabul senaryoları hazır.
- [ ] Test verisi sentetik; secretlar güvenli kanalda.
- [ ] Demo, test kanıtı ve açık risk kaydı eklendi.

Bu kutular yalnızca bu tarayıcıda tutulan kişisel notlardır; paylaşılan görev durumu veya resmi kabul kaydı değildir.

## Sonraki adım

[S16 sprintine geç](https://karacaismail.github.io/galaxyPayFrappe/docs/sprint-16/).


---

# S16 · Denetim ve yazılım tedarik zinciri

Kaynak: src/content/docs/sprint-16.md

## Sprint hedefi

G5 yönetişim kapısı ve denetlenebilir sürüm kanıtı. **Planlandı · henüz geliştirilmedi.** Faz 5: Güvenlik & yönetişim. Süre 2 hafta; 10 geliştirme kişi-günü kapsam + 4 gün entegrasyon/review kapasitesi önerisi. [Kapasite varsayımları](https://karacaismail.github.io/galaxyPayFrappe/docs/kapsam/).

| Alan | Karar |
|---|---|
| Önkoşul | S15 ve ilgili kapının kanıtı |
| Birincil roller | Güvenlik + Platform / TL |
| Dış bağımlılık | Denetim kapsamı ve kanıt deposu. |
| Teslim | G5 yönetişim kapısı ve denetlenebilir sürüm kanıtı. |

## İş kartları

### GP-161 · Audit bütünlüğü

**İş:** Rol, ödeme, iade, config ve export olaylarını erişimi sınırlı depoda sakla.

**Kabul:** Yetkisiz silme/değişiklik testleri başarısız; hassas gövde audit içine taşınmaz.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-162 · Build provenance

**İş:** SBOM, bağımlılık/lisans taraması ve imzalı artifact akışını kur.

**Kabul:** Deploy edilen artifact commit ve CI çalışmasına kadar izlenebilir.

**Kaba tahmin:** 4 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-163 · Kontrol kanıtları

**İş:** Erişim gözden geçirme, secret rotasyon ve değişiklik kanıtlarını birleştir.

**Kabul:** G5 kontrol sahipleri kabul verir; sertifikasyon iddiası yapılmaz.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

## Sprint kabulü

Her GP kartının yukarıdaki kabul kriteri kanıtlanmalı. [Ortak Definition of Done](https://karacaismail.github.io/galaxyPayFrappe/docs/gelistirme-sureci/) uygulanır; [test matrisindeki](https://karacaismail.github.io/galaxyPayFrappe/docs/test-stratejisi/) ilgili senaryolar çalışır. Çalışmayan/dış bağımlılığa takılan testler açık bırakılır. Kanıt paketi: commit, ortam, fixture sürümü, test çıktısı, demo kaydı, reviewer ve açık Q bağlantıları. Faz çıkışı gerekiyorsa [kapı tutanağı](https://karacaismail.github.io/galaxyPayFrappe/docs/kabul-kapilari/) eklenir.

## Sprint içi çalışma

Gün 1: sözleşme/DoR ve sahiplik. Gün 2–7: GP kartlarını küçük dilimlerle uygula. Gün 8: entegrasyon/negatif senaryolar. Gün 9: UAT/doküman/release provası. Gün 10: demo ve kabul. Sağlayıcı cevabı gecikirse mock ve bağımsız işleri ilerlet; teyit gerektiren kabiliyeti canlıya açma.

## AI görev istemi

Aşağıdaki metin ilgili sprint bağlamını taşır; uygulama sırasında sıradaki tek GP kartına daralt. Kod bloklarının sağ üstündeki düğmeyle kopyalanabilir.

```text
S16 / Denetim ve yazılım tedarik zinciri sprintini uygula.
Önce mevcut repo, docs/mimari, docs/api-referansi, docs/odeme-akisi,
docs/test-stratejisi ve bu sprintin GP kartlarını oku.
Bağımlılık: S15. Teyit ihtiyacı: Denetim kapsamı ve kanıt deposu.
İş kartları: GP-161, GP-162, GP-163.
Her seferinde tek kartın küçük dikey dilimini ele al.
Provider davranışını uydurma; bilinmeyeni Q kaydına bağla.
Credentialı istemciye/loga taşıma; para/tenant/idempotency kurallarını koru.
Kabul kriterini önce test senaryosuna dönüştür, sonra kodu uygula.
Çalıştırılan testleri ve çalıştırılamayan doğrulamaları ayrı raporla.
Diff, docs güncellemesi, kanıt ve açık riskleri sun.
Bu prompt tek başına canlı ödeme, iade veya üretim deploy yetkisi değildir.
```

## Hazırlık kontrolü

- [ ] Önceki sprint kanıtı ve bağımlılıklar okundu.
- [ ] Her GP kartı için sorumlu/reviewer belirlendi.
- [ ] Pozitif ve negatif kabul senaryoları hazır.
- [ ] Test verisi sentetik; secretlar güvenli kanalda.
- [ ] Demo, test kanıtı ve açık risk kaydı eklendi.

Bu kutular yalnızca bu tarayıcıda tutulan kişisel notlardır; paylaşılan görev durumu veya resmi kabul kaydı değildir.

## Sonraki adım

[S17 sprintine geç](https://karacaismail.github.io/galaxyPayFrappe/docs/sprint-17/).


---

# S17 · Contract-first entegrasyon platformu

Kaynak: src/content/docs/sprint-17.md

## Sprint hedefi

Sürüm kontrollü sözleşme hattı ve adaptör rehberi. **Planlandı · henüz geliştirilmedi.** Faz 6: Platform & DX. Süre 2 hafta; 10 geliştirme kişi-günü kapsam + 4 gün entegrasyon/review kapasitesi önerisi. [Kapasite varsayımları](https://karacaismail.github.io/galaxyPayFrappe/docs/kapsam/).

| Alan | Karar |
|---|---|
| Önkoşul | S16 ve ilgili kapının kanıtı |
| Birincil roller | BE + DX |
| Dış bağımlılık | Swagger güncelleme sıklığı ve sürüm politikası. |
| Teslim | Sürüm kontrollü sözleşme hattı ve adaptör rehberi. |

## İş kartları

### GP-171 · Şema değişim hattı

**İş:** Planlı OpenAPI snapshot, breaking diff ve sorumlu bildirimi kur.

**Kabul:** Alan silme/tip değişimi CI contract gateini kırar.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-172 · Adaptör sınırı

**İş:** Sağlayıcı DTOsunu domain modelinden ayır; hata/durum maplerini tek yerde tut.

**Kabul:** Sağlayıcı şema değişikliği domain dışına yayılmaz; bilinmeyen enum incelemeye gider.

**Kaba tahmin:** 4 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-173 · Versiyon politikası

**İş:** İç API deprecation, migration ve tüketici testlerini ekle.

**Kabul:** Örnek eski tüketici geçiş penceresinde çalışır.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

## Sprint kabulü

Her GP kartının yukarıdaki kabul kriteri kanıtlanmalı. [Ortak Definition of Done](https://karacaismail.github.io/galaxyPayFrappe/docs/gelistirme-sureci/) uygulanır; [test matrisindeki](https://karacaismail.github.io/galaxyPayFrappe/docs/test-stratejisi/) ilgili senaryolar çalışır. Çalışmayan/dış bağımlılığa takılan testler açık bırakılır. Kanıt paketi: commit, ortam, fixture sürümü, test çıktısı, demo kaydı, reviewer ve açık Q bağlantıları. Faz çıkışı gerekiyorsa [kapı tutanağı](https://karacaismail.github.io/galaxyPayFrappe/docs/kabul-kapilari/) eklenir.

## Sprint içi çalışma

Gün 1: sözleşme/DoR ve sahiplik. Gün 2–7: GP kartlarını küçük dilimlerle uygula. Gün 8: entegrasyon/negatif senaryolar. Gün 9: UAT/doküman/release provası. Gün 10: demo ve kabul. Sağlayıcı cevabı gecikirse mock ve bağımsız işleri ilerlet; teyit gerektiren kabiliyeti canlıya açma.

## AI görev istemi

Aşağıdaki metin ilgili sprint bağlamını taşır; uygulama sırasında sıradaki tek GP kartına daralt. Kod bloklarının sağ üstündeki düğmeyle kopyalanabilir.

```text
S17 / Contract-first entegrasyon platformu sprintini uygula.
Önce mevcut repo, docs/mimari, docs/api-referansi, docs/odeme-akisi,
docs/test-stratejisi ve bu sprintin GP kartlarını oku.
Bağımlılık: S16. Teyit ihtiyacı: Swagger güncelleme sıklığı ve sürüm politikası.
İş kartları: GP-171, GP-172, GP-173.
Her seferinde tek kartın küçük dikey dilimini ele al.
Provider davranışını uydurma; bilinmeyeni Q kaydına bağla.
Credentialı istemciye/loga taşıma; para/tenant/idempotency kurallarını koru.
Kabul kriterini önce test senaryosuna dönüştür, sonra kodu uygula.
Çalıştırılan testleri ve çalıştırılamayan doğrulamaları ayrı raporla.
Diff, docs güncellemesi, kanıt ve açık riskleri sun.
Bu prompt tek başına canlı ödeme, iade veya üretim deploy yetkisi değildir.
```

## Hazırlık kontrolü

- [ ] Önceki sprint kanıtı ve bağımlılıklar okundu.
- [ ] Her GP kartı için sorumlu/reviewer belirlendi.
- [ ] Pozitif ve negatif kabul senaryoları hazır.
- [ ] Test verisi sentetik; secretlar güvenli kanalda.
- [ ] Demo, test kanıtı ve açık risk kaydı eklendi.

Bu kutular yalnızca bu tarayıcıda tutulan kişisel notlardır; paylaşılan görev durumu veya resmi kabul kaydı değildir.

## Sonraki adım

[S18 sprintine geç](https://karacaismail.github.io/galaxyPayFrappe/docs/sprint-18/).


---

# S18 · SDK, mock ve golden path

Kaynak: src/content/docs/sprint-18.md

## Sprint hedefi

Golden path paketi ve ölçülen onboarding süresi. **Planlandı · henüz geliştirilmedi.** Faz 6: Platform & DX. Süre 2 hafta; 10 geliştirme kişi-günü kapsam + 4 gün entegrasyon/review kapasitesi önerisi. [Kapasite varsayımları](https://karacaismail.github.io/galaxyPayFrappe/docs/kapsam/).

| Alan | Karar |
|---|---|
| Önkoşul | S17 ve ilgili kapının kanıtı |
| Birincil roller | DX + BE + QA |
| Dış bağımlılık | Desteklenecek tüketici dilleri ve ekip ihtiyacı. |
| Teslim | Golden path paketi ve ölçülen onboarding süresi. |

## İş kartları

### GP-181 · İstemci paketi

**İş:** Onaylı iç API için tipli istemci, hata tipleri ve örnek kod üret.

**Kabul:** Örnekler gerçek CI içinde derlenir; secret istemci SDKya girmez.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-182 · Senaryo sunucusu

**İş:** Başarı, gecikme, timeout, duplicate ve kötü şema fixturelarını paketle.

**Kabul:** Mock deterministiktir; gerçek API eşitliği contract testleriyle sınırlı olarak gösterilir.

**Kaba tahmin:** 4 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-183 · Tek komut deneyimi

**İş:** Kurulum, seed, test ve temizleme görevlerini standartlaştır.

**Kabul:** Yeni geliştirici ≤30 dk içinde ilk mock akışı tamamlar ve kanıtlar.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

## Sprint kabulü

Her GP kartının yukarıdaki kabul kriteri kanıtlanmalı. [Ortak Definition of Done](https://karacaismail.github.io/galaxyPayFrappe/docs/gelistirme-sureci/) uygulanır; [test matrisindeki](https://karacaismail.github.io/galaxyPayFrappe/docs/test-stratejisi/) ilgili senaryolar çalışır. Çalışmayan/dış bağımlılığa takılan testler açık bırakılır. Kanıt paketi: commit, ortam, fixture sürümü, test çıktısı, demo kaydı, reviewer ve açık Q bağlantıları. Faz çıkışı gerekiyorsa [kapı tutanağı](https://karacaismail.github.io/galaxyPayFrappe/docs/kabul-kapilari/) eklenir.

## Sprint içi çalışma

Gün 1: sözleşme/DoR ve sahiplik. Gün 2–7: GP kartlarını küçük dilimlerle uygula. Gün 8: entegrasyon/negatif senaryolar. Gün 9: UAT/doküman/release provası. Gün 10: demo ve kabul. Sağlayıcı cevabı gecikirse mock ve bağımsız işleri ilerlet; teyit gerektiren kabiliyeti canlıya açma.

## AI görev istemi

Aşağıdaki metin ilgili sprint bağlamını taşır; uygulama sırasında sıradaki tek GP kartına daralt. Kod bloklarının sağ üstündeki düğmeyle kopyalanabilir.

```text
S18 / SDK, mock ve golden path sprintini uygula.
Önce mevcut repo, docs/mimari, docs/api-referansi, docs/odeme-akisi,
docs/test-stratejisi ve bu sprintin GP kartlarını oku.
Bağımlılık: S17. Teyit ihtiyacı: Desteklenecek tüketici dilleri ve ekip ihtiyacı.
İş kartları: GP-181, GP-182, GP-183.
Her seferinde tek kartın küçük dikey dilimini ele al.
Provider davranışını uydurma; bilinmeyeni Q kaydına bağla.
Credentialı istemciye/loga taşıma; para/tenant/idempotency kurallarını koru.
Kabul kriterini önce test senaryosuna dönüştür, sonra kodu uygula.
Çalıştırılan testleri ve çalıştırılamayan doğrulamaları ayrı raporla.
Diff, docs güncellemesi, kanıt ve açık riskleri sun.
Bu prompt tek başına canlı ödeme, iade veya üretim deploy yetkisi değildir.
```

## Hazırlık kontrolü

- [ ] Önceki sprint kanıtı ve bağımlılıklar okundu.
- [ ] Her GP kartı için sorumlu/reviewer belirlendi.
- [ ] Pozitif ve negatif kabul senaryoları hazır.
- [ ] Test verisi sentetik; secretlar güvenli kanalda.
- [ ] Demo, test kanıtı ve açık risk kaydı eklendi.

Bu kutular yalnızca bu tarayıcıda tutulan kişisel notlardır; paylaşılan görev durumu veya resmi kabul kaydı değildir.

## Sonraki adım

[S19 sprintine geç](https://karacaismail.github.io/galaxyPayFrappe/docs/sprint-19/).


---

# S19 · Dokümantasyon ve geliştirici deneyimi

Kaynak: src/content/docs/sprint-19.md

## Sprint hedefi

G6 DX kabulü ve görev tamamlama ölçümleri. **Planlandı · henüz geliştirilmedi.** Faz 6: Platform & DX. Süre 2 hafta; 10 geliştirme kişi-günü kapsam + 4 gün entegrasyon/review kapasitesi önerisi. [Kapasite varsayımları](https://karacaismail.github.io/galaxyPayFrappe/docs/kapsam/).

| Alan | Karar |
|---|---|
| Önkoşul | S18 ve ilgili kapının kanıtı |
| Birincil roller | DX + FE / TL |
| Dış bağımlılık | Geliştirici geri bildirimi ve arama verisi. |
| Teslim | G6 DX kabulü ve görev tamamlama ölçümleri. |

## İş kartları

### GP-191 · Canlı doküman hattı

**İş:** API örneklerini fixturelardan üret; doküman sahipliği ve son kontrol tarihi ekle.

**Kabul:** Örnek sözleşme driftinde docs CI kırılır; ölü bağlantı kalmaz.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-192 · Erişilebilir portal

**İş:** Arama, kopyala, sürüm ve içerik gezinmesini kullanıcılarla test et.

**Kabul:** Minimum 1rem, klavye ve mobil kabulü geçer; 5 görevden en az 4ü yardımsız bulunur.

**Kaba tahmin:** 4 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-193 · AI context packs

**İş:** Sınırlandırılmış görev istemleri, ADR ve kabul testlerini tek bağlamda sun.

**Kabul:** Pilot görevde secret sızıntısı yok; diff bağımsız incelemeye elverişli.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

## Sprint kabulü

Her GP kartının yukarıdaki kabul kriteri kanıtlanmalı. [Ortak Definition of Done](https://karacaismail.github.io/galaxyPayFrappe/docs/gelistirme-sureci/) uygulanır; [test matrisindeki](https://karacaismail.github.io/galaxyPayFrappe/docs/test-stratejisi/) ilgili senaryolar çalışır. Çalışmayan/dış bağımlılığa takılan testler açık bırakılır. Kanıt paketi: commit, ortam, fixture sürümü, test çıktısı, demo kaydı, reviewer ve açık Q bağlantıları. Faz çıkışı gerekiyorsa [kapı tutanağı](https://karacaismail.github.io/galaxyPayFrappe/docs/kabul-kapilari/) eklenir.

## Sprint içi çalışma

Gün 1: sözleşme/DoR ve sahiplik. Gün 2–7: GP kartlarını küçük dilimlerle uygula. Gün 8: entegrasyon/negatif senaryolar. Gün 9: UAT/doküman/release provası. Gün 10: demo ve kabul. Sağlayıcı cevabı gecikirse mock ve bağımsız işleri ilerlet; teyit gerektiren kabiliyeti canlıya açma.

## AI görev istemi

Aşağıdaki metin ilgili sprint bağlamını taşır; uygulama sırasında sıradaki tek GP kartına daralt. Kod bloklarının sağ üstündeki düğmeyle kopyalanabilir.

```text
S19 / Dokümantasyon ve geliştirici deneyimi sprintini uygula.
Önce mevcut repo, docs/mimari, docs/api-referansi, docs/odeme-akisi,
docs/test-stratejisi ve bu sprintin GP kartlarını oku.
Bağımlılık: S18. Teyit ihtiyacı: Geliştirici geri bildirimi ve arama verisi.
İş kartları: GP-191, GP-192, GP-193.
Her seferinde tek kartın küçük dikey dilimini ele al.
Provider davranışını uydurma; bilinmeyeni Q kaydına bağla.
Credentialı istemciye/loga taşıma; para/tenant/idempotency kurallarını koru.
Kabul kriterini önce test senaryosuna dönüştür, sonra kodu uygula.
Çalıştırılan testleri ve çalıştırılamayan doğrulamaları ayrı raporla.
Diff, docs güncellemesi, kanıt ve açık riskleri sun.
Bu prompt tek başına canlı ödeme, iade veya üretim deploy yetkisi değildir.
```

## Hazırlık kontrolü

- [ ] Önceki sprint kanıtı ve bağımlılıklar okundu.
- [ ] Her GP kartı için sorumlu/reviewer belirlendi.
- [ ] Pozitif ve negatif kabul senaryoları hazır.
- [ ] Test verisi sentetik; secretlar güvenli kanalda.
- [ ] Demo, test kanıtı ve açık risk kaydı eklendi.

Bu kutular yalnızca bu tarayıcıda tutulan kişisel notlardır; paylaşılan görev durumu veya resmi kabul kaydı değildir.

## Sonraki adım

[S20 sprintine geç](https://karacaismail.github.io/galaxyPayFrappe/docs/sprint-20/).


---

# S20 · Kurumsal kimlik ve erişim

Kaynak: src/content/docs/sprint-20.md

## Sprint hedefi

Kurumsal rol matrisi ve kimlik kabul paketi. **Planlandı · henüz geliştirilmedi.** Faz 7: Enterprise grade. Süre 2 hafta; 10 geliştirme kişi-günü kapsam + 4 gün entegrasyon/review kapasitesi önerisi. [Kapasite varsayımları](https://karacaismail.github.io/galaxyPayFrappe/docs/kapsam/).

| Alan | Karar |
|---|---|
| Önkoşul | S19 ve ilgili kapının kanıtı |
| Birincil roller | BE + Güvenlik / IT |
| Dış bağımlılık | Kurumsal IdP, rol sahibi ve lifecycle beklentileri. |
| Teslim | Kurumsal rol matrisi ve kimlik kabul paketi. |

## İş kartları

### GP-201 · SSO ve MFA

**İş:** Onaylı OIDC/SAML yolunu seç; oturum, MFA ve acil erişim sürecini kur.

**Kabul:** MFA gerektiren rol bypass edilemez; acil erişim izlenir.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-202 · Görev ayrılığı

**İş:** İade talebi/onanması, export ve rol yönetimi yetkilerini ayır.

**Kabul:** Aynı kişi kendi yüksek riskli talebini onaylayamaz.

**Kaba tahmin:** 4 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-203 · Kullanıcı yaşam döngüsü

**İş:** İşten ayrılma ve erişim gözden geçirme; SCIM varsa sözleşme keşfi yap.

**Kabul:** Devre dışı kullanıcının oturumu iptal edilir; erişim matrisi sahiplidir.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

## Sprint kabulü

Her GP kartının yukarıdaki kabul kriteri kanıtlanmalı. [Ortak Definition of Done](https://karacaismail.github.io/galaxyPayFrappe/docs/gelistirme-sureci/) uygulanır; [test matrisindeki](https://karacaismail.github.io/galaxyPayFrappe/docs/test-stratejisi/) ilgili senaryolar çalışır. Çalışmayan/dış bağımlılığa takılan testler açık bırakılır. Kanıt paketi: commit, ortam, fixture sürümü, test çıktısı, demo kaydı, reviewer ve açık Q bağlantıları. Faz çıkışı gerekiyorsa [kapı tutanağı](https://karacaismail.github.io/galaxyPayFrappe/docs/kabul-kapilari/) eklenir.

## Sprint içi çalışma

Gün 1: sözleşme/DoR ve sahiplik. Gün 2–7: GP kartlarını küçük dilimlerle uygula. Gün 8: entegrasyon/negatif senaryolar. Gün 9: UAT/doküman/release provası. Gün 10: demo ve kabul. Sağlayıcı cevabı gecikirse mock ve bağımsız işleri ilerlet; teyit gerektiren kabiliyeti canlıya açma.

## AI görev istemi

Aşağıdaki metin ilgili sprint bağlamını taşır; uygulama sırasında sıradaki tek GP kartına daralt. Kod bloklarının sağ üstündeki düğmeyle kopyalanabilir.

```text
S20 / Kurumsal kimlik ve erişim sprintini uygula.
Önce mevcut repo, docs/mimari, docs/api-referansi, docs/odeme-akisi,
docs/test-stratejisi ve bu sprintin GP kartlarını oku.
Bağımlılık: S19. Teyit ihtiyacı: Kurumsal IdP, rol sahibi ve lifecycle beklentileri.
İş kartları: GP-201, GP-202, GP-203.
Her seferinde tek kartın küçük dikey dilimini ele al.
Provider davranışını uydurma; bilinmeyeni Q kaydına bağla.
Credentialı istemciye/loga taşıma; para/tenant/idempotency kurallarını koru.
Kabul kriterini önce test senaryosuna dönüştür, sonra kodu uygula.
Çalıştırılan testleri ve çalıştırılamayan doğrulamaları ayrı raporla.
Diff, docs güncellemesi, kanıt ve açık riskleri sun.
Bu prompt tek başına canlı ödeme, iade veya üretim deploy yetkisi değildir.
```

## Hazırlık kontrolü

- [ ] Önceki sprint kanıtı ve bağımlılıklar okundu.
- [ ] Her GP kartı için sorumlu/reviewer belirlendi.
- [ ] Pozitif ve negatif kabul senaryoları hazır.
- [ ] Test verisi sentetik; secretlar güvenli kanalda.
- [ ] Demo, test kanıtı ve açık risk kaydı eklendi.

Bu kutular yalnızca bu tarayıcıda tutulan kişisel notlardır; paylaşılan görev durumu veya resmi kabul kaydı değildir.

## Sonraki adım

[S21 sprintine geç](https://karacaismail.github.io/galaxyPayFrappe/docs/sprint-21/).


---

# S21 · Tenant politikaları ve büyük müşteri

Kaynak: src/content/docs/sprint-21.md

## Sprint hedefi

İzolasyon test raporu ve kurumsal tenant politikaları. **Planlandı · henüz geliştirilmedi.** Faz 7: Enterprise grade. Süre 2 hafta; 10 geliştirme kişi-günü kapsam + 4 gün entegrasyon/review kapasitesi önerisi. [Kapasite varsayımları](https://karacaismail.github.io/galaxyPayFrappe/docs/kapsam/).

| Alan | Karar |
|---|---|
| Önkoşul | S20 ve ilgili kapının kanıtı |
| Birincil roller | BE + Platform / PO |
| Dış bağımlılık | Kurumsal müşteri hacmi ve izolasyon gereksinimleri. |
| Teslim | İzolasyon test raporu ve kurumsal tenant politikaları. |

## İş kartları

### GP-211 · Politika modeli

**İş:** Tenant limit, özellik bayrağı ve credential sınırlarını tanımla.

**Kabul:** Tenant A ayarı B işlemine etki etmez; config değişimi audit edilir.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-212 · İzolasyon kanıtı

**İş:** Veri, kuyruk, cache ve rapor tenant anahtarlarını negatif test et.

**Kabul:** Çapraz tenant erişim testlerinin tamamı reddedilir.

**Kaba tahmin:** 4 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-213 · Taşınabilirlik ve kota

**İş:** Export/import sınırları, tenant offboarding ve noisy-neighbor kontrolü ekle.

**Kabul:** Yoğun müşteri diğerinin SLOsunu bozmadan sınırlanır.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

## Sprint kabulü

Her GP kartının yukarıdaki kabul kriteri kanıtlanmalı. [Ortak Definition of Done](https://karacaismail.github.io/galaxyPayFrappe/docs/gelistirme-sureci/) uygulanır; [test matrisindeki](https://karacaismail.github.io/galaxyPayFrappe/docs/test-stratejisi/) ilgili senaryolar çalışır. Çalışmayan/dış bağımlılığa takılan testler açık bırakılır. Kanıt paketi: commit, ortam, fixture sürümü, test çıktısı, demo kaydı, reviewer ve açık Q bağlantıları. Faz çıkışı gerekiyorsa [kapı tutanağı](https://karacaismail.github.io/galaxyPayFrappe/docs/kabul-kapilari/) eklenir.

## Sprint içi çalışma

Gün 1: sözleşme/DoR ve sahiplik. Gün 2–7: GP kartlarını küçük dilimlerle uygula. Gün 8: entegrasyon/negatif senaryolar. Gün 9: UAT/doküman/release provası. Gün 10: demo ve kabul. Sağlayıcı cevabı gecikirse mock ve bağımsız işleri ilerlet; teyit gerektiren kabiliyeti canlıya açma.

## AI görev istemi

Aşağıdaki metin ilgili sprint bağlamını taşır; uygulama sırasında sıradaki tek GP kartına daralt. Kod bloklarının sağ üstündeki düğmeyle kopyalanabilir.

```text
S21 / Tenant politikaları ve büyük müşteri sprintini uygula.
Önce mevcut repo, docs/mimari, docs/api-referansi, docs/odeme-akisi,
docs/test-stratejisi ve bu sprintin GP kartlarını oku.
Bağımlılık: S20. Teyit ihtiyacı: Kurumsal müşteri hacmi ve izolasyon gereksinimleri.
İş kartları: GP-211, GP-212, GP-213.
Her seferinde tek kartın küçük dikey dilimini ele al.
Provider davranışını uydurma; bilinmeyeni Q kaydına bağla.
Credentialı istemciye/loga taşıma; para/tenant/idempotency kurallarını koru.
Kabul kriterini önce test senaryosuna dönüştür, sonra kodu uygula.
Çalıştırılan testleri ve çalıştırılamayan doğrulamaları ayrı raporla.
Diff, docs güncellemesi, kanıt ve açık riskleri sun.
Bu prompt tek başına canlı ödeme, iade veya üretim deploy yetkisi değildir.
```

## Hazırlık kontrolü

- [ ] Önceki sprint kanıtı ve bağımlılıklar okundu.
- [ ] Her GP kartı için sorumlu/reviewer belirlendi.
- [ ] Pozitif ve negatif kabul senaryoları hazır.
- [ ] Test verisi sentetik; secretlar güvenli kanalda.
- [ ] Demo, test kanıtı ve açık risk kaydı eklendi.

Bu kutular yalnızca bu tarayıcıda tutulan kişisel notlardır; paylaşılan görev durumu veya resmi kabul kaydı değildir.

## Sonraki adım

[S22 sprintine geç](https://karacaismail.github.io/galaxyPayFrappe/docs/sprint-22/).


---

# S22 · Hizmet yönetimi ve kurumsal kabul

Kaynak: src/content/docs/sprint-22.md

## Sprint hedefi

G7 enterprise kabul paketi ve işletim sözleşmesi. **Planlandı · henüz geliştirilmedi.** Faz 7: Enterprise grade. Süre 2 hafta; 10 geliştirme kişi-günü kapsam + 4 gün entegrasyon/review kapasitesi önerisi. [Kapasite varsayımları](https://karacaismail.github.io/galaxyPayFrappe/docs/kapsam/).

| Alan | Karar |
|---|---|
| Önkoşul | S21 ve ilgili kapının kanıtı |
| Birincil roller | Operasyon + PO + TL |
| Dış bağımlılık | SLA, destek saatleri ve sağlayıcı eskalasyon anlaşması. |
| Teslim | G7 enterprise kabul paketi ve işletim sözleşmesi. |

## İş kartları

### GP-221 · Hizmet kataloğu

**İş:** Sorumlular, hizmet saatleri, önem seviyeleri ve eskalasyon yollarını tanımla.

**Kabul:** P1 masa başı tatbikatında görevler ve iletişim sahibine kadar izlenir.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-222 · SLO ve hata bütçesi

**İş:** Ölçülen veriden erişilebilirlik hedefi ve release durdurma kuralı belirle.

**Kabul:** Öneri %99,9 hedef; sağlayıcı etkisi ayrı ama kullanıcı kaybı ayrıca görünür.

**Kaba tahmin:** 4 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-223 · Kurumsal teslim

**İş:** İş sürekliliği, sözleşme, destek ve güvenlik kanıtlarını müşteri kabulüne hazırla.

**Kabul:** G7 imzalı kabul ve açık istisna listesi; sertifika vaadi yok.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

## Sprint kabulü

Her GP kartının yukarıdaki kabul kriteri kanıtlanmalı. [Ortak Definition of Done](https://karacaismail.github.io/galaxyPayFrappe/docs/gelistirme-sureci/) uygulanır; [test matrisindeki](https://karacaismail.github.io/galaxyPayFrappe/docs/test-stratejisi/) ilgili senaryolar çalışır. Çalışmayan/dış bağımlılığa takılan testler açık bırakılır. Kanıt paketi: commit, ortam, fixture sürümü, test çıktısı, demo kaydı, reviewer ve açık Q bağlantıları. Faz çıkışı gerekiyorsa [kapı tutanağı](https://karacaismail.github.io/galaxyPayFrappe/docs/kabul-kapilari/) eklenir.

## Sprint içi çalışma

Gün 1: sözleşme/DoR ve sahiplik. Gün 2–7: GP kartlarını küçük dilimlerle uygula. Gün 8: entegrasyon/negatif senaryolar. Gün 9: UAT/doküman/release provası. Gün 10: demo ve kabul. Sağlayıcı cevabı gecikirse mock ve bağımsız işleri ilerlet; teyit gerektiren kabiliyeti canlıya açma.

## AI görev istemi

Aşağıdaki metin ilgili sprint bağlamını taşır; uygulama sırasında sıradaki tek GP kartına daralt. Kod bloklarının sağ üstündeki düğmeyle kopyalanabilir.

```text
S22 / Hizmet yönetimi ve kurumsal kabul sprintini uygula.
Önce mevcut repo, docs/mimari, docs/api-referansi, docs/odeme-akisi,
docs/test-stratejisi ve bu sprintin GP kartlarını oku.
Bağımlılık: S21. Teyit ihtiyacı: SLA, destek saatleri ve sağlayıcı eskalasyon anlaşması.
İş kartları: GP-221, GP-222, GP-223.
Her seferinde tek kartın küçük dikey dilimini ele al.
Provider davranışını uydurma; bilinmeyeni Q kaydına bağla.
Credentialı istemciye/loga taşıma; para/tenant/idempotency kurallarını koru.
Kabul kriterini önce test senaryosuna dönüştür, sonra kodu uygula.
Çalıştırılan testleri ve çalıştırılamayan doğrulamaları ayrı raporla.
Diff, docs güncellemesi, kanıt ve açık riskleri sun.
Bu prompt tek başına canlı ödeme, iade veya üretim deploy yetkisi değildir.
```

## Hazırlık kontrolü

- [ ] Önceki sprint kanıtı ve bağımlılıklar okundu.
- [ ] Her GP kartı için sorumlu/reviewer belirlendi.
- [ ] Pozitif ve negatif kabul senaryoları hazır.
- [ ] Test verisi sentetik; secretlar güvenli kanalda.
- [ ] Demo, test kanıtı ve açık risk kaydı eklendi.

Bu kutular yalnızca bu tarayıcıda tutulan kişisel notlardır; paylaşılan görev durumu veya resmi kabul kaydı değildir.

## Sonraki adım

[S23 sprintine geç](https://karacaismail.github.io/galaxyPayFrappe/docs/sprint-23/).


---

# S23 · Olgunluk değerlendirmesi

Kaynak: src/content/docs/sprint-23.md

## Sprint hedefi

Maturity baseline ve öncelikli iyileştirme portföyü. **Planlandı · henüz geliştirilmedi.** Faz 8: Maturity ready. Süre 2 hafta; 10 geliştirme kişi-günü kapsam + 4 gün entegrasyon/review kapasitesi önerisi. [Kapasite varsayımları](https://karacaismail.github.io/galaxyPayFrappe/docs/kapsam/).

| Alan | Karar |
|---|---|
| Önkoşul | S22 ve ilgili kapının kanıtı |
| Birincil roller | TL + PO + Finans + Operasyon |
| Dış bağımlılık | En az 90 günlük ölçüm verisi; yoksa gözlem penceresi beklenir. |
| Teslim | Maturity baseline ve öncelikli iyileştirme portföyü. |

## İş kartları

### GP-231 · Skor kartı

**İş:** Güvenlik, güvenilirlik, finans, DX ve ürün alanlarında 0–3 kanıt skoru çıkar.

**Kabul:** Her skor ölçüm/rapora bağlıdır; bilinmeyenler sıfır veya değerlendirilemedi olur.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-232 · Akış metrikleri

**İş:** Lead time, deploy sıklığı, başarısız değişim ve toparlanma süresini ölç.

**Kabul:** Tanım ve örneklem tutarlıdır; AI çıktı hacmi başarı metriği sayılmaz.

**Kaba tahmin:** 4 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-233 · Boşluk planı

**İş:** Kanıt eksiklerini risk, maliyet ve sahipleriyle sırala.

**Kabul:** En yüksek riskli 5 boşluk için teslim tarihi ve kapanış testi var.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

## Sprint kabulü

Her GP kartının yukarıdaki kabul kriteri kanıtlanmalı. [Ortak Definition of Done](https://karacaismail.github.io/galaxyPayFrappe/docs/gelistirme-sureci/) uygulanır; [test matrisindeki](https://karacaismail.github.io/galaxyPayFrappe/docs/test-stratejisi/) ilgili senaryolar çalışır. Çalışmayan/dış bağımlılığa takılan testler açık bırakılır. Kanıt paketi: commit, ortam, fixture sürümü, test çıktısı, demo kaydı, reviewer ve açık Q bağlantıları. Faz çıkışı gerekiyorsa [kapı tutanağı](https://karacaismail.github.io/galaxyPayFrappe/docs/kabul-kapilari/) eklenir.

## Sprint içi çalışma

Gün 1: sözleşme/DoR ve sahiplik. Gün 2–7: GP kartlarını küçük dilimlerle uygula. Gün 8: entegrasyon/negatif senaryolar. Gün 9: UAT/doküman/release provası. Gün 10: demo ve kabul. Sağlayıcı cevabı gecikirse mock ve bağımsız işleri ilerlet; teyit gerektiren kabiliyeti canlıya açma.

## AI görev istemi

Aşağıdaki metin ilgili sprint bağlamını taşır; uygulama sırasında sıradaki tek GP kartına daralt. Kod bloklarının sağ üstündeki düğmeyle kopyalanabilir.

```text
S23 / Olgunluk değerlendirmesi sprintini uygula.
Önce mevcut repo, docs/mimari, docs/api-referansi, docs/odeme-akisi,
docs/test-stratejisi ve bu sprintin GP kartlarını oku.
Bağımlılık: S22. Teyit ihtiyacı: En az 90 günlük ölçüm verisi; yoksa gözlem penceresi beklenir.
İş kartları: GP-231, GP-232, GP-233.
Her seferinde tek kartın küçük dikey dilimini ele al.
Provider davranışını uydurma; bilinmeyeni Q kaydına bağla.
Credentialı istemciye/loga taşıma; para/tenant/idempotency kurallarını koru.
Kabul kriterini önce test senaryosuna dönüştür, sonra kodu uygula.
Çalıştırılan testleri ve çalıştırılamayan doğrulamaları ayrı raporla.
Diff, docs güncellemesi, kanıt ve açık riskleri sun.
Bu prompt tek başına canlı ödeme, iade veya üretim deploy yetkisi değildir.
```

## Hazırlık kontrolü

- [ ] Önceki sprint kanıtı ve bağımlılıklar okundu.
- [ ] Her GP kartı için sorumlu/reviewer belirlendi.
- [ ] Pozitif ve negatif kabul senaryoları hazır.
- [ ] Test verisi sentetik; secretlar güvenli kanalda.
- [ ] Demo, test kanıtı ve açık risk kaydı eklendi.

Bu kutular yalnızca bu tarayıcıda tutulan kişisel notlardır; paylaşılan görev durumu veya resmi kabul kaydı değildir.

## Sonraki adım

[S24 sprintine geç](https://karacaismail.github.io/galaxyPayFrappe/docs/sprint-24/).


---

# S24 · Kaos ve işletim tatbikatları

Kaynak: src/content/docs/sprint-24.md

## Sprint hedefi

Dayanıklılık kanıtı ve düzeltilmiş runbooklar. **Planlandı · henüz geliştirilmedi.** Faz 8: Maturity ready. Süre 2 hafta; 10 geliştirme kişi-günü kapsam + 4 gün entegrasyon/review kapasitesi önerisi. [Kapasite varsayımları](https://karacaismail.github.io/galaxyPayFrappe/docs/kapsam/).

| Alan | Karar |
|---|---|
| Önkoşul | S23 ve ilgili kapının kanıtı |
| Birincil roller | Platform + QA + Operasyon |
| Dış bağımlılık | Onaylı test alanı ve durdurma koşulları. |
| Teslim | Dayanıklılık kanıtı ve düzeltilmiş runbooklar. |

## İş kartları

### GP-241 · Finansal uç durumlar

**İş:** Geç success, çift callback, servis timeout ve worker ölümü birleşimlerini test et.

**Kabul:** Tüm senaryolar sonunda sipariş, attempt ve mutabakat kayıtları açıklanabilir.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-242 · İnsan süreçleri

**İş:** Nöbet devri, erişim kaybı ve sağlayıcı kesinti masa başı tatbikatı yap.

**Kabul:** Yedek sorumlu runbook ile müdahale eder; kişi bağımlılığı ortaya çıkarılır.

**Kaba tahmin:** 4 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-243 · Bulgu düzeltme

**İş:** Tatbikat açıklarını kapat ve etkilenen akışı yeniden çalıştır.

**Kabul:** Kritik bulgular tekrarlanamaz; gerçek süreler hedeflerle karşılaştırılır.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

## Sprint kabulü

Her GP kartının yukarıdaki kabul kriteri kanıtlanmalı. [Ortak Definition of Done](https://karacaismail.github.io/galaxyPayFrappe/docs/gelistirme-sureci/) uygulanır; [test matrisindeki](https://karacaismail.github.io/galaxyPayFrappe/docs/test-stratejisi/) ilgili senaryolar çalışır. Çalışmayan/dış bağımlılığa takılan testler açık bırakılır. Kanıt paketi: commit, ortam, fixture sürümü, test çıktısı, demo kaydı, reviewer ve açık Q bağlantıları. Faz çıkışı gerekiyorsa [kapı tutanağı](https://karacaismail.github.io/galaxyPayFrappe/docs/kabul-kapilari/) eklenir.

## Sprint içi çalışma

Gün 1: sözleşme/DoR ve sahiplik. Gün 2–7: GP kartlarını küçük dilimlerle uygula. Gün 8: entegrasyon/negatif senaryolar. Gün 9: UAT/doküman/release provası. Gün 10: demo ve kabul. Sağlayıcı cevabı gecikirse mock ve bağımsız işleri ilerlet; teyit gerektiren kabiliyeti canlıya açma.

## AI görev istemi

Aşağıdaki metin ilgili sprint bağlamını taşır; uygulama sırasında sıradaki tek GP kartına daralt. Kod bloklarının sağ üstündeki düğmeyle kopyalanabilir.

```text
S24 / Kaos ve işletim tatbikatları sprintini uygula.
Önce mevcut repo, docs/mimari, docs/api-referansi, docs/odeme-akisi,
docs/test-stratejisi ve bu sprintin GP kartlarını oku.
Bağımlılık: S23. Teyit ihtiyacı: Onaylı test alanı ve durdurma koşulları.
İş kartları: GP-241, GP-242, GP-243.
Her seferinde tek kartın küçük dikey dilimini ele al.
Provider davranışını uydurma; bilinmeyeni Q kaydına bağla.
Credentialı istemciye/loga taşıma; para/tenant/idempotency kurallarını koru.
Kabul kriterini önce test senaryosuna dönüştür, sonra kodu uygula.
Çalıştırılan testleri ve çalıştırılamayan doğrulamaları ayrı raporla.
Diff, docs güncellemesi, kanıt ve açık riskleri sun.
Bu prompt tek başına canlı ödeme, iade veya üretim deploy yetkisi değildir.
```

## Hazırlık kontrolü

- [ ] Önceki sprint kanıtı ve bağımlılıklar okundu.
- [ ] Her GP kartı için sorumlu/reviewer belirlendi.
- [ ] Pozitif ve negatif kabul senaryoları hazır.
- [ ] Test verisi sentetik; secretlar güvenli kanalda.
- [ ] Demo, test kanıtı ve açık risk kaydı eklendi.

Bu kutular yalnızca bu tarayıcıda tutulan kişisel notlardır; paylaşılan görev durumu veya resmi kabul kaydı değildir.

## Sonraki adım

[S25 sprintine geç](https://karacaismail.github.io/galaxyPayFrappe/docs/sprint-25/).


---

# S25 · Maturity ready kabulü

Kaynak: src/content/docs/sprint-25.md

## Sprint hedefi

G8 karar tutanağı ve 90 günlük yeniden değerlendirme planı. **Planlandı · henüz geliştirilmedi.** Faz 8: Maturity ready. Süre 2 hafta; 10 geliştirme kişi-günü kapsam + 4 gün entegrasyon/review kapasitesi önerisi. [Kapasite varsayımları](https://karacaismail.github.io/galaxyPayFrappe/docs/kapsam/).

| Alan | Karar |
|---|---|
| Önkoşul | S24 ve ilgili kapının kanıtı |
| Birincil roller | Bağımsız inceleyen + PO / TL |
| Dış bağımlılık | 90 gün metrik ve G1–G7 kanıtları. |
| Teslim | G8 karar tutanağı ve 90 günlük yeniden değerlendirme planı. |

## İş kartları

### GP-251 · Bağımsız örnekleme

**İş:** Ödeme, iade, release ve erişim değişikliklerini bağımsız gözle örnekle.

**Kabul:** Örneklerin tamamında kim/ne/zaman/kanıt izi tamamdır.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-252 · İşletim devri

**İş:** Servis sahibi, bütçe, nöbet, tedarikçi ve eğitim dokümanlarını devret.

**Kabul:** Başka ekip örnek incident ve restore görevini yürütebilir.

**Kaba tahmin:** 4 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-253 · Olgunluk kararı

**İş:** G8 için 5 alanda ≥2, kritik açık 0 ve sonraki gözden geçirmeyi kaydet.

**Kabul:** Maturity ready ürün içi ölçüttür; bağımsız sertifikasyon gibi sunulmaz.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

## Sprint kabulü

Her GP kartının yukarıdaki kabul kriteri kanıtlanmalı. [Ortak Definition of Done](https://karacaismail.github.io/galaxyPayFrappe/docs/gelistirme-sureci/) uygulanır; [test matrisindeki](https://karacaismail.github.io/galaxyPayFrappe/docs/test-stratejisi/) ilgili senaryolar çalışır. Çalışmayan/dış bağımlılığa takılan testler açık bırakılır. Kanıt paketi: commit, ortam, fixture sürümü, test çıktısı, demo kaydı, reviewer ve açık Q bağlantıları. Faz çıkışı gerekiyorsa [kapı tutanağı](https://karacaismail.github.io/galaxyPayFrappe/docs/kabul-kapilari/) eklenir.

## Sprint içi çalışma

Gün 1: sözleşme/DoR ve sahiplik. Gün 2–7: GP kartlarını küçük dilimlerle uygula. Gün 8: entegrasyon/negatif senaryolar. Gün 9: UAT/doküman/release provası. Gün 10: demo ve kabul. Sağlayıcı cevabı gecikirse mock ve bağımsız işleri ilerlet; teyit gerektiren kabiliyeti canlıya açma.

## AI görev istemi

Aşağıdaki metin ilgili sprint bağlamını taşır; uygulama sırasında sıradaki tek GP kartına daralt. Kod bloklarının sağ üstündeki düğmeyle kopyalanabilir.

```text
S25 / Maturity ready kabulü sprintini uygula.
Önce mevcut repo, docs/mimari, docs/api-referansi, docs/odeme-akisi,
docs/test-stratejisi ve bu sprintin GP kartlarını oku.
Bağımlılık: S24. Teyit ihtiyacı: 90 gün metrik ve G1–G7 kanıtları.
İş kartları: GP-251, GP-252, GP-253.
Her seferinde tek kartın küçük dikey dilimini ele al.
Provider davranışını uydurma; bilinmeyeni Q kaydına bağla.
Credentialı istemciye/loga taşıma; para/tenant/idempotency kurallarını koru.
Kabul kriterini önce test senaryosuna dönüştür, sonra kodu uygula.
Çalıştırılan testleri ve çalıştırılamayan doğrulamaları ayrı raporla.
Diff, docs güncellemesi, kanıt ve açık riskleri sun.
Bu prompt tek başına canlı ödeme, iade veya üretim deploy yetkisi değildir.
```

## Hazırlık kontrolü

- [ ] Önceki sprint kanıtı ve bağımlılıklar okundu.
- [ ] Her GP kartı için sorumlu/reviewer belirlendi.
- [ ] Pozitif ve negatif kabul senaryoları hazır.
- [ ] Test verisi sentetik; secretlar güvenli kanalda.
- [ ] Demo, test kanıtı ve açık risk kaydı eklendi.

Bu kutular yalnızca bu tarayıcıda tutulan kişisel notlardır; paylaşılan görev durumu veya resmi kabul kaydı değildir.

## Sonraki adım

[S26 sprintine geç](https://karacaismail.github.io/galaxyPayFrappe/docs/sprint-26/).


---

# S26 · Ölçüme dayalı yeni döngü

Kaynak: src/content/docs/sprint-26.md

## Sprint hedefi

Deney raporu ve güncellenmiş çeyrek planı. **Planlandı · henüz geliştirilmedi.** Faz 9: Sürekli gelişim. Süre 2 hafta; 10 geliştirme kişi-günü kapsam + 4 gün entegrasyon/review kapasitesi önerisi. [Kapasite varsayımları](https://karacaismail.github.io/galaxyPayFrappe/docs/kapsam/).

| Alan | Karar |
|---|---|
| Önkoşul | S25 ve ilgili kapının kanıtı |
| Birincil roller | PO + TL + ilgili ekip |
| Dış bağımlılık | Kullanıcı geri bildirimi, maliyet ve hata verisi. |
| Teslim | Deney raporu ve güncellenmiş çeyrek planı. |

## İş kartları

### GP-261 · Hipotez seçimi

**İş:** Bir kullanıcı sorunu ve ölçülebilir deney seç; çoklu sağlayıcı/taksit gibi opsiyonları kanıta göre sırala.

**Kabul:** Beklenen değer, kapsam dışı ve durdurma eşiği kayıtlı.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-262 · Küçük dilim teslimi

**İş:** Feature flag ile sınırlı kullanıcı grubunda geri alınabilir değişim yayınla.

**Kabul:** Finansal doğruluk ve security gate korunur; rollout ölçümü var.

**Kaba tahmin:** 4 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-263 · Öğrenme ve yeniden plan

**İş:** Sonuçları değerlendir; teknik borç için kapasite ayır; sonraki 2 sprinti güncelle.

**Kabul:** Başarısız hipotez kapatılabilir; sonraki işler aynı DoR/DoD ile hazır.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

## Sprint kabulü

Her GP kartının yukarıdaki kabul kriteri kanıtlanmalı. [Ortak Definition of Done](https://karacaismail.github.io/galaxyPayFrappe/docs/gelistirme-sureci/) uygulanır; [test matrisindeki](https://karacaismail.github.io/galaxyPayFrappe/docs/test-stratejisi/) ilgili senaryolar çalışır. Çalışmayan/dış bağımlılığa takılan testler açık bırakılır. Kanıt paketi: commit, ortam, fixture sürümü, test çıktısı, demo kaydı, reviewer ve açık Q bağlantıları. Faz çıkışı gerekiyorsa [kapı tutanağı](https://karacaismail.github.io/galaxyPayFrappe/docs/kabul-kapilari/) eklenir.

## Sprint içi çalışma

Gün 1: sözleşme/DoR ve sahiplik. Gün 2–7: GP kartlarını küçük dilimlerle uygula. Gün 8: entegrasyon/negatif senaryolar. Gün 9: UAT/doküman/release provası. Gün 10: demo ve kabul. Sağlayıcı cevabı gecikirse mock ve bağımsız işleri ilerlet; teyit gerektiren kabiliyeti canlıya açma.

## AI görev istemi

Aşağıdaki metin ilgili sprint bağlamını taşır; uygulama sırasında sıradaki tek GP kartına daralt. Kod bloklarının sağ üstündeki düğmeyle kopyalanabilir.

```text
S26 / Ölçüme dayalı yeni döngü sprintini uygula.
Önce mevcut repo, docs/mimari, docs/api-referansi, docs/odeme-akisi,
docs/test-stratejisi ve bu sprintin GP kartlarını oku.
Bağımlılık: S25. Teyit ihtiyacı: Kullanıcı geri bildirimi, maliyet ve hata verisi.
İş kartları: GP-261, GP-262, GP-263.
Her seferinde tek kartın küçük dikey dilimini ele al.
Provider davranışını uydurma; bilinmeyeni Q kaydına bağla.
Credentialı istemciye/loga taşıma; para/tenant/idempotency kurallarını koru.
Kabul kriterini önce test senaryosuna dönüştür, sonra kodu uygula.
Çalıştırılan testleri ve çalıştırılamayan doğrulamaları ayrı raporla.
Diff, docs güncellemesi, kanıt ve açık riskleri sun.
Bu prompt tek başına canlı ödeme, iade veya üretim deploy yetkisi değildir.
```

## Hazırlık kontrolü

- [ ] Önceki sprint kanıtı ve bağımlılıklar okundu.
- [ ] Her GP kartı için sorumlu/reviewer belirlendi.
- [ ] Pozitif ve negatif kabul senaryoları hazır.
- [ ] Test verisi sentetik; secretlar güvenli kanalda.
- [ ] Demo, test kanıtı ve açık risk kaydı eklendi.

Bu kutular yalnızca bu tarayıcıda tutulan kişisel notlardır; paylaşılan görev durumu veya resmi kabul kaydı değildir.

## Sonraki adım

S26 döngüsünü gerçek ölçümlerle yeniden planla; yeni deney kartlarına ayrı ID ver.


---

# Test stratejisi ve kabul matrisi

Kaynak: src/content/docs/test-stratejisi.md

## Katmanlar

Unit: para, normalize, durum geçişleri. Contract: OpenAPI ve redakte fixture uyumu. Integration: gerçek test PostgreSQL, unique kısıtlar, concurrency ve transaction rollback. Mock E2E: UI→backend→provider simülatörü→callback. Sandbox UAT: gerçek sağlayıcı kart/cüzdan akışı. Yük/kaos: önce yerel mock, sonra açıkça izinli ortam.

**V2 düzeltmesi:** Sağlayıcının dummy test kartları [test verisi referansında](https://karacaismail.github.io/galaxyPayFrappe/v2/test-data/) yayımlanır. Önceki “tüm PAN/CVV değerlerini portaldan çıkar” yaklaşımı bu test verisi için gereksizdi. Gerçek kart verisi, hesap parolası ve kayıtlı cüzdan telefonu public fixture değildir. Kartların fiili geçerliliği ve gerçek ödeme UAT henüz denenmedi.


## MVP kabul matrisi

| ID | Senaryo | Beklenen sonuç | Sprint |
|---|---|---|---|
| TC01 | Doğrudan kart ile başarı | Backend sorgusu/eşleşme sonrası tek paid etkisi | S04 |
| TC02 | Banka/3DS reddi | Teyitli final fail; güvenli mesaj | S04 |
| TC03 | Kullanıcı popupı kapatır | Otomatik fail yok; pending/sorgu | S02–04 |
| TC04 | Aynı butona iki tık / iki sekme | Tek aktif attempt, aynı idempotent sonuç | S02 |
| TC05 | Aynı key farklı sipariş/tutar | Conflict; provider çağrısı yok | S02 |
| TC06 | Callback 100 tekrar | 1 sipariş etkisi; duplicate audit | S03 |
| TC07 | Pending callback success sonrasında | SUCCEEDED geriye dönmez | S03 |
| TC08 | Callback hiç gelmez | GetById jobuyla doğru sonuç | S03 |
| TC09 | Sahte callback / sahte postMessage | Paid etkisi yok; doğrulama/karantina | S03 |
| TC10 | Tutar veya merchant uyuşmazlığı | REVIEW_REQUIRED; fulfillment yok | S03 |
| TC11 | Add timeout, UUID bilinmiyor | UNKNOWN; kör Add retry yok | S02–03 |
| TC12 | DB kapalı callback alımı | Başarı ACK yok; kayıp olay başarı sayılmaz | S03 |
| TC13 | 401/429/5xx/bozuk 200 | Kısıtlı retry/contract alarm; başarı sayılmaz | S02–03 |
| TC14 | Yetkisiz kullanıcı/başka tenant ID | 401/403/uygun 404; veri sızıntısı yok | S02 |
| TC15 | Popup engeli / yenileme / mobil dönüş | Aynı attempt sürer; güvenli yönlendirme | S02–04 |
| TC16 | Restore ve rollback | Açık attemptler korunur; sorguyla toparlanır | S04 |

## Sonraki kabul grupları

S05–07: cüzdan, devre dışı merchant, yanlış mapping, rol ve export görünürlüğü. S08–10: eşzamanlı iade, timeout iade, brüt/net farkı, timezone sınırı, geç settlement. S11–13: worker kill, DLQ replay, backpressure, 2x yük ve restore. S14–16: IDOR, XSS, SSRF, retention, secret rotation. S17–22: contract breaking change, SDK örnek derlemesi, SSO iptal, görev ayrılığı ve tenant izolasyonu. S23–25: birleşik finansal uç durum ve bağımsız kanıt örneklemesi.

## Test kanıtı formatı

Run ID, commit SHA, ortam, fixture sürümü, GP/TC ID, beklenen/gözlenen, timestamp, redakte ekran/log, reviewer ve açık hata bağlantısı. “Geçti” iddiasının yanında hangi testin nerede çalıştırıldığı bulunur. Mock sonucu sağlayıcı UAT kanıtı gibi gösterilmez.

## Hata önceliği

P0: yanlış/çift para etkisi, çapraz tenant sızıntısı veya secret ifşası; yayını durdur. P1: temel ödeme/kurtarma akışı kullanılamıyor; G1 geçilemez. P2: kontrollü workaround olan sınırlı kusur; owner ve süre gerekir. P3: düşük etkili iyileştirme. Üretim olayı şiddeti hizmet sahibi tarafından etki kapsamıyla atanır.


---

# Veri modeli ve invariantlar

Kaynak: src/content/docs/veri-modeli.md

## Önerilen tablolar

| Tablo | Temel alanlar | Kısıt / politika |
|---|---|---|
| orders | id, tenant_id, seller_id, amount_minor, currency, version | Tutar sunucudan; değişiklik attempt hashini etkiler |
| merchant_mappings | tenant_id, seller_id, provider_submerchant_id, active, verified_at | Satıcı eşleşmesi tekil; provider erişimi server-side |
| payment_attempts | id, order_id, tenant_id, provider_id, state, amount_minor, currency, version, timestamps | Bilinen provider_id ortam/hesap kapsamında unique; aktif attempt kısıtı |
| idempotency_records | tenant_id, key, request_hash, attempt_id, response_summary, expires_at | tenant + key unique; saklama süresi provider belirsizlik penceresini kapsar |
| callback_inbox | id, provider_event_key?, body_hash, provider_id, verification, state, retry_count, received_at | Olay tekilliği + ayrı business effect dedup |
| payment_effects | attempt_id, effect_type, target_id, applied_at | attempt + effect_type + target unique |
| outbox_messages | id, aggregate_id, type, payload, lease_until, attempts, delivered_at | At-least-once delivery; consumer idempotency |
| refund_requests | id, attempt_id, amount_minor, state, requester, approver, key | Paid tutarı aşamaz; mevcut provider kısmi iade desteği bilinmiyor |
| reconciliation_cases | id, refs, expected, observed, reason, owner, state | Aynı fark tekrar çoğalmaz; çözüm gerekçesi gerekir |
| audit_events | actor, tenant, action, entity, time, correlation, safe_diff | Append-only mantık; ayrı yetki ve retention |

Bu şema taslaktır; hazır migration yoktur. Demo yalnızca `PaymentCallbackRecords` tutar. S01 ilişkileri ve constraintleri gerçek sipariş sistemine göre kesinleştirir.

## Para ve zaman

Yerelde TRY için kuruş integer veya `decimal`/`numeric` kullan. Currency alanını açık taşı; API şemasında currency alanı yok, TRY desteğini **Q08** ile teyit et. Provider JSON `number/double` tipinde olsa bile iş hesaplarını floating point ile yapma. Adaptör sınırında kültürden bağımsız iki ondalık serialize et; 0.01, 0.10+0.20, üst limit ve yuvarlama sınırlarını test et.

UTC anlarını sakla; kullanıcı gösterimini `Europe/Istanbul` ile biçimlendir. Tarih aralığı sorgusunun sağlayıcı saat dilimi ve sınır dahil/hariç semantiğini Q09 ile teyit et. İş günü/mutabakat günü ayrı domain kavramlarıdır.

## Değişmez kurallar

1. İstemci amount, merchant veya paid iddiası finansal gerçek değildir.
2. Bir sipariş için eşzamanlı aktif ödeme niyeti kontrollüdür; farklı sekmeler aynı atomik kısıta tabidir.
3. Bir tahsilat iş etkisi en fazla bir kez uygulanır; teslimler birden çok kez olabilir.
4. Her para değişimi kaynağı, aktörü, zamanını ve korelasyonunu taşır.
5. Belirsiz işlem otomatik fail veya tekrar tahsilat sayılmaz.
6. İade tahsilat tarihçesini silmez; iade toplamı doğrulanmış tahsilatı aşamaz.
7. Tenant filtresi her sorgu ve cache anahtarında uygulanır; API ID bilmek erişim hakkı vermez.
8. Kart PAN/CVV, token, credential ve ödeme linki log/analitik/dokümanlara yazılmaz.

## Migration ve geri dönüş

S01’den itibaren migration ayrı sürümlenir ve test DB’de denenir. S04 pilotta yedek + kontrollü migration adımı bulunur. S13 expand/contract akışıyla eski/yeni sürüm birlikte çalışabilir. Veri kaybettiren down migration yerine uygulama rollbacki + ileri düzeltme tercih edilir. Demo DB’si üretim sipariş/ledger sistemi olarak kullanılmaz.
