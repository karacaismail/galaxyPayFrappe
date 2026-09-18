import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
process.chdir(fileURLToPath(new URL('../',import.meta.url)));
const json = async path => JSON.parse(await readFile(path,'utf8'));

test('Sağlayıcının 18 test kartı kayıpsız, string alanlarla ve denenmedi etiketiyle sunulur',async()=>{
 const data=await json('src/data/test-cards.json');
 assert.equal(data.cards.length,18);
 assert.equal(data.executionStatus,'not-run');
 const normalized=data.cards.map(c=>[c.pan,c.expiry,c.cvv,c.otp].join('|')).join('\n');
 assert.equal(createHash('sha256').update(normalized).digest('hex'),'5849ac7b829c9070b0e2bce09d35c630dfd0756679163acf0795fd5002d1f4ad');
 assert.deepEqual(await json('public/downloads/test-cards.json'),data);
 const page=await readFile('src/content/v2/test-data.md','utf8');
 for(const card of data.cards)assert.ok(page.includes(card.pan),card.id+' dokümanda yok');
 assert.equal(new Set(data.cards.map(c=>c.pan)).size,18);
 for(const card of data.cards){assert.match(card.pan,/^\d{16}$/);assert.equal(card.expiry,'12/26');assert.equal(card.cvv,'000');assert.equal(card.otp,'123456');}
 try{
  const source=await readFile('../GalaksiPay_Test_Kartları.txt','utf8');
  const pans=[...source.matchAll(/(\d{6})_(\d{10})/g)].map(m=>m[1]+m[2]);
  assert.deepEqual(data.cards.map(c=>c.pan),pans);
  assert.equal(data.sourceSha256,createHash('sha256').update(await readFile('../GalaksiPay_Test_Kartları.txt')).digest('hex'));
 }catch(e){if(e.code!=='ENOENT')throw e;}
});

test('Geliştirici kritik görevleri ayrı doğrudan erişilebilir sayfalarda bulur',async()=>{
 for(const slug of ['quickstart','test-data','core-development','roadmap','tdd','callback','audit','architecture','scenarios','mobile','decisions'])
  await access(`src/content/v2/${slug}.md`);
});

test('Core → maturity planında her sprintin önce başarısız testi, çıktısı ve kanıtı vardır',async()=>{
 const plan=await json('src/data/development-plan.json');
 assert.equal(plan.phases[0].id,'core');assert.equal(plan.phases.at(-1).id,'maturity');
 const ids=plan.phases.flatMap(p=>p.sprints.map(s=>s.id));assert.equal(new Set(ids).size,ids.length);
 for(const phase of plan.phases){assert.ok(phase.gate);for(const sprint of phase.sprints){assert.ok(sprint.build.length);assert.ok(sprint.redTests.length);assert.ok(sprint.fixture);assert.ok(sprint.evidence);assert.ok(sprint.owner);}}
 const tests=plan.phases.flatMap(p=>p.sprints.flatMap(s=>s.redTests));
 for(const invariant of ['double_start','callback_duplicate','unknown_add','seller_isolation','desktop_asset_leak','refund_duplicate','restore','revocation'])
  assert.ok(tests.some(t=>t.id.includes(invariant)),invariant+' için test yok');
});

test('Endpoint rehberi gerçek OpenAPI yollarına dayanır ve örnek istekler şemayı bozmaz',async()=>{
 const spec=await json('public/downloads/provider-openapi.json');
 const endpoints=await json('src/data/api-reference.json');
 assert.ok(endpoints.length>=10);
 for(const endpoint of endpoints){
  const op=spec.paths[endpoint.path]?.[endpoint.method.toLowerCase()];assert.ok(op,endpoint.path);
  assert.ok(endpoint.tests.length);assert.ok(endpoint.unknowns.length);assert.ok(endpoint.responseNote);
  if(endpoint.requestExample){
   const ref=op.requestBody.content['application/json'].schema.$ref.split('/').at(-1);
   const schema=spec.components.schemas[ref];
   for(const name of schema.required||[])assert.ok(Object.hasOwn(endpoint.requestExample,name),endpoint.path+': '+name);
   for(const name of Object.keys(endpoint.requestExample))assert.ok(schema.properties[name],endpoint.path+': bilinmeyen '+name);
  }
 }
});

test('İndirilen OpenAPI tüm yerel schema referanslarını çözer',async()=>{
 const spec=await json('public/downloads/provider-openapi.json');
 const walk=obj=>{if(!obj||typeof obj!=='object')return;for(const [key,value]of Object.entries(obj)){if(key==='$ref'&&value.startsWith('#/')){let target=spec;for(const segment of value.slice(2).split('/'))target=target?.[segment];assert.ok(target,value);}else walk(value);}};walk(spec);
});
