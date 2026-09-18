---
title: "S20 · Kurumsal kimlik ve erişim"
description: "Kurumsal rol matrisi ve kimlik kabul paketi."
group: "Sprintler"
---

## Sprint hedefi

Kurumsal rol matrisi ve kimlik kabul paketi. **Planlandı · henüz geliştirilmedi.** Faz 7: Enterprise grade. Süre 2 hafta; 10 geliştirme kişi-günü kapsam + 4 gün entegrasyon/review kapasitesi önerisi. [Kapasite varsayımları](/docs/kapsam/).

| Alan | Karar |
|---|---|
| Önkoşul | S19 ve ilgili kapının kanıtı |
| Birincil roller | BE + Güvenlik / IT |
| Dış bağımlılık | Kurumsal IdP, rol sahibi ve lifecycle beklentileri. |
| Teslim | Kurumsal rol matrisi ve kimlik kabul paketi. |

## İş kartları

### GP-201 · SSO ve MFA

**İş:** Onaylı OIDC/SAML yolunu seç; oturum, MFA ve acil erişim sürecini kur.

**Kabul:** MFA gerektiren rol bypass edilemez; acil erişim izlenir.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-202 · Görev ayrılığı

**İş:** İade talebi/onanması, export ve rol yönetimi yetkilerini ayır.

**Kabul:** Aynı kişi kendi yüksek riskli talebini onaylayamaz.

**Kaba tahmin:** 4 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

### GP-203 · Kullanıcı yaşam döngüsü

**İş:** İşten ayrılma ve erişim gözden geçirme; SCIM varsa sözleşme keşfi yap.

**Kabul:** Devre dışı kullanıcının oturumu iptal edilir; erişim matrisi sahiplidir.

**Kaba tahmin:** 3 geliştirme kişi-günü. Kart DoR sonrasında daha küçük PRlara bölünebilir.

## Sprint kabulü

Her GP kartının yukarıdaki kabul kriteri kanıtlanmalı. [Ortak Definition of Done](/docs/gelistirme-sureci/) uygulanır; [test matrisindeki](/docs/test-stratejisi/) ilgili senaryolar çalışır. Çalışmayan/dış bağımlılığa takılan testler açık bırakılır. Kanıt paketi: commit, ortam, fixture sürümü, test çıktısı, demo kaydı, reviewer ve açık Q bağlantıları. Faz çıkışı gerekiyorsa [kapı tutanağı](/docs/kabul-kapilari/) eklenir.

## Sprint içi çalışma

Gün 1: sözleşme/DoR ve sahiplik. Gün 2–7: GP kartlarını küçük dilimlerle uygula. Gün 8: entegrasyon/negatif senaryolar. Gün 9: UAT/doküman/release provası. Gün 10: demo ve kabul. Sağlayıcı cevabı gecikirse mock ve bağımsız işleri ilerlet; teyit gerektiren kabiliyeti canlıya açma.

## AI görev istemi

Aşağıdaki metin ilgili sprint bağlamını taşır; uygulama sırasında sıradaki tek GP kartına daralt. Kod bloklarının sağ üstündeki düğmeyle kopyalanabilir.

```text
S20 / Kurumsal kimlik ve erişim sprintini uygula.
Önce mevcut repo, docs/mimari, docs/api-referansi, docs/odeme-akisi,
docs/test-stratejisi ve bu sprintin GP kartlarını oku.
Bağımlılık: S19. Teyit ihtiyacı: Kurumsal IdP, rol sahibi ve lifecycle beklentileri.
İş kartları: GP-201, GP-202, GP-203.
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

[S21 sprintine geç](/docs/sprint-21/).
