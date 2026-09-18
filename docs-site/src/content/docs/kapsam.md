---
title: "Ürün kapsamı ve başarı ölçütleri"
description: "MVP sınırı, kullanıcılar, varsayımlar ve maliyet modeli."
group: "Başlangıç"
---

## Ürün hedefi

Yetkili bir satıcı için ödeme oluştur; müşteriyi GalaksiPay ödeme sayfasına yönlendir; sonucu güvenilir biçimde siparişe işle; belirsiz ve başarısız durumları operasyonun çözebileceği şekilde izle. İlk sürüm **hosted checkout** yaklaşımıyla kart verisini bizim UI/API katmanımızdan uzak tutar.

## Kullanıcılar ve temel işler

| Rol | Yapacağı iş | Başarı kanıtı |
|---|---|---|
| Müşteri | Öde, geri dön, sonucu öğren | İki kez tıklama tek attempt; yenileme doğru sonucu gösterir |
| Satıcı | Kendi ödemelerini gör | Başka satıcı/tenant işlemi erişilemez |
| Destek | Sonucu araştır | Korelasyon ve sağlayıcı ID ile takip edilebilir |
| Finans | İade, fark ve dönem raporu | Onay, tutar sınırı ve kaynak eşleşmesi |
| Geliştirici | Akışı yerelde üret, küçük değişiklik teslim et | Mock, contract, test ve docs tek görevde |
| Operasyon | Kesinti ve gecikme yönet | Alarm sahibi, kill switch ve restore kanıtı |

## Faz 1 kapsamı

Dahil: sipariş sahibi doğrulama; sunucu tutar hesabı; merchant izin kontrolü; idempotent start; PaymentUrl allowlist; hosted ödeme; kalıcı inbox; doğrulanmış durum sorgusu; UI pending/success/failure/review; basit reconciliation; maskeli gözlemlenebilirlik; CI testleri; pilot runbook; geri yükleme provası.

Kapsam dışı: bizim kart saklamamız, kendi cüzdanımız, çoklu ödeme sağlayıcı yönlendirmesi, abonelik, otomatik parçalı dağıtım, kredi verme, çoklu para birimi, gelişmiş BI ve müşteri destek sistemi inşası. Bunlar gelecekte doğrulanmış ihtiyaç ve sağlayıcı desteği ile ele alınır. MVP iade otomasyonu içermez; canlı pilot öncesi sağlayıcı/finans üzerinden kontrollü manuel iade sorumlusu ve prosedürü gerekir.

## Varsayımlar ve karar ihtiyacı

- **A01**: Hosted checkout + tek ödeme sağlayıcı. Ürün sahibi S01 sonunda onaylar.
- **A02**: Sipariş başına tek satıcı/tek para birimi (TRY önerisi). Çok satıcılı sepet varsa ödeme parçalama/atomiklik yeniden tasarlanır.
- **A03**: Mevcut .NET bilgisinden yararlanmak için yeni payment backend .NET 10 + PostgreSQL. Astro bu teslimde dokümantasyon katmanıdır; ödeme backendini statik siteye taşımıyoruz.
- **A04**: Kullanıcı/tenant kimliği mevcut iş uygulamasından güvenilir sunucu oturumu ile gelir; uygulama yoksa kimlik epic’i S01 planına eklenir ve tahmin yenilenir.
- **A05**: 2 tam zamanlı geliştirici + 0,5 QA + 0,25 Platform + 0,25 PO; finans/güvenlik/hukuk konu bazlı katkı verir. Bir kişi çalışacaksa bu takvim geçerli değildir.

## Takvim ve kapasite

Sprint = 2 hafta. 2 geliştirici × 10 iş günü × %70 odak = yaklaşık **14 geliştirme kişi-günü**. Her sprint 3 iş kartı için toplam 10 kişi-gün kaba geliştirme tahmini, 4 gün entegrasyon/review payı içerir. QA, platform, iş sahibi zamanı bu geliştirme puanlarına dahil değildir. Hastalık, resmi tatil ve sağlayıcı bekleme süresi ayrıca eklenir.

MVP 4 sprint / 8 hafta; ilk olgunluk değerlendirmesi S25 / 50 hafta; ilk sürekli gelişim döngüsüyle plan 26 sprint / 52 hafta. Bu bir taahhüt değildir. S02 ve S04 sonunda gerçek çevrim süresiyle yeniden tahmin edilir. S23–S25 için 90 günlük ölçüm penceresi dolmadıysa olgunluk kapısı ileri kayar.

## Başarı ölçütleri

MVP: kritik akış testlerinin %100 geçmesi; yinelenen callbackte 0 çift iş etkisi; yetkisiz merchant testlerinde 0 erişim; ödenmiş siparişi yanlış geriye götüren 0 geçiş; açık P0/P1 = 0. Gerçek ödeme dönüşüm oranı sağlayıcı/banka/UX etkileriyle ölçülür, sabit başarı oranı vaat edilmez.

Sonraki hedefler öneridir: iç durum API p95 ≤500 ms; hizmet SLO %99,9; RPO ≤15 dk / RTO ≤60 dk; yeni geliştirici ilk mock akışı ≤30 dk. Ölçüm kapsamları [operasyon](/docs/operasyon/) ve [kabul kapıları](/docs/kabul-kapilari/) sayfalarında tanımlıdır.
