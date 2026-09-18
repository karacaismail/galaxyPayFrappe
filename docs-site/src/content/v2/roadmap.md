---
title: "Core → maturity yol haritası"
description: "Her sprintte geliştirilecek modül, ilk test, veri ve teslim kanıtı."
group: "Geliştirme"
---

## Çalışma sırası

**Core development → MVP → post-MVP → finans → dayanıklılık → güvenlik/DX → enterprise → maturity.** Güvenlik ve finansal doğruluğun temeli core/MVP’dedir; sonraki fazlar ileri kabiliyetleri ekler.

Sprintler takvim vaadi değildir. Bir sprintte en fazla üç dikey dilim; ekip kapasitesi C01/C02 sonunda ölçülür. Canlı bağımlılığı olan iş mockla ilerleyebilir, canlı gate açık kalır. Önceki 18–20 gün ve 26 sprint takvimleri bu planın tahmini değildir.

## Faz 0 · Core development

**Faz çıkışı:** Gerçek test DB’sinde domain/izin invariantları; deterministic mock ve repeatable seed; CI negatif testi yakalıyor.

<span id="c01"></span>
### C01 · Domain ve yetki çekirdeği

**Sahip:** BE + QA · **Önkoşul:** ürün/sürüm/test ortamı kararı · **Durum:** planlandı.

**Geliştirilecek:**

- Payment Order / Attempt / Membership DocType ve migration
- Minor-unit para, durum makinesi, sipariş versiyonu, rol/nesne kontrolü
- Tekrarlanabilir test site/seed ve DB test katmanı

**Önce başarısız olacak testler:**

| Test / katman | Given | When | Then |
|---|---|---|---|
| `UT_money_exact` · unit | 12550 kuruş ve bozuk/negatif değerler | Tutar normalize edilir | 125.50 kayıpsız; bozuk/negatif reddedilir |
| `IT_seller_isolation` · integration / MariaDB | Seller A ve B aynı sitede | A, B’nin liste/detay/dosyasını ister | Veri dönmez; doğrudan method da reddeder |
| `UT_state_monotonic` · unit | SUCCEEDED attempt | Geç PENDING uygulanır | Durum ve sipariş etkisi değişmez |

**Test verisi:** Buyer A/B; Seller A/B; paid/pending/unknown orders

**Teslim kanıtı:** Test fail/pass logu + migration/rollback + izin matrisi

<span id="c02"></span>
### C02 · Provider portu ve test düzeneği

**Sahip:** BE + FE + QA · **Önkoşul:** C01 · **Durum:** planlandı.

**Geliştirilecek:**

- Python GalaksiPay adapter arayüzü + deterministic mock
- Auth/body/error parser; secret/env doğrulama ve snapshot pin
- FE shared DTO/client, ayrı Vite/Vue entry ve 320 profile loader

**Önce başarısız olacak testler:**

| Test / katman | Given | When | Then |
|---|---|---|---|
| `CT_auth_shape` · contract | Onaylı olmayan/bozuk token gövdesi | Auth parser çalışır | Token var sanılmaz; contract error |
| `CT_add_shape` · contract | 200 fakat Id/PaymentUrl eksik | Add sonucu okunur | Başarı kabul edilmez |
| `UI_desktop_asset_leak` · browser / build | 320 CSS px yeni context | Public route açılır ve menü kullanılır | Desktop JS/CSS ve Vue admin artifacti 0 |

**Test verisi:** Schema snapshot + synthetic auth/add/status fixtures; gerçek UAT fixture ayrı

**Teslim kanıtı:** Contract raporu + build asset manifesti/HAR; C01/C02 sürüm matrisi

## Faz 1 · MVP

**Faz çıkışı:** Alıcı tahsilat → satıcı görünürlüğü → ops recovery çalışır. Kritik negatif testler ve ayrı sandbox UAT/pilot kabulü tamam.

<span id="m01"></span>
### M01 · İdempotent ödeme başlatma

**Sahip:** BE + FE + QA · **Önkoşul:** C02 · **Durum:** planlandı.

**Geliştirilecek:**

- Sipariş sahibi/CSRF/server tutarı/aktif merchant doğrulaması
- Durable intent + DB unique key + commit sonrası worker
- Hosted PaymentUrl yönlendirmesi ve aynı attempti sürdürme

**Önce başarısız olacak testler:**

| Test / katman | Given | When | Then |
|---|---|---|---|
| `IT_double_start` · concurrency / MariaDB | Aynı order/version, 20 eşzamanlı istek | Start çağrılır | 1 intent; en fazla 1 provider dispatch |
| `IT_unknown_add` · fault injection | Provider Add işlendi, cevap veya worker kayboldu | Job yeniden çalışır | UNKNOWN; kör ikinci Add yok |
| `IT_start_authorization` · HTTP integration | Başka buyer IDsi veya geçersiz CSRF | Start çağrılır | Provider çağrısı 0 |

