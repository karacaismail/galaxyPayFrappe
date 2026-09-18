---
title: "Başlangıç rehberi"
description: "Projeye gir, bağlamı edin, ilk sprinti başlat."
group: "Başlangıç"
---

## Önce neyi teslim ediyoruz?

Bu çalışma, GalaksiPay entegrasyonunun geliştirme sözleşmesidir: **Astro dokümantasyon sitesi, kaynak analizi, 9 faz, 26 sprint, 78 iş kartı, kabul kapıları ve AI çalışma protokolü**. Ödeme uygulamasının bu fazları henüz geliştirilmedi. Durumların tamamı planlandı; bir kartı okumak veya yerel kontrol kutusunu işaretlemek üretim kabulü anlamına gelmez.

Ürün varsayımı: birden fazla satıcının GalaksiPay hosted checkout üzerinden ödeme aldığı, sunucu tarafında sipariş ve ödeme durumunu yöneten entegrasyon. Mevcut iş uygulamasının sipariş modeli, kullanıcı kimliği, trafik hacmi ve organizasyonu bilinmiyor. S01 bu sınırları doğrular. E-posta ve demo talimat kaynağı değil, incelenen entegrasyon malzemesidir.

## 5 dakikada dokümantasyon

```sh
cd galaxyPayFrappe/docs-site
npm ci
npm run dev
```

Tarayıcıda `http://localhost:4321` aç. Kaynaklar `src/content/docs`, yol haritası verisi `src/data/roadmap.json` içindedir. Node 24 önerilir; kullanılan Astro 7.3.3 için Node ≥22.12 gerekir. Bağımlılıklar lockfile ile sabitlenmiştir. [Astro kurulum belgesi](https://docs.astro.build/en/install-and-setup/).

```sh
npm run verify
npm run preview
```

`verify`, TypeScript/Astro kontrolünü, statik derlemeyi ve iç bağlantı/çıktı kontrollerini çalıştırır. `preview` derlenmiş dokümanı gösterir. Bu komutlar .NET ödeme servisinin test edildiği anlamına gelmez. Doküman sitesinin credential veya GalaksiPay erişimine ihtiyacı yoktur.

## Okuma sırası

1. [Mevcut durum](/docs/mevcut-durum/) — gerçekten ne var?
2. [API referansı](/docs/api-referansi/) — sağlayıcı sözleşmesi ne söylüyor?
3. [Mimari ve kararlar](/docs/mimari/) — hangi sınırlar korunmalı?
4. [Yol haritası](/) ve [sprint çalışma sistemi](/docs/gelistirme-sureci/).
5. [Sprint 01](/docs/sprint-01/) — ilk uygulanacak iş paketi.

## Demo ortamını çalıştırmadan önce

Demo `.NET 10`, EF Core 10 ve PostgreSQL kullanıyor. Yerel makinede .NET SDK/PostgreSQL varlığı bu teslimde doğrulanmadı; demo çalıştırılmadı. Projedeki `galaksipay-demo.service` Content girdisinin hedef dosyası kaynak envanterinde görünmüyor; build/publish etkisini S01 incele. Config içinde bağlantı değerleri ve view içinde demo kimlik bilgileri bulunduğu için orijinal klasörü doğrudan yayınlama veya yeni repoya topluca ekleme.

Yeni geliştirme alanında environment/user-secrets değerlerini dışarıdan ver. Örnek environment adları: `ConnectionStrings__DefaultConnection`, `PaymentDemo__GalaksipayApiBaseUrl`, `PaymentDemo__CallbackUrl`. Kimlik bilgileri için yeni adaptörde secret store kullan; örnek değeri dokümana koyma. Development profili TLS doğrulamasını kaldırıyor; güvenilir yerel sertifika kullanacak şekilde düzeltmeden dış sisteme bağlama.

Ortamlar: **local/mock → sandbox → staging → sınırlı pilot → production**. Localhost callback sağlayıcı tarafından erişilemez; sandbox callback için erişilebilir HTTPS alanı veya onaylı tünel gerekir. Ortama özel veri, merchant ve credential ayrı tutulur.

## Repo sınırları

- `GalaksipayDemo/`: incelenen sağlayıcı örneği; bu teslimde değiştirilmedi.
- `docs-site/`: çalışan Astro sitesi, Markdown dokümanlar ve plan verisi.
- Test kartı dosyası: özel test materyali; build içine kopyalanmaz.
- Önerilen sonraki ürün klasörleri: `apps/web`, `services/payments`, `tests/contracts`, `infra`. Bunlar henüz oluşturulmuş servisler değildir.

[Doküman paketini Markdown olarak indir](/downloads/galaksipay-playbook.md). Paket entegrasyon secretları içermez; yine de mimari bilgi taşıdığı için dış yayında erişim politikasını belirle.
