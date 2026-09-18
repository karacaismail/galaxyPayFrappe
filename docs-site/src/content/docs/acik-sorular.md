---
title: "Açık sorular ve risk kaydı"
description: "Sağlayıcı teyitlerini geliştirme bağımlılığına dönüştür."
group: "Planlama"
---

## Sağlayıcıya yöneltilecek somut sorular

Bu bir hazırlık listesidir; e-posta gönderilmedi veya toplantı oluşturulmadı. S01’de TL/entegrasyon sorumlusu cevapları tarihli kanıt olarak ekler.

| ID | Soru ve gerekli kanıt | Sahip | Son tarih / etki |
|---|---|---|---|
| Q01 | Callback imza yöntemi, header/algoritma, event ID, replay, retry takvimi, timeout ve ACK örneği nedir? İmza yoksa mutabık güven modeli? | TL + sağlayıcı | S03; canlı G1 engeli |
| Q02 | E-postadaki PaymentId = Add data.Id = GetById id mi? Roundtrip örneği? | BE + sağlayıcı | S01–S03; doğrulama engeli |
| Q03 | Auth 200/hata gövdeleri, TTL, refresh, scope, 401/403 ve rate limit nedir? | BE + sağlayıcı | S02; adaptör/pilot |
| Q04 | Add için idempotency/OrderNo uniqueness var mı? Timeoutta UUID yoksa işlem nasıl bulunur? | TL + sağlayıcı | S02–S04; canlı G1 engeli |
| Q05 | GetSubMerchants tenant kapsamı, aktiflik, sayfalama ve ana merchant fallback davranışı nedir? | BE + sağlayıcı | S02; S05 onboarding |
| Q06 | Tam durum enumu, terminal durumlar, IsPaid ilişkisi, sync_error ve geç başarı kuralları? | BE + Finans | S03; canlı G1 engeli |
| Q07 | Refund/Void yetkisi, gövdedeki AccessToken, tam/kısmi iade, tekrar güvenliği ve zaman sınırı? | Finans + sağlayıcı | S08; otomasyon engeli; pilot manuel süreç gerekli |
| Q08 | Desteklenen para birimi, hassasiyet, alt/üst tutar ve yuvarlama kuralı? | Finans + BE | S02; canlı G1 engeli |
| Q09 | Tarih aralığı UTC mi, sınırlar dahil mi, max aralık/sayfa, geç kayıt/settlement/komisyon kaynağı? | Finans + sağlayıcı | S09; mutabakat |
| Q10 | Entegrasyon belgesinin güncel §2.3 alanları, güvenli iletim ve gerçek satıcı aktivasyon süresi? | PO + operasyon | S01 talep; pilot ve S05 engeli |
| Q11 | Prod base URL, yetki/credential teslimi, callback hostları, ödeme URL allowlist, TLS/IP ve destek SLA? | Platform + sağlayıcı | S04; canlı G1 engeli |
| Q12 | Test kartları/3DS/OTP/cüzdan hesapları için güncel senaryo ve izinli test hacmi? | QA + sağlayıcı | S04; UAT |
| Q13 | Kendi uygulamamızda sipariş modeli, oturum/tenant kaynağı, tek/çok satıcılı sepet ve fulfillment ne? | PO + TL | S01; mimari kapsam |
| Q14 | Günlük/tepe trafik, bütçe, ekip, destek saatleri ve veri saklama sorumluları? | PO + hizmet sahibi | S01 ilk tahmin; S12/S15/S22 kesinleştirme |

## Risk kaydı

| Risk | Olasılık / etki | Azaltma ve izleme | Sahip |
|---|---|---|---|
| Sağlayıcı sözleşmesi eksik | Yüksek / yüksek | Q01–Q12, snapshot, fixture, pilot kapısı | TL |
| Callback sahteciliği veya tekrar | Orta / kritik | Server sorgu, eşleşme, atomik business dedup | BE |
| Add timeout sonrası çift tahsilat | Orta / kritik | UNKNOWN, kör retry yok, Q04 çözümü | BE + Finans |
| Gerçek satıcı tanım gecikmesi | Yüksek / yüksek | §2.3 erken talep; dummy ile teknik ilerleme | PO |
| Demo secretlarının yayılması | Orta / yüksek | Orijinal klasörü yayın dışı tut; sunucu secret ve rotasyon | Güvenlik |
| AI yanlış endpoint/iş kuralı üretir | Orta / yüksek | Snapshot/context pack, contract test, review | TL |
| Finans farkı yanlış kapanır | Orta / yüksek | Ayrı settlement modeli, auditli çözüm | Finans |
| Kapsam ve kapasite sapması | Yüksek / orta | S02/S04 yeniden tahmin; küçük WIP | PO |
| Tek kişiye bağlı işletim | Orta / yüksek | Runbook, yedek sorumlu, tatbikat | Operasyon |

## Cevap kaydı şablonu

Q ID / cevap tarihi / sağlayıcı veya karar sahibi / cevap özeti / örnek fixture veya belge referansı / etkilediği endpoint ve GP / kabul testi / kapalı mı / yeniden kontrol tarihi. Sözlü varsayım “doğrulandı” diye işaretlenmez. Açık soru kapanana kadar ilgili feature flag kapalı veya sandbox sınırlı kalabilir.
