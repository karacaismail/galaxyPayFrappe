---
title: "Callback referansı ve fixture"
description: "Demo modelinden görülen gövde; kaynağı doğrulanmış API sözleşmesiyle karıştırılmaz."
group: "API referansı"
---

## Yön ve güven sınırı

GalaksiPay → bizim `CallbackUrl` adresimiz → **POST**. Endpoint Frappe custom app içinde uygulanacak dar alım yoludur; GitHub Pages bu POST’u alamaz. Gövde aşağıdaki yerel C# modelden türetilmiştir: `Models/PaymentCallbackRequest.cs`. Bu **demo model kanıtıdır**, callback imza/retry/ACK sözleşmesinin doğrulandığı anlamına gelmez.

## Synthetic callback örneği

```json
{
  "IsSuccess": true,
  "Message": null,
  "ErrorCode": null,
  "Data": {
    "Id": "00000000-0000-4000-8000-000000000002",
    "TransactionNo": 12345,
    "IsPaid": true,
    "OrderNo": "ORDER-SYNTHETIC-001",
    "MpOrderNo": null,
    "Amount": 125.50,
    "RrnNo": null,
    "SlipNo": null,
    "MerchantName": "Synthetic merchant",
    "EffectiveMerchantName": "Synthetic merchant",
    "TransactionStatusName": "<provider-status-to-confirm>",
    "MasterpassErrorMessage": null
  }
}
```

[Fixture indir](/downloads/callback.synthetic.json). PascalCase model alanları korunur; gerçek wire casing sandbox fixtureıyla teyit edilir. TransactionNo int64 olduğu için büyük gerçek değer TypeScript sınırında hassasiyet kaybetmeden parse edilmelidir. `TransactionStatusName` örneği gerçek enum değildir.

## Alım → doğrulama → etki

1. Boyut/content-type/schema limitlerini uygula. Callback kaynağını **sağlayıcıyla kararlaştırılmış** protokolle doğrula; imza headerı/algoritması uydurma.
2. Olayı durable inboxa commit et. DB başarısızsa “kaydedildi” ACK’i dönme; gerçek ACK kodu/body ve retry süresi Q01’de teyit edilir.
3. Worker kendi server credentialıyla GetById çağırır. Id/OrderNo/tutar/merchant beklenenle eşleşir; callback içindeki `IsPaid` tek başına yetmez.
4. İş etkisi + audit/outbox aynı transaction içinde unique constraintle uygulanır. Tekrarlı teslim tek sipariş etkisi üretir.
5. Çelişki REVIEW_REQUIRED; kayıp callback scheduler sorgusuyla tamamlanır. UUID bilinmeyen Add için Q04 çözümü veya manuel vaka gerekir.

Demo callback modeli SubMerchantId alanını taşımıyor; merchant doğrulaması yalnız callback ismine bakılarak yapılamaz. Yetkili status DTO’su ve yerel mapping kullanılmalıdır.

## Test vektörleri — M02’den önce kırmızı

| Vektör | Değişiklik | Beklenen invariant |
|---|---|---|
| duplicate ×100 | Aynı body eşzamanlı teslim | 1 business effect |
| out-of-order | Success sonrası pending | Success geriye dönmez |
| wrong amount | Amount 125.50 yerine 1.00 | Review, fulfillment 0 |
| wrong merchant | GetById başka merchant döner | Review, fulfillment 0 |
| invalid identity | Bilinmeyen ID/order | Kayıt eşleştirilmez, paid yok |
| DB unavailable | Inbox commit başarısız | Success ACK yok |
| queue unavailable | Inbox var, enqueue yok | Scheduler kurtarır |
| spoofed postMessage | Sahte browser mesajı | En fazla yetkili status refresh; paid etkisi yok |

İlgili sprint: [M02](/v2/roadmap/#m02). Q01 kapanmadan canlı alım protokolü “hazır” sayılmaz.
