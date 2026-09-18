---
title: "Veri modeli ve invariantlar"
description: "Ödeme doğruluğunu koddan önce tanımla."
group: "Teknik tasarım"
---

## Önerilen tablolar

| Tablo | Temel alanlar | Kısıt / politika |
|---|---|---|
| orders | id, tenant_id, seller_id, amount_minor, currency, version | Tutar sunucudan; değişiklik attempt hashini etkiler |
| merchant_mappings | tenant_id, seller_id, provider_submerchant_id, active, verified_at | Satıcı eşleşmesi tekil; provider erişimi server-side |
| payment_attempts | id, order_id, tenant_id, provider_id, state, amount_minor, currency, version, timestamps | Bilinen provider_id ortam/hesap kapsamında unique; aktif attempt kısıtı |
| idempotency_records | tenant_id, key, request_hash, attempt_id, response_summary, expires_at | tenant + key unique; saklama süresi provider belirsizlik penceresini kapsar |
| callback_inbox | id, provider_event_key?, body_hash, provider_id, verification, state, retry_count, received_at | Olay tekilliği + ayrı business effect dedup |
| payment_effects | attempt_id, effect_type, target_id, applied_at | attempt + effect_type + target unique |
| outbox_messages | id, aggregate_id, type, payload, lease_until, attempts, delivered_at | At-least-once delivery; consumer idempotency |
| refund_requests | id, attempt_id, amount_minor, state, requester, approver, key | Paid tutarı aşamaz; mevcut provider kısmi iade desteği bilinmiyor |
| reconciliation_cases | id, refs, expected, observed, reason, owner, state | Aynı fark tekrar çoğalmaz; çözüm gerekçesi gerekir |
| audit_events | actor, tenant, action, entity, time, correlation, safe_diff | Append-only mantık; ayrı yetki ve retention |

Bu şema taslaktır; hazır migration yoktur. Demo yalnızca `PaymentCallbackRecords` tutar. S01 ilişkileri ve constraintleri gerçek sipariş sistemine göre kesinleştirir.

## Para ve zaman

Yerelde TRY için kuruş integer veya `decimal`/`numeric` kullan. Currency alanını açık taşı; API şemasında currency alanı yok, TRY desteğini **Q08** ile teyit et. Provider JSON `number/double` tipinde olsa bile iş hesaplarını floating point ile yapma. Adaptör sınırında kültürden bağımsız iki ondalık serialize et; 0.01, 0.10+0.20, üst limit ve yuvarlama sınırlarını test et.

UTC anlarını sakla; kullanıcı gösterimini `Europe/Istanbul` ile biçimlendir. Tarih aralığı sorgusunun sağlayıcı saat dilimi ve sınır dahil/hariç semantiğini Q09 ile teyit et. İş günü/mutabakat günü ayrı domain kavramlarıdır.

## Değişmez kurallar

1. İstemci amount, merchant veya paid iddiası finansal gerçek değildir.
2. Bir sipariş için eşzamanlı aktif ödeme niyeti kontrollüdür; farklı sekmeler aynı atomik kısıta tabidir.
3. Bir tahsilat iş etkisi en fazla bir kez uygulanır; teslimler birden çok kez olabilir.
4. Her para değişimi kaynağı, aktörü, zamanını ve korelasyonunu taşır.
5. Belirsiz işlem otomatik fail veya tekrar tahsilat sayılmaz.
6. İade tahsilat tarihçesini silmez; iade toplamı doğrulanmış tahsilatı aşamaz.
7. Tenant filtresi her sorgu ve cache anahtarında uygulanır; API ID bilmek erişim hakkı vermez.
8. Kart PAN/CVV, token, credential ve ödeme linki log/analitik/dokümanlara yazılmaz.

## Migration ve geri dönüş

S01’den itibaren migration ayrı sürümlenir ve test DB’de denenir. S04 pilotta yedek + kontrollü migration adımı bulunur. S13 expand/contract akışıyla eski/yeni sürüm birlikte çalışabilir. Veri kaybettiren down migration yerine uygulama rollbacki + ileri düzeltme tercih edilir. Demo DB’si üretim sipariş/ledger sistemi olarak kullanılmaz.
