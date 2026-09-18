import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
const files=(await readdir('src/content/docs')).filter(f=>f.endsWith('.md'));
const pages=[];
for(const file of files){const text=await readFile(`src/content/docs/${file}`,'utf8');const title=JSON.parse(text.match(/^title: (.*)$/m)[1]);pages.push({file,title,body:text.replace(/^---[\s\S]*?---\s*/, '')});}
pages.sort((a,b)=>a.file.localeCompare(b.file,'tr'));
const roadmap=JSON.parse(await readFile('src/data/roadmap.json','utf8'));
const overview=roadmap.phases.map(p=>`| ${p.id} | ${p.name} | ${p.range} | ${p.duration} | ${p.gate} |`).join('\n');
const content=`# GalaksiPay · Geliştirme playbook\n\n18 Eylül 2026 · Plan v1.0 · 9 faz · 26 sprint · 78 iş kartı\n\nBu paket bir geliştirme planıdır; ödeme uygulamasının tamamlandığı anlamına gelmez. Tüm sprintler planlandı. V1 önceki mimari önerisi ve referans setidir; güncel Frappe planı /v2/ yolundadır. Her belgenin tam içeriği aşağıdadır; web bağlantıları build ortamının adresini kullanır.\n\n## Yol haritası\n\n| Faz | Ad | Sprint | Süre | Çıkış |\n|---|---|---|---|---|\n${overview}\n\n${pages.map(p=>`# ${p.title}\n\nKaynak: src/content/docs/${p.file}\n\n${p.body}`).join('\n\n---\n\n')}`;
await mkdir('public/downloads',{recursive:true});
const origin = process.env.SITE_BASE ? 'https://karacaismail.github.io'+process.env.SITE_BASE.replace(/\/$/,'') : 'http://localhost:4321';
await writeFile('public/downloads/galaksipay-playbook.md',content.replace(/\]\((\/[^)]*)\)/g, (_, url) => `](${origin}${url})`));
console.log(`Exported ${pages.length} documents.`);
const v2 = await readFile('src/content/v2/playbook.md','utf8');
const v2Bundle = '# GalaksiPay × Frappe · V2 geliştirme rehberi\n\n18 Eylül 2026 · Güncel mimari planı\n\n' + v2.replace(/^---[\s\S]*?---\s*/, '');
await writeFile('public/downloads/galaksipay-frappe-v2.md', v2Bundle.replace(/\]\((\/[^)]*)\)/g, (_, url) => `](${origin}${url})`));
console.log('Exported Frappe v2 playbook.');