**Test verisi:** Mock success/timeout; CARD-01 yalnız sandboxta; aktif/pasif merchant

**Teslim kanıtı:** DB/spy assertion + Add crash matrisi + 320 checkout E2E

<span id="m02"></span>
### M02 · Callback, doğrulama ve kurtarma

**Sahip:** BE + FE + QA · **Önkoşul:** M01 · **Durum:** planlandı.

**Geliştirilecek:**

- Durable inbox + schema/kaynak doğrulama + hızlı ACK sınırı
- GetById ile kimlik/tutar/merchant kontrolü + unique effect/outbox
- Scheduler: enqueue kaybı, kayıp callback, UNKNOWN/review

**Önce başarısız olacak testler:**

| Test / katman | Given | When | Then |
|---|---|---|---|
| `IT_callback_duplicate` · concurrency / MariaDB | Aynı event 100 kez | Aynı anda teslim edilir | Tek iş etkisi; inbox kanıtı korunur |
| `IT_callback_mismatch` · integration | Amount/merchant/order çelişkili | Callback + provider sorgu işlenir | REVIEW_REQUIRED; fulfillment 0 |
| `IT_queue_gap` · fault injection | DB commit oldu, enqueue öncesi süreç öldü | Scheduler çalışır | İş bulunur; Add tekrar edilmez |

**Test verisi:** callback synthetic JSON + bozuk payload + pending/success ters sıra

**Teslim kanıtı:** Commit/rollback + crash recovery logu; Q01/Q02/Q06 kanıtları

<span id="m03"></span>
### M03 · Üç rolün minimum ekranı

**Sahip:** BE + FE + QA · **Önkoşul:** M02 · **Durum:** planlandı.

**Geliştirilecek:**

- Buyer: özet/redirect/pending/sonuç; yenileme desteği
- Seller: aktivasyon/liste/detay/destek
- Vue ops: mapping/işlem/review/refresh/kill switch

**Önce başarısız olacak testler:**

| Test / katman | Given | When | Then |
|---|---|---|---|
| `UI_buyer_resume` · E2E mock | 3DS sonrası sekme yenilenir | Sonuç tekrar açılır | Aynı attempt; duplicate ödeme yok |
| `UI_role_scope` · E2E + permission | Aynı işlem IDsi üç rolle | Ekran ve API açılır | Sadece izinli alan/eylem görünür ve çalışır |
| `UI_ops_refresh` · E2E mock | UNKNOWN kayıt | Ops tekrar sorgula seçer | GetById; Add çağrısı 0 |

**Test verisi:** 3 rol seed; unknown/pending/success; uzun Türkçe etiket

**Teslim kanıtı:** Rol E2E + 320/390/768/1280 screenshot + keyboard/focus

<span id="m04"></span>
### M04 · Sandbox kabulü ve dar pilot

**Sahip:** BE + FE + QA · **Önkoşul:** M03 · **Durum:** planlandı.

**Geliştirilecek:**

- Doğrudan kart ve gerekiyorsa kayıtlı kart UAT
- TLS/domain/secret/merchant aktivasyon; alarm ve kill switch
- Manuel iade/itiraz yolu; backup/restore/rollback ve destek devri

**Önce başarısız olacak testler:**

| Test / katman | Given | When | Then |
|---|---|---|---|
| `UAT_hosted_payment` · sandbox / manuel kontrollü | Güncel listedeki test kartı, yetkili hesap | Hosted ödeme tamamlanır | Add ID/callback/GetById roundtrip aynı işlemi gösterir |
| `OPS_restore` · restore rehearsal | Açık attempt içeren yedek | Staginge restore edilir | Kayıp tahsilat yok; sorgu ile toparlanır |
| `OPS_kill_switch` · integration + ops | Yeni start kapalı | Start ve callback aynı anda gelir | Start durur; callback/recovery sürer |

**Test verisi:** CARD-01…18; iki dummy merchant; gerçek satıcı pilot için ayrıca aktif

**Teslim kanıtı:** UAT run ID + kullanılan maskeli kart ref + provider teyitleri + iş sahibi kabulü

## Faz 2 · Post-MVP

**Faz çıkışı:** Onboarding/cüzdan ve teyitli iade/iptal uçları testli; platform etkileri auditli.

<span id="p01"></span>
### P01 · Satıcı self-service ve cüzdan

**Sahip:** BE + FE + QA · **Önkoşul:** M04 · **Durum:** planlandı.

**Geliştirilecek:**

- §2.3 teyitli onboarding, private belge ve durum
- Satıcı davet/rol iptali ve hesap kurtarma deneyimi
- Kayıtlı kart ile doğrudan kart ayrı akış ve feature flag

**Önce başarısız olacak testler:**

