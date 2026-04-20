/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#FF5500',
          black: '#000000',
          dark: '#111111',
          gray: '#1f1f1f',
        },
      },
      fontFamily: {
        display: ['Unbounded', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      backgroundColor: {
        base: '#050505',
      },
    },
  },
  plugins: [],
};
