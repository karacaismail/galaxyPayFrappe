---
title: "S19 · Dokümantasyon ve geliştirici deneyimi"
description: "G6 DX kabulü ve görev tamamlama ölçümleri."
group: "Sprintler"
---

## Sprint hedefi

G6 DX kabulü ve görev tamamlama ölçümleri. **Planlandı · henüz geliştirilmedi.** Faz 6: Platform & DX. Süre 2 hafta; 10 geliştirme kişi-günü kapsam + 4 gün entegrasyon/review kapasitesi önerisi. [Kapasite varsayımları](/docs/kapsam/).

| Alan | Karar |
|---|---|
| Önkoşul | S18 ve ilgili kapının kanıtı |
| Birincil roller | DX + FE / TL |
| Dış bağımlılık | Geliştirici geri bildirimi ve arama verisi. |
| Teslim | G6 DX kabulü ve görev tamamlama ölçümleri. |

## İş kartları

### GP-191 · Canlı doküman hattı

**İş:** API örneklerini fixturelardan üret; doküman sahipliği ve son kontrol tarihi ekle.

**Kabul:** Örnek sözleşme driftinde docs CI kırılır; ölü bağlantı kalmaz.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-192 · Erişilebilir portal

**İş:** Arama, kopyala, sürüm ve içerik gezinmesini kullanıcılarla test et.

**Kabul:** Minimum 1rem, klavye ve mobil kabulü geçer; 5 görevden en az 4ü yardımsız bulunur.

**Kaba tahmin:** 4 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-193 · AI context packs

**İş:** Sınırlandırılmış görev istemleri, ADR ve kabul testlerini tek bağlamda sun.

**Kabul:** Pilot görevde secret sızıntısı yok; diff bağımsız incelemeye elverişli.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

## Sprint kabulü

Her GP kartının yukarıdaki kabul kriteri kanıtlanmalı. [Ortak Definition of Done](/docs/gelistirme-sureci/) uygulanır; [test matrisindeki](/docs/test-stratejisi/) ilgili senaryolar çalışır. Çalışmayan/dış bağımlılığa takılan testler açık bırakılır. Kanıt paketi: commit, ortam, fixture sürümü, test çıktısı, demo kaydı, reviewer ve açık Q bağlantıları. Faz çıkışı gerekiyorsa [kapı tutanağı](/docs/kabul-kapilari/) eklenir.

## Sprint içi çalışma

Gün 1: sözleşme/DoR ve sahiplik. Gün 2–7: GP kartlarını küçük dilimlerle uygula. Gün 8: entegrasyon/negatif senaryolar. Gün 9: UAT/doküman/release provası. Gün 10: demo ve kabul. Sağlayıcı cevabı gecikirse mock ve bağımsız işleri ilerlet; teyit gerektiren kabiliyeti canlıya açma.

## AI görev istemi

Aşağıdaki metin ilgili sprint bağlamını taşır; uygulama sırasında sıradaki tek GP kartına daralt. Kod bloklarının sağ üstündeki düğmeyle kopyalanabilir.

```text
S19 / Dokümantasyon ve geliştirici deneyimi sprintini uygula.
Önce mevcut repo, docs/mimari, docs/api-referansi, docs/odeme-akisi,
docs/test-stratejisi ve bu sprintin GP kartlarını oku.
Bağımlılık: S18. Teyit ihtiyacı: Geliştirici geri bildirimi ve arama verisi.
İş kartları: GP-191, GP-192, GP-193.
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

[S20 sprintine geç](/docs/sprint-20/).
