---
title: "Sprint çalışma sistemi"
description: "Hazır iş, küçük dilim, doğrulanabilir teslim."
group: "Geliştirme"
---

## Sprint ritmi

2 haftalık sprint. Gün 1: kapasite, DoR, risk ve demo hedefi; gün 2–7: küçük dikey dilimler + review; gün 8: entegrasyon ve negatif senaryolar; gün 9: UAT, docs ve release provası; gün 10: demo, kabul, retrospektif ve sonraki sprintin hazırlığı. Her gün kısa engel kontrolü; sprint ortasında scope değişirse eşdeğer kapasite çıkarılır.

S01–S04 kritik yol: **sözleşme → güvenli start → doğrulanmış sonuç → pilot kabul**. İleri fazlar önceki kapı kanıtını kullanır. Sağlayıcı cevabı beklenirken mock/test/docs işi devam eder; kapı gereksinimi tamamlandı gibi sayılmaz.

## Definition of Ready

- İş kartı tek kullanıcı/developer sonucuna odaklı; kapsam dışı yazılı.
- Girdi sözleşmesi, dosya sınırı ve en az bir negatif senaryo tanımlı.
- Kabul kriteri ölçülebilir; owner ve reviewer rolleri belli.
- Secret gereksinimi güvenli kanalda; test fixtureları sentetik.
- Bağımlılıklar linkli; blokaj varsa çalışma için mock sınırı belirli.
- İş 1–3 günlük dilimlere bölünebilir; karttaki 4 günlük iş gerekirse iki PR olur.

## Definition of Done

Kod review edildi; ilgili unit/contract/integration/E2E kanıtı geçti; para/tenant/callback negatif testleri korundu; secret/dependency taraması geçti; docs ve ADR güncellendi; loglar maskeli; migration/rollback etkisi yazılı; gerçek kapsam ve bilinen limitler belirtildi. Üretim davranışı değiştiren kartta gözlem metriği ve rollback tetikleyicisi vardır. “AI tamam dedi” kabul kanıtı değildir.

## PR ve CI

Önerilen branch biçimi `feat/GP-011-contract-baseline`. Bir PR bir davranışı değiştirir; üretilmiş dosyalar ayrı anlaşılır bölümde tutulur. PR açıklaması: sorun → sonuç → test kanıtı → risk/geri dönüş → GP/ADR bağlantısı. Para ve kimlik değişikliklerinde ikinci bir yetkin reviewer gerekir; küçük doküman düzeltmelerinde normal review yeterlidir.

CI sırası: format/type → secret/SAST/dependency → unit → DB integration/migration → provider contract fixture → docs build/link → kritik mock E2E. Sandbox UAT ayrı credentiallı korumalı ortamda çalışır; her PR sağlayıcıya gerçek ödeme göndermemelidir. Yük testi yalnızca onaylı hedefte.

## İş durumu ve sahiplik

Backlog → Ready → In progress → Review → Verified → Accepted. Blocked bir bayraktır; neden, bağımlı Q kaydı ve sonraki kontrol tarihi içerir. Portalın kontrol kutuları sadece o tarayıcıdaki kişisel hazırlık notlarıdır, bu iş akışının paylaşılan kaydı değildir.

| Karar | Yapan | Hesap veren | Danışılan |
|---|---|---|---|
| Scope ve sıra | PO + TL | PO | Finans, destek |
| Mimari/sözleşme | BE + TL | TL | Sağlayıcı, güvenlik |
| Test kabulü | QA | TL | PO |
| Finansal eşleştirme/iade | BE + Finans | Finans sahibi | Sağlayıcı |
| Canlı çıkış | Platform + TL | Ürün/hizmet sahibi | Güvenlik, finans |
| Veri/saklama/PCI kapsamı | Hukuk + Güvenlik | İlgili kontrol sahibi | Sağlayıcı/uzman |

İsimler henüz atanmadı; S01 kickoffta bu rol tablosu gerçek isimlerle tamamlanır.

## Sprint kapanışı ve yeniden tahmin

Planlanan/bitirilen kart, taşınan iş, bekleme günü, defect ve gerçek kişi-gün kaydedilir. Demo kayıtları ve test raporları evidence klasörüne bağlanır. S02/S04’te 10 kişi-günlük sprint tahmini gerçek hızla yenilenir. Eksik kapı varsa bir sonraki sprintin bağımsız keşfi yapılabilir, ancak kapıya bağlı yayına geçilmez.
