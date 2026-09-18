---
title: "S08 · İade ve iptal iş kuralları"
description: "Sağlayıcı teyitli iade/iptal akışı veya kapalı feature flag ve blokaj kaydı."
group: "Sprintler"
---

## Sprint hedefi

Sağlayıcı teyitli iade/iptal akışı veya kapalı feature flag ve blokaj kaydı. **Planlandı · henüz geliştirilmedi.** Faz 3: Finansal operasyon. Süre 2 hafta; 10 geliştirme kişi-günü kapsam + 4 gün entegrasyon/review kapasitesi önerisi. [Kapasite varsayımları](/docs/kapsam/).

| Alan | Karar |
|---|---|
| Önkoşul | S07 ve ilgili kapının kanıtı |
| Birincil roller | BE + Finans / QA |
| Dış bağımlılık | Q07 Refund/Void yetkisi, AccessToken anlamı, zaman pencereleri. |
| Teslim | Sağlayıcı teyitli iade/iptal akışı veya kapalı feature flag ve blokaj kaydı. |

## İş kartları

### GP-081 · Sözleşmeyi kapat

**İş:** Refund/Void için token, tutar, tam/kısmi kapsam ve nihai sonuç sorgusunu teyit et.

**Kabul:** Kısmi iade desteği kanıt yoksa arayüzde yer almaz; onaylı test fixtureı mevcut.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-082 · Kontrollü talep modeli

**İş:** İade niyeti, yetki, gerekçe ve idempotency anahtarını kaydet; onay mekanizmasını tasarla.

**Kabul:** İade toplamı ödenmiş tutarı aşamaz; iki eşzamanlı talep sınırı aşamaz.

**Kaba tahmin:** 4 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-083 · Sandbox yürütme

**İş:** Tam iade veya iptal için doğrulanmış adaptör ve pending sonucu uygula.

**Kabul:** Timeout yeni iade oluşturmaz; finans sonucu sorgu/uzlaşma ile kesinleştirir.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

## Sprint kabulü

Her GP kartının yukarıdaki kabul kriteri kanıtlanmalı. [Ortak Definition of Done](/docs/gelistirme-sureci/) uygulanır; [test matrisindeki](/docs/test-stratejisi/) ilgili senaryolar çalışır. Çalışmayan/dış bağımlılığa takılan testler açık bırakılır. Kanıt paketi: commit, ortam, fixture sürümü, test çıktısı, demo kaydı, reviewer ve açık Q bağlantıları. Faz çıkışı gerekiyorsa [kapı tutanağı](/docs/kabul-kapilari/) eklenir.

## Sprint içi çalışma

Gün 1: sözleşme/DoR ve sahiplik. Gün 2–7: GP kartlarını küçük dilimlerle uygula. Gün 8: entegrasyon/negatif senaryolar. Gün 9: UAT/doküman/release provası. Gün 10: demo ve kabul. Sağlayıcı cevabı gecikirse mock ve bağımsız işleri ilerlet; teyit gerektiren kabiliyeti canlıya açma.

## AI görev istemi

Aşağıdaki metin ilgili sprint bağlamını taşır; uygulama sırasında sıradaki tek GP kartına daralt. Kod bloklarının sağ üstündeki düğmeyle kopyalanabilir.

```text
S08 / İade ve iptal iş kuralları sprintini uygula.
Önce mevcut repo, docs/mimari, docs/api-referansi, docs/odeme-akisi,
docs/test-stratejisi ve bu sprintin GP kartlarını oku.
Bağımlılık: S07. Teyit ihtiyacı: Q07 Refund/Void yetkisi, AccessToken anlamı, zaman pencereleri.
İş kartları: GP-081, GP-082, GP-083.
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

[S09 sprintine geç](/docs/sprint-09/).
