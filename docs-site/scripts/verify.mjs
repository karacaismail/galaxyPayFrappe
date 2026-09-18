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
if(search.length!==42)failures.push('Search must contain 42 docs.');
const bundle=await readFile('dist/downloads/galaksipay-playbook.md','utf8');
if(!bundle.includes('GP-261')||!bundle.includes('Q14'))failures.push('Incomplete Markdown export.');
if(failures.length){console.error(failures.join('\n'));process.exit(1);}
console.log(`Verified ${htmlFiles.length} pages, ${links} local links/anchors, 9 phases, 26 sprints, 78 stories and 42 search documents.`);
