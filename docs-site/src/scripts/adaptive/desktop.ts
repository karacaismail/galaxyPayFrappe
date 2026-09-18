import styleUrl from '../../styles/adaptive/desktop-only.css?url';
export function mount() {
  const shell=document.querySelector('#document-shell');
  const source=document.querySelector('#docs-nav-source');
  if(!shell||!source)return()=>{};
  const style=document.createElement('link');style.rel='stylesheet';style.href=styleUrl;document.head.append(style);
  const aside=document.createElement('aside');aside.className='desktop-toc';
  const nav=source.cloneNode(true) as HTMLElement;nav.removeAttribute('id');nav.setAttribute('aria-label','Masaüstü doküman gezinmesi');
  aside.append(nav);
  const toc=document.querySelector('#contents nav');
  if(toc){const label=document.createElement('p');label.className='nav-label';label.textContent='Bu sayfada';aside.append(label,toc.cloneNode(true));}
  shell.append(aside);
  return()=>{aside.remove();style.remove();};
}
