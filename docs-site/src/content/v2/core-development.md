---
title: "Core development"
description: "MVP’den önce kurulacak domain, adapter, test ve frontend temeli."
group: "Geliştirme"
---

## Core’un somut çıktısı

Core yalnız repo/CI kurulumu değildir. Gerçek test DB’sinde sipariş–ödeme niyeti ilişkisi, tek mali etki, rol/nesne izni ve provider sınırı çalışmadan checkout ekranı “tamam” sayılmaz.

| Modül | İlk başarısız test | Geliştirilecek en küçük davranış | Geçiş kanıtı |
|---|---|---|---|
| Para / durum | Negatif tutar kabul edilir; geç pending successi geri alır | Minor-unit/Decimal ve izinli geçiş fonksiyonları | Unit test + sınır değerleri |
| Kimlik / üyelik | Seller A, B’nin kaydını görür | Liste + kayıt + private file yetkisi | Gerçek rollerle HTTP/DB testi; Administrator kullanılmaz |
| Order / Attempt | Aynı order için iki etkin niyet oluşur | MariaDB unique/lock, version ve idempotency record | İki bağlantıyla yarış testi |
| Provider portu | Bozuk 200 yanıtı başarı sanılır | Tipli request/response parser ve fail-safe adapter | Sabit OpenAPI + synthetic/teyitli fixture ayrımı |
| Inbox / effect | Tek event iki fulfillment üretir | Kalıcı inbox ve unique business effect | Concurrency + rollback testi |
| Worker / scheduler | Commit→enqueue arası çöküş işi kaybettirir | Enqueue-after-commit + kalıcı pending taraması | Süreç öldürme/fault test |
| UI client | Browser amount/merchant değiştirir | Backend kaynaklı DTO ve ortak hata sözlüğü | HTTP negatif test + UI E2E |
| Adaptive temel | 320 px’de desktop chunk indirilir | Ayrı entry ve koşullu import/CSS asseti | Production build network kaydı |

## Yapılacaklar sırası

1. Frappe/Bench/Python/Node/MariaDB/Redis compatibility matrisini seçilen sürümün resmi gereksinimleriyle sabitle. Bu repoda Frappe kurulumu bulunmadığı için sürüm varsayılmaz.
2. İzole test sitesi, custom app, migration ve Buyer A/B / Seller A/B / Ops / Finance seedini oluştur.
3. C01 testlerini **önce kırmızı** çalıştır: para, durum, nesne izinleri; implementasyonu küçük domain komutlarıyla ekle.
4. C02’de provider portu + deterministic mock + contract fixtureları; backend testleri gerçek sağlayıcıya çıkmaz.
5. Buyer/seller TypeScript/Vite entryleri, Vue admin ayrı build; framework içermeyen contracts ve design tokens paketi.
6. CI’da unit → DB/permission → contract → production frontend build/E2E; sandbox UAT ayrı manuel/korumalı iş.

## Sınırlar

Frappe core fork edilmez; custom app kullanılır. ERPNext ancak mevcut iş sistemi gerektiriyorsa bağlanır. Domain kodunun testinde her şey mocklanmaz: unique/transaction/permission davranışı MariaDB ve Frappe test site üzerinde doğrulanır. Test amaçlı provider portu yalnız network sınırını taklit eder.

## C01/C02 bitiş kontrolü

Temiz kurulum + seed tekrar üretilebilir; role göre veri izolasyonu kanıtlı; bozuk provider yanıtı kontrollü hata; secret browser bundle’da yok; 320 px’de desktop asset yok. Bu kapıdan sonra [MVP M01](/v2/roadmap/#m01) başlar. Açık callback imzası/ID/idempotency konuları mock ilerlemesini durdurmaz, canlı geçişi engeller.
