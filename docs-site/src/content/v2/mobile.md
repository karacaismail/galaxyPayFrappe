---
title: "320 px adaptive geliştirme"
description: "Ortak ve profil kodu ayrımı; mobil ağ ve etkileşim kabulü."
group: "Frontend"
---

## 08 · Gerçek mobile first: 320 px ve koşullu teslim

**Kabul tanımı:** 320 CSS px viewportta temiz cache ile açılan buyer sayfası yalnızca ortak kodu ve gereken mobil modülü indirir. Vue admin, desktop grid/chart, hover/kısayol modülleri, masaüstü görselleri ve masaüstüne özel CSS için **0 ağ isteği**. Aynı kural 320 px admin açılışında masaüstü admin geliştirmeleri için geçerlidir; adminin ortak Vue runtimeı ise gerektiği için yüklenir.

“Sadece mobil kod” ortak domain/client, erişilebilirlik ve loader kodunu dışlamak anlamına gelmez. `display:none`, Tailwind `hidden lg:block` ve CSS media query bir dosyanın indirilmesini engellemez. `<link media>` dosyasının da indirilmediği varsayılmaz. Yükleme sınırı entry graph + koşullu `import()` + CSS splitting + ağ testiyle kurulur. UA sniffing ve “telefon modeline göre sayfa” yaklaşımı kullanılmaz.

### Tasarımın tabanı

- İlk tasarım/artifact **320 px**, tek kolon; masaüstü ekranı küçülterek başlanmaz. 320 px bir minimum cihaz iddiası değil, kabul viewportudur; daha dar erişilebilir akışlar da içerik kırmadan ele alınır.
- Kök font kullanıcının tercihini korur; gövde, kod, badge, tablo ve hata dahil minimum **1rem**. Akışkan başlık/boşluk için `clamp`; metin boyutu hiçbir uçta 1rem altına düşmez.
- Grid `minmax(0, 1fr)`, `min-width:0`, mantıksal padding, taşan referanslarda `overflow-wrap:anywhere`. Sabit 100vw genişliği ve ölçekleyip küçültme yok.
- Kart → içerik uygunluğuna göre genişleyen düzen; tablo gerekiyorsa mobile label/value veya tek kayıt görünümü. Desktop tablo bileşeni mobile gizlenmiş ikinci DOM ağacı olarak gönderilmez.
- Birincil eylem minimum 44×44, tercihen 48 px; safe-area inset, sanal klavye, yatay/dikey dönüş ve reduced-motion ele alınır. Hover tek erişim yolu olamaz.
- `inputmode`, `autocomplete`, yerel klavye ve alanla ilişkili hata; hata özeti focusu doğru alana taşır. 3DS dönüşünde focus/scroll ve devam eden attempt korunur.
- Görseller varsa `<picture>`/`srcset`/`sizes`, boyut/aspect-ratio ve uygun codec; mobilde masaüstü hero downloadı yok. Sistem fontu ilk seçenek; gerekli font subseti budgeta dahil.

### Profil politikası

Ortak HTML + CSS 320 px için tek başına kullanılabilir. Küçük yükleyici `(min-width: 64rem) and (pointer: fine)` eşleşince desktop geliştirmesini, diğer durumda compact/mobile geliştirmesini import eder. Bu eşik ürünün içerik testiyle değişebilir; touch-tablet geniş ekranda da hafif profilde kalabilir. Feature flag/rol ve route kontrolü eklenir; her büyük ekran bütün admin modüllerini indirmez.

Alttaki örnek **ürün için uygulama şablonudur**. Gerçek v2 doküman portalı da ayrı compact/desktop modülleri kullanır; henüz Vue ödeme admininin ağı ölçülmüş değildir.

```ts
// Shared entry: route + permission sonucu belirlendikten sonra.
// İki UI aynı state/store ve API clientı kullanır.
const desktop = matchMedia('(min-width: 64rem) and (pointer: fine)');
let revision = 0;
let dispose: (() => void) | undefined;

async function loadProfile() {
  const current = ++revision;
  const module = desktop.matches
    ? await import('./profiles/desktop')
    : await import('./profiles/compact');
  if (current !== revision) return; // resize yarışında eski sonuç bağlanmaz
  dispose?.();
  dispose = module.mount(); // event listener/observer cleanup döndürür
}

desktop.addEventListener('change', loadProfile);
void loadProfile();
```

