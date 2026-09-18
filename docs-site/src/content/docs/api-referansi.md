---
title: "GalaksiPay API referansı"
description: "18 Eylül 2026 Swagger şeması ve demo istemcisine dayanan entegrasyon yüzeyi."
group: "Entegrasyon"
---

## Ortam ve kanıt

Test base URL: `https://testapi.galaksipay.com/galaksipay`. Aşağıdaki yollar bu base URL’ye eklenir. Üretim URL’si verilmedi; test hostunu tahmin ederek üretime çevirmeyin. [Swagger UI](https://testapi.galaksipay.com/galaksipay/swagger/index.html) ve [ham OpenAPI](https://testapi.galaksipay.com/galaksipay/swagger/v1/swagger.json) 18 Eylül 2026 tarihinde salt okunur alındı. Şema JWT Bearer güvenlik tanımı içeriyor; fiili hesap yetkileri denenmedi.

[Özet sözleşmeyi indir](/downloads/provider-contract.json). Bu dosya ilgili yolların ve modellerin seçilmiş anlık görüntüsüdür; tam OpenAPI belgesi veya çalıştırılabilir SDK değildir. Alan yazımında şemanın PascalCase biçimi korunmuştur. Demo cevapları case-insensitive okur; sandbox fixtureıyla gerçek casing teyit edilir.

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
