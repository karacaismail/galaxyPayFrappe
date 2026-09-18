---
title: "S09 · Günlük mutabakat"
description: "Günlük mutabakat raporu ve fark çözüm akışı."
group: "Sprintler"
---

## Sprint hedefi

Günlük mutabakat raporu ve fark çözüm akışı. **Planlandı · henüz geliştirilmedi.** Faz 3: Finansal operasyon. Süre 2 hafta; 10 geliştirme kişi-günü kapsam + 4 gün entegrasyon/review kapasitesi önerisi. [Kapasite varsayımları](/docs/kapsam/).

| Alan | Karar |
|---|---|
| Önkoşul | S08 ve ilgili kapının kanıtı |
| Birincil roller | BE + Finans |
| Dış bağımlılık | Tarih aralığı API timezone/limit ve settlement dosyası erişimi. |
| Teslim | Günlük mutabakat raporu ve fark çözüm akışı. |

## İş kartları

### GP-091 · Eşleştirme modeli

**İş:** Sipariş, sağlayıcı tahsilatı ve banka/settlement hareketini ayrı kaynak olarak modelle.

**Kabul:** Payment success ile banka settlementı aynı şey sayılmaz; ID, tarih ve tutar izlenir.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-092 · Mutabakat işi

**İş:** Tarih aralığı pencereleri, watermark ve geç gelen kayıtlar için yeniden tarama uygula.

**Kabul:** Tekrar çalıştırma aynı farkı çoğaltmaz; limit ve saat dilimi sınır testleri geçer.

**Kaba tahmin:** 4 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-093 · Fark kuyruğu

**İş:** Eksik, fazla, tutar farkı ve zaman farkını sorumluya ata.

**Kabul:** Seed verisindeki bütün kasıtlı farklar bulunur; kapanış gerekçesi audit kaydına girer.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

## Sprint kabulü

Her GP kartının yukarıdaki kabul kriteri kanıtlanmalı. [Ortak Definition of Done](/docs/gelistirme-sureci/) uygulanır; [test matrisindeki](/docs/test-stratejisi/) ilgili senaryolar çalışır. Çalışmayan/dış bağımlılığa takılan testler açık bırakılır. Kanıt paketi: commit, ortam, fixture sürümü, test çıktısı, demo kaydı, reviewer ve açık Q bağlantıları. Faz çıkışı gerekiyorsa [kapı tutanağı](/docs/kabul-kapilari/) eklenir.

## Sprint içi çalışma

Gün 1: sözleşme/DoR ve sahiplik. Gün 2–7: GP kartlarını küçük dilimlerle uygula. Gün 8: entegrasyon/negatif senaryolar. Gün 9: UAT/doküman/release provası. Gün 10: demo ve kabul. Sağlayıcı cevabı gecikirse mock ve bağımsız işleri ilerlet; teyit gerektiren kabiliyeti canlıya açma.

## AI görev istemi

Aşağıdaki metin ilgili sprint bağlamını taşır; uygulama sırasında sıradaki tek GP kartına daralt. Kod bloklarının sağ üstündeki düğmeyle kopyalanabilir.

```text
S09 / Günlük mutabakat sprintini uygula.
Önce mevcut repo, docs/mimari, docs/api-referansi, docs/odeme-akisi,
docs/test-stratejisi ve bu sprintin GP kartlarını oku.
Bağımlılık: S08. Teyit ihtiyacı: Tarih aralığı API timezone/limit ve settlement dosyası erişimi.
İş kartları: GP-091, GP-092, GP-093.
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

[S10 sprintine geç](/docs/sprint-10/).
