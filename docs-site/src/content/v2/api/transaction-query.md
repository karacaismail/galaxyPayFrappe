---
title: "Alternatif işlem sorgusu"
description: "GET /api/Transaction/Get/Get"
group: "API referansı"
---

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

Q02, Q06 — [soru kaydı](/docs/acik-sorular/). Bu endpointin şemada bulunması hesabınızın bu işleme yetkili olduğunu kanıtlamaz.
