---
title: "Callback güvenliği ve kurtarma"
description: "Bildirim alımı, yetkili doğrulama, ACK ve tekrar teslim."
group: "Entegrasyon"
---

## İki farklı kanal

**Sunucudan callback** finansal değişimi tetikleyebilen dış girdidir; kimlik ve eşleşme doğrulaması gerektirir. **Tarayıcı postMessage** güvenilir finansal kayıt değildir. `event.origin` izin listesi, `event.source === popupRef` ve aktif attempt bağlantısı kontrol edilse de mesaj yalnızca kendi durum endpointini yeniletir. İstemciden gelen `isPaid` hiçbir sipariş durumunu doğrudan güncellemez.

## Callback sözleşmesinin bilinen bölümü

Demo modeli aşağıdaki zarfı tüketiyor; örnek sentetiktir ve resmi teslim garantisi değildir:

```json
{
  "isSuccess": true,
  "message": null,
  "errorCode": null,
  "data": {
    "id": "00000000-0000-4000-8000-000000000002",
    "isPaid": true,
    "orderNo": "ORDER-SANDBOX-0001",
    "amount": 125.50,
    "transactionStatusName": "PaymentReceived"
  }
}
```

`isSuccess` zarf sonucu ile `data.isPaid` tahsilat durumunu karıştırma. Kimlik, event ID, imza başlığı, algoritma, canonicalization, zaman toleransı, key rotation, retry süresi, ACK kodu ve timeout **belgelenmemiştir**. HMAC varmış gibi bir header adı uydurulmaz.

## Önerilen alım algoritması

1. HTTPS, izinli method/content-type, payload boyutu ve yapısal doğrulama uygula.
2. Sağlayıcı imza protokolü varsa **ham body** üzerinden resmi algoritmayla doğrula; replay/timestamp/key rotation kontrollerini uygula.
3. Doğrulanmış imza yoksa callbacki ödeme kanıtı sayma. Sağlayıcıyla mutabık bir teslim kontrolü + bilinen attempt için yetkili durum sorgusu kullan; internetten rastgele UUID sorgusuna rate limit uygula. IP allowlist ek savunmadır, tek başına ödeme doğrulaması değildir.
4. Inbox olayını atomik olarak kalıcılaştır. DB yazılamadıysa başarı ACK dönme. Teyit edilen başarı ACK’i yalnızca kalıcı alımdan sonra dön; mevcut demo 200 JSON dönüyor ama sağlayıcının beklediği sözleşme Q01 ile netleşecek.
5. Worker kendi provider tokenı ile sorgular. OrderNo/UUID/tutar/merchant eşleşmezse karantinaya al.
6. Domain geçişi ve sipariş yan etkisini aynı transaction/outbox sınırında tekilleştir.
7. Kontrollü retry bittiğinde DLQ/inceleme vakası oluştur; backlog yaşı için alarm üret.

## Yarış durumları

Callback, Add cevabı yerel DB’ye yazılmadan gelebilir. Yetkisiz sipariş yaratmak yerine “eşleşme bekliyor” inbox kaydı tut; kayıt penceresinden sonra provider referansıyla yeniden dene. Bilinmeyen OrderNo veya tenant sadece callbacke dayanarak oluşturulmaz.

Callback ile polling aynı anda success bulursa optimistic concurrency / satır kilidi + unique business effect tek güncelleme üretir. Success sonrasında gelen pending/failed bildirimleri durumu geri almaz; çelişki audit ve gerekirse inceleme doğurur.

## Kurtarma ve canlı çıkış

Kayıp callback: süresi gelen açık attemptleri kontrollü sorgula. Önerilen sorgu aralıkları (sağlayıcı limit teyidine bağlı) 5, 15, 30, 60 saniye; ardından operasyonel uzun aralıklı job. Müşteri tarayıcısı doğrudan provider polling yapmaz; uygulama endpointi rate-limit edilir. Süre eşiği sonunda otomatik fail yerine inceleme durumu kullan.

Q01/Q04/Q06 çözümlenmeden internetten bildirim kabul eden akış “üretime hazır” olarak işaretlenmez. Mock çalışması ve sandbox E2E bu kararlardan bağımsız ilerleyebilir. [Test matrisi](/docs/test-stratejisi/) ve [güvenlik](/docs/guvenlik/) sayfaları ilgili kanıtları tanımlar.
