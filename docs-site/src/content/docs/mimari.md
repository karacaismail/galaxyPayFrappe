---
title: "Mimari ve karar kayıtları"
description: "Modüler başlangıç, açık güven sınırları ve büyüme koşulları."
group: "Teknik tasarım"
---

## Hedef bileşenler — henüz geliştirilmedi

```text
Müşteri / Satıcı UI ──→ Uygulama API (kimlik + tenant + sipariş)
                             │
                      Payment Application
                      /        |         \
                PostgreSQL  Provider     Worker
                Order       Adapter      Inbox / sorgu / outbox
                Attempt        │             ↑
                Inbox          ↓             │
                Outbox      GalaksiPay ──→ Callback alımı
```

Astro portalı ayrı statik builddir ve bu finansal veri yolunda bulunmaz. Hosted checkout tarayıcıda açılır; provider auth ve muhasebe etkileri sunucudadır. Başlangıçta modüler monolit + PostgreSQL tercih edilir; çalışan modüllerin ölçülmüş ölçek ihtiyacı olmadan mikroservis/kuyruk kümesi eklenmez. Inbox/outbox ilk fazda DB tablosu ve worker olabilir.

## Sorumluluklar

| Modül | Sahip olduğu davranış | Bağımlılık sınırı |
|---|---|---|
| Orders | Sipariş toplamı, müşteri ve satıcı yetkisi | Provider DTO bilmez |
| Payments | Attempt, idempotency ve durum geçişleri | Provider arayüzünü kullanır |
| GalaksipayAdapter | Auth, Add, GetById ve hata dönüşümü | Domaini ham API yanıtıyla kirletmez |
| Callbacks | Dış girdi, doğrulama ve inbox | Siparişi doğrudan paid yapmaz |
| Reconciliation | Açık/belirsiz işlem ve finans farkları | Read-only provider sorgu + auditli domain komutu |
| Operations | Destek/finans rolleri ve kayıt erişimi | Tenant ve field allowlist zorunlu |

## ADR-001 · Hosted checkout

**Öneri / S01 onayı bekliyor.** Kart bilgisi sağlayıcının hosted arayüzünde girilir. Gerekçe: mevcut demo sözleşmesi, kart verisi temasını sınırlama ve daha küçük MVP. Bedel: sağlayıcı UX/erişilebilirliği ve yönlendirme davranışına bağımlılık. Kendi kart formu ve cüzdan saklama kapsam dışıdır. PCI kapsamı ayrıca değerlendirilir.

## ADR-002 · .NET + PostgreSQL, Astro dokümantasyon

**Öneri.** Demo .NET 10 ve EF/Npgsql kullanır; backend ekibi bu yoldan devam edebilir. Astro 7.3.3 statik doküman içindir. Yeni backend TypeScript istenirse yalnızca dosya çevirisi değil sözleşme/para/eşzamanlılık testleriyle yeni ADR gerekir. Veritabanı sürümü altyapı ve EF uyumluluk testiyle S01’de sabitlenir.

## ADR-003 · Sunucu doğrulaması ve yerel idempotency

**Öneri / MVP zorunlu kabul koşulu.** Finansal gerçek provider sorgusu + yerel sipariş eşleşmesiyle belirlenir. Idempotency atomik DB kısıtlarıyla sağlanır. Bedel: ek sorgu/worker ve belirsizliği yönetme ihtiyacı. Sağlayıcı idempotency garantisi olmadan “exactly once” vaat edilmez.

## ADR-004 · Kalıcı inbox/outbox

**Öneri.** Callback önce kalıcı yazılır; iş etkisi ve outbox aynı transactionda kaydolur. Ayrı broker başlangıçta şart değildir. Worker lease ve event/business dedup gerekir. S11’de gerçek trafik ve backlog gerekçe oluşturursa broker değerlendirilir.

## Karar değişikliği şablonu

Başlık / durum / tarih / karar sahibi / bağlam / değerlendirilen seçenekler / karar / sonuçlar / doğrulama testi / geri dönüş planı. Her ADR ilgili GP iş kartına bağlanır; superseded karar silinmez. Auth, para, tenant, callback veya prod secret sınırını değiştiren AI diff’i insan incelemesinden geçer.
