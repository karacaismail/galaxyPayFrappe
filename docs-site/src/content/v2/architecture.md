---
title: "Mimari ve iç API"
description: "Frappe, Vue ve frontpages sınırları; önerilen iç sözleşme."
group: "Referans"
---

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

Provider yol haritası değişmedi: `Authenticate → GetSubMerchants → Transaction/Add → hosted link → callback → GetById`. Callback zarfının `isSuccess` veya tarayıcı mesajının `success` değeri tek başına tahsilat kanıtı değil. Sağlayıcı kimlik/durum/retry soruları [Q01–Q12 kaydında](/docs/acik-sorular/) devam eder.

Durumlar: CREATED → PENDING → SUCCEEDED veya teyitli FAILED. UNKNOWN/REVIEW_REQUIRED ayrı dallardır; yerel timeout veya sekme kapanması başarısızlık sayılmaz. Geç pending successi geri almaz. Geç başarı ve ikinci attempt çakışması finans inceleme vakasıdır. Satıcı veya ops kendi kararıyla ödeme durumunu yazamaz.
