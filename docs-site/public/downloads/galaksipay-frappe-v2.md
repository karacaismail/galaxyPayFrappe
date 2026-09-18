# GalaksiPay × Frappe · V2 geliştirme rehberi

18 Eylül 2026 · Güncel mimari planı

## 01 · Hedef ve değişen karar

**İlk hedef:** alıcı ödeme yapabilsin; satıcı kendi tahsilatını görebilsin; platform belirsiz işlemi güvenle çözebilsin. Tek satıcıya ait sipariş + tek para birimi + GalaksiPay hosted checkout ile başla. Ürün kataloğu, kampanya motoru ve çok satıcılı sepet MVP şartı değildir; mevcut sipariş sistemi varsa bağlan, yoksa küçük bir Payment Order oluştur.

**Bu sayfa güncel v2 planıdır.** [V1 yol haritası](https://karacaismail.github.io/galaxyPayFrappe/) önceki .NET/PostgreSQL önerisini tarihsel referans olarak korur. V2’de bu backend önerisi **Frappe custom app + seçilen Frappe sürümüyle uyumlu MariaDB + Redis/worker/scheduler** olarak değiştirilir. V1’in idempotency, callback güvenliği ve finansal doğruluk kuralları devam eder; 26 sprintlik takvim v2 MVP takvimi değildir.

Bu teslim çalışan bir **dokümantasyon portalıdır**. Frappe servisi, Vue admin ve alıcı/satıcı ödeme uygulaması henüz geliştirilmedi. Aşağıdaki API/DocType isimleri projemiz için önerilen sözleşmedir. Sağlayıcının [doğrulanmış API referansı](https://karacaismail.github.io/galaxyPayFrappe/docs/api-referansi/) ayrı tutulur.

**Hız tercihi:** hazır Frappe kimlik, rol, DocType, workflow ve job mekanizmalarını kullan; tek deploy edilebilir custom app; ayrı buyer/seller frontend girişleri ve ayrı Vue admin buildi; bir işi veri modelinden ekrana ve teste kadar bitir. Bir sprintte en fazla iki aktif iş. Mock adaptör ile sağlayıcı yanıtını beklemeden ilerle.

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
- **V2-ADR02 — Öneri, S0’da kesinleşir:** tek Frappe site içinde platform + merchant üyelik modeli. Bir satıcı = bir tenant site varsayımı yok. Bağımsız kurumsal müşteriler gerekirse site-per-tenant değerlendirilir; merchant iş sınırı ile altyapı tenantı farklıdır.
- **V2-ADR03 — Öneri:** minimum özel Payment Order; ERPNext bağımlılığı yalnızca mevcut ERPNext muhasebe/sipariş sistemi varsa. Hazır olmayan ERP projesi ödeme MVP’sinin önkoşulu yapılmaz.
- **V2-ADR04 — Kabul edildi, kullanıcı yönlendirmesi:** 320 CSS px taban, ortak + seçilen profil modülü; masaüstüne özel kod dar ekran açılışında sıfır ağ isteği.
- **V2-ADR05 — Öneri:** tek satıcı/sipariş, hosted checkout, server-side para ve idempotency. Çoklu satıcı dağıtımı, taksit ve kısmi iade ayrı sağlayıcı teyidi ister.

Alternatif değerlendirmesi: mikroservis/broker eklemek ilk teslimi ve operasyon yükünü artırır; başlangıçta Frappe worker ve kalıcı inbox yeterli hedef olarak seçildi. Mevcut büyük sipariş sistemi varsa Payment Order kopyası yerine adapter seçilir. S0 sonunda TL ürün sınırı, ekip bilgisi ve desteklenen sürümleri ADR’ye kaydeder.

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

### DocType taslağı — S0’da migration tasarımına dönüşür

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

Üç ayrı arayüz aynı kullanıcı kimlik altyapısını paylaşır; kimlik bilgisi kodu yeniden icat edilmez. Frappe session cookie ve aynı-origin istekler önerilir; state-changing requestlerde sürüme uygun CSRF token aktarımı gerekir. S0 auth adapterı token edinme/bootstrap akışını doğrular; `ignore_csrf` genel ayarıyla çözüm üretilmez. Kullanıcı ekranına uzun ömürlü Frappe API secretı veya GalaksiPay JWT koyma. [Frappe REST auth](https://docs.frappe.io/framework/user/en/api/rest).

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

Alpine bir checkout açıklaması/menü gibi küçük alanın davranışını yönetebilir; global state ödeme gerçeği değildir. Sıkı CSP için `@alpinejs/csp` seçeneğini değerlendirmek, standart build yüzünden ödeme sayfasında `unsafe-eval` açmaktan daha iyi başlangıçtır; desteklenen ifade sınırlarını S0’da doğrula. [Alpine CSP](https://alpinejs.dev/advanced/csp).

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

## 09 · Özellik öncelikleri: önce tahsilat, sonra genişleme

| Alan | MVP öncesi / MVP zorunlu | MVP sonrası | Daha sonra / koşullu |
|---|---|---|---|
| Alıcı kimliği | Mevcut Frappe session, ownership, CSRF | Hesap kurtarma/davet UX geliştirmesi | Misafir checkout, sosyal giriş |
| Sipariş | Tek satıcı, TRY teyidi, sunucu tutarı, sürüm | Sipariş kaynağı adapterı genişleme | Çok satıcılı sepet/parçalı tahsilat |
| Ödeme | Hosted link, idempotency, durable intent, callback/sorgu | Cüzdan UAT ve deneyim iyileştirme | Taksit, çoklu para, abonelik |
| Satıcı | Pilot aktivasyon, üyelik, mapping, liste/detay | Self-service onboarding ve ekip | Otomatik kurumsal KYC workflow |
| Admin | Mapping, işlem/detay, review, refresh, kill switch | Refund/Void, mutabakat, CSV | Büyük grafik/BI, toplu işlemler |
| Güvenlik | Role/record kontrolleri, secret, TLS, masking | Bağımsız pentest ve retention otomasyonu | SSO/SCIM ve kurumsal kontrol paketi |
| İşletim | Alarm sahibi, backup/restore, rollback, manual iade yolu | SLO, günlük settlement, DLQ replay | Çok bölge, daha sıkı RPO/RTO |
| DX | Seed/mock, tipli kontrat, CI, prompt/DoD | Otomatik schema drift, SDK örnekleri | Çoklu provider adapter ekosistemi |
| Mobil | 320 taban + ayrı entry/chunk + cold-load testi | Gerçek kullanıcı ölçümü, düşük ağ iyileştirme | Gerekçeli native uygulama |

MVP’de katalog/stok/sepet/lojistik sistemi kurulacak varsayımı yok. İhtiyaç varsa bu ayrı kapsam ve süre etkisidir. Başarısızlık, belirsizlik, veri izolasyonu ve geri dönüş kontrolleri hız için sonraya atılmaz. Finansın kontrollü manuel iade/itiraz prosedürü pilot öncesi hazırdır; otomatik iade ekranı ertelenebilir. Chargeback/itiraz geldiğinde platformun kimden kanıt toplayacağı ve sağlayıcıya hangi referansı ileteceği işletim sahibine atanır; banka kararı uygulamada uydurulmaz.

## 10 · Kısa sprint planı ve teslim kapıları

**Plan varsayımı:** Frappe/Python bilen 1 backend + Vue/TypeScript bilen 1 frontend geliştirici, 0,5 QA ve ihtiyaç halinde platform/finans katkısı. Sprint 1 hafta; iki geliştirici için 10 kişi-günün yaklaşık 7’si net kapasite, kalan review/entegrasyon tamponudur. S0 3–5 iş günü; S1–S3 birer 5 iş günü: teknik MVP için **18–20 iş günü plan varsayımı**, dış onay/bekleme hariç. Bu teslim tarihi taahhüdü değildir. Tek kişi veya Frappe öğrenme eğrisi varsa S0 sonunda yeniden tahmin edilir.

Her sprint üç küçük kart, yaklaşık 2’şer geliştirme kişi-günü; 1 gün teknik belirsizlik tamponu. İşler AI için 2–4 saatlik parçaya daraltılır. Finansal yan etki ve yetki davranışı ayrı testle kapanır. Aşağıdaki IDler v1’deki GP kartlarından bağımsızdır.

### S0 · MVP öncesi — sözleşme ve çalışan iskelet

**Önkoşul:** ürün sahibi, sağlayıcı test erişim süreci ve mevcut sipariş/auth kararları. **Roller:** BE + FE + TL/QA. **Demo:** temiz kurulumda iki ayrı satıcı ve bir alıcıyla mock akış; 320 px başlangıç.

- **F0-1 / Sözleşme:** Frappe/Python/Node/DB ve frontend paket sürümlerini tek compatibility matrisinde sabitle; lockfile, provider snapshot, Q kaydı ve sentetik fixture. Kabul: temiz checkout, aynı sürüm, auth/provider cevap parser testi.
- **F0-2 / Frappe temel:** custom app, rol/üyelik, Order/Attempt/Inbox taslağı, migration, permission query/record testleri. Kabul: Seller A, Seller B’nin listesini/detayını okuyamaz; Buyer başka ordera erişemez.
- **F0-3 / Frontend temel:** buyer/seller ayrı Vite entry, Vue admin ayrı build, shared contracts/tokens, 320 taban ve profil loader. Kabul: mobile HAR’da desktop/admin chunk yok; temel metin ≥1rem.

**G0 çıkışı:** sürüm/kimlik/sipariş sınırı belli, seed tekrar üretilebilir, mock demosu ve izolasyon testi geçti. Sağlayıcı belgesinin §2.3/Q01/Q04 gibi açıkları sahipli; mock ilerleyebilir. Tüm gerçek credentiallar sunucuda.

### S1 · MVP — alıcı ödeme başlatır

**Önkoşul:** G0. **Roller:** BE + FE, QA. **Demo:** tek alıcı, tek aktif satıcı, tek sipariş → aynı sekmede hosted ödeme linki.

- **F1-1 / Kalıcı start:** session/CSRF, server tutarı, order version, DB unique idempotency ve tek aktif intent. Kabul: eşzamanlı 20 start = 1 etkin intent; aynı key farklı request conflict.
- **F1-2 / Provider adapter:** server auth, token scope/cache, Add ve belirsiz çağrı statei. Kabul: Add timeout ve worker kill tekrar tahsilat yapmaz; UUID/URL yoksa contract error.
- **F1-3 / Checkout UX:** 320 özeti, erişilebilir form/hata, PaymentUrl allowlist, redirect ve pending dönüşü. Kabul: iki sekme/yenileme/popup engeli aynı attempti kullanır; URL/token logda yok.

**Teslim:** uçtan uca sandbox başlatma; henüz sadece link üretimi ödeme başarı kabulü değildir. Q03/Q04/Q05/Q08 cevabı canlı davranış için gereklidir.

### S2 · MVP — güvenilir sonuç ve görünürlük

**Önkoşul:** S1. **Roller:** BE + FE, QA. **Demo:** callback kaybolsa dahi doğru sonuç; satıcı kendi işlemini görür.

- **F2-1 / Callback ve worker:** kalıcı inbox, doğrulama, GetById karşılaştırması, event/business dedup. Kabul: 100 callback tek sipariş etkisi; yanlış tutar/merchant reviewa gider; sahte postMessage paid yaratmaz.
- **F2-2 / Recovery:** scheduler, enqueue kaybı, geç/ters olay, UNKNOWN çözüm yolu ve alarm. Kabul: DB/Redis/worker arızasında kayıt kaybolmaz; açık işler kontrollü yeniden sorgulanır.
- **F2-3 / Seller + Vue ops:** satıcı liste/detay; admin inceleme/mapping/refresh; field allowlist. Kabul: 3 rolün aynı IDye erişim sonuçları doğru; refresh asla Add çağırmaz.

**Teslim:** güvenilir ödeme durumu + minimum seller/admin. Q01/Q02/Q06 kapanmadan üretim kapısı geçilmez.

### S3 · MVP — pilotu bitir ve teslim et

**Önkoşul:** S2 + gerçek satıcı/pilot erişimi. **Roller:** QA + BE/FE + hizmet sahibi/finans. **Demo:** kabul paketi ve geri dönüş provası.

- **F3-1 / UAT:** başarı/red/3DS/yenileme/geç callback/duplicate/tenant escape/mobil ağ senaryoları. Kabul: [v1 TC01–16](https://karacaismail.github.io/galaxyPayFrappe/docs/test-stratejisi/) Frappeye uyarlanmış olarak geçer; rol testleri Administrator ile yapılmaz.
- **F3-2 / Mobile ve build gate:** 320 cold-load JS/CSS ayrımı, 200% zoom, focus, klavye, CSS/JS budget. Kabul: desktop-only istek 0, public Vue istek 0, içerik kaybı/taşma 0; desktopta enhancement gerçekten çalışır.
- **F3-3 / Pilot işletimi:** HTTPS, prod secret/mapping, alarm sahibi, backup+restore, kill switch, manual iade ve rollback. Kabul: onaylı dar satıcı/hacim; 48 saat pilot gözlemi ve tüm açık UNKNOWNlara sahip atanması.

**G1 teknik MVP:** kritik testler yeşil, P0/P1 açık 0, görev/kanıt/rollback paketi mevcut. **G1 canlı pilot:** sağlayıcı teyitleri, §2.3/aktivasyon, gerçek ortam ve iş sahibi kabulü ayrıca tamam. 48 saat önerilen ilk gözlemdir; olgunluk sertifikası değildir. Dış blokaj varsa “sandbox MVP tamam / canlı pilot bekliyor” denir.

### S4 · MVP sonrası — satıcı deneyimi ve cüzdan

**Önkoşul:** G1 veya bağımsız sandbox keşif. **Roller:** FE + BE + QA/ops.

- **F4-1:** §2.3 teyitli onboarding, özel belge erişimi, status/rejection. Kabul: yanlış satıcı belgesine erişim engelli.
- **F4-2:** cüzdan + doğrudan kart UAT, test hesabı, mobil dönüş; kart verisi bizde yok. Kabul: iki akış ayrı kanıtlı.
- **F4-3:** satıcı üyelik daveti/revoke ve destek vakası. Kabul: iptal edilen üye liste ve dosyadan da çıkar.

**G2 çıkışı:** iki satıcı izolasyonu, cüzdan UAT, self-service kullanımı. Sağlayıcı kayıtlı kart desteği hazır değilse ayrı feature flag ve blokaj.

### S5 · MVP sonrası — finansal operasyon

**Önkoşul:** Q07/Q09 iade/iptal/settlement teyidi. **Roller:** BE + finans + QA; FE minimal UI.

- **F5-1:** Refund/Void talebi, görev ayrılığı ve işlem keyi. Kabul: tekrarda çift iade yok; kapsam dışı kısmi iade görünmez.
- **F5-2:** günlük sipariş–provider–settlement mutabakatı; timezone/geç kayıt. Kabul: seed edilen tüm farklar bulunur ve tekrar çoğalmaz.
- **F5-3:** maskeli export, formül enjeksiyonu koruması, itiraz/chargeback sorumluluğu. Kabul: finans örnek dönemi kaynak kanıtıyla kapatır.

**G3 çıkışı:** finansal hareketler açıklanabilir; iade belirsizliği review kuyruğuna gider. Settlement kaynağı yoksa rapora “banka mutabakatı tamam” yazılmaz.

### S6 · Dayanıklılık ve platform kalitesi

**Önkoşul:** pilot hacmi/incident verisi. **Roller:** platform + BE + QA/güvenlik. Süre 5–10 iş günü; ölçülen ihtiyaca göre daralt.

- **F6-1:** hedef hacim/2x tepe yük, rate limit, backlog/DLQ ve restore tatbikatı. Kabul: kabul edilmiş RPO/RTO ölçülür; provider yük testi yalnızca izinliyse.
- **F6-2:** retention, secret rotation, bağımlılık taraması, bağımsız yetki/ödeme testi. Kabul: kritik/yüksek açıklar kapalı; kalan kritik bulgu canlı geçişini engeller ve sahibine atanır.
- **F6-3:** contract drift, golden path ve yeni geliştirici onboarding ölçümü. Kabul: ≤30 dk mock hedefi kanıtlı; kırıcı şema değişikliği CI’ı durdurur.

**G4 çıkışı:** operasyon, güvenlik ve DX hedefleri ölçülmüş; büyüme tahmin yerine veriyle planlanır.

### S7+ · Enterprise / maturity — ihtiyaç tetiklediğinde

**Başlama kriteri:** müşteri sözleşmesi, trafik, izolasyon veya denetim ihtiyacı. MVP önüne alınmaz. Zaman penceresi gerçek gereksinimlerle yeniden tahmin edilir.

- **F7-1:** kurumsal SSO/MFA, görev ayrılığı, erişim gözden geçirme; gerekiyorsa SCIM/tenant site ayrımı. Kabul: revocation ve çapraz tenant negatif testleri.
- **F7-2:** bağımsız denetim kanıtı, incident/restore tatbikatı, maliyet/SLO raporu. Kabul: en az 90 günlük gözlem; eksik veri varsa maturity kararı bekler.
- **F7-3:** kullanıcı değerine göre çoklu provider/taksit/abonelik keşfi. Kabul: sağlayıcı yetkisi, iş vakası, feature flag ve durdurma kriteri; gereksiz altyapı eklenmez.

**G5 çıkışı:** her kontrol sahibi ve kanıtı belli; “enterprise/maturity” iç ürün ölçütüdür, dış sertifika iddiası değildir. V1’in uzun vadeli [G7/G8 ölçütleri](https://karacaismail.github.io/galaxyPayFrappe/docs/kabul-kapilari/) değerlendirme referansı olabilir.

## 11 · Vibecoding işletim sistemi

### Önerilen repo yapısı — ödeme uygulaması için taslak

```text
apps/galaxy_pay/             # Frappe custom app; bu klasör henüz yok
  galaxy_pay/api/            # dar, izinli RPC command/query
  galaxy_pay/services/       # ödeme domaini, idempotency, state
  galaxy_pay/providers/      # GalaksiPay ve deterministic mock
  galaxy_pay/doctype/        # uygulama modülü altında gerçek DocType yolları
  galaxy_pay/jobs/           # inbox/reconciliation/sweeper
  galaxy_pay/tests/          # role, transaction, concurrency, provider
frontends/customer/         # TypeScript + Tailwind + Alpine + Flowbite
frontends/seller/           # ayrı entry/route ve izinli DTO
frontends/admin/            # Vue + Vite; public frontpages'e import edilmez
packages/contracts/        # Python şemasından teyitli TS tip/fixture
packages/design-tokens/     # ortak renk, 1rem, boşluk, focus
fixtures/                  # synthetic; credential/PAN/gerçek telefon yok
docs-site/                 # çalışan Astro v1 + v2 dokümanı
```

Frappe gerçek modül/DocType yolu scaffold sonucu esas alınır; şematik ağaçtan elle yanlış modül dizini üretme. Sürüm kararları: Frappe/Bench/Python/Node/MariaDB/Redis uyumluluğu birlikte kilitlenir; web tarafında Vue/TypeScript/Vite/Tailwind/Flowbite/Alpine lockfilela kilitlenir. Bu doküman görülmeyen bir Frappe kurulumunun sürümünü doğrulanmış gibi söylemez.

### İlk gün çıktıları

S0’da `dev`, `seed`, `test:backend`, `test:contract`, `test:e2e`, `test:mobile-network`, `verify` görevleri tek görev çalıştırıcıda tanımlanır; isimler şu an **hedef komutlardır**, bu repo içinde çalışan backend scriptleri değildir. Mevcut `docs-site/npm run verify` yalnızca doküman sitesini doğrular. Frappe test yolu `bench --site <test-site> run-tests --app galaxy_pay` olarak seçilen sürümde doğrulanır. [Frappe test rehberi](https://docs.frappe.io/framework/user/en/testing).

Sentetik seed: Buyer A/B, Seller A/B, ops, finance; aktif/pasif merchant; paid/pending/unknown/fail siparişler. Provider mock senaryoları: success, decline, Add timeout, auth expire, bozuk 200, duplicate callback, yanlış merchant, callback-before-save, queue failure ve geç success. Ortam kurulumundan sonra **tek mock akış** çalışmadan feature geliştirmeye başlanmaz.

### Bir AI görev kartı

```text
Kart: F2-1 / callback inbox ve doğrulama.
Bağlam: v2 §06–07, v1 provider snapshot, Q01/Q02/Q06 cevapları.
Dosya sınırı: callback api + inbox service + provider query + ilgili test.
Hedef: tekrar teslimde tek iş etkisi; provider teyidi olmadan paid yok.
Değiştirme: frontend statei ve unrelated Frappe core dosyaları.
Kabul: 100 tekrar -> 1 etki; yanlış amount/merchant -> review;
       DB yazılamazsa success ACK yok; worker crash recoverable.
Mobil değişirse: 320 px cold-load ve desktop request=0 kanıtı ekle.
Önce mevcut kodu oku, bir negatif testi tarif et, küçük diff uygula.
Endpoint/header/alan uydurma. Secretı prompta, fixturea veya loga taşıma.
Çıktı: diff + gerçekten çalışan test + açık Q + docs + geri dönüş.
```

AI döngüsü: **bağlam → küçük plan → bir invariant testi → uygulama → test → diff review → demo**. Her kart tek sorumlu ve reviewer taşır. İşi bitirmek için yeni kütüphane gerekçesi “daha modern” olamaz; ölçülen eksikliği ve alternatifini yaz. Üç frontendin auth clientı, para formatterı veya error mapini kopyalaması yerine shared tipli modül kullan; framework runtimeını shared pakete koyma.

### Definition of Ready / Done

**Ready:** kullanıcı senaryosu IDsi, rol, input/output, mock, negatif durum, dosya sınırı, kabul ölçüsü, dış Q bağımlılığı. **Done:** ilgili role/record/para/timeout testleri, build, maskeli log, docs, review, gerekiyorsa migration+rollback. UI kartında ayrıca 320 ekran/klavye/focus ve network artifacti. Çalıştırılmayan sandbox testi açıkça “bekliyor”. Kodun yazılması veya mockun geçmesi gerçek ödeme kabulü değildir.

### Kısa sprint ritmi

Pazartesi hedef ve DoR; salı–perşembe dikey dilimler + günlük 15 dakikalık blokaj/kanıt kontrolü; cuma UAT/demo, gate ve sıradaki sprint. S1 sonunda gerçek çevrim süresiyle tahmin yenilenir. Yeni özellik ancak aynı sprintten eşdeğer iş çıkarılırsa eklenir. İlk üç MVP sprintinin sonunda çalışan alıcı–satıcı–ops yolu her seferinde gösterilir.

## 12 · Test ve canlıya çıkış kontrolü

| Test grubu | Ölçülen invariant | Geçiş kapısı |
|---|---|---|
| Domain / gerçek DB | Tek aktif intent, exact para, idempotency, unique effect | G0–G1 |
| Frappe permissions | Buyer ownership, seller membership, list/detail/file isolation | G0–G1 |
| Provider contract | ID, token/body, Amount, merchant, status map; bilinmeyen fail-safe | G1 |
| Fault injection | Add sonrası crash, DB rollback, inbox commit/queue kaybı | G1 |
| Browser E2E | 3DS/redirect/refresh, pending/unknown mesajı, sahte postMessage | G1 |
| Mobile network | 320 cold context; desktop JS/CSS/admin bundle 0; no prefetch leak | G0 ve her UI PR |
| UX / accessibility | 1rem, 44 px, focus, keyboard, zoom, safe area | G1 |
| Operasyon / finans | Restore/rollback, kill switch, manuel iade, açık vaka sahipliği | Pilot |

### Gerçek adaptive testinin taslağı

Bu örnek gelecek ürün testidir; fixture/project ayarları S0’da kurulur. Asset sınıflaması Vite manifestten yapılır; yalnızca “desktop” kelimesinin dosya isminde bulunmasına güvenilmez. Browser testinde izinli artifact hashlerinin listesi manifestten okunur.

```ts
// Önerilen Playwright acceptance: cold, boş context, serviceWorkers:'block'
const requested: string[] = [];
page.on('request', request => requested.push(request.url()));
await page.setViewportSize({ width: 320, height: 740 });
await page.goto('/pay/synthetic-order');
await expect(page.getByRole('button', { name: 'Öde' })).toBeVisible();
// Menüyü/formu kullan; idle/prefetch penceresini de izle.
expect(requested.some(url => desktopAssetManifest.has(new URL(url).pathname)))
  .toBe(false);
expect(requested.some(url => adminAssetManifest.has(new URL(url).pathname)))
  .toBe(false);
```

Gerçek cihaz + pointer profili ayrı contextlerde çalıştırılır. Dev serverın modül graphı production bundle kanıtı değildir; CI production buildi servis eder. HAR, manifest, gzip ölçümü, viewport, cache ayarı ve commit test artifacti olarak saklanır. Desktop testi 1280/fine pointerda enhancementı indirip çalıştırdığını da gösterir; “hiçbir kod çalışmadığı için 0 request” yanlış geçişini engeller.

### Pilot öncesi kapatma listesi

- Sağlayıcı callback kimliği/imzası/retry/ACK, PaymentId semantiği ve belirsiz Add kurtarma yolu teyitli.
- Frappe custom method izinleri, CSRF ve dosya erişimi testli; global bypass yok.
- Gerçek satıcı §2.3/aktivasyon, prod host/credential, tutar/para/limit kuralları teyitli.
- Kart/cüzdan test fixtureları güncel; provider yükü için izinli sınırlar belli.
- Yeni start kill switchi, açık ödemeleri takip eden worker/scheduler, alarm ve destek sahibi hazır.
- Manuel iade/itiraz, backup restore, encryption key koruması ve application rollback provası hazır.
- Minimum mobil ve finansal kabul testleri geçti; unresolved P0/P1 = 0.

Docs GitHub Pages yayını bu listenin geçtiği anlamına gelmez. Uygulama deploymentı: staging Frappe + frontend build → migration/role fixture → smoke/UAT → kontrollü prod → gözlem → genişletme. Pages bu sırada sadece plan ve statik kanıtları yayınlar; secret veya gerçek ödeme logu koyulmaz.

## 13 · Açık kararlar ve kaynak kaydı

### İlk sprintte kapatılacak kararlar

| ID | Karar | Sahip / etkisi |
|---|---|---|
| V2-Q1 | Mevcut Frappe/ERPNext var mı, sürüm ve barındırma nedir? | TL/ops; compatibility matrix ve kurulum |
| V2-Q2 | Sipariş kaynağı ve alıcı oturumu hazır mı; misafir şart mı? | PO/BE; kapsam/takvim |
| V2-Q3 | Bir sipariş tek satıcılı mı; platform kendi hesabına mı yoksa merchant adına mı hareket ediyor? | PO/finans; para ve yetki modeli |
| V2-Q4 | Vue admini kim kullanacak; satıcılar için ayrı lightweight portal yeterli mi? | PO; bu plan ayrı seller portalını varsayar |
| V2-Q5 | Ortam domainleri, callback erişimi, sağlayıcı Q01–Q12 cevapları? | Platform/sağlayıcı; canlı kapı |
| V2-Q6 | Gerçek ekip, beklenen hacim, hizmet saatleri, hedef budget? | PO/TL; 18–20 iş günü varsayımını doğrular |

### V1 → V2 izlenebilirliği

| V1 kanıt / kapsam | V2 karşılığı |
|---|---|
| GalaksiPay demo + Swagger | Python adapterın provider sözleşmesi; C# kodu üretim backend seçimi değil |
| GP/S01–S04 | V2 S0–S3 dikey MVP, Frappe izin/transaction ve adaptive acceptance ile |
| Post-MVP/finans | V2 S4–S5; gerekli manual operasyon pilot öncesinde |
| Dayanıklılık/güvenlik/DX | Temeller G0–G1, ileri ölçümler S6 |
| Enterprise/maturity | S7+ gereksinimle tetiklenir; 90 gün kanıt şartı korunur |
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
