---
title: "S03 · Callback ve durum doğrulaması"
description: "Doğrulanmış sonuç; yinelenen, sahte ve kayıp callback test kanıtları."
group: "Sprintler"
---

## Sprint hedefi

Doğrulanmış sonuç; yinelenen, sahte ve kayıp callback test kanıtları. **Planlandı · henüz geliştirilmedi.** Faz 1: MVP. Süre 2 hafta; 10 geliştirme kişi-günü kapsam + 4 gün entegrasyon/review kapasitesi önerisi. [Kapasite varsayımları](/docs/kapsam/).

| Alan | Karar |
|---|---|
| Önkoşul | S02 ve ilgili kapının kanıtı |
| Birincil roller | BE + QA |
| Dış bağımlılık | Q01 callback doğrulama/retry; Q02 ID semantiği; canlı geçiş için gerekli. |
| Teslim | Doğrulanmış sonuç; yinelenen, sahte ve kayıp callback test kanıtları. |

## İş kartları

### GP-031 · Callback inbox

**İş:** Boyut ve şema kontrolü; kalıcı inbox; olay tekilleştirme; ham gövde için kontrollü erişim uygula.

**Kabul:** Aynı bildirim 100 kez gelince 1 iş etkisi; DB yazımı başarısızsa başarı ACK verilmez.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-032 · Yetkili durum doğrulaması

**İş:** GetById ile OrderNo, Amount, merchant ve ID eşleşmesini kontrol et; onaylı durum makinesini uygula.

**Kabul:** Sahte callback/postMessage siparişi paid yapamaz; eşleşmeyen tutar inceleme kuyruğuna gider.

**Kaba tahmin:** 4 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-033 · Kayıp/ters sıralı olay kurtarma

**İş:** Sınırlı backoff, jitter ve reconciliation job; read-only müşteri durum endpointi ekle.

**Kabul:** Callback yokken sorgu ile sonuç bulunur; geç pending başarılı ödemeyi geriye götürmez.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

## Sprint kabulü

Her GP kartının yukarıdaki kabul kriteri kanıtlanmalı. [Ortak Definition of Done](/docs/gelistirme-sureci/) uygulanır; [test matrisindeki](/docs/test-stratejisi/) ilgili senaryolar çalışır. Çalışmayan/dış bağımlılığa takılan testler açık bırakılır. Kanıt paketi: commit, ortam, fixture sürümü, test çıktısı, demo kaydı, reviewer ve açık Q bağlantıları. Faz çıkışı gerekiyorsa [kapı tutanağı](/docs/kabul-kapilari/) eklenir.

## Sprint içi çalışma

Gün 1: sözleşme/DoR ve sahiplik. Gün 2–7: GP kartlarını küçük dilimlerle uygula. Gün 8: entegrasyon/negatif senaryolar. Gün 9: UAT/doküman/release provası. Gün 10: demo ve kabul. Sağlayıcı cevabı gecikirse mock ve bağımsız işleri ilerlet; teyit gerektiren kabiliyeti canlıya açma.

## AI görev istemi

Aşağıdaki metin ilgili sprint bağlamını taşır; uygulama sırasında sıradaki tek GP kartına daralt. Kod bloklarının sağ üstündeki düğmeyle kopyalanabilir.

```text
S03 / Callback ve durum doğrulaması sprintini uygula.
Önce mevcut repo, docs/mimari, docs/api-referansi, docs/odeme-akisi,
docs/test-stratejisi ve bu sprintin GP kartlarını oku.
Bağımlılık: S02. Teyit ihtiyacı: Q01 callback doğrulama/retry; Q02 ID semantiği; canlı geçiş için gerekli.
İş kartları: GP-031, GP-032, GP-033.
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

[S04 sprintine geç](/docs/sprint-04/).
