---
title: "Mevcut durum ve boşluklar"
description: "Demo kaynaklarından doğrulanan davranışlar ve MVP öncelikleri."
group: "Başlangıç"
---

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
