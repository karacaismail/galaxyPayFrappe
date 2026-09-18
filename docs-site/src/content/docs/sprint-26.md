---
title: "S26 · Ölçüme dayalı yeni döngü"
description: "Deney raporu ve güncellenmiş çeyrek planı."
group: "Sprintler"
---

## Sprint hedefi

Deney raporu ve güncellenmiş çeyrek planı. **Planlandı · henüz geliştirilmedi.** Faz 9: Sürekli gelişim. Süre 2 hafta; 10 geliştirme kişi-günü kapsam + 4 gün entegrasyon/review kapasitesi önerisi. [Kapasite varsayımları](/docs/kapsam/).

| Alan | Karar |
|---|---|
| Önkoşul | S25 ve ilgili kapının kanıtı |
| Birincil roller | PO + TL + ilgili ekip |
| Dış bağımlılık | Kullanıcı geri bildirimi, maliyet ve hata verisi. |
| Teslim | Deney raporu ve güncellenmiş çeyrek planı. |

## İş kartları

### GP-261 · Hipotez seçimi

**İş:** Bir kullanıcı sorunu ve ölçülebilir deney seç; çoklu sağlayıcı/taksit gibi opsiyonları kanıta göre sırala.

**Kabul:** Beklenen değer, kapsam dışı ve durdurma eşiği kayıtlı.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-262 · Küçük dilim teslimi

**İş:** Feature flag ile sınırlı kullanıcı grubunda geri alınabilir değişim yayınla.

**Kabul:** Finansal doğruluk ve security gate korunur; rollout ölçümü var.

**Kaba tahmin:** 4 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-263 · Öğrenme ve yeniden plan

**İş:** Sonuçları değerlendir; teknik borç için kapasite ayır; sonraki 2 sprinti güncelle.

**Kabul:** Başarısız hipotez kapatılabilir; sonraki işler aynı DoR/DoD ile hazır.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

## Sprint kabulü

Her GP kartının yukarıdaki kabul kriteri kanıtlanmalı. [Ortak Definition of Done](/docs/gelistirme-sureci/) uygulanır; [test matrisindeki](/docs/test-stratejisi/) ilgili senaryolar çalışır. Çalışmayan/dış bağımlılığa takılan testler açık bırakılır. Kanıt paketi: commit, ortam, fixture sürümü, test çıktısı, demo kaydı, reviewer ve açık Q bağlantıları. Faz çıkışı gerekiyorsa [kapı tutanağı](/docs/kabul-kapilari/) eklenir.

## Sprint içi çalışma

Gün 1: sözleşme/DoR ve sahiplik. Gün 2–7: GP kartlarını küçük dilimlerle uygula. Gün 8: entegrasyon/negatif senaryolar. Gün 9: UAT/doküman/release provası. Gün 10: demo ve kabul. Sağlayıcı cevabı gecikirse mock ve bağımsız işleri ilerlet; teyit gerektiren kabiliyeti canlıya açma.

## AI görev istemi

Aşağıdaki metin ilgili sprint bağlamını taşır; uygulama sırasında sıradaki tek GP kartına daralt. Kod bloklarının sağ üstündeki düğmeyle kopyalanabilir.

```text
S26 / Ölçüme dayalı yeni döngü sprintini uygula.
Önce mevcut repo, docs/mimari, docs/api-referansi, docs/odeme-akisi,
docs/test-stratejisi ve bu sprintin GP kartlarını oku.
Bağımlılık: S25. Teyit ihtiyacı: Kullanıcı geri bildirimi, maliyet ve hata verisi.
İş kartları: GP-261, GP-262, GP-263.
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

S26 döngüsünü gerçek ölçümlerle yeniden planla; yeni deney kartlarına ayrı ID ver.
