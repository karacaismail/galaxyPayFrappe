---
title: "ID ile ödeme durumu"
description: "GET /api/Transaction/GetById/{id}"
group: "API referansı"
---

## GET /api/Transaction/GetById/{id}

**Base URL:** `https://testapi.galaksipay.com/galaksipay` · **Aşama:** MVP · **Kanıt:** OpenAPI şeması; gerçek hesap çağrısı yapılmadı.

**Auth:** `Authorization: Bearer <server-token>`; fiili hesap/merchant yetkisi ayrıca test edilir. Token browsera taşınmaz.

## İstek

| Parametre | Yer | Tür | Required |
|---|---|---|---|
| `id` | path | string / uuid | Evet |

## cURL

Örnekler sunucu/yerel terminal içindir. Token ve ID env değerleri önce temin edilir; bu sitede çalıştırılmaz.

```sh
GP_BASE="https://testapi.galaksipay.com/galaksipay"
curl --fail-with-body --request GET \
  "$GP_BASE/api/Transaction/GetById/${PAYMENT_ID}" \
  --header "Accept: application/json" \
  --header "Authorization: Bearer $GP_TOKEN"
```

## Yanıt

TransactionDtoApiResult. IsPaid, OrderNo, Amount, SubMerchantId/EffectiveMerchantId eşleşmeden yerel paid etkisi uygulanmaz.

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
| `IT_callback_duplicate` | 100 aynı callback | Eşzamanlı işlenir | Tek sipariş etkisi |
| `CT_status_map` | Bilinmeyen status/IsPaid çelişkisi | Yerel statee çevrilir | Fail-safe review; terminal durum uydurulmaz |

## Açık sağlayıcı teyidi

Q02, Q06 — [soru kaydı](/docs/acik-sorular/). Bu endpointin şemada bulunması hesabınızın bu işleme yetkili olduğunu kanıtlamaz.
