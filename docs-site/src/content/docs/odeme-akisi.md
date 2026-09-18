---
title: "Ödeme akışı ve durum modeli"
description: "Tek ödeme niyeti, güvenilir sonuç ve belirsizlik yönetimi."
group: "Entegrasyon"
---

## Hedef akış — önerilen tasarım

1. Müşteri mevcut sipariş için ödemeyi başlatır; backend oturum, tenant ve sahiplik doğrular.
2. Backend tutarı/satıcıyı kendi siparişinden hesaplar; kalıcı attempt + idempotency kaydı oluşturur.
3. Sunucu credential ile auth alır; `Transaction/Add` çağırır; UUID ve PaymentUrl saklanır.
4. Tarayıcı izinli sağlayıcı linkini açar. Popup engellenirse aynı linke üst pencere yönlendirme sunulur.
5. Sağlayıcı callback gönderir; backend kalıcı inbox kaydı alır. Tarayıcı postMessage yalnızca durum yenileme sinyalidir.
6. Worker yetkili `GetById` sorgusuyla kimlik, sipariş, tutar ve satıcı eşleşmesini doğrular.
7. Yerel transaction içinde attempt güncellenir; sipariş etkisi/outbox tekilleştirilir. UI kendi backendinden sonucu okur.
8. Callback kaybı veya belirsizlik varsa zamanlanmış sorgu aynı doğrulama hattından geçer.

## Durumlar — yerel domain, sağlayıcı enumu değil

| Durum | Anlamı | Çıkış |
|---|---|---|
| CREATED | Kalıcı intent var, sağlayıcı çağrısı henüz kesin değil | PENDING / UNKNOWN / FAILED |
| PENDING | Sağlayıcı işlem IDsi biliniyor, sonuç bekleniyor | SUCCEEDED / FAILED / REVIEW_REQUIRED |
| UNKNOWN | Add cevabı kayboldu; işlem oluşmuş olabilir | Sağlayıcı kanıtıyla PENDING / SUCCEEDED / FAILED / REVIEW_REQUIRED |
| SUCCEEDED | Yetkili sorgu + eşleşme ile ödeme doğrulandı | Yalnızca ayrı iade/iptal süreci; geç pending geriye taşımaz |
| FAILED | Sağlayıcının teyitli nihai başarısızlığı | Yeni ödeme girişimi ayrı attempt olarak açılır |
| REVIEW_REQUIRED | Çelişki, sync_error, eşleşmeyen tutar/satıcı veya tanımsız durum | Yetkili kanıt + kontrollü çözüm |

İade durumu ayrı aggregate/alan olarak tutulur; SUCCEEDED tahsilat tarihçesi silinmez. Link süresi dolması veya müşteri popupı kapatması finansal FAILED kanıtı değildir. Yerel zaman aşımı `UNKNOWN/REVIEW_REQUIRED` doğurabilir. FAILED sonrası gecikmiş doğrulanmış başarı varsa sıradan geçişle gizleme: reconciliation vakası aç, diğer denemeleri kontrol et, finansal gerçeği auditli düzelt.

## Sağlayıcı durum eşleştirmesi

Demoda `PaymentReceived`, `PaymentPending`, `PaymentStarted`, `ErrorReceived` isimleri görülüyor. Tam ve terminal enum listesi doğrulanmadı (**Q06**). `IsPaid=false` tek başına başarısızlık kanıtı olamaz. RRN/slip varlığı da tek başına başarı değildir; demodaki `sync_error` yorumu ihtilaf işaretidir. Q06 kapanana kadar bilinmeyen durumları incelemeye yönlendir.

## Idempotency ve atomiklik

Yerel benzersizlik: `(tenant_id, idempotency_key)`. Request hash sunucunun hesapladığı sipariş/satıcı/tutar/para birimi sürümünü içerir. Aynı anahtar + aynı hash mevcut sonucu döndürür; farklı hash conflict olur. SIPARIŞ başına etkin attempt kısıtı, satır kilidi veya eşdeğer DB mekanizmasıyla eşzamanlı startı engeller. Yalnızca butonu kapatmak yeterli değildir.

İstek sağlayıcıya gitti ama cevap gelmediyse, sağlayıcının idempotency desteği doğrulanmadan Add yeniden çağrılmaz. Önce bilinen UUID ile sorgu; UUID yoksa OrderNo ile arama garantisi olmadığı için sağlayıcı destek/reconciliation yolu gerekir. Bu, **Q04** için kritik canlı çıkış konusu.

Callback teslimi en az bir kez olabilir; exactly-once network varsayımı yapılmaz. Olay keyi mevcutsa kullan; yoksa doğrulanmış kimlik + olay tipi/sürümü gibi teyitli alanlardan dedup tasarla. Ham body hash yalnızca aynı gövdeyi ayırır, iş etkisini tek başına korumaz. Siparişe ödeme etkisi ve outbox için ayrıca benzersiz DB kısıtı gerekir. Sadece PaymentId üzerinden bütün bildirimleri tekilleştirmek pending→success güncellemesini kaybettirebilir.

## Güvenli kullanıcı mesajları

- Pending: “Ödeme sonucu doğrulanıyor. Bu sayfayı yenileyebilirsiniz.”
- Belirsiz: “Sonuç henüz doğrulanamadı. Yeniden ödeme başlatmadan önce durum kontrol ediliyor.”
- Başarılı: yalnızca backend doğruladıktan sonra “Ödemeniz alındı.”
- Doğrulanmış başarısız: güvenli sebep + yeni deneme eylemi; banka/secret içeriği yok.
- İnceleme: destek referansı göster; otomatik yeniden tahsilat yapma.
