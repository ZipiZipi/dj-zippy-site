/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          // the accent: orange on the B side, blue once the A side is picked (see global.css)
          orange: 'rgb(var(--accent-rgb) / <alpha-value>)',
          // the other side's colour, for small details that break up the accent:
          // blue on the B side, orange on the A side
          alt: 'rgb(var(--alt-rgb) / <alpha-value>)',
          // fixed side colours, for labels that always mean one side
          'side-a': 'rgb(var(--side-a-rgb) / <alpha-value>)',
          'side-b': 'rgb(var(--side-b-rgb) / <alpha-value>)',
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
