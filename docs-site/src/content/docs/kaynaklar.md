---
title: "Kaynaklar ve izlenebilirlik"
description: "Hangi kararın hangi kanıta dayandığını izle."
group: "Başlangıç"
---

## Kaynaklar

- **SRC01 · Kullanıcı yazışması:** 17 Eylül 2026 demo paylaşımı; 18/26/31 Ağustos mesajları. Ödeme linki, callback, PaymentId, SubMerchantId, test ve §2.3 bağımlılığı. Metin kullanıcı tarafından sağlandı.
- **SRC02 · Yerel demo:** `GalaksipayDemo/Galaksipay.Demo`, 18 Eylül 2026 statik inceleme. Controller, service, models, Program, view ve migration envanteri.
- **SRC03 · Test OpenAPI:** [ham şema](https://testapi.galaksipay.com/galaksipay/swagger/v1/swagger.json), 18 Eylül 2026 HTTP 200. Şema alanları/yolları doğrulandı; kimlik doğrulama ve ödeme çalıştırılmadı. [Seçilmiş snapshot](/downloads/provider-contract.json).
- **SRC04 · Ekran görüntüleri:** e-posta tarihi ve demo klasör yapısı için bağlam; eklerin içeriklerinin yerine geçmez.
- **SRC05 · Astro:** [kurulum](https://docs.astro.build/en/install-and-setup/), 18 Eylül 2026. Uygulanan sürüm package-lock ile sabit.
- **SRC06 · Güvenlik referansı:** [OWASP REST](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html), teknik kontrol rehberi.
- **SRC07 · PCI değerlendirme başlangıcı:** [PCI SSC merchant kaynakları](https://www.pcisecuritystandards.org/merchants/), kapsam teyidi için.
- **SRC08 · Erişilebilirlik:** [WCAG 2.2](https://www.w3.org/TR/WCAG22/), kalite hedefi için.

## İhtiyaç → iş → kanıt

| İhtiyaç | Kaynak | Sprint / test |
|---|---|---|
| Ödeme linki oluştur/aç | SRC01/02/03 | S02 / TC01, TC04, TC15 |
| Callback POST al | SRC01/02 | S03 / TC06–TC10, TC12 |
| PaymentId ile ayrıca sorgula | SRC01/03 | S03 / Q02 + TC08 |
| Sub-merchant listele ve yönlendir | SRC01/02/03 | S02, S05 / TC14 |
| Satıcı §2.3 bilgilerini temin et | SRC01; asıl belge eksik | S01 talep, S05 / Q10 |
| Cüzdan ve doğrudan kart | SRC01/02 | S04, S06 / ayrı UAT |
| İade ve iptal | SRC03; ürün önerisi | S08 / Q07 |
| Astro ve min 1rem | Kullanıcı talebi | Bu portal; S19 ürün DX genişlemesi |
| Vibecoding sprint akışı | Kullanıcı talebi | AI playbook + her sprint istemi |
| Enterprise / maturity | Kullanıcı talebi; proje önerisi | S20–S25 / G7, G8 |

## Bilinen eksikler

Entegrasyon dokümanının asıl eki, sağlayıcı üretim sözleşmesi, erişim/limit/SLA bilgileri, gerçek satıcı tanımları ve mevcut iş uygulaması kaynakları yok. Plan bunları açık bağımlılık olarak taşır. Roadmap kapsamı mevcut kanıtlarla olabildiğince tamamlandı; bilinmeyen sağlayıcı davranışları kesin bilgi gibi yazılmadı.

## Güncelleme disiplini

API snapshot ve dokümanlar değişen sözleşmeyle aynı PRda güncellenir. Her Q cevabı kaynak/tarih taşır; her release kapısı kanıta bağlanır. Roadmap verisinin tek kaynağı `src/data/roadmap.json`; sprint sayfalarının güncellenmesinde aynı ID/tarih korunur. İndirilebilir Markdown build sırasında mevcut içerikten üretilir.
