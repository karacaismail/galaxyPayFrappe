---
title: "Test stratejisi ve kabul matrisi"
description: "Finansal doğruluğu normal ve bozuk akışlarda kanıtla."
group: "Kalite & işletim"
---

## Katmanlar

Unit: para, normalize, durum geçişleri. Contract: OpenAPI ve redakte fixture uyumu. Integration: gerçek test PostgreSQL, unique kısıtlar, concurrency ve transaction rollback. Mock E2E: UI→backend→provider simülatörü→callback. Sandbox UAT: gerçek sağlayıcı kart/cüzdan akışı. Yük/kaos: önce yerel mock, sonra açıkça izinli ortam.

Demo test kartlarını güvenli yerel materyalden seç; PAN/CVV değerlerini repo, ekran görüntüsü, CI logu veya portala taşıma. Kart reddinde listedeki başka güncel kartı dene ve kart referansını maskeli kaydet. Cüzdan senaryosu için yazışmadaki yetkili test hesabı gerekir. Bu teslimde hiçbir kart/ödeme denemesi yapılmadı.

## MVP kabul matrisi

| ID | Senaryo | Beklenen sonuç | Sprint |
|---|---|---|---|
| TC01 | Doğrudan kart ile başarı | Backend sorgusu/eşleşme sonrası tek paid etkisi | S04 |
| TC02 | Banka/3DS reddi | Teyitli final fail; güvenli mesaj | S04 |
| TC03 | Kullanıcı popupı kapatır | Otomatik fail yok; pending/sorgu | S02–04 |
| TC04 | Aynı butona iki tık / iki sekme | Tek aktif attempt, aynı idempotent sonuç | S02 |
| TC05 | Aynı key farklı sipariş/tutar | Conflict; provider çağrısı yok | S02 |
| TC06 | Callback 100 tekrar | 1 sipariş etkisi; duplicate audit | S03 |
| TC07 | Pending callback success sonrasında | SUCCEEDED geriye dönmez | S03 |
| TC08 | Callback hiç gelmez | GetById jobuyla doğru sonuç | S03 |
| TC09 | Sahte callback / sahte postMessage | Paid etkisi yok; doğrulama/karantina | S03 |
| TC10 | Tutar veya merchant uyuşmazlığı | REVIEW_REQUIRED; fulfillment yok | S03 |
| TC11 | Add timeout, UUID bilinmiyor | UNKNOWN; kör Add retry yok | S02–03 |
| TC12 | DB kapalı callback alımı | Başarı ACK yok; kayıp olay başarı sayılmaz | S03 |
| TC13 | 401/429/5xx/bozuk 200 | Kısıtlı retry/contract alarm; başarı sayılmaz | S02–03 |
| TC14 | Yetkisiz kullanıcı/başka tenant ID | 401/403/uygun 404; veri sızıntısı yok | S02 |
| TC15 | Popup engeli / yenileme / mobil dönüş | Aynı attempt sürer; güvenli yönlendirme | S02–04 |
| TC16 | Restore ve rollback | Açık attemptler korunur; sorguyla toparlanır | S04 |

## Sonraki kabul grupları

S05–07: cüzdan, devre dışı merchant, yanlış mapping, rol ve export görünürlüğü. S08–10: eşzamanlı iade, timeout iade, brüt/net farkı, timezone sınırı, geç settlement. S11–13: worker kill, DLQ replay, backpressure, 2x yük ve restore. S14–16: IDOR, XSS, SSRF, retention, secret rotation. S17–22: contract breaking change, SDK örnek derlemesi, SSO iptal, görev ayrılığı ve tenant izolasyonu. S23–25: birleşik finansal uç durum ve bağımsız kanıt örneklemesi.

## Test kanıtı formatı

Run ID, commit SHA, ortam, fixture sürümü, GP/TC ID, beklenen/gözlenen, timestamp, redakte ekran/log, reviewer ve açık hata bağlantısı. “Geçti” iddiasının yanında hangi testin nerede çalıştırıldığı bulunur. Mock sonucu sağlayıcı UAT kanıtı gibi gösterilmez.

## Hata önceliği

P0: yanlış/çift para etkisi, çapraz tenant sızıntısı veya secret ifşası; yayını durdur. P1: temel ödeme/kurtarma akışı kullanılamıyor; G1 geçilemez. P2: kontrollü workaround olan sınırlı kusur; owner ve süre gerekir. P3: düşük etkili iyileştirme. Üretim olayı şiddeti hizmet sahibi tarafından etki kapsamıyla atanır.
