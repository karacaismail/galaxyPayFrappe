# galaxyPayFrappe · Developer docs

[**Güncel geliştirici merkezi**](https://karacaismail.github.io/galaxyPayFrappe/v2/) · [API referansı](https://karacaismail.github.io/galaxyPayFrappe/v2/api/) · [18 test kartı](https://karacaismail.github.io/galaxyPayFrappe/v2/test-data/) · [Core → maturity](https://karacaismail.github.io/galaxyPayFrappe/v2/roadmap/)

Astro doküman sitesi. **Frappe ödeme backend’i ve Vue/TypeScript ürün arayüzleri henüz geliştirilmedi.** Kaynak e-posta, C# demo ve 18 Eylül 2026 OpenAPI şemasıdır.

- 23 güncel DX dokümanı; quickstart, test verisi, 10 operasyon referansı, 12 model, callback fixture, TDD ve açık kararlar.
- 8 faz / 13 sprint / 39 RED senaryosu: core development → MVP → post-MVP → finans → dayanıklılık → güvenlik/DX → enterprise → maturity.
- Sağlayıcının 18 **dummy sandbox kartı** kayıpsız dokümante edilir. Kartların fiili kabulü denenmedi. Hesap parolası ve kayıtlı cüzdan telefonu public çıktıda yok.
- 320 CSS px ortak taban, minimum 1rem; seçilen compact/desktop JS ve CSS modülleri. Güncel içerik kökten açılır; eski plan `/v1/` arşivindedir.

```sh
cd docs-site
npm ci
npm run test:docs
npm run dev
```

Yerel: http://127.0.0.1:4321/v2/

```sh
npm run verify
SITE_BASE=/galaxyPayFrappe npm run verify
SITE_BASE=/galaxyPayFrappe npm run preview -- --port 4322
```

`main` pushu GitHub Actions ile test → build → Pages deployment çalıştırır. Pages yalnız statik dokümandır; callback/Frappe servisi değildir. Orijinal demo ve ekler git dışında kalır; doğrulanmış dummy kart referansı ayrıca yayımlanır.

[Site geliştirme notları](docs-site/README.md) · [Doğrulama kaydı](docs-site/VERIFICATION.md) · [Eksik ve gereksiz içerik analizi](https://karacaismail.github.io/galaxyPayFrappe/v2/audit/)
