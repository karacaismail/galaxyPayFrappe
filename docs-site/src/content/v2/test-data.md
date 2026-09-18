---
title: "Test kartları ve sandbox verileri"
description: "Sağlayıcı ekindeki 18 dummy kart, 3DS bilgisi, hesap ve merchant ihtiyaçları."
group: "Test verisi"
---

## Test kartları

**Kaynak:** kullanıcının sağladığı `GalaksiPay_Test_Kartları.txt`. Aşağıdaki 18 kayıt **yalnız sağlayıcı test ortamı için verilmiştir**. Kaynak dosyadaki `_` ayıracı giriş için çıkarıldı. `SKT (Yıl/Ay) = 2612`, arayüzde **12/26**; ayrı alan varsa ay **12**, yıl **2026**. CVV `000` string olarak korunur.

**Dosyayla doğrulandı; ödeme işlemiyle denenmedi.** Kartların bugün kabul edildiği veya her kartın belirli bir red/başarı senaryosu ürettiği iddia edilmez. Sağlayıcı, geçerliliğin değişebildiğini ve sorun halinde listedeki başka kartın denenmesini belirtmiştir. OTP yalnız bu test kartı listesinin SMS şifresidir; diğer gerçek hesap/işlemler için genellenmez.

<div class="test-card-grid">
<section class="test-card"><h3>CARD-01</h3><div class="pan-row"><code>6060432073705005</code><button type="button" class="button" data-copy-card="6060432073705005" aria-label="CARD-01 numarasını kopyala" hidden>Kopyala</button></div><p>SKT <strong>12/26</strong> · CVV <code>000</code><br>SMS test şifresi <code>123456</code></p></section>
<section class="test-card"><h3>CARD-02</h3><div class="pan-row"><code>5167400000496745</code><button type="button" class="button" data-copy-card="5167400000496745" aria-label="CARD-02 numarasını kopyala" hidden>Kopyala</button></div><p>SKT <strong>12/26</strong> · CVV <code>000</code><br>SMS test şifresi <code>123456</code></p></section>
<section class="test-card"><h3>CARD-03</h3><div class="pan-row"><code>4256691944867646</code><button type="button" class="button" data-copy-card="4256691944867646" aria-label="CARD-03 numarasını kopyala" hidden>Kopyala</button></div><p>SKT <strong>12/26</strong> · CVV <code>000</code><br>SMS test şifresi <code>123456</code></p></section>
<section class="test-card"><h3>CARD-04</h3><div class="pan-row"><code>4284624140544525</code><button type="button" class="button" data-copy-card="4284624140544525" aria-label="CARD-04 numarasını kopyala" hidden>Kopyala</button></div><p>SKT <strong>12/26</strong> · CVV <code>000</code><br>SMS test şifresi <code>123456</code></p></section>
<section class="test-card"><h3>CARD-05</h3><div class="pan-row"><code>4985170000702810</code><button type="button" class="button" data-copy-card="4985170000702810" aria-label="CARD-05 numarasını kopyala" hidden>Kopyala</button></div><p>SKT <strong>12/26</strong> · CVV <code>000</code><br>SMS test şifresi <code>123456</code></p></section>
<section class="test-card"><h3>CARD-06</h3><div class="pan-row"><code>4356292313685179</code><button type="button" class="button" data-copy-card="4356292313685179" aria-label="CARD-06 numarasını kopyala" hidden>Kopyala</button></div><p>SKT <strong>12/26</strong> · CVV <code>000</code><br>SMS test şifresi <code>123456</code></p></section>
<section class="test-card"><h3>CARD-07</h3><div class="pan-row"><code>5218487962459752</code><button type="button" class="button" data-copy-card="5218487962459752" aria-label="CARD-07 numarasını kopyala" hidden>Kopyala</button></div><p>SKT <strong>12/26</strong> · CVV <code>000</code><br>SMS test şifresi <code>123456</code></p></section>
<section class="test-card"><h3>CARD-08</h3><div class="pan-row"><code>5200190005138652</code><button type="button" class="button" data-copy-card="5200190005138652" aria-label="CARD-08 numarasını kopyala" hidden>Kopyala</button></div><p>SKT <strong>12/26</strong> · CVV <code>000</code><br>SMS test şifresi <code>123456</code></p></section>
<section class="test-card"><h3>CARD-09</h3><div class="pan-row"><code>5269737320050521</code><button type="button" class="button" data-copy-card="5269737320050521" aria-label="CARD-09 numarasını kopyala" hidden>Kopyala</button></div><p>SKT <strong>12/26</strong> · CVV <code>000</code><br>SMS test şifresi <code>123456</code></p></section>
<section class="test-card"><h3>CARD-10</h3><div class="pan-row"><code>4446763125813623</code><button type="button" class="button" data-copy-card="4446763125813623" aria-label="CARD-10 numarasını kopyala" hidden>Kopyala</button></div><p>SKT <strong>12/26</strong> · CVV <code>000</code><br>SMS test şifresi <code>123456</code></p></section>
<section class="test-card"><h3>CARD-11</h3><div class="pan-row"><code>6060433087290190</code><button type="button" class="button" data-copy-card="6060433087290190" aria-label="CARD-11 numarasını kopyala" hidden>Kopyala</button></div><p>SKT <strong>12/26</strong> · CVV <code>000</code><br>SMS test şifresi <code>123456</code></p></section>
<section class="test-card"><h3>CARD-12</h3><div class="pan-row"><code>4799150896081734</code><button type="button" class="button" data-copy-card="4799150896081734" aria-label="CARD-12 numarasını kopyala" hidden>Kopyala</button></div><p>SKT <strong>12/26</strong> · CVV <code>000</code><br>SMS test şifresi <code>123456</code></p></section>
<section class="test-card"><h3>CARD-13</h3><div class="pan-row"><code>5377193762823307</code><button type="button" class="button" data-copy-card="5377193762823307" aria-label="CARD-13 numarasını kopyala" hidden>Kopyala</button></div><p>SKT <strong>12/26</strong> · CVV <code>000</code><br>SMS test şifresi <code>123456</code></p></section>
<section class="test-card"><h3>CARD-14</h3><div class="pan-row"><code>5200190059838710</code><button type="button" class="button" data-copy-card="5200190059838710" aria-label="CARD-14 numarasını kopyala" hidden>Kopyala</button></div><p>SKT <strong>12/26</strong> · CVV <code>000</code><br>SMS test şifresi <code>123456</code></p></section>
<section class="test-card"><h3>CARD-15</h3><div class="pan-row"><code>5163103002982563</code><button type="button" class="button" data-copy-card="5163103002982563" aria-label="CARD-15 numarasını kopyala" hidden>Kopyala</button></div><p>SKT <strong>12/26</strong> · CVV <code>000</code><br>SMS test şifresi <code>123456</code></p></section>
<section class="test-card"><h3>CARD-16</h3><div class="pan-row"><code>5486742060635314</code><button type="button" class="button" data-copy-card="5486742060635314" aria-label="CARD-16 numarasını kopyala" hidden>Kopyala</button></div><p>SKT <strong>12/26</strong> · CVV <code>000</code><br>SMS test şifresi <code>123456</code></p></section>
<section class="test-card"><h3>CARD-17</h3><div class="pan-row"><code>5200190011811433</code><button type="button" class="button" data-copy-card="5200190011811433" aria-label="CARD-17 numarasını kopyala" hidden>Kopyala</button></div><p>SKT <strong>12/26</strong> · CVV <code>000</code><br>SMS test şifresi <code>123456</code></p></section>
<section class="test-card"><h3>CARD-18</h3><div class="pan-row"><code>4090700100360047</code><button type="button" class="button" data-copy-card="4090700100360047" aria-label="CARD-18 numarasını kopyala" hidden>Kopyala</button></div><p>SKT <strong>12/26</strong> · CVV <code>000</code><br>SMS test şifresi <code>123456</code></p></section>
</div>

