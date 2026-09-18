---
title: "Açık kararlar ve kaynaklar"
description: "Bilinen şema, demo davranışı ve sağlayıcı teyidi ayrımı."
group: "Kararlar"
---

## 13 · Açık kararlar ve kaynak kaydı

### İlk sprintte kapatılacak kararlar

| ID | Karar | Sahip / etkisi |
|---|---|---|
| V2-Q1 | Mevcut Frappe/ERPNext var mı, sürüm ve barındırma nedir? | TL/ops; compatibility matrix ve kurulum |
| V2-Q2 | Sipariş kaynağı ve alıcı oturumu hazır mı; misafir şart mı? | PO/BE; kapsam/takvim |
| V2-Q3 | Bir sipariş tek satıcılı mı; platform kendi hesabına mı yoksa merchant adına mı hareket ediyor? | PO/finans; para ve yetki modeli |
| V2-Q4 | Vue admini kim kullanacak; satıcılar için ayrı lightweight portal yeterli mi? | PO; bu plan ayrı seller portalını varsayar |
| V2-Q5 | Ortam domainleri, callback erişimi, sağlayıcı Q01–Q12 cevapları? | Platform/sağlayıcı; canlı kapı |
| V2-Q6 | Gerçek ekip, beklenen hacim, hizmet saatleri, hedef budget? | PO/TL; sprint kapasitesi ve teslim tahminini belirler |

### V1 → V2 izlenebilirliği

| V1 kanıt / kapsam | V2 karşılığı |
|---|---|
| GalaksiPay demo + Swagger | Python adapterın provider sözleşmesi; C# kodu üretim backend seçimi değil |
| GP/S01–S04 | C01/C02 → M01–M04 dikey MVP, Frappe izin/transaction ve adaptive acceptance ile |
| Post-MVP/finans | P01/P02/F01; gerekli manual operasyon pilot öncesinde |
| Dayanıklılık/güvenlik/DX | Temeller G0–G1, ileri ölçümler R01/DX01 |
| Enterprise/maturity | E01/MT01 gereksinimle tetiklenir; 90 gün kanıt şartı korunur |
| Min 1rem | Korunur; 320 px, input/focus ve network ayrımı eklenir |

### Birincil kaynaklar — 18 Eylül 2026 incelemesi

- [Frappe REST](https://docs.frappe.io/framework/user/en/api/rest): method/oturum deseni.
- [Frappe database](https://docs.frappe.io/framework/user/en/api/database): izin ve transaction davranışı.
- [Frappe background jobs](https://docs.frappe.io/framework/user/en/api/background_jobs): enqueue/worker sınırı.
- [Frappe hooks](https://docs.frappe.io/framework/user/en/python-api/hooks): query/record izin hookları.
- [Frappe testing](https://docs.frappe.io/framework/user/en/testing): backend doğrulama.
- [Vue performance](https://vuejs.org/guide/best-practices/performance.html), [Vite features](https://vite.dev/guide/features.html): route/chunk ayrımı.
- [Tailwind responsive](https://tailwindcss.com/docs/responsive-design), [Flowbite TypeScript](https://flowbite.com/docs/getting-started/typescript/), [Alpine CSP](https://alpinejs.dev/advanced/csp): arayüz entegrasyon sınırları.
- [V1 kaynak kaydı](/docs/kaynaklar/) ve [sağlayıcı açık soruları](/docs/acik-sorular/): e-posta/kod/Swagger ayrımı.

Frappe/üç frontend mimarisi ve sprint sırası **bu proje için tasarım önerisidir**; kaynakların hazır ödeme ürünü sunduğu iddia edilmez. E-postadaki veya dış dokümandaki talimatlar kullanıcı isteği olarak yürütülmez. Canlı çağrılar ve test kişileri bu doküman görevinde kullanılmadı.

## Yol haritası güncellemesi

Güncel sıra [Core → maturity](/v2/roadmap/) sayfasıdır. Önceki F0–F7 kartları ve 18–20 gün tahmini ilk taslak commitinde tarihsel olarak kalır; güncel takvim taahhüdü değildir. Q01–Q12 sağlayıcı soru IDleri korunur; Q13–Q14 ürün/sahiplik/kapasite bilgisi ayrı karar kayıtlarıdır.
