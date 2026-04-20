import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://zippydj.com',
  integrations: [tailwind()],
  output: 'hybrid', // Enable hybrid rendering (static + dynamic pages)
  adapter: cloudflare({
    mode: 'directory'
  }),
  vite: {
    ssr: {
      external: ['svgo']
    }
  }
});