[Test verisini JSON indir](/downloads/test-cards.json). Kaynak SHA-256: `3b3e4da87dd4acea73abb81dce9330a784e1715010941a596098bdd64ff292f2`. Kaynak kontrol tarihi: 18 Eylül 2026. Test raporunda PAN yerine `CARD-01` gibi referans ve gerekiyorsa son dört rakam kullan.

## Doğrudan kart ve cüzdan birbirinden farklı testlerdir

| Akış | Gerekli veri | Adımlar | Kabul |
|---|---|---|---|
| Doğrudan kart | Yetkili kendi test telefonunuz + listedeki kart | Hosted link → kart bilgisi → sunuluyorsa 3DS/OTP → sonuç | Callback/GetById eşleşmesi ve tek ödeme etkisi |
| Kayıtlı kart / cüzdan | Sağlayıcı test ortamında hesabı bulunan telefon | Yazışmadaki numara `TEST_WALLET_PHONE` olarak ekip test secret’ına alınır → hosted wallet akışı | Kayıtlı kart yolu ayrıca UAT; doğrudan kart başarısından çıkarılmaz |
| Dummy satıcı | Auth hesabıyla `GetSubMerchants` sonucu | İki dummy kaydı listeden belirle, aktif/ayar kontrolü, yerel Seller A/B mapping | ID ve hesabın kapsamı kanıtlı; sabit uydurma UUID kullanılmaz |
| Gerçek satıcı | Entegrasyon belgesi §2.3 ve sağlayıcı aktivasyonu | Alan listesini sağlayıcıdan al, güvenli ilet, onayı bekle | §2.1 bilgisi istenmiyor; §2.3 içeriği elimizde olmadığı için alan uydurulmaz |

Kayıtlı cüzdan telefonu yazışmada mevcut; public portala kişi/test hesabı tanımlayıcısı olarak kopyalanmadı. Test hesabı parolası da yerel demo veya ekip secret store’undan alınır. **Erişim yolu belgelenir; test kartı kataloğu erişilemez bırakılmaz.**

## Tekrar üretilebilir UAT kaydı

```json
{
  "run_id": "UAT-EXAMPLE-001",
  "environment": "sandbox",
  "card_ref": "CARD-01",
  "merchant_ref": "seed-seller-a",
  "order_no": "ORDER-SYNTHETIC-001",
  "payment_id": "<returned-id>",
  "expected": "verified-payment-and-one-business-effect",
  "observed": "not-run",
  "executed_at": null
}
```

Kart reddi tek başına ürün kusuru kanıtı değildir. Kullanılan kart ref, sağlayıcı işlem ref ve maskeli hata sınıfını kaydet; farklı kartla tekrar denemeden önce önceki attemptin belirsiz olmadığını kontrol et. UNKNOWN işlem için yeni tahsilat açma. Test red/timeout/duplicate senaryoları kart listesine yüklenmez; deterministic mock/fault injection ile üretilir.
