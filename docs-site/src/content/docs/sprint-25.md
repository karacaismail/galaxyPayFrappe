---
title: "S25 · Maturity ready kabulü"
description: "G8 karar tutanağı ve 90 günlük yeniden değerlendirme planı."
group: "Sprintler"
---

## Sprint hedefi

G8 karar tutanağı ve 90 günlük yeniden değerlendirme planı. **Planlandı · henüz geliştirilmedi.** Faz 8: Maturity ready. Süre 2 hafta; 10 geliştirme kişi-günü kapsam + 4 gün entegrasyon/review kapasitesi önerisi. [Kapasite varsayımları](/docs/kapsam/).

| Alan | Karar |
|---|---|
| Önkoşul | S24 ve ilgili kapının kanıtı |
| Birincil roller | Bağımsız inceleyen + PO / TL |
| Dış bağımlılık | 90 gün metrik ve G1–G7 kanıtları. |
| Teslim | G8 karar tutanağı ve 90 günlük yeniden değerlendirme planı. |

## İş kartları

### GP-251 · Bağımsız örnekleme

**İş:** Ödeme, iade, release ve erişim değişikliklerini bağımsız gözle örnekle.

**Kabul:** Örneklerin tamamında kim/ne/zaman/kanıt izi tamamdır.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-252 · İşletim devri

**İş:** Servis sahibi, bütçe, nöbet, tedarikçi ve eğitim dokümanlarını devret.

**Kabul:** Başka ekip örnek incident ve restore görevini yürütebilir.

**Kaba tahmin:** 4 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-253 · Olgunluk kararı

**İş:** G8 için 5 alanda ≥2, kritik açık 0 ve sonraki gözden geçirmeyi kaydet.

**Kabul:** Maturity ready ürün içi ölçüttür; bağımsız sertifikasyon gibi sunulmaz.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

## Sprint kabulü

Her GP kartının yukarıdaki kabul kriteri kanıtlanmalı. [Ortak Definition of Done](/docs/gelistirme-sureci/) uygulanır; [test matrisindeki](/docs/test-stratejisi/) ilgili senaryolar çalışır. Çalışmayan/dış bağımlılığa takılan testler açık bırakılır. Kanıt paketi: commit, ortam, fixture sürümü, test çıktısı, demo kaydı, reviewer ve açık Q bağlantıları. Faz çıkışı gerekiyorsa [kapı tutanağı](/docs/kabul-kapilari/) eklenir.

## Sprint içi çalışma

Gün 1: sözleşme/DoR ve sahiplik. Gün 2–7: GP kartlarını küçük dilimlerle uygula. Gün 8: entegrasyon/negatif senaryolar. Gün 9: UAT/doküman/release provası. Gün 10: demo ve kabul. Sağlayıcı cevabı gecikirse mock ve bağımsız işleri ilerlet; teyit gerektiren kabiliyeti canlıya açma.

## AI görev istemi

Aşağıdaki metin ilgili sprint bağlamını taşır; uygulama sırasında sıradaki tek GP kartına daralt. Kod bloklarının sağ üstündeki düğmeyle kopyalanabilir.

```text
S25 / Maturity ready kabulü sprintini uygula.
Önce mevcut repo, docs/mimari, docs/api-referansi, docs/odeme-akisi,
docs/test-stratejisi ve bu sprintin GP kartlarını oku.
Bağımlılık: S24. Teyit ihtiyacı: 90 gün metrik ve G1–G7 kanıtları.
İş kartları: GP-251, GP-252, GP-253.
Her seferinde tek kartın küçük dikey dilimini ele al.
Provider davranışını uydurma; bilinmeyeni Q kaydına bağla.
Credentialı istemciye/loga taşıma; para/tenant/idempotency kurallarını koru.
Kabul kriterini önce test senaryosuna dönüştür, sonra kodu uygula.
Çalıştırılan testleri ve çalıştırılamayan doğrulamaları ayrı raporla.
Diff, docs güncellemesi, kanıt ve açık riskleri sun.
Bu prompt tek başına canlı ödeme, iade veya üretim deploy yetkisi değildir.
```

## Hazırlık kontrolü

- [ ] Önceki sprint kanıtı ve bağımlılıklar okundu.
- [ ] Her GP kartı için sorumlu/reviewer belirlendi.
- [ ] Pozitif ve negatif kabul senaryoları hazır.
- [ ] Test verisi sentetik; secretlar güvenli kanalda.
- [ ] Demo, test kanıtı ve açık risk kaydı eklendi.

Bu kutular yalnızca bu tarayıcıda tutulan kişisel notlardır; paylaşılan görev durumu veya resmi kabul kaydı değildir.

## Sonraki adım

[S26 sprintine geç](/docs/sprint-26/).
