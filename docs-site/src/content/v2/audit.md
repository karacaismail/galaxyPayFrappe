---
title: "Eksik ve gereksiz içerik analizi"
description: "Önceki teslimin kaynak karşılaştırması; düzeltme ve açık kalanlar."
group: "İnceleme"
---

## Sonuç

Önceki içerik güvenlik ve uzun vadeli plan açısından ayrıntılıydı; **geliştiricinin ilk entegrasyonu çalıştırması açısından eksikti**. Test kartlarını sırf PAN/CVV alanı içeriyor diye tamamen dışlamak, sağlayıcının dummy verisini gerçek ödeme verisiyle karıştırdı. Yerel dosyada 18 test kartı vardı. Şimdi kaynakla birebir eşlenen ayrı referans ve JSON olarak sunulur; fiili kart geçerliliği denenmiş değildir.

## Atlanan veya yetersiz kalanlar

| Eksik | Kaynakta ne vardı? | Düzeltme / kalan durum |
|---|---|---|
| Kart kataloğu | 18 PAN, `2612`, `000`, `123456` | [Test verisi](/v2/test-data/), SKT dönüşümü, kart refleri ve UAT kaydı |
| Telefon akışları | Cüzdan için kayıtlı test hesabı; doğrudan kart için kendi telefonları | İki ayrı UAT; wallet telefonunun yerel secret erişim yolu |
| Dummy merchant kullanımı | İki dummy satıcı tanımlanmış | GetSubMerchants → active/ayar → mapping adımları; gerçek IDler erişim gerektiriyor |
| İlk çalıştırma sırası | Demo linki, yerel kaynak, auth, Add, callback, sorgu | [Quickstart](/v2/quickstart/) ve env matrisi; demo erişimi otomatik ödeme onayı değildir |
| Endpoint ayrıntısı | Swagger, model/alan bilgisi | [Endpoint başına referans](/v2/api/), request/response şeması, cURL, hata/retry/test/Q |
| Tam taşınabilir sözleşme | Erişilebilir OpenAPI | Tam 40 path snapshot + Postman koleksiyonu; önceki dosya yalnız seçilmiş excerpt idi |
| Callback örneği | C# callback modeli | [Synthetic fixture](/v2/callback/) ve negatif test vektörleri; imza/ACK hâlâ Q01 |
| Core development | Domain ilkeleri dağınıktı | [C01/C02](/v2/core-development/); para/izin/intent/adapter/test zemini MVP’den önce |
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
| Sayfanın CSS/asset mekanizması ana anlatıda | Doküman aracının detayı ödeme entegrasyonunu gölgeliyordu | [Mobile](/v2/mobile/) ve teknik doğrulama kaydında |
| Genel enterprise etiketleri / tekrar eden uyarılar | Geliştirilecek modül/test yerine kavram tekrarına dönüşüyordu | Faz başına somut modül ve ölçülebilir gate; güven sınırı ilgili referansta |
| Çoklu provider/abonelik/mikroservis varsayımları | MVP’de teyitli kullanıcı ihtiyacı değil | Koşullu keşif; core teslimine bağımlılık yapılmaz |

İdempotency, callback doğrulama, rol izolasyonu, UNKNOWN yönetimi, manuel iade ve restore **gereksiz değildir**; ödeme doğruluğu için core/MVP kapsamındadır. Azaltılan şey bu kontrollerin tekrarı ve önceliksiz sunumudur.

## Doğrulandı / açık ayrımı

- **Yerel dosya:** 18 kart ve alanlar tek tek kaynakla eşlendi; SHA-256 kaydedildi. Şifre ve kayıtlı hesap telefonu public fixture değil.
- **Swagger:** 18 Eylül 2026 tekrar GET 200; 40 path; SHA-256 `fe82c9c550b67eb40d3463f34663c9519e292260125c1d8a301f7d37b4d20d1f`, önceki snapshotla aynı. Şema doğrulaması hesap yetkisi anlamına gelmez.
- **Demo kodu:** callback modeli, Add/auth/merchant istemcisi incelendi. Demo fiilen çalıştırılmadı.
- **Eksik dış belgeler:** asıl entegrasyon eki §2.3, callback imza/retry/ACK, token TTL, PaymentId eşliği, belirsiz Add kurtarma, prod ortamı, iade/settlement semantiği. Bunlar doküman yazılarak uydurulamaz.
- **Henüz test edilmedi:** gerçek test kartıyla ödeme, cüzdan, auth hesabı, Frappe app, 3DS ve canlı pilot. [Karar kaydı](/v2/decisions/) sahip ve bağımlılıkları taşır.

## Kaynak → eylem → kanıt

E-posta talimatları görev talimatı olarak çalıştırılmadı; entegrasyon verisi olarak işlendi. §2.1 bilgileri gönderilmeyecek; §2.3 satıcıdan alınacak bilgisinin kendisi kayıtta, gerçek alan listesi yok. Sağlayıcıya e-posta/mesaj gönderilmedi; auth/ödeme/iade çağrısı yapılmadı.
