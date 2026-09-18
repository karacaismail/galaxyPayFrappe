---
title: "S02 · Ödemeyi güvenle başlat"
description: "Dummy merchant ile ödeme linki ve kalıcı attempt kaydı."
group: "Sprintler"
---

## Sprint hedefi

Dummy merchant ile ödeme linki ve kalıcı attempt kaydı. **Planlandı · henüz geliştirilmedi.** Faz 1: MVP. Süre 2 hafta; 10 geliştirme kişi-günü kapsam + 4 gün entegrasyon/review kapasitesi önerisi. [Kapasite varsayımları](/docs/kapsam/).

| Alan | Karar |
|---|---|
| Önkoşul | S01 ve ilgili kapının kanıtı |
| Birincil roller | BE + FE |
| Dış bağımlılık | Auth yanıtı, token TTL ve izinli ödeme hostları teyidi. |
| Teslim | Dummy merchant ile ödeme linki ve kalıcı attempt kaydı. |

## İş kartları

### GP-021 · Sunucu auth adaptörü

**İş:** Test secret store, kısıtlı token cache, timeout ve hata sınıflandırmasını uygula.

**Kabul:** Token istemciye dönmez; bozuk auth cevabı başarı sayılmaz; 401 döngüsü oluşmaz.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-022 · Idempotent ödeme oluşturma

**İş:** Sipariş toplamını sunucudan al; merchant eşleşmesini doğrula; intenti önce kaydet; Add sonucunu ilişkilendir.

**Kabul:** Aynı anahtar ve gövde aynı attempti döndürür; farklı gövde 409; belirsiz Add otomatik tekrarlanmaz.

**Kaba tahmin:** 4 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-023 · Hosted checkout UX

**İş:** PaymentUrl allowlist, popup engeli için aynı linke yönlendirme ve pending ekranını uygula.

**Kabul:** Popup kapanması başarısız ödeme sayılmaz; tekrar tıklama ikinci işlem oluşturmaz.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

## Sprint kabulü

Her GP kartının yukarıdaki kabul kriteri kanıtlanmalı. [Ortak Definition of Done](/docs/gelistirme-sureci/) uygulanır; [test matrisindeki](/docs/test-stratejisi/) ilgili senaryolar çalışır. Çalışmayan/dış bağımlılığa takılan testler açık bırakılır. Kanıt paketi: commit, ortam, fixture sürümü, test çıktısı, demo kaydı, reviewer ve açık Q bağlantıları. Faz çıkışı gerekiyorsa [kapı tutanağı](/docs/kabul-kapilari/) eklenir.

## Sprint içi çalışma

Gün 1: sözleşme/DoR ve sahiplik. Gün 2–7: GP kartlarını küçük dilimlerle uygula. Gün 8: entegrasyon/negatif senaryolar. Gün 9: UAT/doküman/release provası. Gün 10: demo ve kabul. Sağlayıcı cevabı gecikirse mock ve bağımsız işleri ilerlet; teyit gerektiren kabiliyeti canlıya açma.

## AI görev istemi

Aşağıdaki metin ilgili sprint bağlamını taşır; uygulama sırasında sıradaki tek GP kartına daralt. Kod bloklarının sağ üstündeki düğmeyle kopyalanabilir.

```text
S02 / Ödemeyi güvenle başlat sprintini uygula.
Önce mevcut repo, docs/mimari, docs/api-referansi, docs/odeme-akisi,
docs/test-stratejisi ve bu sprintin GP kartlarını oku.
Bağımlılık: S01. Teyit ihtiyacı: Auth yanıtı, token TTL ve izinli ödeme hostları teyidi.
İş kartları: GP-021, GP-022, GP-023.
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

[S03 sprintine geç](/docs/sprint-03/).
