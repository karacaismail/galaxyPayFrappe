---
title: "Alt satıcıları listele"
description: "GET /api/Merchant/GetSubMerchants"
group: "API referansı"
---

## GET /api/Merchant/GetSubMerchants

**Base URL:** `https://testapi.galaksipay.com/galaksipay` · **Aşama:** Core / MVP · **Kanıt:** OpenAPI şeması; gerçek hesap çağrısı yapılmadı.

**Auth:** `Authorization: Bearer <server-token>`; fiili hesap/merchant yetkisi ayrıca test edilir. Token browsera taşınmaz.

## İstek

İstek gövdesi/parametre şeması bu operasyonda tanımlı değil.

## cURL

Örnekler sunucu/yerel terminal içindir. Token ve ID env değerleri önce temin edilir; bu sitede çalıştırılmaz.

```sh
GP_BASE="https://testapi.galaksipay.com/galaksipay"
curl --fail-with-body --request GET \
  "$GP_BASE/api/Merchant/GetSubMerchants" \
  --header "Accept: application/json" \
  --header "Authorization: Bearer $GP_TOKEN"
```

## Yanıt

SubMerchantDtoListApiResult. Id/IsActive/HasMasterpassSetting alanları şemada var; hesap kapsamı ve boş liste semantiği teyit bekliyor.

200 şeması: [`SubMerchantDtoListApiResult`](/v2/api/models/#submerchantdtolistapiresult).

| Alan | Tür | Required | Kısıt / not |
|---|---|---|---|
| `IsSuccess` | boolean | Hayır | — |
| `Message` | string / nullable | Hayır | — |
| `MessageJson` | string / nullable | Hayır | — |
| `Code` | integer / int32 | Hayır | — |
| `ErrorCode` | string / nullable | Hayır | — |
| `StackTrace` | string / nullable | Hayır | — |
| `Data` | array[SubMerchantDto] / nullable | Hayır | — |

### Synthetic yanıt örneği

Şematik ve kısaltılmıştır; **sağlayıcıdan alınmış başarılı cevap değildir**. Gerçek casing/hata/enumlar fixturela teyit edilir.

```json
{
  "IsSuccess": true,
  "Data": [
    {
      "Id": "00000000-0000-4000-8000-000000000001",
      "Name": "Synthetic seller — gerçek atanmış ID değil",
      "Code": null,
      "Description": null,
      "IsActive": true,
      "HasMasterpassSetting": true
    }
  ]
}
```

## Hata ve tekrar davranışı

Şema ayrıntılı hata/limit garantisi vermiyor. Proje kuralı: 401/403 yetki incelemesi; 429 varsa Retry-After ve sınırlı okumalar; bozuk 200 contract violation. Güvenli okumalar sınırlı backoff ile tekrar edilebilir; 404 anlamı teyit edilmeden kesin başarısız ödeme çıkarılmaz.

## Önce yazılacak testler

| Test | Given | When | Then |
|---|---|---|---|
| `CT_merchant_shape` | Id/IsActive/HasMasterpassSetting fixtureları | Liste normalize edilir | Eksik/pasif/ayarsız kayıtla start açılmaz |
| `IT_seller_isolation` | Seller A/B üyeliği | A B kaydını okur/başlatır | Veri ve provider çağrısı yok |

## Açık sağlayıcı teyidi

Q05 — [soru kaydı](/docs/acik-sorular/). Bu endpointin şemada bulunması hesabınızın bu işleme yetkili olduğunu kanıtlamaz.
