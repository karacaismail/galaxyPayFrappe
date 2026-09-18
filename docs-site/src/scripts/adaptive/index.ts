type Enhancement = { mount: () => (() => void) };
const wide = matchMedia('(min-width: 64rem) and (pointer: fine)');
let version = 0;
let dispose: (() => void) | undefined;
async function adapt() {
  const current = ++version;
  dispose?.(); dispose = undefined;
  const desktop = wide.matches;
  const status = document.querySelector<HTMLElement>('#profile-status');
  try {
    // Only the chosen branch is requested; no static desktop import or prefetch.
    const module: Enhancement = desktop ? await import('./desktop') : await import('./compact');
    if (current !== version) return;
    dispose = module.mount();
    document.documentElement.dataset.profile = desktop ? 'desktop' : 'compact';
    if (status) status.textContent = desktop
      ? 'Etkin profil: ortak temel + masaüstü gezinmesi.'
      : 'Etkin profil: ortak temel + kompakt gezinme.';
  } catch {
    if (current === version && status) status.textContent = 'Ek gezinme yüklenemedi. Temel dokümanı kullanabilirsiniz.';
  }
}
wide.addEventListener('change', adapt);
void adapt();

// Read-only, same-page resource evidence. Cache hits also appear as resource entries.
const inspect = document.querySelector<HTMLButtonElement>('#inspect-assets');
if (inspect) {
  inspect.hidden = false;
  inspect.addEventListener('click', () => {
    const report = document.querySelector('#asset-report');
    if (!report) return;
    const files = [...new Set(performance.getEntriesByType('resource')
      .map(item => new URL(item.name).pathname)
      .filter(path => /\.(js|css)$/.test(path)))];
    const intro = document.createElement('p');
    intro.textContent = `Bu açılışta kaydedilen ${files.length} JS/CSS kaynağı:`;
    const list = document.createElement('ul');
    files.forEach(file => { const item = document.createElement('li'); item.textContent = file.split('/').pop() || file; list.append(item); });
    report.replaceChildren(intro, list);
  });
}
document.querySelectorAll<HTMLTableElement>('.prose table').forEach((table, i) => {
  table.tabIndex = 0;
  table.setAttribute('role', 'table');
  table.setAttribute('aria-label', `Tablo ${i + 1}; dar ekranda yatay kaydırılabilir`);
  const hint = document.createElement('p'); hint.className = 'table-hint';
  hint.textContent = 'Tabloyu gerektiğinde yatay kaydırın; klavye ile odaklayıp ok tuşlarını kullanabilirsiniz.';
  table.before(hint);
});
document.querySelectorAll<HTMLPreElement>('.prose pre').forEach(pre => {
  pre.tabIndex = 0;
  const controls = document.createElement('div'); controls.className = 'code-actions';
  const button = document.createElement('button'); button.className = 'copy-code'; button.type = 'button'; button.textContent = 'Kodu kopyala';
  button.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(pre.querySelector('code')?.textContent || ''); button.textContent = 'Kopyalandı'; }
    catch { button.textContent = 'Metni seçerek kopyalayın'; }
    setTimeout(() => { button.textContent = 'Kodu kopyala'; }, 2000);
  });
  controls.append(button); pre.after(controls);
});

document.querySelectorAll<HTMLButtonElement>('[data-copy-card]').forEach(button=>{
 button.hidden=false;
 button.addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText(button.dataset.copyCard || '');button.textContent='Kopyalandı';}
  catch{button.textContent='Metni seçin';}
  setTimeout(()=>button.textContent='Kopyala',2000);
 });
});
