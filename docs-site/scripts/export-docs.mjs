import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
const files=(await readdir('src/content/docs')).filter(f=>f.endsWith('.md'));
const pages=[];
for(const file of files){const text=await readFile(`src/content/docs/${file}`,'utf8');const title=JSON.parse(text.match(/^title: (.*)$/m)[1]);pages.push({file,title,body:text.replace(/^---[\s\S]*?---\s*/, '')});}
pages.sort((a,b)=>a.file.localeCompare(b.file,'tr'));
const roadmap=JSON.parse(await readFile('src/data/roadmap.json','utf8'));
const overview=roadmap.phases.map(p=>`| ${p.id} | ${p.name} | ${p.range} | ${p.duration} | ${p.gate} |`).join('\n');
const content=`# GalaksiPay · Geliştirme playbook\n\n18 Eylül 2026 · Plan v1.0 · 9 faz · 26 sprint · 78 iş kartı\n\nBu paket bir geliştirme planıdır; ödeme uygulamasının tamamlandığı anlamına gelmez. Tüm sprintler planlandı. Web içi /docs bağlantılarını localhost:4321 üzerinde açın; her belgenin tam içeriği aşağıdadır.\n\n## Yol haritası\n\n| Faz | Ad | Sprint | Süre | Çıkış |\n|---|---|---|---|---|\n${overview}\n\n${pages.map(p=>`# ${p.title}\n\nKaynak: src/content/docs/${p.file}\n\n${p.body}`).join('\n\n---\n\n')}`;
await mkdir('public/downloads',{recursive:true});
const origin = process.env.SITE_BASE ? 'https://karacaismail.github.io'+process.env.SITE_BASE.replace(/\/$/,'') : 'http://localhost:4321';
await writeFile('public/downloads/galaksipay-playbook.md',content.replace(/\]\((\/[^)]*)\)/g, (_, url) => `](${origin}${url})`));
console.log(`Exported ${pages.length} documents.`);
