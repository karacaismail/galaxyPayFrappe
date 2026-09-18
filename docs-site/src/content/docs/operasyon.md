---
title: "Operasyon ve runbooklar"
description: "Gözlemlenebilirlik, olay müdahalesi ve geri dönüş."
group: "Kalite & işletim"
---

## İzlenecek sinyaller

| Sinyal | Neden | Önerilen başlangıç eşiği |
|---|---|---|
| Pending/unknown yaşı | Kayıp callback veya sağlayıcı gecikmesi | İş süresine göre belirle; ilk öneri 15 dk operasyon incelemesi |
| Callback inbox gecikmesi | Worker/DB problemi | p95 ve en yaşlı iş; pilotta baz ölçüm |
| Add timeout / şema hatası | Belirsiz tahsilat riski | Her UNKNOWN vaka; kümelenme P1 değerlendirmesi |
| İşlem/tutar/merchant farkı | Finansal doğruluk | Her fark vaka oluşturur |
| Duplicate business effect | Kritik invariant ihlali | 0 hedef; tek olay bile durdurma nedeni |
| DLQ ve queue age | İş kaybı/tekrar sorunu | Sahipli alarm ve artış hızı |
| 401/403/429/5xx | Kimlik, limit veya kesinti | Ortam ve merchant bazlı oran |

Log alanları: correlation_id, internal_attempt_id, masked provider reference, tenant context, operation, duration, safe error class. Telefon/ad, token, PaymentUrl, PAN/CVV ve ham provider gövdesi loga yazılmaz. Trace başlıklarının PII taşımaması gerekir.

## Runbook A · Callback gelmiyor

Tetikleyici: açık attempt yaşı eşiği aştı. Önce sağlayıcı ID, inbox ve worker sağlığını kontrol et. Bilinen UUID ile yetkili GetById sorgusu başlat; eşleştirme hattını kullan. Callback DNS/TLS/route/ACK ve proxy loglarını hassas veri göstermeden kontrol et. Otomatik Add retry yapma. Sorgu da belirsizse destek vakasını referansla sağlayıcıya taşımak için hizmet sahibine devret. Kapanış: yerel/provider durum eşleşti, neden ve gecikme kaydı var.

## Runbook B · sync_error veya tutar farkı

Tetikleyici: referans var ama tahsilat doğrulanamıyor / Amount farklı. Siparişin fulfillment ve yeni tahsilatını durdur; REVIEW_REQUIRED oluştur. Yetkili sorgu, provider referansı ve finans kaynağını karşılaştır. RRN/slip var diye success atama. Finans sahibi auditli düzeltme kararı verir. Kapanışta hiçbir önceki kanıt silinmez.

## Runbook C · Sağlayıcı kesintisi

Hata oranı ve circuit breaker sinyalini doğrula. Yeni payment startı feature flag ile durdur; callback alımını, açık iş sorgusunu ve veri kaydını koru. Kullanıcıya belirsiz sonucu açık göster. Sağlayıcı toparlanınca küçük hacimle aç; backlog ve karşılaştırmayı tamamla. Ana metrik normalleşmeden otomatik tam açılış yapma.

## Runbook D · Secret sızıntısı

Etkilenen credential/ortamı belirle, revoke/rotate et, erişim kapsamını azalt. İlgili secretı loglardan ve artifactlerden güvenli şekilde temizle; kanıt ve etki değerlendirmesini koru. Repo geçmişi varsa ayrı temizleme planı ve erişim incelemesi yap. Yeni credentialın yalnızca secret storeda bulunduğunu test et. Olayı güvenlik sahibine devret.

## Runbook E · Hatalı release / DB kaybı

Yeni tahsilatları durdur; webhook ingestion mümkünse sürsün. Son bilinen uygulama artifactine dön; DB şemasının eski sürümle uyumunu kontrol et. Veri kaybettiren down migration çalıştırma. DB kaybında yedekten izole geri yükle, commit/watermark ve açık attemptleri sağlayıcı ile yeniden uzlaştır. Restore sonrası çift yan etki testi yap ve hizmet sahibi kademeli açsın.

## Ölçüm hedeflerinin kapsamı

SLO önerisi %99,9: kullanıcının yetkili ödeme başlatma/durum sorgu isteklerinde hizmetin geçerli yanıt verebilmesi; ölçüm penceresi 30 gün. Banka reddi hizmet arızası sayılmaz; provider kesintisinin kullanıcı etkisi ayrı gösterilir. p95 ≤500 ms iç durum API için; auth/Add/3DS/banka bekleme zamanı ayrı metrik. RPO ≤15 dk ve RTO ≤60 dk önerisi altyapı ile kanıtlanmadan taahhüt edilmez. Maliyet metriği başarılı ödeme başına compute/DB/log ve operasyon yükünü kapsar.

## Yayın kararı

Pilot öncesi test/prod credential ayrımı, aktif merchant, callback erişimi, finans manuel iade yolu, alarm nöbetçisi, restore ve rollback kanıtı gerekir. Rollback tetikleri: doğruluk ihlali, tenant sızıntısı, yükselen UNKNOWN, başarısız migration veya kararlaştırılmış hata bütçesi aşımı. [G1 kapısı](/docs/kabul-kapilari/) eksikse sürüm sandboxta kalır.
