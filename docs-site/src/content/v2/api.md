---
title: "GalaksiPay API referansı"
description: "Endpoint başına şema, örnek, hata politikası ve test bağımlılığı."
group: "API referansı"
---

## Sözleşme durumu

Test Swagger 18 Eylül 2026 tekrar HTTP GET ile alındı; **40 path**, önceki SHA-256 ile aynı. Auth/ödeme çağrısı yapılmadı. Aşağıda entegrasyon için seçilmiş 10 operasyon ayrıntılıdır. Diğer 30 path tam snapshotta incelenebilir; hepsi hosted checkout görevi değildir.

[Tam OpenAPI JSON](/downloads/provider-openapi.json) · [Postman koleksiyonu](/downloads/galaksipay.postman_collection.json) · [Model referansı](/v2/api/models/)

## Endpointler

| Yöntem | Yol / referans | Aşama |
|---|---|---|
| POST | [/api/Authentication/Authenticate](/v2/api/authenticate/) | Core |
| GET | [/api/Merchant/GetSubMerchants](/v2/api/sub-merchants/) | Core / MVP |
| POST | [/api/Transaction/Add](/v2/api/create-payment/) | MVP |
| GET | [/api/Transaction/GetById/{id}](/v2/api/payment-status/) | MVP |
| GET | [/api/Transaction/GetByTransactionNo/{transactionNo}](/v2/api/transaction-number/) | Operasyon |
| GET | [/api/Transaction/Get/Get](/v2/api/transaction-query/) | Operasyon |
| GET | [/api/Transaction/GetTransactionsByDateRange/{startDate}/{endDate}](/v2/api/date-range/) | Finans |
| POST | [/api/MasterpassV2/Refund](/v2/api/refund/) | MVP sonrası |
| POST | [/api/MasterpassV2/Void](/v2/api/void/) | MVP sonrası |
| POST | [/api/Transaction/ApplyInstallment](/v2/api/installment/) | Koşullu |

## Katmanları ayır

Bu yollar **GalaksiPay sağlayıcı API’sidir**. [Frappe iç API önerisi](/v2/architecture/) `/api/method/galaxy_pay...` yollarından ayrıdır; iç API henüz geliştirilmedi. Callback ise sağlayıcıdan bize gelen POST’tur: [callback referansı](/v2/callback/).

## Postman kullanımı

Koleksiyonu import et; baseUrl sandbox olarak gelir. `serverToken`, paymentId ve tarih değişkenleri boş tutulur. Request body placeholderlarını yerel environment ile doldur; Authenticate response parserı otomatik yazılmadı çünkü token gövdesi şemada eksik. Koleksiyon örneklerinin hiçbiri bu görevde çalıştırılmadı. ApplyInstallment gövdesi teyit sonrası hazırlanır; varsayılan `{}` istek için hazır değildir.

## Sık karışan alanlar

PaymentId (e-posta), Add Data.Id ve GetById UUID eşliği Q02 ile roundtrip doğrulanacak. TransactionNo ayrı int64 değerdir. Yerel order ID, provider ID ve merchant ID aynı kimlik değildir. Callback IsSuccess veya browser postMessage paid kanıtı değildir.

## cURL değişkenleri

`GP_TOKEN`: doğrulanmış Authenticate cevabından alınan server tokenı. `PAYMENT_ID`: Add cevabındaki Id; Q02 roundtrip teyidi gerekir. `TRANSACTION_NO`: provider int64 iş numarası. `START_DATE` / `END_DATE`: Q09 ile teyit edilmiş format/saat dilimi. Bunlar secret veya gerçek kayıt içermeyen komut şablonlarıdır; boş değişkenle çağrı yapılmaz.
