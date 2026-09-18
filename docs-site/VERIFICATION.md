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

## V2 / GitHub Pages güncellemesi

18 Eylül 2026: önce V1 `940798f` commitinden GitHub Pages’e yayınlandı (Actions run 35341266980 başarılı); ardından ayrı `/galaxyPayFrappe/v2/` sayfası geliştirildi.

- Hem kök adresle `npm run verify`, hem `SITE_BASE=/galaxyPayFrappe npm run verify` geçti: 17 Astro/TS dosyasında 0 hata/uyarı/ipucu; 45 HTML, 1.700 link/anchor, 43 arama kaydı. V1 78 kartı korunuyor; V2 24 benzersiz kartı kapsıyor.
- V2’de 13 bölüm; alıcı 10, satıcı 9, platform 9 senaryo; rol/DocType/API taslağı, S0–S7+ planı, sağlayıcı bağımlılıkları ve mobil kabul ölçüleri.
- Üretim buildi `127.0.0.1:4322/galaxyPayFrappe/` üzerinden gerçek tarayıcıda incelendi. Dev server çıktısı kullanılmadı.
- 320×740 açılışında profil `compact`; document clientWidth/scrollWidth = 320/320; desktop DOM sayısı 0; doğrudan metin içeren düğümlerin minimum fontu 16px.
- 360, 390, 768 ve 1280 px kontrollerinde sayfa yatay taşması 0.
- Mobil kaynak kaydı yalnızca 4 JS/CSS dosyası: `index.qAIiKQNg.css`, `index.astro_astro_type_script_index_0_lang.DasZ4m_a.js`, `compact.CQp8MTVd.js`, `compact-only.KdhGEnCO.css`. Masaüstü JS/CSS istenmedi.
- 1280×800/fine pointer açılışında 4 dosya: aynı ortak JS/CSS + `desktop.uLnX_3b9.js` + `desktop-only.nXb-67cJ.css`. Kompakt modül istenmedi; ek gezinme DOM sayısı 1.
- 320 → 1280 → 320 geçişinde ek gezinme eklenip kaldırıldı, etkin stylesheet doğru profile döndü. Önceden indirilen kaynakların kayıtları doğal olarak korunur.
- Mobil içindekiler açıldı, alıcı bölümü seçildi, menü kapandı ve focus ilgili başlığa geçti. S0 ana eylemi doğrudan S0 başlığına gidiyor.
- 12 referans tablosu yatay kaydırılabilir ve klavye odaklanabilir; tablo semantiği korunuyor. Sayfa taşması ile tablo içi kaydırma ayrı ölçülür.
- Mobil başlangıç JS gzip toplamı 2.012 byte; CSS gzip toplamı 2.614 byte. Ölçüm derlenmiş dosyalara Node gzip uygulayarak elde edildi; HTTP transfer/p75 ölçümü değildir.
- CSS ilk denemede Astro tarafından ortak HTML’e alınmıştı. Profil CSS’leri `?url` assetleriyle yalnız mount anında eklenerek düzeltildi; verifier bu sızıntıyı ve ayrı artifactleri kontrol ediyor.

Tarayıcı kaynak kaydı cache hitlerini de kapsar; temiz, izole browser context/HAR veya gerçek dokunmatik cihaz testi bu teslimde yapılmadı. 200% zoom, yavaş ağ, tam WCAG, gerçek provider ödeme UAT ve Vue/Frappe uygulama testleri planın kabul işleri olarak duruyor. Buradaki mobil ölçümler yalnız çalışan Astro V2 doküman sayfasına aittir.