CSS ilgili modülün içinden import edilir; shared entry masaüstü CSS dosyasını statik import etmez. Vite `cssCodeSplit` açık tutulur. Async chunk CSS’i o chunk yüklenince gelir; statik importlar için oluşturulan preloadlar incelenir. Sırf bu ayarı yazmak yeterli kanıt değildir: çıktıdaki modulepreload/prefetch ve service worker precache graphı test edilir. [Vite CSS splitting](https://vite.dev/guide/features.html#css-code-splitting).

**Bu Astro portalında doğrulanan ayrıntı:** normal CSS importu, dinamik JS modülünün içinden gelse bile Astro tarafından ortak HTML stiline taşınabildi. Bu nedenle profil CSS’leri `?url` ile ayrı asset olarak derlenir, yalnızca seçilen modül mount olduğunda stylesheet linki eklenir; dispose sırasında kaldırılır. `assetsInlineLimit: 0` ve build kontrolü ayrı CSS dosyasını korur. Ürün Vite buildinde de çıktıyı ölç; framework davranışını varsayma.

Vue admin route’u ve ağır bileşenleri dinamik importla ayır; `v-if` aynı bundle içindeyse indirmeyi önlemez. Router prefetchi desktop rotalarını mobilde çağırmamalı. [Vue performans/code splitting](https://vuejs.org/guide/best-practices/performance.html). Tailwind responsive utilityler ortak akışkan görsel düzen içindir; JS seçiminin yerini tutmaz. Desktop-only utilityler için ayrı stylesheet entry ve dar source taraması gerekir. [Tailwind responsive tasarım](https://tailwindcss.com/docs/responsive-design).

Alpine bir checkout açıklaması/menü gibi küçük alanın davranışını yönetebilir; global state ödeme gerçeği değildir. Sıkı CSP için `@alpinejs/csp` seçeneğini değerlendirmek, standart build yüzünden ödeme sayfasında `unsafe-eval` açmaktan daha iyi başlangıçtır; desteklenen ifade sınırlarını C02’de doğrula. [Alpine CSP](https://alpinejs.dev/advanced/csp).

### Yeniden boyutlandırma ve anlamlı sınır

İlk açılış mobilken desktop modülü yüklenmez. Kullanıcı pencereyi büyütürse gerektikçe yüklenir; tekrar küçültünce listener ve desktop DOM temizlenir. İndirilmiş byte browser cacheinden “geri alınamaz”. Kabul testi **temiz mobil açılış**, **mobil etkileşim**, **desktopa büyüme**, **tekrar mobile dönüş** durumlarını ayrı raporlar. Form statei DOM modülünde tutulmaz, profil geçişinde ödeme yinelenmez.

### Ölçülebilir budget — başlangıç hedefi

| Ölçüm | Buyer/seller hedefi | Vue admin hedefi | Kanıt |
|---|---|---|---|
| Başlangıç first-party JS, gzip | ≤60 KiB | ≤120 KiB | Vite output + gzip; route bazlı |
| Başlangıç CSS, gzip | ≤25 KiB | ≤35 KiB | Ortak + seçilen profil toplamı |
| 320 px desktop-only istek | 0 | 0 | Cold-cache network/HAR, JS ve CSS |
| Public rotada Vue/admin artifacti | 0 | Uygulanmaz | Import graph + network |
| 320 px sayfa taşması | 0 px | 0 px | scrollWidth ≤ clientWidth |
| Metin / dokunma | ≥1rem / ≥44 px | Aynı | Computed style + pointer/klavye |
| CWV hedefi | LCP ≤2,5 sn, INP ≤200 ms, CLS ≤0,1 | Aynı başlangıç hedefi | Lab ve pilot gerçek kullanıcı p75 ayrı |

Budgetlar provider hosted ekranı ve bankanın 3DS bekleme süresini kapsamaz; bunlar ayrı ölçülür. Font/görsel/analitik toplam ağı ayrıca raporlanır. Gerçek trafik verisi yokken p75 başarı iddiası yazılmaz. Cihaz matrisi: 320, 360, 390, 768 ve 1280 CSS px; touch/fine pointer; 200% zoom; yavaş ağ/CPU; reduced-motion; JS hatası ve offline dönüş. Kütüphane importunu optimize etmeden budgetı büyütme.


## Test önce

İlk kırmızı test `UI_desktop_asset_leak`: production manifestten desktop-only JS/CSS kümesini çıkar; 320 CSS px boş contextte public route aç, menü/formu kullan, prefetch penceresini izle. İstek kümesiyle kesişim boş olmalı. Sonra 1280/fine pointerda desktop modülünün gerçekten yüklendiğini göster. Tek başına dosya isminde desktop kelimesi aramak yeterli kabul değildir.

Viewport ayarının gerçekten 320 CSS px verdiğini `document.documentElement.clientWidth` ile ölç; tarayıcı zoomu sonucu değiştirebilir. Form statei profil dışında kalır. Zoom, klavye, orientation ve touch cihaz testleri ayrı satırlar olarak raporlanır.
