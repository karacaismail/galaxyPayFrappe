---
title: "Taksit uygula"
description: "POST /api/Transaction/ApplyInstallment"
group: "API referansı"
---

## POST /api/Transaction/ApplyInstallment

**Base URL:** `https://testapi.galaksipay.com/galaksipay` · **Aşama:** Koşullu · **Kanıt:** OpenAPI şeması; gerçek hesap çağrısı yapılmadı.

**Auth:** `Authorization: Bearer <server-token>`; fiili hesap/merchant yetkisi ayrıca test edilir. Token browsera taşınmaz.

## İstek

Model: `TransactionApplyInstallmentRequest`. Required durumu sağlayıcı şemasıdır; projenin server-side ek kuralları ayrıca uygulanır.

| Alan | Tür | Required | Kısıt / not |
|---|---|---|---|
| `TransactionId` | string / uuid | Hayır | — |
| `InstallmentCount` | integer / int32 / nullable | Hayır | — |
| `Bin` | string / nullable | Hayır | — |

## cURL

Örnekler sunucu/yerel terminal içindir. Token ve ID env değerleri önce temin edilir; bu sitede çalıştırılmaz.

```sh
GP_BASE="https://testapi.galaksipay.com/galaksipay"
curl --fail-with-body --request POST \
  "$GP_BASE/api/Transaction/ApplyInstallment" \
  --header "Accept: application/json" \
  --header "Authorization: Bearer $GP_TOKEN" \
  --header "Content-Type: application/json" \
  --data @request.json
```

`request.json` yukarıdaki modelden, sağlayıcı teyidi sonrası oluşturulur; koşullu operasyon için hazır iş akışı varsayılmaz.

## Yanıt

Şemada var; hosted checkout içindeki sorumluluğu ve iş yetkisi teyit edilmeden çağrılmaz.

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

Şema ayrıntılı hata/limit garantisi vermiyor. Proje kuralı: 401/403 yetki incelemesi; 429 varsa Retry-After ve sınırlı okumalar; bozuk 200 contract violation. Add/Refund/Void gibi mali yan etkili çağrı timeoutta otomatik tekrarlanmaz; UNKNOWN/review ve sağlayıcı sorgusu gerekir.

## Önce yazılacak testler

| Test | Given | When | Then |
|---|---|---|---|
| `CT_installment_scope` | Taksit feature flag kapalı/teyitsiz | İstemci taksit ister | Provider çağrısı yok |

## Açık sağlayıcı teyidi

Q07, Q08 — [soru kaydı](/docs/acik-sorular/). Bu endpointin şemada bulunması hesabınızın bu işleme yetkili olduğunu kanıtlamaz.