| Test / katman | Given | When | Then |
|---|---|---|---|
| `IT_membership_revocation` · integration | Üye erişimi iptal edildi | Liste/detay/dosya yeniden istenir | Üçü de reddedilir |
| `UAT_wallet` · sandbox | Yetkili kayıtlı kart test telefonu | Cüzdanla ödeme yapılır | Kart kaydı bizde tutulmadan doğrulanmış sonuç |
| `IT_private_file` · HTTP integration | Seller B belgesi | Seller A indirme URLsi kullanır | Dosya baytı dönmez |

**Test verisi:** Davet/revoke seed; §2.3 form fixture; TEST_WALLET_PHONE erişimi

**Teslim kanıtı:** UAT + dosya izin testi; onboarding red/onay senaryosu

<span id="p02"></span>
### P02 · İade ve iptal operasyonu

**Sahip:** BE + Finans + QA · **Önkoşul:** M04 · **Durum:** planlandı.

**Geliştirilecek:**

- Refund Request ve requester/approver ayrımı
- Teyitli Refund/Void adapterı, ayrı idempotency
- İade belirsizliği inceleme ve müşteri durum ekranı

**Önce başarısız olacak testler:**

| Test / katman | Given | When | Then |
|---|---|---|---|
| `IT_refund_duplicate` · concurrency | Aynı onaylı iade | 20 tekrar/eşzamanlı komut | Tek mali etki; toplam iade sınırı |
| `IT_refund_unknown` · fault injection | İade kabul edildi, yanıt kayıp | Worker retry | İkinci iade yok; sorgu/manual case |
| `IT_void_window` · contract + domain | İzinli pencere dışı işlem | Void istenir | Açık hata; sipariş iptalini banka iptali sanmaz |

**Test verisi:** Q07 kanıtlı success/refused/timeout fixture; kısmi iade yalnız teyitle

**Teslim kanıtı:** Finans onaylı senaryo + fault test + audit trail

## Faz 3 · Finansal doğruluk

**Faz çıkışı:** Sipariş/provider/settlement ayrımı ve tüm farkların sahibi belli; net/brüt raporu kanıtla yeniden üretilebilir.

<span id="f01"></span>
### F01 · Mutabakat ve raporlama

**Sahip:** BE + Finans + QA · **Önkoşul:** P02 · **Durum:** planlandı.

**Geliştirilecek:**

- Provider tarih sorgusu + teyitli settlement importu
- Fark, komisyon/net ve geç kayıt kuyruğu
- Maskeli CSV, chargeback kanıt dosyası ve dönem kapanışı

**Önce başarısız olacak testler:**

| Test / katman | Given | When | Then |
|---|---|---|---|
| `IT_reconcile_late` · integration | Geç settlement + UTC sınırı | Aynı dönem iki kez işlenir | Eksik/fazla fark doğru, duplicate 0 |
| `IT_csv_formula` · security | Formül ile başlayan satıcı alanı | CSV indirilir | Formül çalıştıran değer üretilmez |
| `IT_finance_scope` · permission | Finans A kapsamı | B raporu istenir | Yetkisiz satır yok |

**Test verisi:** Q09 teyitli dosya/sorgu + brüt/net/farklı komisyon seed

**Teslim kanıtı:** Kaynak toplamları ile rapor eşitliği; finans sign-off

## Faz 4 · Dayanıklılık

**Faz çıkışı:** Hedef yük ve arıza altında kabul edilmiş SLO/RPO/RTO ölçülür; on-call sorumlusu ve replay prosedürü belli.

<span id="r01"></span>
### R01 · Yük, kuyruk ve kurtarma

**Sahip:** Platform + BE + QA · **Önkoşul:** M04 · **Durum:** planlandı.

**Geliştirilecek:**

- Rate limit/backpressure, DLQ ve güvenli replay
- İşlem korelasyonu, metriği/alarmı ve incident runbook
- Yedek/anahtar geri yükleme ve rollout/rollback otomasyonu

**Önce başarısız olacak testler:**

| Test / katman | Given | When | Then |
|---|---|---|---|
| `LOAD_queue_limit` · load / mock | Kararlaştırılmış 2x tepe yük | Worker yavaşlatılır | Bellek/kuyruk sınırlı; kayıp olay yok |
| `OPS_restore_key` · ops | DB ve encryption key yedeği | Kayıp ortam kurtarılır | Secret/işler açılır; RPO/RTO raporlu |
| `IT_replay_effect` · integration | DLQda tamamlanmış event | Replay yapılır | Para etkisi yinelenmez |

**Test verisi:** Mock provider, kontrollü Redis/DB/worker faultları

**Teslim kanıtı:** Yük grafiği + restore süresi + alarm/tatbikat kaydı

## Faz 5 · Güvenlik ve DX olgunluğu

