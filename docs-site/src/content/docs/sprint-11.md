---
title: "S11 · Worker, inbox ve outbox dayanıklılığı"
description: "Kesinti ve worker restart kanıtı; queue age dashboardu."
group: "Sprintler"
---

## Sprint hedefi

Kesinti ve worker restart kanıtı; queue age dashboardu. **Planlandı · henüz geliştirilmedi.** Faz 4: Dayanıklılık. Süre 2 hafta; 10 geliştirme kişi-günü kapsam + 4 gün entegrasyon/review kapasitesi önerisi. [Kapasite varsayımları](/docs/kapsam/).

| Alan | Karar |
|---|---|
| Önkoşul | S10 ve ilgili kapının kanıtı |
| Birincil roller | BE + Platform |
| Dış bağımlılık | Ölçülen backlog ve iş hacmi. |
| Teslim | Kesinti ve worker restart kanıtı; queue age dashboardu. |

## İş kartları

### GP-111 · Kalıcı iş yürütme

**İş:** İş lease, retry sayacı ve outbox teslimini kur; mevcut DB inboxı kullan.

**Kabul:** Worker işlem ortasında ölürse iş kaybolmaz; aynı yan etki iki kez oluşmaz.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-112 · Zehirli mesaj yönetimi

**İş:** Backoff/jitter, dead-letter ve yetkili replay ekle.

**Kabul:** Bozuk mesaj sağlıklı işleri durdurmaz; replay gerekçesi audit edilir.

**Kaba tahmin:** 4 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-113 · Backpressure

**İş:** Sağlayıcı limitine göre concurrency ve circuit breaker uygula.

**Kabul:** Sağlayıcı kesintisinde sınırsız kuyruk/istek fırtınası oluşmaz.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

## Sprint kabulü

Her GP kartının yukarıdaki kabul kriteri kanıtlanmalı. [Ortak Definition of Done](/docs/gelistirme-sureci/) uygulanır; [test matrisindeki](/docs/test-stratejisi/) ilgili senaryolar çalışır. Çalışmayan/dış bağımlılığa takılan testler açık bırakılır. Kanıt paketi: commit, ortam, fixture sürümü, test çıktısı, demo kaydı, reviewer ve açık Q bağlantıları. Faz çıkışı gerekiyorsa [kapı tutanağı](/docs/kabul-kapilari/) eklenir.

## Sprint içi çalışma

Gün 1: sözleşme/DoR ve sahiplik. Gün 2–7: GP kartlarını küçük dilimlerle uygula. Gün 8: entegrasyon/negatif senaryolar. Gün 9: UAT/doküman/release provası. Gün 10: demo ve kabul. Sağlayıcı cevabı gecikirse mock ve bağımsız işleri ilerlet; teyit gerektiren kabiliyeti canlıya açma.

## AI görev istemi

Aşağıdaki metin ilgili sprint bağlamını taşır; uygulama sırasında sıradaki tek GP kartına daralt. Kod bloklarının sağ üstündeki düğmeyle kopyalanabilir.

```text
S11 / Worker, inbox ve outbox dayanıklılığı sprintini uygula.
Önce mevcut repo, docs/mimari, docs/api-referansi, docs/odeme-akisi,
docs/test-stratejisi ve bu sprintin GP kartlarını oku.
Bağımlılık: S10. Teyit ihtiyacı: Ölçülen backlog ve iş hacmi.
İş kartları: GP-111, GP-112, GP-113.
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

[S12 sprintine geç](/docs/sprint-12/).
