---
title: "S18 · SDK, mock ve golden path"
description: "Golden path paketi ve ölçülen onboarding süresi."
group: "Sprintler"
---

## Sprint hedefi

Golden path paketi ve ölçülen onboarding süresi. **Planlandı · henüz geliştirilmedi.** Faz 6: Platform & DX. Süre 2 hafta; 10 geliştirme kişi-günü kapsam + 4 gün entegrasyon/review kapasitesi önerisi. [Kapasite varsayımları](/docs/kapsam/).

| Alan | Karar |
|---|---|
| Önkoşul | S17 ve ilgili kapının kanıtı |
| Birincil roller | DX + BE + QA |
| Dış bağımlılık | Desteklenecek tüketici dilleri ve ekip ihtiyacı. |
| Teslim | Golden path paketi ve ölçülen onboarding süresi. |

## İş kartları

### GP-181 · İstemci paketi

**İş:** Onaylı iç API için tipli istemci, hata tipleri ve örnek kod üret.

**Kabul:** Örnekler gerçek CI içinde derlenir; secret istemci SDKya girmez.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-182 · Senaryo sunucusu

**İş:** Başarı, gecikme, timeout, duplicate ve kötü şema fixturelarını paketle.

**Kabul:** Mock deterministiktir; gerçek API eşitliği contract testleriyle sınırlı olarak gösterilir.

**Kaba tahmin:** 4 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-183 · Tek komut deneyimi

**İş:** Kurulum, seed, test ve temizleme görevlerini standartlaştır.

**Kabul:** Yeni geliştirici ≤30 dk içinde ilk mock akışı tamamlar ve kanıtlar.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

## Sprint kabulü

Her GP kartının yukarıdaki kabul kriteri kanıtlanmalı. [Ortak Definition of Done](/docs/gelistirme-sureci/) uygulanır; [test matrisindeki](/docs/test-stratejisi/) ilgili senaryolar çalışır. Çalışmayan/dış bağımlılığa takılan testler açık bırakılır. Kanıt paketi: commit, ortam, fixture sürümü, test çıktısı, demo kaydı, reviewer ve açık Q bağlantıları. Faz çıkışı gerekiyorsa [kapı tutanağı](/docs/kabul-kapilari/) eklenir.

## Sprint içi çalışma

Gün 1: sözleşme/DoR ve sahiplik. Gün 2–7: GP kartlarını küçük dilimlerle uygula. Gün 8: entegrasyon/negatif senaryolar. Gün 9: UAT/doküman/release provası. Gün 10: demo ve kabul. Sağlayıcı cevabı gecikirse mock ve bağımsız işleri ilerlet; teyit gerektiren kabiliyeti canlıya açma.

## AI görev istemi

Aşağıdaki metin ilgili sprint bağlamını taşır; uygulama sırasında sıradaki tek GP kartına daralt. Kod bloklarının sağ üstündeki düğmeyle kopyalanabilir.

```text
S18 / SDK, mock ve golden path sprintini uygula.
Önce mevcut repo, docs/mimari, docs/api-referansi, docs/odeme-akisi,
docs/test-stratejisi ve bu sprintin GP kartlarını oku.
Bağımlılık: S17. Teyit ihtiyacı: Desteklenecek tüketici dilleri ve ekip ihtiyacı.
İş kartları: GP-181, GP-182, GP-183.
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

[S19 sprintine geç](/docs/sprint-19/).
