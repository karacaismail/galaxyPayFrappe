---
title: "S16 · Denetim ve yazılım tedarik zinciri"
description: "G5 yönetişim kapısı ve denetlenebilir sürüm kanıtı."
group: "Sprintler"
---

## Sprint hedefi

G5 yönetişim kapısı ve denetlenebilir sürüm kanıtı. **Planlandı · henüz geliştirilmedi.** Faz 5: Güvenlik & yönetişim. Süre 2 hafta; 10 geliştirme kişi-günü kapsam + 4 gün entegrasyon/review kapasitesi önerisi. [Kapasite varsayımları](/docs/kapsam/).

| Alan | Karar |
|---|---|
| Önkoşul | S15 ve ilgili kapının kanıtı |
| Birincil roller | Güvenlik + Platform / TL |
| Dış bağımlılık | Denetim kapsamı ve kanıt deposu. |
| Teslim | G5 yönetişim kapısı ve denetlenebilir sürüm kanıtı. |

## İş kartları

### GP-161 · Audit bütünlüğü

**İş:** Rol, ödeme, iade, config ve export olaylarını erişimi sınırlı depoda sakla.

**Kabul:** Yetkisiz silme/değişiklik testleri başarısız; hassas gövde audit içine taşınmaz.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-162 · Build provenance

**İş:** SBOM, bağımlılık/lisans taraması ve imzalı artifact akışını kur.

**Kabul:** Deploy edilen artifact commit ve CI çalışmasına kadar izlenebilir.

**Kaba tahmin:** 4 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-163 · Kontrol kanıtları

**İş:** Erişim gözden geçirme, secret rotasyon ve değişiklik kanıtlarını birleştir.

**Kabul:** G5 kontrol sahipleri kabul verir; sertifikasyon iddiası yapılmaz.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

## Sprint kabulü

Her GP kartının yukarıdaki kabul kriteri kanıtlanmalı. [Ortak Definition of Done](/docs/gelistirme-sureci/) uygulanır; [test matrisindeki](/docs/test-stratejisi/) ilgili senaryolar çalışır. Çalışmayan/dış bağımlılığa takılan testler açık bırakılır. Kanıt paketi: commit, ortam, fixture sürümü, test çıktısı, demo kaydı, reviewer ve açık Q bağlantıları. Faz çıkışı gerekiyorsa [kapı tutanağı](/docs/kabul-kapilari/) eklenir.

## Sprint içi çalışma

Gün 1: sözleşme/DoR ve sahiplik. Gün 2–7: GP kartlarını küçük dilimlerle uygula. Gün 8: entegrasyon/negatif senaryolar. Gün 9: UAT/doküman/release provası. Gün 10: demo ve kabul. Sağlayıcı cevabı gecikirse mock ve bağımsız işleri ilerlet; teyit gerektiren kabiliyeti canlıya açma.

## AI görev istemi

Aşağıdaki metin ilgili sprint bağlamını taşır; uygulama sırasında sıradaki tek GP kartına daralt. Kod bloklarının sağ üstündeki düğmeyle kopyalanabilir.

```text
S16 / Denetim ve yazılım tedarik zinciri sprintini uygula.
Önce mevcut repo, docs/mimari, docs/api-referansi, docs/odeme-akisi,
docs/test-stratejisi ve bu sprintin GP kartlarını oku.
Bağımlılık: S15. Teyit ihtiyacı: Denetim kapsamı ve kanıt deposu.
İş kartları: GP-161, GP-162, GP-163.
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

[S17 sprintine geç](/docs/sprint-17/).
