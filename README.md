# galaxyPayFrappe · Geliştirici rehberi

[**Güncel V2 rehberi →**](https://karacaismail.github.io/galaxyPayFrappe/v2/) · [V1 doküman seti](https://karacaismail.github.io/galaxyPayFrappe/) · [V2 Markdown](https://karacaismail.github.io/galaxyPayFrappe/downloads/galaksipay-frappe-v2.md)

Astro ile Türkçe GalaksiPay entegrasyon planı. **Bu repo dokümantasyon sitesidir; ödeme backend’i henüz uygulanmadı.**

- **V2:** Frappe custom app, Vue headless admin, TypeScript/Vite + Tailwind/Flowbite/Alpine.js frontpages. Alıcı, satıcı ve platform için 28 senaryo, 24 iş kartı; MVP öncesi → MVP → post-MVP → enterprise/maturity.
- **V1:** önceki mimari önerisi ve ayrıntılı API/test/operasyon referansı; 9 faz, 26 sprint, 78 kart, 42 belge. V1 takvimi güncel Frappe MVP takvimi değildir.
- **Adaptive V2 portal:** 320 px taban, minimum 1rem metin. Ortak kod + seçilen kompakt/masaüstü JS ve CSS modülü. Masaüstü gezinmesi mobilde gizlenmiş DOM olarak gönderilmez.

## Yerel geliştirme

```sh
cd docs-site
npm ci
npm run dev
```

Yerel V2: http://127.0.0.1:4321/v2/

```sh
# Yerel kök adres ve GitHub Pages alt yolu
npm run verify
SITE_BASE=/galaxyPayFrappe npm run verify
SITE_BASE=/galaxyPayFrappe npm run preview -- --port 4322
```

Son komuttan sonra: http://127.0.0.1:4322/galaxyPayFrappe/v2/

## Yayın ve kapsam

`main` pushu `.github/workflows/pages.yml` ile kontrol → build → GitHub Pages deployment çalıştırır. Kaynak ve Pages herkese açıktır. GitHub Pages yalnızca Astro’nun statik çıktısını sunar; Frappe, DB ve worker ayrı uygulama ortamında çalışacaktır.

Orijinal `GalaksipayDemo/` ve `GalaksiPay_Test_Kartları.txt` sağlayıcı materyalidir; git tarafından yok sayılır. Credentiallar, gerçek telefonlar ve test kartı bilgileri public çıktıya eklenmez. Sağlayıcı hesabına giriş veya ödeme/iade çağrısı yapılmadı.

[Site geliştirme rehberi](docs-site/README.md) · [Doğrulama kaydı](docs-site/VERIFICATION.md)
