---
title: "S05 · Satıcı onboarding ve izolasyon"
description: "Onboarding kontrol listesi ve iki satıcılı izolasyon kanıtı."
group: "Sprintler"
---

## Sprint hedefi

Onboarding kontrol listesi ve iki satıcılı izolasyon kanıtı. **Planlandı · henüz geliştirilmedi.** Faz 2: Post-MVP. Süre 2 hafta; 10 geliştirme kişi-günü kapsam + 4 gün entegrasyon/review kapasitesi önerisi. [Kapasite varsayımları](/docs/kapsam/).

| Alan | Karar |
|---|---|
| Önkoşul | S04 ve ilgili kapının kanıtı |
| Birincil roller | BE + FE / Operasyon |
| Dış bağımlılık | Eksik 2.3 belgesi ve sağlayıcı gerçek satıcı tanımı. |
| Teslim | Onboarding kontrol listesi ve iki satıcılı izolasyon kanıtı. |

## İş kartları

### GP-051 · Onboarding akışı

**İş:** 2.3 alanlarını teyitli şemayla topla; taslak, gönderildi, incelemede ve aktif durumları oluştur.

**Kabul:** Alan listesi uydurulmaz; eksik evrak ve red gerekçesi görünür.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-052 · Merchant eşleşmesi

**İş:** Tenant–yerel satıcı–SubMerchantId bağını ve IsActive/HasMasterpassSetting kontrollerini ekle.

**Kabul:** Başka tenant ID’siyle ödeme ve listeleme reddedilir; ana merchant fallback sessiz çalışmaz.

**Kaba tahmin:** 4 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-053 · Aktivasyon UAT

**İş:** İki gerçek veya onaylı dummy satıcıyla ayrık ödeme ve audit akışını çalıştır.

**Kabul:** Her işlem doğru effective merchant ile eşleşir; deaktivasyon yeni girişimi durdurur.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

## Sprint kabulü

Her GP kartının yukarıdaki kabul kriteri kanıtlanmalı. [Ortak Definition of Done](/docs/gelistirme-sureci/) uygulanır; [test matrisindeki](/docs/test-stratejisi/) ilgili senaryolar çalışır. Çalışmayan/dış bağımlılığa takılan testler açık bırakılır. Kanıt paketi: commit, ortam, fixture sürümü, test çıktısı, demo kaydı, reviewer ve açık Q bağlantıları. Faz çıkışı gerekiyorsa [kapı tutanağı](/docs/kabul-kapilari/) eklenir.

## Sprint içi çalışma

Gün 1: sözleşme/DoR ve sahiplik. Gün 2–7: GP kartlarını küçük dilimlerle uygula. Gün 8: entegrasyon/negatif senaryolar. Gün 9: UAT/doküman/release provası. Gün 10: demo ve kabul. Sağlayıcı cevabı gecikirse mock ve bağımsız işleri ilerlet; teyit gerektiren kabiliyeti canlıya açma.

## AI görev istemi

Aşağıdaki metin ilgili sprint bağlamını taşır; uygulama sırasında sıradaki tek GP kartına daralt. Kod bloklarının sağ üstündeki düğmeyle kopyalanabilir.

```text
S05 / Satıcı onboarding ve izolasyon sprintini uygula.
Önce mevcut repo, docs/mimari, docs/api-referansi, docs/odeme-akisi,
docs/test-stratejisi ve bu sprintin GP kartlarını oku.
Bağımlılık: S04. Teyit ihtiyacı: Eksik 2.3 belgesi ve sağlayıcı gerçek satıcı tanımı.
İş kartları: GP-051, GP-052, GP-053.
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

[S06 sprintine geç](/docs/sprint-06/).
