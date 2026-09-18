import styleUrl from '../../styles/adaptive/desktop-only.css?url';
export function mount() {
  const shell = document.querySelector('#document-shell');
  const source = document.querySelector('#contents nav');
  if (!shell || !source) return () => {};
  const style = document.createElement('link'); style.rel = 'stylesheet'; style.href = styleUrl;
  document.head.append(style);
  const aside = document.createElement('aside'); aside.className = 'desktop-toc';
  const label = document.createElement('p'); label.textContent = 'BU REHBERDE';
  const nav = source.cloneNode(true) as HTMLElement;
  nav.setAttribute('aria-label', 'Masaüstü bölüm gezinmesi');
  aside.append(label, nav); shell.append(aside);
  const links = [...nav.querySelectorAll<HTMLAnchorElement>('a')];
  const observer = new IntersectionObserver(entries => {
    const active = entries.filter(e => e.isIntersecting).at(-1);
    if (!active) return;
    links.forEach(link => {
      if (decodeURIComponent(link.hash.slice(1)) === active.target.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '0px 0px -65% 0px', threshold: 0 });
  document.querySelectorAll('#playbook > h2').forEach(h => observer.observe(h));
  return () => { observer.disconnect(); aside.remove(); style.remove(); };
}
