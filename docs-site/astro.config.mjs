import { defineConfig } from 'astro/config';
const base = process.env.SITE_BASE || '/';
function prefixMarkdownLinks() {
  return tree => {
    const visit = node => {
      if ((node.type === 'link' || node.type === 'image') && node.url?.startsWith('/') && !node.url.startsWith('//')) {
        node.url = base.replace(/\/$/, '') + node.url;
      }
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}
export default defineConfig({
  site: 'https://karacaismail.github.io', base, trailingSlash: 'always', output: 'static',
  devToolbar: { enabled: false }, markdown: { remarkPlugins: [prefixMarkdownLinks] },
});
