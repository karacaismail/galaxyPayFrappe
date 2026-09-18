---
title: "S01 · Sözleşme, sınırlar ve geliştirme temeli"
description: "Yerel mock ödeme, CI çıktısı, 4 ADR ve açık soru kaydı."
group: "Sprintler"
---

## Sprint hedefi

Yerel mock ödeme, CI çıktısı, 4 ADR ve açık soru kaydı. **Planlandı · henüz geliştirilmedi.** Faz 1: MVP. Süre 2 hafta; 10 geliştirme kişi-günü kapsam + 4 gün entegrasyon/review kapasitesi önerisi. [Kapasite varsayımları](/docs/kapsam/).

| Alan | Karar |
|---|---|
| Önkoşul | Başlangıç ve ilgili kapının kanıtı |
| Birincil roller | BE + FE / TL |
| Dış bağımlılık | Güncel doküman 2.3 ve sağlayıcı soru listesi; cevap beklerken mock ile ilerlenir. |
| Teslim | Yerel mock ödeme, CI çıktısı, 4 ADR ve açık soru kaydı. |

## İş kartları

### GP-011 · Sözleşme envanteri

**İş:** OpenAPI anlık görüntüsünü sürümle; auth, Add, GetById ve callback fixture sınırlarını kaydet.

**Kabul:** Şema değişikliği diff olarak görülebilir; bilinmeyenler Q kayıtlarına bağlı.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-012 · Repo ve secret sınırı

**İş:** Yeni uygulama katmanlarını planla; credential alanlarını üretim tasarımından çıkar; config, mock ve CI iskeletini kur.

**Kabul:** Temiz checkout kurulabilir; tarayıcı bundle ve log taramasında test secret değeri bulunmaz.

**Kaba tahmin:** 4 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-013 · Domain ve veri sözlüğü

**İş:** Order, PaymentAttempt, MerchantMapping ve Inbox modellerini; para hassasiyeti ve durum geçişlerini tanımla.

**Kabul:** İki eşzamanlı denemede sipariş başına aktif girişim kısıtı tasarımı ve migration testi var.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

## Sprint kabulü

Her GP kartının yukarıdaki kabul kriteri kanıtlanmalı. [Ortak Definition of Done](/docs/gelistirme-sureci/) uygulanır; [test matrisindeki](/docs/test-stratejisi/) ilgili senaryolar çalışır. Çalışmayan/dış bağımlılığa takılan testler açık bırakılır. Kanıt paketi: commit, ortam, fixture sürümü, test çıktısı, demo kaydı, reviewer ve açık Q bağlantıları. Faz çıkışı gerekiyorsa [kapı tutanağı](/docs/kabul-kapilari/) eklenir.

## Sprint içi çalışma

Gün 1: sözleşme/DoR ve sahiplik. Gün 2–7: GP kartlarını küçük dilimlerle uygula. Gün 8: entegrasyon/negatif senaryolar. Gün 9: UAT/doküman/release provası. Gün 10: demo ve kabul. Sağlayıcı cevabı gecikirse mock ve bağımsız işleri ilerlet; teyit gerektiren kabiliyeti canlıya açma.

## AI görev istemi

Aşağıdaki metin ilgili sprint bağlamını taşır; uygulama sırasında sıradaki tek GP kartına daralt. Kod bloklarının sağ üstündeki düğmeyle kopyalanabilir.

```text
S01 / Sözleşme, sınırlar ve geliştirme temeli sprintini uygula.
Önce mevcut repo, docs/mimari, docs/api-referansi, docs/odeme-akisi,
docs/test-stratejisi ve bu sprintin GP kartlarını oku.
Bağımlılık: Başlangıç. Teyit ihtiyacı: Güncel doküman 2.3 ve sağlayıcı soru listesi; cevap beklerken mock ile ilerlenir.
İş kartları: GP-011, GP-012, GP-013.
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

[S02 sprintine geç](/docs/sprint-02/).
