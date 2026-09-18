---
title: "Tarih aralığı işlemleri"
description: "GET /api/Transaction/GetTransactionsByDateRange/{startDate}/{endDate}"
group: "API referansı"
---

## GET /api/Transaction/GetTransactionsByDateRange/{startDate}/{endDate}

**Base URL:** `https://testapi.galaksipay.com/galaksipay` · **Aşama:** Finans · **Kanıt:** OpenAPI şeması; gerçek hesap çağrısı yapılmadı.

**Auth:** `Authorization: Bearer <server-token>`; fiili hesap/merchant yetkisi ayrıca test edilir. Token browsera taşınmaz.

## İstek

| Parametre | Yer | Tür | Required |
|---|---|---|---|
| `startDate` | path | string / date-time | Evet |
| `endDate` | path | string / date-time | Evet |

## cURL

Örnekler sunucu/yerel terminal içindir. Token ve ID env değerleri önce temin edilir; bu sitede çalıştırılmaz.

```sh
GP_BASE="https://testapi.galaksipay.com/galaksipay"
curl --fail-with-body --request GET \
  "$GP_BASE/api/Transaction/GetTransactionsByDateRange/${START_DATE}/${END_DATE}" \
  --header "Accept: application/json" \
  --header "Authorization: Bearer $GP_TOKEN"
```

## Yanıt

TransactionDtoListApiResult. Tarih sınırları, saat dilimi, sayfalama ve settlement kaynağı kesinleşmedi.

200 şeması: [`TransactionDtoListApiResult`](/v2/api/models/#transactiondtolistapiresult).

| Alan | Tür | Required | Kısıt / not |
|---|---|---|---|
| `IsSuccess` | boolean | Hayır | — |
| `Message` | string / nullable | Hayır | — |
| `MessageJson` | string / nullable | Hayır | — |
| `Code` | integer / int32 | Hayır | — |
| `ErrorCode` | string / nullable | Hayır | — |
| `StackTrace` | string / nullable | Hayır | — |
| `Data` | array[TransactionDto] / nullable | Hayır | — |

## Hata ve tekrar davranışı

Şema ayrıntılı hata/limit garantisi vermiyor. Proje kuralı: 401/403 yetki incelemesi; 429 varsa Retry-After ve sınırlı okumalar; bozuk 200 contract violation. Güvenli okumalar sınırlı backoff ile tekrar edilebilir; 404 anlamı teyit edilmeden kesin başarısız ödeme çıkarılmaz.

## Önce yazılacak testler

| Test | Given | When | Then |
|---|---|---|---|
| `IT_reconcile_late` | Geç kayıt ve sınır timestamp | Aynı dönem iki kez çekilir | Fark bulunur; duplicate rapor yok |
| `CT_date_range` | Teyitli UTC/sınır/paging fixture | Tarih aralığı sorgulanır | Kayıp/çift kayıt yok; max aralık ihlali kontrollü |

## Açık sağlayıcı teyidi

Q09 — [soru kaydı](/docs/acik-sorular/). Bu endpointin şemada bulunması hesabınızın bu işleme yetkili olduğunu kanıtlamaz.
