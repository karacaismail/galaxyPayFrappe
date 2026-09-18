---
title: "S24 · Kaos ve işletim tatbikatları"
description: "Dayanıklılık kanıtı ve düzeltilmiş runbooklar."
group: "Sprintler"
---

## Sprint hedefi

Dayanıklılık kanıtı ve düzeltilmiş runbooklar. **Planlandı · henüz geliştirilmedi.** Faz 8: Maturity ready. Süre 2 hafta; 10 geliştirme kişi-günü kapsam + 4 gün entegrasyon/review kapasitesi önerisi. [Kapasite varsayımları](/docs/kapsam/).

| Alan | Karar |
|---|---|
| Önkoşul | S23 ve ilgili kapının kanıtı |
| Birincil roller | Platform + QA + Operasyon |
| Dış bağımlılık | Onaylı test alanı ve durdurma koşulları. |
| Teslim | Dayanıklılık kanıtı ve düzeltilmiş runbooklar. |

## İş kartları

### GP-241 · Finansal uç durumlar

**İş:** Geç success, çift callback, servis timeout ve worker ölümü birleşimlerini test et.

**Kabul:** Tüm senaryolar sonunda sipariş, attempt ve mutabakat kayıtları açıklanabilir.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-242 · İnsan süreçleri

**İş:** Nöbet devri, erişim kaybı ve sağlayıcı kesinti masa başı tatbikatı yap.

**Kabul:** Yedek sorumlu runbook ile müdahale eder; kişi bağımlılığı ortaya çıkarılır.

**Kaba tahmin:** 4 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-243 · Bulgu düzeltme

**İş:** Tatbikat açıklarını kapat ve etkilenen akışı yeniden çalıştır.

**Kabul:** Kritik bulgular tekrarlanamaz; gerçek süreler hedeflerle karşılaştırılır.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

## Sprint kabulü

Her GP kartının yukarıdaki kabul kriteri kanıtlanmalı. [Ortak Definition of Done](/docs/gelistirme-sureci/) uygulanır; [test matrisindeki](/docs/test-stratejisi/) ilgili senaryolar çalışır. Çalışmayan/dış bağımlılığa takılan testler açık bırakılır. Kanıt paketi: commit, ortam, fixture sürümü, test çıktısı, demo kaydı, reviewer ve açık Q bağlantıları. Faz çıkışı gerekiyorsa [kapı tutanağı](/docs/kabul-kapilari/) eklenir.

## Sprint içi çalışma

Gün 1: sözleşme/DoR ve sahiplik. Gün 2–7: GP kartlarını küçük dilimlerle uygula. Gün 8: entegrasyon/negatif senaryolar. Gün 9: UAT/doküman/release provası. Gün 10: demo ve kabul. Sağlayıcı cevabı gecikirse mock ve bağımsız işleri ilerlet; teyit gerektiren kabiliyeti canlıya açma.

## AI görev istemi

Aşağıdaki metin ilgili sprint bağlamını taşır; uygulama sırasında sıradaki tek GP kartına daralt. Kod bloklarının sağ üstündeki düğmeyle kopyalanabilir.

```text
S24 / Kaos ve işletim tatbikatları sprintini uygula.
Önce mevcut repo, docs/mimari, docs/api-referansi, docs/odeme-akisi,
docs/test-stratejisi ve bu sprintin GP kartlarını oku.
Bağımlılık: S23. Teyit ihtiyacı: Onaylı test alanı ve durdurma koşulları.
İş kartları: GP-241, GP-242, GP-243.
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

[S25 sprintine geç](/docs/sprint-25/).
