import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://zippydj.com',
  trailingSlash: 'never', // canonical URLs without trailing slash (matches SSR pages + sitemap)
  integrations: [tailwind()],
  output: 'hybrid', // Enable hybrid rendering (static + dynamic pages)
  adapter: cloudflare({
    mode: 'directory',
    // The generated _routes.json covers the Serbian routes with `/sr/*`, which
    // only matches paths *under* /sr. `/sr` itself is the SSR home page, so it
    // has to be listed explicitly or Cloudflare serves it as a missing asset.
    routes: { extend: { include: [{ pattern: '/sr' }] } },
    platformProxy: { enabled: true, configPath: 'wrangler.jsonc', experimentalJsonConfig: true }
  }),
  vite: {
    ssr: {
      external: ['svgo']
    }
  }
});
