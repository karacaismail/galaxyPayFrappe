---
title: "S17 · Contract-first entegrasyon platformu"
description: "Sürüm kontrollü sözleşme hattı ve adaptör rehberi."
group: "Sprintler"
---

## Sprint hedefi

Sürüm kontrollü sözleşme hattı ve adaptör rehberi. **Planlandı · henüz geliştirilmedi.** Faz 6: Platform & DX. Süre 2 hafta; 10 geliştirme kişi-günü kapsam + 4 gün entegrasyon/review kapasitesi önerisi. [Kapasite varsayımları](/docs/kapsam/).

| Alan | Karar |
|---|---|
| Önkoşul | S16 ve ilgili kapının kanıtı |
| Birincil roller | BE + DX |
| Dış bağımlılık | Swagger güncelleme sıklığı ve sürüm politikası. |
| Teslim | Sürüm kontrollü sözleşme hattı ve adaptör rehberi. |

## İş kartları

### GP-171 · Şema değişim hattı

**İş:** Planlı OpenAPI snapshot, breaking diff ve sorumlu bildirimi kur.

**Kabul:** Alan silme/tip değişimi CI contract gateini kırar.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-172 · Adaptör sınırı

**İş:** Sağlayıcı DTOsunu domain modelinden ayır; hata/durum maplerini tek yerde tut.

**Kabul:** Sağlayıcı şema değişikliği domain dışına yayılmaz; bilinmeyen enum incelemeye gider.

**Kaba tahmin:** 4 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-173 · Versiyon politikası

**İş:** İç API deprecation, migration ve tüketici testlerini ekle.

**Kabul:** Örnek eski tüketici geçiş penceresinde çalışır.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

## Sprint kabulü

Her GP kartının yukarıdaki kabul kriteri kanıtlanmalı. [Ortak Definition of Done](/docs/gelistirme-sureci/) uygulanır; [test matrisindeki](/docs/test-stratejisi/) ilgili senaryolar çalışır. Çalışmayan/dış bağımlılığa takılan testler açık bırakılır. Kanıt paketi: commit, ortam, fixture sürümü, test çıktısı, demo kaydı, reviewer ve açık Q bağlantıları. Faz çıkışı gerekiyorsa [kapı tutanağı](/docs/kabul-kapilari/) eklenir.

## Sprint içi çalışma

Gün 1: sözleşme/DoR ve sahiplik. Gün 2–7: GP kartlarını küçük dilimlerle uygula. Gün 8: entegrasyon/negatif senaryolar. Gün 9: UAT/doküman/release provası. Gün 10: demo ve kabul. Sağlayıcı cevabı gecikirse mock ve bağımsız işleri ilerlet; teyit gerektiren kabiliyeti canlıya açma.

## AI görev istemi

Aşağıdaki metin ilgili sprint bağlamını taşır; uygulama sırasında sıradaki tek GP kartına daralt. Kod bloklarının sağ üstündeki düğmeyle kopyalanabilir.

```text
S17 / Contract-first entegrasyon platformu sprintini uygula.
Önce mevcut repo, docs/mimari, docs/api-referansi, docs/odeme-akisi,
docs/test-stratejisi ve bu sprintin GP kartlarını oku.
Bağımlılık: S16. Teyit ihtiyacı: Swagger güncelleme sıklığı ve sürüm politikası.
İş kartları: GP-171, GP-172, GP-173.
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

[S18 sprintine geç](/docs/sprint-18/).
