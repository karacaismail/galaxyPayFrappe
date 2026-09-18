import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
async function walk(dir){const out=[];for(const name of await readdir(dir)){const file=path.join(dir,name);if((await stat(file)).isDirectory())out.push(...await walk(file));else out.push(file);}return out;}
const base=(process.env.SITE_BASE || '/').replace(/\/$/,'');
const files=await walk('dist');const htmlFiles=files.filter(f=>f.endsWith('.html'));const failures=[];let links=0;
const contents=new Map(await Promise.all(htmlFiles.map(async f=>[path.resolve(f),await readFile(f,'utf8')])));
for(const [file,html] of contents){
 const route=file.endsWith('/index.html')?path.relative(path.resolve('dist'),path.dirname(file))+'/':path.relative(path.resolve('dist'),file);
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 if(new Set(ids).size!==ids.length)failures.push(`${route}: duplicate element ID`);
 for(const match of html.matchAll(/\bhref="([^"]+)"/g)){
  const href=match[1].replaceAll('&amp;','&');if(/^(https?:|mailto:|tel:|data:)/.test(href))continue;
  const url=new URL(href,`https://docs.local${base}/${route.replace(/^\/+/, '')}`);if(url.origin!=='https://docs.local')continue;
  if(base && !url.pathname.startsWith(base+'/')) { failures.push(`${route}: link escapes deployment base ${href}`); continue; }
  let target=path.resolve('dist',decodeURIComponent(url.pathname.slice(base.length)).replace(/^\//,''));
  if(url.pathname.endsWith('/'))target=path.join(target,'index.html');
  try{await stat(target);}catch{failures.push(`${route}: broken link ${href}`);continue;}
  if(url.hash){const text=contents.get(target);if(text&&!text.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`))failures.push(`${route}: missing anchor ${href}`);}
  links++;
 }
}
const roadmap=JSON.parse(await readFile('src/data/roadmap.json','utf8'));
if(roadmap.phases.length!==9||roadmap.sprints.length!==26)failures.push('Unexpected phase/sprint counts.');
const storyIds=roadmap.sprints.flatMap(s=>s.stories.map(t=>t.id));
if(storyIds.length!==78||new Set(storyIds).size!==78)failures.push('Story IDs must be 78 unique IDs.');
for(const sprint of roadmap.sprints){
 const markdown=await readFile(`src/content/docs/${sprint.slug}.md`,'utf8');
 for(const story of sprint.stories){if(!markdown.includes(story.id)||!markdown.includes(story.acceptance))failures.push(`${sprint.id}: story differs from document ${story.id}`);}
 if(!roadmap.phases.some(p=>p.id===sprint.phase))failures.push(`${sprint.id}: missing phase`);
}
const search=JSON.parse(await readFile('dist/search.json','utf8'));
const dxDocs=(await walk('src/content/v2')).filter(f=>f.endsWith('.md'));
if(search.length!==42+dxDocs.length+1 || !search.some(doc=>doc.url===base+'/v2/test-data/'))failures.push('Search must contain V1 and every current DX page.');
const bundle=await readFile('dist/downloads/galaksipay-playbook.md','utf8');
if(!bundle.includes('GP-261')||!bundle.includes('Q14'))failures.push('Incomplete Markdown export.');
const v2 = await readFile('dist/v2/index.html','utf8');
const v2Bundle = await readFile('dist/downloads/galaksipay-frappe-v2.md','utf8');
const plan=JSON.parse(await readFile('src/data/development-plan.json','utf8'));
const currentRoadmap=await readFile('dist/v2/roadmap/index.html','utf8');
for(const phase of plan.phases)for(const sprint of phase.sprints){
 if(!currentRoadmap.includes(`id="${sprint.id.toLowerCase()}"`))failures.push(`Missing sprint anchor ${sprint.id}`);
 for(const test of sprint.redTests)if(!currentRoadmap.includes(test.id)||!v2Bundle.includes(test.id))failures.push(`Missing documented RED test ${test.id}`);
}
if(/<(?:script|link)[^>]*(?:src|href)="[^"]*(?:desktop|compact)[^"]*"/.test(v2))failures.push('V2 adaptive assets must not be static imports/preloads.');
if(/<style[^>]*>[\s\S]*?html\[data-profile=/.test(v2.split('</head>')[0]))failures.push('Adaptive CSS leaked into shared HTML.');
for(const profile of ['desktop','compact']){
 const js = files.filter(file=>new RegExp(`/\\_astro/${profile}\\.[^/]+\\.js$`).test(file));
 const css = files.filter(file=>new RegExp(`/\\_astro/${profile}-only\\.[^/]+\\.css$`).test(file));
 if(js.length!==1 || css.length!==1)failures.push(`Missing separate ${profile} JS/CSS artifact`);
 else {
  const code=await readFile(js[0],'utf8');
  if(!code.includes(path.basename(css[0])))failures.push(`${profile} module must load its own CSS URL`);
 }
}
for(const term of ['Core development','Test kartları','API referansı'])if(!v2.includes(term))failures.push(`V2 missing ${term}`);
if(failures.length){console.error(failures.join('\n'));process.exit(1);}
console.log(`Verified ${htmlFiles.length} pages, ${links} local links/anchors; v1: 9 phases/26 sprints/78 stories; v2: ${dxDocs.length} docs/${plan.phases.length} phases; ${search.length} search documents.`);
