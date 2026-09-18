---
title: "S06 · Cüzdan ve ödeme deneyimi"
description: "Mobil/masaüstü ödeme deneyimi ve erişilebilirlik kabul raporu."
group: "Sprintler"
---

## Sprint hedefi

Mobil/masaüstü ödeme deneyimi ve erişilebilirlik kabul raporu. **Planlandı · henüz geliştirilmedi.** Faz 2: Post-MVP. Süre 2 hafta; 10 geliştirme kişi-günü kapsam + 4 gün entegrasyon/review kapasitesi önerisi. [Kapasite varsayımları](/docs/kapsam/).

| Alan | Karar |
|---|---|
| Önkoşul | S05 ve ilgili kapının kanıtı |
| Birincil roller | FE + QA / BE |
| Dış bağımlılık | Sağlayıcıya ait test cüzdan hesabı ve erişim desteği. |
| Teslim | Mobil/masaüstü ödeme deneyimi ve erişilebilirlik kabul raporu. |

## İş kartları

### GP-061 · Cüzdan UAT

**İş:** İzinli test hesabıyla kayıtlı kart ve doğrudan kart yollarını ayır; kart verisini uygulamada toplama.

**Kabul:** Her iki yol ayrı test sonucu üretir; test telefonları yayınlanan fixturelara girmez.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-062 · Dayanıklı müşteri UX

**İş:** Mobil yönlendirme, sekme kapanması, geri dönüş ve sayfa yenilemede attempt devamlılığını uygula.

**Kabul:** Kullanıcı pending sonucu görür; başarısızlık ve bilinmeyen durum farklı açıklanır.

**Kaba tahmin:** 4 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-063 · Erişilebilirlik

**İş:** Klavye, focus dönüşü, ekran okuyucu, 200% zoom ve minimum 1rem metni doğrula.

**Kabul:** Ödeme eylemleri klavyeyle tamamlanır; küçük ekranlarda kontroller örtüşmez.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

## Sprint kabulü

Her GP kartının yukarıdaki kabul kriteri kanıtlanmalı. [Ortak Definition of Done](/docs/gelistirme-sureci/) uygulanır; [test matrisindeki](/docs/test-stratejisi/) ilgili senaryolar çalışır. Çalışmayan/dış bağımlılığa takılan testler açık bırakılır. Kanıt paketi: commit, ortam, fixture sürümü, test çıktısı, demo kaydı, reviewer ve açık Q bağlantıları. Faz çıkışı gerekiyorsa [kapı tutanağı](/docs/kabul-kapilari/) eklenir.

## Sprint içi çalışma

Gün 1: sözleşme/DoR ve sahiplik. Gün 2–7: GP kartlarını küçük dilimlerle uygula. Gün 8: entegrasyon/negatif senaryolar. Gün 9: UAT/doküman/release provası. Gün 10: demo ve kabul. Sağlayıcı cevabı gecikirse mock ve bağımsız işleri ilerlet; teyit gerektiren kabiliyeti canlıya açma.

## AI görev istemi

Aşağıdaki metin ilgili sprint bağlamını taşır; uygulama sırasında sıradaki tek GP kartına daralt. Kod bloklarının sağ üstündeki düğmeyle kopyalanabilir.

```text
S06 / Cüzdan ve ödeme deneyimi sprintini uygula.
Önce mevcut repo, docs/mimari, docs/api-referansi, docs/odeme-akisi,
docs/test-stratejisi ve bu sprintin GP kartlarını oku.
Bağımlılık: S05. Teyit ihtiyacı: Sağlayıcıya ait test cüzdan hesabı ve erişim desteği.
İş kartları: GP-061, GP-062, GP-063.
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

[S07 sprintine geç](/docs/sprint-07/).
