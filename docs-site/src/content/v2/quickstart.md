---
title: "Quickstart"
description: "İlk doğru istek ve ilk başarısız test için gerekli sıra."
group: "Başlangıç"
---

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
| 2 · Auth | [Authenticate](/v2/api/authenticate/) | Gerçek token cevabı redakte fixturea alınır; Q03 parser/TTL teyidi |
| 3 · Satıcı | [GetSubMerchants](/v2/api/sub-merchants/) | Dönen gerçek Id, IsActive ve ayarlar doğrulanır; iki dummy hesabın IDsi listeden alınır |
| 4 · Başlat | [Transaction/Add](/v2/api/create-payment/) | Benzersiz OrderNo, yetkili telefon, gerçek submerchant, erişilebilir HTTPS callback; Id ve PaymentUrl kaydedilir |
| 5 · Hosted checkout | [18 test kartı](/v2/test-data/) | Kart listeden seçilir; 3DS/SMS ekranında test OTP kullanılır; başarısız kart için listeden başka kart denenir |
| 6 · Sonuç | [Callback](/v2/callback/) + [GetById](/v2/api/payment-status/) | OrderNo/Id/tutar/merchant eşleşir; tek sipariş etkisi. Linkin açılması “ödendi” değildir |
| 7 · Hata yolu | [TDD matrisi](/v2/tdd/) | Tekrar/timeout/kayıp callback/yanlış merchant ayrıca sınanır; happy path tek başına kabul değildir |

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

[Core development](/v2/core-development/) → [C01 kırmızı testleri](/v2/roadmap/#c01) → en küçük uygulama → gerçek DB/rol testi → review. Sağlayıcı teyidi beklerken deterministic mock ile ilerle; mock sonucunu sandbox sonucu olarak kaydetme.
