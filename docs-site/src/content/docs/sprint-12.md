---
title: "S12 · Performans ve kapasite"
description: "Tekrarlanabilir yük raporu ve kapasite eşiği."
group: "Sprintler"
---

## Sprint hedefi

Tekrarlanabilir yük raporu ve kapasite eşiği. **Planlandı · henüz geliştirilmedi.** Faz 4: Dayanıklılık. Süre 2 hafta; 10 geliştirme kişi-günü kapsam + 4 gün entegrasyon/review kapasitesi önerisi. [Kapasite varsayımları](/docs/kapsam/).

| Alan | Karar |
|---|---|
| Önkoşul | S11 ve ilgili kapının kanıtı |
| Birincil roller | Platform + BE + QA |
| Dış bağımlılık | Hedef trafik, p95 bütçesi ve sağlayıcı sandbox yük izni. |
| Teslim | Tekrarlanabilir yük raporu ve kapasite eşiği. |

## İş kartları

### GP-121 · Yük modeli

**İş:** Ölçülen baz trafik ve 2x tepe profili; mock ve canlı limitlerini ayır.

**Kabul:** Sağlayıcıya izinsiz yük gönderilmez; workload dağılımı belgeli.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-122 · Profil ve iyileştirme

**İş:** DB index, sorgu planı, connection pool ve kontrollü token refreshi optimize et.

**Kabul:** 2x yükte iç API p95 ≤500 ms hedefi ölçülür; sağlayıcı/3DS süresi ayrı raporlanır.

**Kaba tahmin:** 4 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-123 · Süreklilik testi

**İş:** Soak, ani yükselme ve kapasite alarmı ekle.

**Kabul:** Kaynak tüketimi dengelenir; hata bütçesi aşımı otomatik rollout durdurur.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

## Sprint kabulü

Her GP kartının yukarıdaki kabul kriteri kanıtlanmalı. [Ortak Definition of Done](/docs/gelistirme-sureci/) uygulanır; [test matrisindeki](/docs/test-stratejisi/) ilgili senaryolar çalışır. Çalışmayan/dış bağımlılığa takılan testler açık bırakılır. Kanıt paketi: commit, ortam, fixture sürümü, test çıktısı, demo kaydı, reviewer ve açık Q bağlantıları. Faz çıkışı gerekiyorsa [kapı tutanağı](/docs/kabul-kapilari/) eklenir.

## Sprint içi çalışma

Gün 1: sözleşme/DoR ve sahiplik. Gün 2–7: GP kartlarını küçük dilimlerle uygula. Gün 8: entegrasyon/negatif senaryolar. Gün 9: UAT/doküman/release provası. Gün 10: demo ve kabul. Sağlayıcı cevabı gecikirse mock ve bağımsız işleri ilerlet; teyit gerektiren kabiliyeti canlıya açma.

## AI görev istemi

Aşağıdaki metin ilgili sprint bağlamını taşır; uygulama sırasında sıradaki tek GP kartına daralt. Kod bloklarının sağ üstündeki düğmeyle kopyalanabilir.

```text
S12 / Performans ve kapasite sprintini uygula.
Önce mevcut repo, docs/mimari, docs/api-referansi, docs/odeme-akisi,
docs/test-stratejisi ve bu sprintin GP kartlarını oku.
Bağımlılık: S11. Teyit ihtiyacı: Hedef trafik, p95 bütçesi ve sağlayıcı sandbox yük izni.
İş kartları: GP-121, GP-122, GP-123.
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

[S13 sprintine geç](/docs/sprint-13/).
