# GalaksiPay Developer Hub

Astro ile Türkçe geliştirici dokümantasyonu: 9 faz, 26 sprint, 78 iş kartı, 42 doküman. Kaynak demo kodu, kullanıcı yazışması ve 18 Eylül 2026 test OpenAPI şeması temel alınmıştır. Bu repo **plan ve doküman sitesi** içerir; üretim ödeme uygulaması değildir.

## Çalıştırma

Node 24 (minimum 22.12) ve npm 9.6.5+.

```sh
npm ci
npm run dev
```

http://localhost:4321

```sh
npm run verify
npm run preview
```

## Düzenleme

- `src/content/docs/*.md`: dokümanlar ve sprint ayrıntıları.
- `src/data/roadmap.json`: faz ve sprint kartlarının tek veri kaynağı; ID/başlık değişince ilgili Markdown sayfasını da güncelle.
- `src/data/navigation.ts`: gezinme.
- `src/styles/global.css`: arayüz; tüm metinler en az 1rem.
- `public/downloads/provider-contract.json`: seçilmiş provider sözleşme snapshotı (tam OpenAPI değil).
- `scripts/export-docs.mjs`: Markdown paketi her buildde oluşturulur.
- `scripts/verify.mjs`: build sonrası iç bağlantı, anchor ve plan tutarlılığı kontrolleri.

Arama tüm belgelerin içeriğini kapsar (Cmd/Ctrl+K). Faz filtreleri ve sprint açılır panelleri çalışır. Tema ve sprint hazırlık kutuları sadece yerel tarayıcıda saklanır; ekip proje yönetim sistemi değildir. Checklistler resmi kabul durumunu değiştirmez.

## Güven sınırı

Bu statik site hiçbir GalaksiPay hesabına giriş yapmaz ve ödeme/iade çağrısı göndermez. Orijinal demo, credentiallar ve test kartları `public` veya build içine eklenmez. Sağlayıcı davranışının doğrulanmamış kısımları açık soru olarak kayıtlıdır. Site noindex içerir; bu erişim kontrolü değildir. Dış yayın için host tarafında erişim politikasını belirleyin.

Ödeme API uygulaması ve onun testleri gelecekteki sprint kapsamıdır. Doküman build başarısı ödeme entegrasyonunun test edildiği anlamına gelmez.
