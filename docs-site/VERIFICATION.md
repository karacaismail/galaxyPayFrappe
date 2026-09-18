# Doğrulama kaydı — 18 Eylül 2026

## Otomatik kontroller

- `npm run verify`: Astro/TypeScript 0 hata, 0 uyarı, 0 ipucu; statik build başarılı.
- 44 HTML sayfası, 1.617 yerel link/anchor, 9 faz, 26 sprint, 78 benzersiz iş kartı doğrulandı.
- 42 doküman arama indeksinde; Markdown paketinde son sprint ve soru kayıtları mevcut.
- İş kartı kimlikleri/kabul metinleri roadmap JSON ile sprint Markdown sayfaları arasında eşleşiyor.
- Derlenmiş dosyalarda demo view credential değerleri ve test dosyasında yakalanan kart numaraları için kontrol: sızıntı bulunmadı. Bu sınırlı tarama kapsamlı güvenlik denetimi değildir.

## Gerçek tarayıcı kontrolleri

Codex tarayıcısında localhost uygulaması üzerinden:

- Ana sayfa masaüstü görsel kontrolü; 9 faz ve ilk fazın sprintleri görünür.
- Kurumsal filtresi 3 faz gösteriyor; Tüm fazlar filtresi 9 faza geri dönüyor.
- Tam metin aramada `callback` 22 sonuç; ilgili callback ve S03 sayfaları ilk sıralarda.
- S01 sayfası: 5 hazırlık kutusu ve 1 kod kopyalama düğmesi.
- Kod kopyalama işlemi “Kopyalandı” geri bildirimi üretti.
- Hazırlık kutusu işaretleme + sayfa yenileme sonrasında durum korundu; test sonunda kutu eski boş durumuna getirildi.
- 390×844 mobil viewport: sprint ve ana sayfa document scrollWidth/clientWidth = 390; yatay sayfa taşması yok.
- Masaüstü ana sayfa ve mobil sprint sayfasındaki metin düğümlerinin hesaplanmış minimum font boyutu 16px (1rem).
- Mobil menü açılıyor; yol haritası bağlantısı çalışıyor; mobil arama `S01` için sonuç üretiyor.
- Tema düğmesi dark durumuna geçiyor ve tekrar light durumuna dönebiliyor.
- S01 testinde browser error log listesi boş.
- Geçici mobil viewport sıfırlandı; ana portal kullanıcı çıktısı olarak açık bırakıldı.

## Sınırlar

Ödeme backend'i çalıştırılmadı, sağlayıcı hesabına giriş yapılmadı, ödeme/iade çağrılmadı. OpenAPI yalnızca HTTP GET ile incelendi. Tam WCAG/penetrasyon testi veya gerçek ödeme UAT yapılmadı. Bunların görev ve kabul kriterleri planın ilgili sprintlerinde bulunur. Bu kayıt dokümantasyon portalının doğrulamasıdır.
