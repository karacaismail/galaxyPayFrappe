type Entry={title:string;description:string;body:string;url:string;group:string};
const input=document.querySelector<HTMLInputElement>('#dx-query');
const output=document.querySelector('#dx-search-results');
const status=document.querySelector('#dx-search-status');
let index:Entry[]=[];let loading:Promise<void>|undefined;
const normalize=(s:string)=>s.toLocaleLowerCase('tr').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i');
function render(){
 if(!input||!output||!status)return;output.replaceChildren();
 const terms=normalize(input.value.trim()).split(/\s+/).filter(Boolean);
 if(!terms.length){status.textContent='';return;}
 const found=index.filter(e=>e.url.includes('/v2/')&&terms.every(t=>normalize(e.title+' '+e.description+' '+e.body).includes(t))).sort((a,b)=>Number(terms.every(t=>normalize(b.title).includes(t)))-Number(terms.every(t=>normalize(a.title).includes(t))));
 status.textContent=found.length?`${found.length} sonuç; ilk ${Math.min(8,found.length)} gösteriliyor.`:'Sonuç yok. Farklı bir terim deneyin.';
 for(const entry of found.slice(0,8)){const a=document.createElement('a');a.href=entry.url;a.textContent=entry.title;output.append(a);}
}
input?.addEventListener('input',async()=>{
 if(!index.length){loading ||= fetch(import.meta.env.BASE_URL.replace(/\/$/,'')+'/search.json').then(r=>{if(!r.ok)throw new Error();return r.json();}).then(data=>{index=data;});try{await loading;}catch{loading=undefined;if(status)status.textContent='Arama yüklenemedi. Dokümantasyon menüsünü kullanın.';return;}}
 render();
});
document.querySelector('.dx-search')?.addEventListener('submit',e=>e.preventDefault());
