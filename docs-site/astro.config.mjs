import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
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
  devToolbar: { enabled: false }, markdown: { processor: unified({ remarkPlugins: [prefixMarkdownLinks] }) },
  vite: { build: { cssCodeSplit: true, modulePreload: false, assetsInlineLimit: 0 } },
});