**Faz çıkışı:** Bağımsız güvenlik incelemesi, retention/rotasyon ve sözleşme drift kapısı çalışır; kritik açık canlıyı engeller.

<span id="dx01"></span>
### DX01 · Güvenlik ve geliştirici akışı

**Sahip:** BE + Güvenlik + DX · **Önkoşul:** M04 · **Durum:** planlandı.

**Geliştirilecek:**

- Bağımsız izin/ödeme incelemesi; retention ve secret rotation
- OpenAPI diff + fixture/schema uyum kapısı
- Tek komut mock onboarding ve sürüm yükseltme provası

**Önce başarısız olacak testler:**

| Test / katman | Given | When | Then |
|---|---|---|---|
| `SEC_rotate_secret` · integration | Yeni/iptal edilmiş credential | Çağrı ve eski token denenir | Yeni çalışır; eski yetki kalkar |
| `CT_breaking_change` · CI contract | Required alan/enum kırıcı değişmiş | Snapshot PR açılır | CI kırıcı farkı yakalar |
| `DX_clean_checkout` · developer smoke | Temiz ortam | Kurulum + seed + mock akış | Belgelendiği biçimde tekrar üretilebilir |

**Test verisi:** Redakte snapshot pair, retention expiry seed, kurulum matrisi

**Teslim kanıtı:** Pentest kapanışı + CI failure sample + onboarding süre kaydı

## Faz 6 · Enterprise readiness

**Faz çıkışı:** Sözleşme/ölçek ihtiyacı varsa SSO/MFA, görev ayrılığı ve izolasyon ayrı kanıtla kabul edilir.

<span id="e01"></span>
### E01 · Kurumsal erişim ve izolasyon

**Sahip:** Platform + Güvenlik + QA · **Önkoşul:** DX01, R01 · **Durum:** planlandı.

**Geliştirilecek:**

- SSO/MFA ve erişim gözden geçirme; SCIM yalnız ihtiyaçla
- Gerekirse site-per-tenant ve geçiş stratejisi
- Audit exportu, görev ayrılığı ve destek sorumlulukları

**Önce başarısız olacak testler:**

| Test / katman | Given | When | Then |
|---|---|---|---|
| `IT_sso_revocation` · integration | IdP kullanıcısı devre dışı | Eski session/API kullanılır | Kabul edilen süre içinde erişim biter |
| `IT_tenant_escape` · security | Tenant A yönetici IDsi | B API/file/export istenir | Veri/yan etki yok |
| `IT_approval_separation` · domain | Talep sahibi onay vermeye çalışır | Finans komutu çalışır | Aynı kişi kendi işlemini onaylayamaz |

**Test verisi:** Test IdP + iki tenant + rol matrisi

**Teslim kanıtı:** Müşteri kapsamına göre kabul raporu; SSO/izolasyon testleri

## Faz 7 · Maturity / sürekli gelişim

**Faz çıkışı:** Olgunluk iddiası gözlem ve tekrar eden kontrollerle desteklenir; eksik kanıt varsa tarih yerine açık eksik raporlanır.

<span id="mt01"></span>
### MT01 · Kanıta dayalı olgunluk döngüsü

**Sahip:** Hizmet sahibi + Finans + QA · **Önkoşul:** F01, R01, DX01 · **Durum:** planlandı.

**Geliştirilecek:**

- SLO, maliyet, incident ve finans farkları için dönem incelemesi
- Restore/revoke/finans kapanışı tatbikatlarını tekrar et
- İş değerine göre çoklu provider/taksit/abonelik keşfi

**Önce başarısız olacak testler:**

| Test / katman | Given | When | Then |
|---|---|---|---|
| `OPS_maturity_evidence` · audit sample | Projenin kararlaştırdığı en az 90 günlük kayıt hedefi | Örnek olay ve işlem izlenir | Kaynak → durum → finans → sorumlu zinciri kopmaz |
| `OPS_repeat_restore` · ops | Yeni sürüm ve güncel yedek | Bağımsız kişi restore eder | RPO/RTO tekrar sağlanır |
| `EXP_provider_flag` · contract + E2E | İkinci provider denemesi kapatıldı | Yeni ödeme ve açık attempt işlenir | Yeni trafik durur; açık işler doğru adapterda sürer |

**Test verisi:** Gerçek dönemden maskeli kanıt; sentetik tatbikat vakaları

**Teslim kanıtı:** Dönem değerlendirmesi + bağımsız reviewer; dış sertifika iddiası değil

## Her sprintin Definition of Done

İlgili testin RED kaydı ve GREEN komutu; gerçek DB/rol sınırı gereken yerde testli; fixture ve doküman güncel; migration/rollback varsa prova; UI’da 320/keyboard/network; reviewer; açık Q ve UAT durumları doğru etiketli. Finansal yanlış etki veya izolasyon ihlali varken sonraki faza geçilmez.
