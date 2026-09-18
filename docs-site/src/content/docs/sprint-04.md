---
title: "S04 · MVP kabulü ve kontrollü pilot"
description: "MVP sürüm paketi; G1 karar tutanağı ve pilot gözlem raporu."
group: "Sprintler"
---

## Sprint hedefi

MVP sürüm paketi; G1 karar tutanağı ve pilot gözlem raporu. **Planlandı · henüz geliştirilmedi.** Faz 1: MVP. Süre 2 hafta; 10 geliştirme kişi-günü kapsam + 4 gün entegrasyon/review kapasitesi önerisi. [Kapasite varsayımları](/docs/kapsam/).

| Alan | Karar |
|---|---|
| Önkoşul | S03 ve ilgili kapının kanıtı |
| Birincil roller | QA + TL + PO / Platform |
| Dış bağımlılık | G1 için satıcı aktivasyonu, üretim kimliği ve güvenlik mutabakatı. |
| Teslim | MVP sürüm paketi; G1 karar tutanağı ve pilot gözlem raporu. |

## İş kartları

### GP-041 · E2E ve UAT

**İş:** Doğrudan kart, 3DS, başarısız işlem, ağ kaybı, popup engeli ve yetkisiz satıcı senaryolarını çalıştır.

**Kabul:** TC01–TC16 kabul paketi geçer; unresolved P0/P1 yok; gerçek ödeme testi ayrı kontrollü UAT planında.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-042 · İşletim asgarisi

**İş:** Dashboard, korelasyon ID, callback gecikme alarmı, yedek ve geri alma yönergesi hazırla.

**Kabul:** Nöbet sorumlusu alarmı alır; yedekten test geri yükleme ve eski sürüme dönüş gösterilir.

**Kaba tahmin:** 4 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-043 · Go/no-go ve pilot

**İş:** G1 kanıtlarını topla; düşük limitli tek satıcı pilotu ve kill switch prosedürünü hazırla.

**Kabul:** PO/TL/operasyon onayı kayıtlı; kapı eksikse sürüm sandbox MVP olarak kalır.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

## Sprint kabulü

Her GP kartının yukarıdaki kabul kriteri kanıtlanmalı. [Ortak Definition of Done](/docs/gelistirme-sureci/) uygulanır; [test matrisindeki](/docs/test-stratejisi/) ilgili senaryolar çalışır. Çalışmayan/dış bağımlılığa takılan testler açık bırakılır. Kanıt paketi: commit, ortam, fixture sürümü, test çıktısı, demo kaydı, reviewer ve açık Q bağlantıları. Faz çıkışı gerekiyorsa [kapı tutanağı](/docs/kabul-kapilari/) eklenir.

## Sprint içi çalışma

Gün 1: sözleşme/DoR ve sahiplik. Gün 2–7: GP kartlarını küçük dilimlerle uygula. Gün 8: entegrasyon/negatif senaryolar. Gün 9: UAT/doküman/release provası. Gün 10: demo ve kabul. Sağlayıcı cevabı gecikirse mock ve bağımsız işleri ilerlet; teyit gerektiren kabiliyeti canlıya açma.

## AI görev istemi

Aşağıdaki metin ilgili sprint bağlamını taşır; uygulama sırasında sıradaki tek GP kartına daralt. Kod bloklarının sağ üstündeki düğmeyle kopyalanabilir.

```text
S04 / MVP kabulü ve kontrollü pilot sprintini uygula.
Önce mevcut repo, docs/mimari, docs/api-referansi, docs/odeme-akisi,
docs/test-stratejisi ve bu sprintin GP kartlarını oku.
Bağımlılık: S03. Teyit ihtiyacı: G1 için satıcı aktivasyonu, üretim kimliği ve güvenlik mutabakatı.
İş kartları: GP-041, GP-042, GP-043.
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

[S05 sprintine geç](/docs/sprint-05/).
