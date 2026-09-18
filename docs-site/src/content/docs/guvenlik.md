---
title: "Güvenlik ve veri sınırları"
description: "MVP kontrolleri ve sonraki yönetişim derinliği."
group: "Kalite & işletim"
---

## MVPden başlayan kontroller

- Credential, token ve API çağrıları sunucuda; environment secret store; test/prod ayrımı ve rotasyon.
- Backend authentication/authorization, order ownership, tenant filtresi ve merchant allowlist.
- Callback doğrulama/sorgu, replay ve duplicate koruması; browser mesajı güven sinyali değildir.
- Sunucu tutar hesabı, decimal para, eşzamanlılık ve idempotency.
- HTTPS sertifika doğrulaması; güvenilir proxy listesi; sabit callback URL; PaymentUrl host allowlist.
- Input boyut/şema sınırı; session tabanlı komutlarda CSRF politikası; CORS origin sınırı.
- Log/response field allowlist; raw body erişim sınırı ve asgari saklama; dependency/secret taraması.
- Yedek, restore provası, alarm sorumlusu ve deployment geri dönüşü.

S14 güvenliğe başlama tarihi değildir; S01–S04 kontrollerinin bağımsız test ve yönetişimle derinleştirilmesidir. HTTPS, erişim kontrolü, veri doğrulama ve güvenli hata tasarımı için [OWASP REST rehberi](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html) referanstır.

## Kart ve kişisel veri

Kart PAN/CVV saklama veya kendi formunda toplama bu tasarımda yok. Hosted checkout kullanımı PCI yükümlülüklerini kendiliğinden ortadan kaldırmaz; doğru kapsamı sağlayıcı, banka ve ilgili uzmanla teyit et. [PCI SSC merchant kaynakları](https://www.pcisecuritystandards.org/merchants/) değerlendirmeye başlangıçtır; bu plan PCI sertifikasyonu beyanı değildir.

Telefon, ad/soyad ve işlem referansları amaç ve rol bazlı işlenir. Dokümanlarda gerçek kişi/test hesabı telefonları çoğaltılmaz. Uygulanacak KVKK, saklama, aktarım ve veri sorumluluğu kararları hukuk/veri sahibi tarafından alınmalıdır; burada hukuki uygunluk hükmü veya keyfi zorunlu saklama süresi verilmez.

## Uygulama önerileri

PaymentUrl token taşıyabilir; `Referrer-Policy: no-referrer`, üçüncü taraf script minimizasyonu ve token redaction kullan. API response’da ham MasterpassResponseRawJson, credential veya auth token dönme. Cookie kullanılıyorsa Secure/HttpOnly ve iş akışına uygun SameSite belirle. Callbackin CSRF istisnası kullanıcı komutlarına yayılmamalı; callback ayrı kimlik doğrulama modeline sahip.

Portal statik içeriktir; robots noindex erişim kontrolü sayılmaz. İç dokümanı internet üzerinde yayınlamak istenirse host seviyesinde kimlik/erişim politikası gerekir. Bu teslim yalnızca localhostta açılır.

## Erişilebilirlik kalite hedefi

Metin, kod, badge, tablo ve gezinme dahil **minimum 1rem**; root varsayılanı 16px, kullanıcı font tercihi korunur. Klavye odağı, atla bağlantısı, başlık sırası, yeterli kontrast, responsive tablolar ve azaltılmış hareket desteği. WCAG 2.2 AA hedefi bir denetim sonucuyla desteklenmelidir; yalnızca font boyutu uyum kanıtı değildir. [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/).
