---
title: "Alıcı, satıcı ve platform"
description: "Ekran, yetki, hata ve kabul davranışları."
group: "Ürün akışları"
---

## 03 · Alıcının senaryoları

| ID / aşama | Tetikleyici ve ekran | Sunucu davranışı | Kabul / istisna |
|---|---|---|---|
| B01 · MVP | Kimliği doğrulanmış alıcı sipariş linkini açar | Sahiplik, aktif satıcı, fiyat/sipariş sürümü okunur | Başkasının siparişini ID değiştirerek açamaz |
| B02 · MVP | 320 px sipariş özeti, tutar, satıcı ve ödeme eylemi | Tutar kaynağı backend; istemci amount alanı kabul edilmez | Uzun satıcı adı, 200% zoom ve ekran klavyesi eylemi kapatmaz |
| B03 · MVP | Öde’ye dokunur, iki sekmede tekrarlar | Aynı sipariş/version için tek aktif attempt + idempotency | Tek Add etkisi; aynı key farklı gövde conflict |
| B04 · MVP | Hosted checkout / 3DS’ye geçer | PaymentUrl hostu allowlistten; URL tokenı loglanmaz | Mobilde aynı sekme yönlendirme varsayılan; popup tek seçenek değildir |
| B05 · MVP | Bankadan döner veya sayfayı yeniler | Kendi backend durumunu okur; provider sorgusu server-side | Return URL / postMessage paid kanıtı değildir |
| B06 · MVP | Sonuç gecikir, internet kesilir, sekme kapanır | PENDING / UNKNOWN korunur, scheduler sorgular | Tekrar tahsilata yönlendirme yok; destek referansı ve yeniden kontrol |
| B07 · MVP | Kesin başarı veya kesin red | Eşleşen provider kanıtı sonrası tek sipariş etkisi | Bildirim hatası ödemeyi geri almaz; gerçek başarısızlık ayrı yeni attempt |
| B08 · MVP sonrası | Kayıtlı kart/cüzdan ile öder | Sağlayıcı cüzdan akışı; bizim sistem PAN/CVV tutmaz | Yetkili test hesabıyla ayrı UAT; hesap yoksa doğrudan kart |
| B09 · MVP sonrası | Ödeme geçmişi ve iade talebi | Sadece kendi siparişleri; iade talebi finans onayına gider | İade isteği anında banka iadesi gibi gösterilmez |
| B10 · Koşullu | Misafir alıcı linkten öder | Kısa ömürlü, tek kapsamlı, iptal edilebilir checkout oturumu tasarlanır | UUID bilmek yetki değildir; oturum modeli test edilmeden guest açılmaz |

MVP kullanıcı yolculuğu: **sipariş özeti → sağlayıcı ödeme sayfası → doğrulanıyor → sonuç**. Ad/soyad/telefon yalnızca sağlayıcının gerekli kıldığı kadar işlenir. Hata mesajı kullanıcıya ne yapacağını söyler; banka ham hatası, token veya callback gövdesi gösterilmez. Ödeme oturumunu offline kuyruğa alıp bağlantı gelince otomatik tahsil etme; PWA varsa yalnızca güvenli statik kabuk cachelenir.

## 04 · Satıcının senaryoları

| ID / aşama | Tetikleyici ve ekran | Backend / platform ilişkisi | Kabul / istisna |
|---|---|---|---|
| S01 · MVP öncesi | Satıcı pilot katılımı | Sağlayıcının gerçek §2.3 alan listesi temin edilir; güvenli kanal kullanılır | Eksik belgeden vergi/IBAN/kimlik alanı uydurulmaz |
| S02 · MVP | Platform satıcıya kullanıcı/üyelik atar | Seller Membership + yerel Merchant Mapping | Kullanıcının gönderdiği merchant ID yetki kaynağı değildir |
| S03 · MVP | Aktivasyon durumunu görür | GetSubMerchants sonucu + IsActive + ayar/sahiplik kontrolü | Pasif/eksik ayarlı satıcıdan yeni ödeme açılmaz |
| S04 · MVP | Kendi ödeme/sipariş listesini açar | Server filtreli, sayfalı, field allowlistli sorgu | Mobil kart listesi; diğer merchantın kaydı/ham PII görünmez |
| S05 · MVP | İşlem detayında sonuç takip eder | Yetkili read; manual refresh yalnızca sorgu tetikler | Refresh Add çağırmaz; rate limit uygulanır |
| S06 · MVP | Bekleyen tahsilat için destek ister | Attempt referansı ile review case | Satıcı kendi kaydını paid yapamaz |
| S07 · MVP sonrası | İade talebi oluşturur | Gerekçe, tutar sınırı ve idempotent talep; finans rolü yürütür | Tam/kısmi destek teyidine göre UI; yetkisiz onay yok |
| S08 · MVP sonrası | Ekip üyesi ve rol yönetir | Davet, iptal, rol matrisi, erişim audit | Davet edilen rol verilen kapsamı aşamaz |
| S09 · MVP sonrası | Dönem/net/komisyon raporu indirir | Tarih/tenant filtresi, maskeli CSV, export audit | Brüt tahsilat ile settlement farklı kavramlardır |

