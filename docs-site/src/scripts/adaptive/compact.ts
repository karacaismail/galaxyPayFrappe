import styleUrl from '../../styles/adaptive/compact-only.css?url';
export function mount() {
  const style = document.createElement('link'); style.rel = 'stylesheet'; style.href = styleUrl;
  document.head.append(style);
  const menu = document.querySelector<HTMLDetailsElement>('#contents');
  const controller = new AbortController();
  menu?.addEventListener('click', event => {
    const target = event.target as HTMLElement;
    const link = target.closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link) return;
    menu.open = false;
    const heading = document.getElementById(decodeURIComponent(link.hash.slice(1)));
    heading?.setAttribute('tabindex', '-1');
    heading?.focus({ preventScroll: true });
  }, { signal: controller.signal });
  return () => { controller.abort(); style.remove(); };
}
