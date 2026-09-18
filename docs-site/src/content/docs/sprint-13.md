---
title: "S13 · Felaket kurtarma ve release güvenliği"
description: "G4 dayanıklılık raporu ve kurtarma süreleri."
group: "Sprintler"
---

## Sprint hedefi

G4 dayanıklılık raporu ve kurtarma süreleri. **Planlandı · henüz geliştirilmedi.** Faz 4: Dayanıklılık. Süre 2 hafta; 10 geliştirme kişi-günü kapsam + 4 gün entegrasyon/review kapasitesi önerisi. [Kapasite varsayımları](/docs/kapsam/).

| Alan | Karar |
|---|---|
| Önkoşul | S12 ve ilgili kapının kanıtı |
| Birincil roller | Platform + TL |
| Dış bağımlılık | RPO/RTO işletme kararı ve yedek altyapısı. |
| Teslim | G4 dayanıklılık raporu ve kurtarma süreleri. |

## İş kartları

### GP-131 · Geri yükleme

**İş:** Şifreli yedek, PITR varsa doğrulama, restore otomasyonu kur.

**Kabul:** Hedef RPO ≤15 dk / RTO ≤60 dk test ortamında ölçülür; desteklenmeyen hedef kaydedilir.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-132 · Release stratejisi

**İş:** Expand/contract migration, kademeli rollout ve geri dönüş prova et.

**Kabul:** Eski/yeni uygulama şemayla birlikte çalışır; veri yıkıcı rollback kullanılmaz.

**Kaba tahmin:** 4 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-133 · Kesinti tatbikatı

**İş:** DB/sağlayıcı/ağ kesintisi ve açık ödemeleri kurtarma akışını prova et.

**Kabul:** Yeni tahsilat durdurulurken callback alımı ve mutabakat korunur.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

## Sprint kabulü

Her GP kartının yukarıdaki kabul kriteri kanıtlanmalı. [Ortak Definition of Done](/docs/gelistirme-sureci/) uygulanır; [test matrisindeki](/docs/test-stratejisi/) ilgili senaryolar çalışır. Çalışmayan/dış bağımlılığa takılan testler açık bırakılır. Kanıt paketi: commit, ortam, fixture sürümü, test çıktısı, demo kaydı, reviewer ve açık Q bağlantıları. Faz çıkışı gerekiyorsa [kapı tutanağı](/docs/kabul-kapilari/) eklenir.

## Sprint içi çalışma

Gün 1: sözleşme/DoR ve sahiplik. Gün 2–7: GP kartlarını küçük dilimlerle uygula. Gün 8: entegrasyon/negatif senaryolar. Gün 9: UAT/doküman/release provası. Gün 10: demo ve kabul. Sağlayıcı cevabı gecikirse mock ve bağımsız işleri ilerlet; teyit gerektiren kabiliyeti canlıya açma.

## AI görev istemi

Aşağıdaki metin ilgili sprint bağlamını taşır; uygulama sırasında sıradaki tek GP kartına daralt. Kod bloklarının sağ üstündeki düğmeyle kopyalanabilir.

```text
S13 / Felaket kurtarma ve release güvenliği sprintini uygula.
Önce mevcut repo, docs/mimari, docs/api-referansi, docs/odeme-akisi,
docs/test-stratejisi ve bu sprintin GP kartlarını oku.
Bağımlılık: S12. Teyit ihtiyacı: RPO/RTO işletme kararı ve yedek altyapısı.
İş kartları: GP-131, GP-132, GP-133.
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

[S14 sprintine geç](/docs/sprint-14/).
