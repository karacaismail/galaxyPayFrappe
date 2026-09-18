---
title: "S10 · Finans raporları ve kapanış"
description: "G3 finans operasyon kabulü ve örnek kapanış paketi."
group: "Sprintler"
---

## Sprint hedefi

G3 finans operasyon kabulü ve örnek kapanış paketi. **Planlandı · henüz geliştirilmedi.** Faz 3: Finansal operasyon. Süre 2 hafta; 10 geliştirme kişi-günü kapsam + 4 gün entegrasyon/review kapasitesi önerisi. [Kapasite varsayımları](/docs/kapsam/).

| Alan | Karar |
|---|---|
| Önkoşul | S09 ve ilgili kapının kanıtı |
| Birincil roller | Finans + BE + FE |
| Dış bağımlılık | Komisyon/net tutar ve mali belge sorumluluğu teyidi. |
| Teslim | G3 finans operasyon kabulü ve örnek kapanış paketi. |

## İş kartları

### GP-101 · Finans raporu

**İş:** Brüt, net, komisyon, iade ve açık farkları kaynak referanslarıyla göster.

**Kabul:** Hesaplama decimal ile yapılır; örnek dönem toplamları kaynaklarla eşleşir.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-102 · Güvenli dışa aktarım

**İş:** Rol kapsamlı CSV, formül enjeksiyonu koruması ve export audit uygula.

**Kabul:** Yetkisiz dışa aktarım engellenir; kişisel veri minimize edilir.

**Kaba tahmin:** 4 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-103 · Kapanış kontrolü

**İş:** Ay kapanışı, geç kayıt düzeltmesi ve dönem kilidi politikası yaz.

**Kabul:** Finans örnek dönemi kapatır; düzeltme iz bırakır ve geçmişi sessiz değiştirmez.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

## Sprint kabulü

Her GP kartının yukarıdaki kabul kriteri kanıtlanmalı. [Ortak Definition of Done](/docs/gelistirme-sureci/) uygulanır; [test matrisindeki](/docs/test-stratejisi/) ilgili senaryolar çalışır. Çalışmayan/dış bağımlılığa takılan testler açık bırakılır. Kanıt paketi: commit, ortam, fixture sürümü, test çıktısı, demo kaydı, reviewer ve açık Q bağlantıları. Faz çıkışı gerekiyorsa [kapı tutanağı](/docs/kabul-kapilari/) eklenir.

## Sprint içi çalışma

Gün 1: sözleşme/DoR ve sahiplik. Gün 2–7: GP kartlarını küçük dilimlerle uygula. Gün 8: entegrasyon/negatif senaryolar. Gün 9: UAT/doküman/release provası. Gün 10: demo ve kabul. Sağlayıcı cevabı gecikirse mock ve bağımsız işleri ilerlet; teyit gerektiren kabiliyeti canlıya açma.

## AI görev istemi

Aşağıdaki metin ilgili sprint bağlamını taşır; uygulama sırasında sıradaki tek GP kartına daralt. Kod bloklarının sağ üstündeki düğmeyle kopyalanabilir.

```text
S10 / Finans raporları ve kapanış sprintini uygula.
Önce mevcut repo, docs/mimari, docs/api-referansi, docs/odeme-akisi,
docs/test-stratejisi ve bu sprintin GP kartlarını oku.
Bağımlılık: S09. Teyit ihtiyacı: Komisyon/net tutar ve mali belge sorumluluğu teyidi.
İş kartları: GP-101, GP-102, GP-103.
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

[S11 sprintine geç](/docs/sprint-11/).
