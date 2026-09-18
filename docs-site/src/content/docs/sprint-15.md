---
title: "S15 · Veri yaşam döngüsü ve gizlilik"
description: "Veri envanteri ve doğrulanmış yaşam döngüsü kontrolleri."
group: "Sprintler"
---

## Sprint hedefi

Veri envanteri ve doğrulanmış yaşam döngüsü kontrolleri. **Planlandı · henüz geliştirilmedi.** Faz 5: Güvenlik & yönetişim. Süre 2 hafta; 10 geliştirme kişi-günü kapsam + 4 gün entegrasyon/review kapasitesi önerisi. [Kapasite varsayımları](/docs/kapsam/).

| Alan | Karar |
|---|---|
| Önkoşul | S14 ve ilgili kapının kanıtı |
| Birincil roller | Veri sahibi + Hukuk + BE |
| Dış bağımlılık | Kişisel veri envanteri ve saklama gereksinimleri. |
| Teslim | Veri envanteri ve doğrulanmış yaşam döngüsü kontrolleri. |

## İş kartları

### GP-151 · Veri haritası

**İş:** Telefon/ad/log/callback/destek/export akışlarını amaç ve erişim rolüyle envanterle.

**Kabul:** Her alanın sahibi, saklama süresi ve aktarım noktası kayıtlı.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-152 · Saklama ve silme

**İş:** Onaylı retention, legal hold ve anonimleştirme görevlerini uygula.

**Kabul:** Süre dolan örnek veri silinir; muhasebe kayıt bütünlüğü korunur.

**Kaba tahmin:** 4 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-153 · İlgili kişi süreçleri

**İş:** Erişim/düzeltme/silme talepleri için kimlik doğrulama ve kayıt akışı tasarla.

**Kabul:** Deneme talebi uçtan uca izlenir; süreler hukuk tarafından onaylanır.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

## Sprint kabulü

Her GP kartının yukarıdaki kabul kriteri kanıtlanmalı. [Ortak Definition of Done](/docs/gelistirme-sureci/) uygulanır; [test matrisindeki](/docs/test-stratejisi/) ilgili senaryolar çalışır. Çalışmayan/dış bağımlılığa takılan testler açık bırakılır. Kanıt paketi: commit, ortam, fixture sürümü, test çıktısı, demo kaydı, reviewer ve açık Q bağlantıları. Faz çıkışı gerekiyorsa [kapı tutanağı](/docs/kabul-kapilari/) eklenir.

## Sprint içi çalışma

Gün 1: sözleşme/DoR ve sahiplik. Gün 2–7: GP kartlarını küçük dilimlerle uygula. Gün 8: entegrasyon/negatif senaryolar. Gün 9: UAT/doküman/release provası. Gün 10: demo ve kabul. Sağlayıcı cevabı gecikirse mock ve bağımsız işleri ilerlet; teyit gerektiren kabiliyeti canlıya açma.

## AI görev istemi

Aşağıdaki metin ilgili sprint bağlamını taşır; uygulama sırasında sıradaki tek GP kartına daralt. Kod bloklarının sağ üstündeki düğmeyle kopyalanabilir.

```text
S15 / Veri yaşam döngüsü ve gizlilik sprintini uygula.
Önce mevcut repo, docs/mimari, docs/api-referansi, docs/odeme-akisi,
docs/test-stratejisi ve bu sprintin GP kartlarını oku.
Bağımlılık: S14. Teyit ihtiyacı: Kişisel veri envanteri ve saklama gereksinimleri.
İş kartları: GP-151, GP-152, GP-153.
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

[S16 sprintine geç](/docs/sprint-16/).
