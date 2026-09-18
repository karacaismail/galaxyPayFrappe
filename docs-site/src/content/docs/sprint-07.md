---
title: "S07 · Destek ve operasyon görünürlüğü"
description: "Destek paneli ve G2 post-MVP kabul paketi."
group: "Sprintler"
---

## Sprint hedefi

Destek paneli ve G2 post-MVP kabul paketi. **Planlandı · henüz geliştirilmedi.** Faz 2: Post-MVP. Süre 2 hafta; 10 geliştirme kişi-günü kapsam + 4 gün entegrasyon/review kapasitesi önerisi. [Kapasite varsayımları](/docs/kapsam/).

| Alan | Karar |
|---|---|
| Önkoşul | S06 ve ilgili kapının kanıtı |
| Birincil roller | FE + BE / Destek |
| Dış bağımlılık | Rol matrisi ve veri görüntüleme yetkileri. |
| Teslim | Destek paneli ve G2 post-MVP kabul paketi. |

## İş kartları

### GP-071 · İşlem arama

**İş:** Maskeli sipariş, attempt, merchant, zaman ve durum filtreleri oluştur.

**Kabul:** Tenant filtreleri sunucuda zorunlu; telefon/token arama sonucunda sızmaz.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-072 · Güvenli yeniden sorgu

**İş:** Yetkili operatöre sadece durum yenileme; gerekçe ve audit kaydı ekle.

**Kabul:** Yeniden sorgu Add veya tahsilat çağırmaz; yetkisiz rol 403 alır.

**Kaba tahmin:** 4 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-073 · Destek playbook

**İş:** Pending, sync_error, mükerrer şüphe ve müşteri iletişim şablonlarını yaz.

**Kabul:** Destek örnek vakayı sağlayıcı referansı ve korelasyon ID ile takip edebilir.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

## Sprint kabulü

Her GP kartının yukarıdaki kabul kriteri kanıtlanmalı. [Ortak Definition of Done](/docs/gelistirme-sureci/) uygulanır; [test matrisindeki](/docs/test-stratejisi/) ilgili senaryolar çalışır. Çalışmayan/dış bağımlılığa takılan testler açık bırakılır. Kanıt paketi: commit, ortam, fixture sürümü, test çıktısı, demo kaydı, reviewer ve açık Q bağlantıları. Faz çıkışı gerekiyorsa [kapı tutanağı](/docs/kabul-kapilari/) eklenir.

## Sprint içi çalışma

Gün 1: sözleşme/DoR ve sahiplik. Gün 2–7: GP kartlarını küçük dilimlerle uygula. Gün 8: entegrasyon/negatif senaryolar. Gün 9: UAT/doküman/release provası. Gün 10: demo ve kabul. Sağlayıcı cevabı gecikirse mock ve bağımsız işleri ilerlet; teyit gerektiren kabiliyeti canlıya açma.

## AI görev istemi

Aşağıdaki metin ilgili sprint bağlamını taşır; uygulama sırasında sıradaki tek GP kartına daralt. Kod bloklarının sağ üstündeki düğmeyle kopyalanabilir.

```text
S07 / Destek ve operasyon görünürlüğü sprintini uygula.
Önce mevcut repo, docs/mimari, docs/api-referansi, docs/odeme-akisi,
docs/test-stratejisi ve bu sprintin GP kartlarını oku.
Bağımlılık: S06. Teyit ihtiyacı: Rol matrisi ve veri görüntüleme yetkileri.
İş kartları: GP-071, GP-072, GP-073.
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

[S08 sprintine geç](/docs/sprint-08/).
