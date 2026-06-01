import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://zippydj.com',
  integrations: [tailwind()],
  output: 'hybrid', // Enable hybrid rendering (static + dynamic pages)
  adapter: cloudflare({
    mode: 'directory',
    platformProxy: { enabled: true, configPath: 'wrangler.jsonc', experimentalJsonConfig: true }
  }),
  vite: {
    ssr: {
      external: ['svgo']
    }
  }
});
