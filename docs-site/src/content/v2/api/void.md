---
title: "İptal"
description: "POST /api/MasterpassV2/Void"
group: "API referansı"
---

## POST /api/MasterpassV2/Void

**Base URL:** `https://testapi.galaksipay.com/galaksipay` · **Aşama:** MVP sonrası · **Kanıt:** OpenAPI şeması; gerçek hesap çağrısı yapılmadı.

**Auth:** `Authorization: Bearer <server-token>`; fiili hesap/merchant yetkisi ayrıca test edilir. Token browsera taşınmaz.

## İstek

Model: `VoidRequest`. Required durumu sağlayıcı şemasıdır; projenin server-side ek kuralları ayrıca uygulanır.

| Alan | Tür | Required | Kısıt / not |
|---|---|---|---|
| `AccessToken` | string | Evet | minLength=1 |
| `GalaksipayTransactionId` | string / uuid | Evet | — |

### Şematik JSON — gerçek credential/merchant içermez

```json
{
  "AccessToken": "<provider-void-token>",
  "GalaksipayTransactionId": "00000000-0000-4000-8000-000000000002"
}
```

Bu gövdeyi yerel `request.json` dosyasına koy; placeholderları yetkili sandbox değerleriyle değiştir. Dosyayı public repoya credentialla ekleme.

## cURL

Örnekler sunucu/yerel terminal içindir. Token ve ID env değerleri önce temin edilir; bu sitede çalıştırılmaz.

```sh
GP_BASE="https://testapi.galaksipay.com/galaksipay"
curl --fail-with-body --request POST \
  "$GP_BASE/api/MasterpassV2/Void" \
  --header "Accept: application/json" \
  --header "Authorization: Bearer $GP_TOKEN" \
  --header "Content-Type: application/json" \
  --data @request.json
```

## Yanıt

ObjectApiResult; izinli zaman penceresi ve tekrar güvenliği bilinmiyor. Siparişi iptal etmek banka işlemini iptal etmez.

200 şeması: [`ObjectApiResult`](/v2/api/models/#objectapiresult).

| Alan | Tür | Required | Kısıt / not |
|---|---|---|---|
| `IsSuccess` | boolean | Hayır | — |
| `Message` | string / nullable | Hayır | — |
| `MessageJson` | string / nullable | Hayır | — |
| `Code` | integer / int32 | Hayır | — |
| `ErrorCode` | string / nullable | Hayır | — |
| `StackTrace` | string / nullable | Hayır | — |
| `Data` | belirtilmemiş / nullable | Hayır | — |

## Hata ve tekrar davranışı

Şema ayrıntılı hata/limit garantisi vermiyor. Proje kuralı: 401/403 yetki incelemesi; 429 varsa Retry-After ve sınırlı okumalar; bozuk 200 contract violation. Add/Refund/Void gibi mali yan etkili çağrı timeoutta otomatik tekrarlanmaz; UNKNOWN/review ve sağlayıcı sorgusu gerekir.

## Önce yazılacak testler

| Test | Given | When | Then |
|---|---|---|---|
| `IT_void_window` | Yetkisiz veya zaman penceresi dışı fixture | Void | Kontrollü red; yerel sipariş statusu banka sonucu sanılmaz |
| `IT_refund_unknown` | İade/iptal kabulü sonrası yanıt kayıp | Retry/scheduler | İkinci mali komut yok; sorgu veya case |

## Açık sağlayıcı teyidi

Q07 — [soru kaydı](/docs/acik-sorular/). Bu endpointin şemada bulunması hesabınızın bu işleme yetkili olduğunu kanıtlamaz.
