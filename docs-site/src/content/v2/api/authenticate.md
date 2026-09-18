---
title: "Kimlik doğrulama"
description: "POST /api/Authentication/Authenticate"
group: "API referansı"
---

## POST /api/Authentication/Authenticate

**Base URL:** `https://testapi.galaksipay.com/galaksipay` · **Aşama:** Core · **Kanıt:** OpenAPI şeması; gerçek hesap çağrısı yapılmadı.

**Auth:** Server kullanıcı/parola gövdesi; token response shape Q03.

## İstek

Model: `AuthenticationStandardLogonParameters`. Required durumu sağlayıcı şemasıdır; projenin server-side ek kuralları ayrıca uygulanır.

| Alan | Tür | Required | Kısıt / not |
|---|---|---|---|
| `UserName` | string / nullable | Hayır | — |
| `Password` | string / nullable | Hayır | — |

### Şematik JSON — gerçek credential/merchant içermez

```json
{
  "UserName": "<server-secret-user>",
  "Password": "<server-secret-password>"
}
```

Bu gövdeyi yerel `request.json` dosyasına koy; placeholderları yetkili sandbox değerleriyle değiştir. Dosyayı public repoya credentialla ekleme.

## cURL

Örnekler sunucu/yerel terminal içindir. Token ve ID env değerleri önce temin edilir; bu sitede çalıştırılmaz.

```sh
GP_BASE="https://testapi.galaksipay.com/galaksipay"
curl --fail-with-body --request POST \
  "$GP_BASE/api/Authentication/Authenticate" \
  --header "Accept: application/json" \
  --header "Content-Type: application/json" \
  --data @request.json
```

## Yanıt

200 token gövdesi şemada tanımlı değil. Demo parser adayları resmi sözleşme sayılmaz. Başarılı ve hatalı sandbox fixture bekleniyor.

200 response body için şema verilmemiş. Token alanı/örnek başarılı response uydurulmadı; Q03 cevabı ile redakte fixture eklenecek.

## Hata ve tekrar davranışı

Şema ayrıntılı hata/limit garantisi vermiyor. Proje kuralı: 401/403 yetki incelemesi; 429 varsa Retry-After ve sınırlı okumalar; bozuk 200 contract violation. Güvenli okumalar sınırlı backoff ile tekrar edilebilir; 404 anlamı teyit edilmeden kesin başarısız ödeme çıkarılmaz.

## Önce yazılacak testler

| Test | Given | When | Then |
|---|---|---|---|
| `CT_auth_shape` | 200 response token alanı eksik/bozuk | Parser çalışır | Token var sanılmaz; contract error |
| `CT_auth_failure` | 401/403 veya success=false fixture | Auth adapter çalışır | Token cachelenmez; güvenli hata |

## Açık sağlayıcı teyidi

Q03 — [soru kaydı](/docs/acik-sorular/). Bu endpointin şemada bulunması hesabınızın bu işleme yetkili olduğunu kanıtlamaz.