Satıcıya ilk sürümde özel bir ERP paneli yapılmaz. `/seller/` Vite frontpages içinde **liste + detay + aktivasyon durumu + destek** yeterli başlangıçtır. Platformun Vue adminine satıcı rolüyle sınırsız erişim vermek yerine aynı Frappe servis kuralları üzerine dar arayüz kurulur.

## 05 · Platform sağlayıcının senaryoları

Buradaki platform sağlayıcı, sizin uygulamanızın işletmecisidir; **GalaksiPay ödeme hizmeti sağlayıcısı** ayrı aktördür.

| ID / aşama | Vue admin ekranı / iş | Yetkili operasyon | Kabul / istisna |
|---|---|---|---|
| P01 · MVP öncesi | Ortam ve provider ayarları | Test/prod secretları güvenli sunucu alanında; erişim/rotasyon sahibi | Credential API yanıtında/HTML’de yok |
| P02 · MVP | Merchant mapping ve üyelik | Yerel satıcıyı sağlayıcı SubMerchantId ile eşleştir, doğrula, devre dışı bırak | Ana merchant fallback sessizce devreye girmez |
| P03 · MVP | Ödeme listesi + olay zaman çizgisi | İzinli rol için maskeli işlem/durum/audit | Sadece read; veri doğrudan CRUD ile para durumuna dönüştürülemez |
| P04 · MVP | İnceleme kuyruğu | UNKNOWN, sync_error, tutar/merchant çelişkisini sahiplen | Tek tuşla paid değil; kanıta bağlı düzeltme komutu |
| P05 · MVP | Tekrar sorgula | Rate-limitli GetById işini kuyruğa al | İdempotent; yeni tahsilat yaratmaz |
| P06 · MVP | Kill switch ve olay takibi | Yeni start durur; callback ve kurtarma hattı sürer | Kim, neden, ne zaman audit; kontrollü yeniden açılış |
| P07 · MVP sonrası | İade/iptal onayı | Teyitli provider yetkisiyle, talep/onanma ayrımı | Timeout otomatik ikinci iade oluşturmaz |
| P08 · MVP sonrası | Günlük mutabakat | Sipariş, provider ve settlement kayıtlarını karşılaştır | Farklar sahipli vaka; satırları silerek fark kapatılmaz |
| P09 · Olgunlaşma | Kurumsal erişim/denetim | SSO/MFA, görev ayrılığı, retention, export ve access review | Erişim iptali, audit ve restore tatbikatı kanıtlı |

MVP Vue ekranları: **giriş, merchant eşleştirme, işlem listesi, işlem detayı, inceleme kuyruğu**. Grafik ve sürükle-bırak dashboard ilk tahsilat için gerekli değildir. Mobil admin aynı kritik yetenekleri kart/tek kayıt eylemleriyle sunar; toplu seçim ve büyük tablo geliştirmesi yalnızca masaüstü modülünde olabilir. Her kritik görev mobilde alternatif yola sahip olmalı.


## Senaryodan teste iz

B01/B02 → C01 izin/para + M03 UI; B03/B04 → M01; B05–B07 → M02/M03; B08 → P01; B09 → P02. S01–S06 → C01/M03/M04; S07–S09 → P01/P02/F01. P01–P06 → C02/M02/M03/M04; P07/P08 → P02/F01; P09 → E01/MT01. [Her sprintin Given/When/Then testi](/v2/roadmap/) aynı davranışın kabul kanıtını tanımlar.
