---
title: "Faz kabul kapıları"
description: "Takvim değil, kanıt fazı tamamlar."
group: "Planlama"
---

## Kapılar ve çıkış kanıtı

| Kapı | Sprint | Asgari kanıt | Karar sahibi |
|---|---|---|---|
| G1 · MVP | S04 | TC01–16, callback güven modeli, idempotency/UNKNOWN çözümü, secret sınırı, merchant aktivasyonu, alarm/restore/rollback | TL + PO + Operasyon + Finans |
| G2 · Post-MVP | S07 | İki merchant izolasyonu, cüzdan/doğrudan UAT, erişilebilirlik ve destek vaka çözümü | PO + QA + Operasyon |
| G3 · Finans | S10 | İade/iptal kontrollü senaryo, günlük mutabakat ve örnek dönem kapanışı | Finans + TL |
| G4 · Dayanıklılık | S13 | Worker recovery, 2x hedef yük, ölçülen restore, kademeli rollout | Platform + TL |
| G5 · Yönetişim | S16 | Açık kritik/yüksek güvenlik bulgusu 0, retention, erişim review, SBOM ve audit | Güvenlik + veri sahibi |
| G6 · DX | S19 | Contract breaking gate, derlenen SDK örneği, ≤30 dk onboarding, docs görev testi | TL + DX |
| G7 · Enterprise | S22 | SSO/MFA, görev ayrılığı, tenant izolasyonu, hizmet sahipliği ve kabul | Hizmet sahibi + Güvenlik |
| G8 · Maturity | S25 | ≥90 gün metrik, bağımsız örnekleme, 5 alanda ≥2/3, kritik açık 0 | PO + bağımsız reviewer |
| G9 · Sürekli gelişim | S26 ve sonrası | Ölçülen deney, maliyet/değer kararı, sonraki iki sprintin DoR’ı | PO + TL |

## G1 iki ayrı karardır

**Sandbox MVP kabulü:** kritik ödeme/test akışı sandbox veya açıkça belirtilen mockta çalışıyor; sağlayıcı eksikleri görünür. **Canlı pilot kabulü:** Q01/02/03/04/05/06/08/10/11/12 gereksinimleri gerekli kapsamda teyitli; prod credential, satıcı, limitler ve erişilebilir callback hazır; operasyon ve finans sorumlusu var. Sandbox kabulü otomatik üretim izni değildir. İlk pilot sınırlı satıcı/hacim ve kill switch ile açılır.

## Maturity skoru

0 = tanımlı değil/kanıt yok. 1 = dokümante ve sahipli. 2 = uygulanmış, test edilmiş, en az 90 günlük gözlemle destekli. 3 = düzenli ölçülen, tatbikat ve bağımsız review ile iyileştirilen. Alanlar: ödeme/finans doğruluğu, güvenlik/veri, güvenilirlik/işletim, teslim/DX, ürün/yönetişim. Ortalamayla kritik zayıflık gizlenmez; her alan en az 2 olmalıdır. “Enterprise grade” ve “maturity ready” bu projenin ölçütleridir, dış sertifika değildir.

## Karar tutanağı

Kapı ID, sürüm/commit, ortam, kanıt bağlantıları, açık risk/istisna, karar (go/no-go/koşullu sandbox), karar sahipleri, tarih, gözlem penceresi ve geri dönüş tetikleri. Hiçbir kart şimdiden kabul edilmiş değildir. Sonraki faz keşfi yapılabilir ama karşılanmayan kapıdan canlı özellik sızdırılmaz.
