---
title: "Ödeme başlat"
description: "POST /api/Transaction/Add"
group: "API referansı"
---

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

200 şeması: [`TransactionDtoApiResult`](/v2/api/models/#transactiondtoapiresult).

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

Q02, Q04, Q08 — [soru kaydı](/docs/acik-sorular/). Bu endpointin şemada bulunması hesabınızın bu işleme yetkili olduğunu kanıtlamaz.
