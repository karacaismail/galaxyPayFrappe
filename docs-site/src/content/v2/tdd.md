---
title: "Test first / TDD çalışma sözleşmesi"
description: "Her dilimde RED → GREEN → REFACTOR; mock, integration ve sandbox kanıtları ayrı."
group: "Test & kalite"
---

## Döngü

**RED:** kullanıcı davranışını ihlal eden bir test yaz; neden başarısız olduğunu gör. Import/syntax hatası yerine hedef davranışın eksikliği ölçülmeli; yeni modülde ilk scaffold hatası geçince davranış assertionının da kırmızı olduğu görülür. **GREEN:** yalnız testi geçiren en küçük domain/adapter/UI değişikliği. **REFACTOR:** davranışı koruyarak tekrarları/sınırları düzenle; aynı test paketi yeniden yeşil. Testi uygulamadan sonra eklemek test-first değildir.

Her PR: senaryo ID → kırmızı test adı/logu → küçük diff → yeşil test → gerekiyorsa refactor → reviewer. Kullanıcı yolunu bitiren küçük dikey dilim; ilk hedef daha çok dosya üretmek değildir.

## Test katmanı seçimi

| Katman | Ne sınanır? | Gerçek bağımlılık | Ne kanıtlamaz? |
|---|---|---|---|
| Unit | Para, durum geçişi, hata sınıflaması | Saf fonksiyon | DB kilidi, banka kabulü |
| Contract | Endpoint/body/DTO/parser, schema drift | Sabit OpenAPI + redakte fixture | Hesap yetkisi, sağlayıcı idempotency garantisi |
| Integration | Unique intent, business effect, izin, commit/rollback | Frappe test sitesi + MariaDB; Redis gerektiğinde | Hosted 3DS ekranı |
| Fault injection | Add sonrası crash, queue gap, DB hatası | Gerçek transaction + kontrollü provider stub | Gerçek sağlayıcının kesinti SLA’sı |
| Browser E2E | Buyer/seller/ops akışı, 320 yükleme, focus | Production frontend + test backend/mock | Gerçek banka sonucu |
| Sandbox UAT | Test kartı/cüzdan/3DS ve callback roundtrip | Yetkili gerçek test sağlayıcısı | Üretim limit/performans garantisi |
| Operasyon | Restore, rollback, alarm, revoke | İzole staging, yedek ve sahipli tatbikat | Dış sertifikasyon |

## Örnek: tek mali etki

Aşağıdaki Python test sözleşmesi **uygulanacak Frappe test modülü için şablondur; bu repoda çalışır backend testi değildir**. `seed_order`, `deliver_verified_callback` ve `count_effects` C01/M02 test yardımcıları olarak yazılacaktır.

```python
def test_callback_duplicate_has_one_effect(self):
    order = self.seed_order(amount_minor=12550, seller="seller-a")
    event = self.verified_callback(order)
    self.deliver_verified_callback(event)
    self.deliver_verified_callback(event)
    self.assertEqual(self.count_effects(order), 1)
```

RED: iki teslim iki etki ürettiğinde `2 != 1`. GREEN: event hashine tek başına güvenmeden business effect unique constrainti ve atomik transaction. REFACTOR: callback doğrulama ve domain uygulamasını ayır. Ardından **iki ayrı DB bağlantısıyla gerçek eşzamanlı** varyantı çalıştır; ardışık örnek yarış testi yerine geçmez.

## Çalıştırma matrisi

| Komut / iş | Durum | Beklenen kullanım |
|---|---|---|
| `npm run test:docs` | Bu repoda uygulanmış | Test kartı kaynağı, kritik DX sayfaları, roadmap test kapsamı, endpoint/schema referansları |
| `npm run verify` | Bu repoda uygulanmış | Yukarıdaki testler + Astro/TS + statik build + link/asset kontrolleri |
| `bench --site <test-site> run-tests --app galaxy_pay` | Frappe app kurulduğunda | Backend unit/integration; modül yolları seçilen sürümde doğrulanır |
| `test:contract`, `test:e2e`, `test:mobile-network` | C02’de kurulacak hedef görevler | CI provider fixture ve production frontend işleri |
| Sandbox UAT | Manuel/korumalı iş | Sağlayıcı hesabı, test kartı ve gerçek callback; normal PR CI’da otomatik tahsilat yok |

[Frappe test rehberi](https://docs.frappe.io/framework/user/en/testing). Test siteyi üretimden ayır; CI seedleri gerçek alıcı/satıcı verisi içermez.

## Coverage ve çıkış ölçüsü

Para, idempotency, auth/record izinleri ve durum geçişlerinde tanımlı tüm olumlu/olumsuz invariantlar test edilir. Satır yüzdesi tek geçiş kapısı değildir. DB concurrency, crash ve provider bozuk yanıt testleri olmadan yüksek unit coverage “hazır” anlamına gelmez. Kritik mutasyon örnekleri: unique constrainti kaldırınca duplicate testi; ownership filtresini kaldırınca isolation testi kırılmalı.

## Kanıt kaydı

```text
Test ID / senaryo ID / commit / ortam / seed-fixture SHA
RED: hangi assertion neden başarısız?
GREEN: gerçek komut, çıkış kodu, rapor yolu
REFACTOR: davranış korundu mu?
Sandbox: not-run | blocked | passed | failed; UAT run ve maskeli referans
Reviewer / açık Q / rollback
```

Bu doküman güncellemesinde 5 DX sözleşme testi önce eksik dosya/veri nedeniyle kırmızı çalıştırıldı. Bunlar doküman kabul testleridir; ödeme domaininin TDD ile uygulanmış olduğu iddia edilmez. [Güncel test matrisi ve sprint çıktıları](/v2/roadmap/).
