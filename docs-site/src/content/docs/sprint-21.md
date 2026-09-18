---
title: "S21 · Tenant politikaları ve büyük müşteri"
description: "İzolasyon test raporu ve kurumsal tenant politikaları."
group: "Sprintler"
---

## Sprint hedefi

İzolasyon test raporu ve kurumsal tenant politikaları. **Planlandı · henüz geliştirilmedi.** Faz 7: Enterprise grade. Süre 2 hafta; 10 geliştirme kişi-günü kapsam + 4 gün entegrasyon/review kapasitesi önerisi. [Kapasite varsayımları](/docs/kapsam/).

| Alan | Karar |
|---|---|
| Önkoşul | S20 ve ilgili kapının kanıtı |
| Birincil roller | BE + Platform / PO |
| Dış bağımlılık | Kurumsal müşteri hacmi ve izolasyon gereksinimleri. |
| Teslim | İzolasyon test raporu ve kurumsal tenant politikaları. |

## İş kartları

### GP-211 · Politika modeli

**İş:** Tenant limit, özellik bayrağı ve credential sınırlarını tanımla.

**Kabul:** Tenant A ayarı B işlemine etki etmez; config değişimi audit edilir.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-212 · İzolasyon kanıtı

**İş:** Veri, kuyruk, cache ve rapor tenant anahtarlarını negatif test et.

**Kabul:** Çapraz tenant erişim testlerinin tamamı reddedilir.

**Kaba tahmin:** 4 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-213 · Taşınabilirlik ve kota

**İş:** Export/import sınırları, tenant offboarding ve noisy-neighbor kontrolü ekle.

**Kabul:** Yoğun müşteri diğerinin SLOsunu bozmadan sınırlanır.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

## Sprint kabulü

Her GP kartının yukarıdaki kabul kriteri kanıtlanmalı. [Ortak Definition of Done](/docs/gelistirme-sureci/) uygulanır; [test matrisindeki](/docs/test-stratejisi/) ilgili senaryolar çalışır. Çalışmayan/dış bağımlılığa takılan testler açık bırakılır. Kanıt paketi: commit, ortam, fixture sürümü, test çıktısı, demo kaydı, reviewer ve açık Q bağlantıları. Faz çıkışı gerekiyorsa [kapı tutanağı](/docs/kabul-kapilari/) eklenir.

## Sprint içi çalışma

Gün 1: sözleşme/DoR ve sahiplik. Gün 2–7: GP kartlarını küçük dilimlerle uygula. Gün 8: entegrasyon/negatif senaryolar. Gün 9: UAT/doküman/release provası. Gün 10: demo ve kabul. Sağlayıcı cevabı gecikirse mock ve bağımsız işleri ilerlet; teyit gerektiren kabiliyeti canlıya açma.

## AI görev istemi

Aşağıdaki metin ilgili sprint bağlamını taşır; uygulama sırasında sıradaki tek GP kartına daralt. Kod bloklarının sağ üstündeki düğmeyle kopyalanabilir.

```text
S21 / Tenant politikaları ve büyük müşteri sprintini uygula.
Önce mevcut repo, docs/mimari, docs/api-referansi, docs/odeme-akisi,
docs/test-stratejisi ve bu sprintin GP kartlarını oku.
Bağımlılık: S20. Teyit ihtiyacı: Kurumsal müşteri hacmi ve izolasyon gereksinimleri.
İş kartları: GP-211, GP-212, GP-213.
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

[S22 sprintine geç](/docs/sprint-22/).
