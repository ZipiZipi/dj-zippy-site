# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static website for DJ Zippy (zippydj.com) - a House Music DJ from Belgrade, Serbia. The site showcases mixes, upcoming gigs, and booking contact. Hosted on Netlify with form handling.

## Build Commands

```bash
# Build CSS (compiles Tailwind and minifies)
npm run build

# Watch for changes during development (not in package.json, run manually)
npx tailwindcss -i ./input.css -o ./output.css --watch
```

## Architecture

### File Structure
- `index.html` - Main landing page (hero, about, music section, dates, contact form)
- `links.html` - Linktree-style page for social links
- `input.css` - Tailwind v4 source with custom theme and components
- `output.css` - Generated CSS (committed, served directly)
- `script.js` - Vanilla JS for mobile menu, music grid filtering, Netlify form AJAX

### Styling (Tailwind v4)
Uses Tailwind CSS v4 with CSS-first configuration in `input.css`:
- Custom colors defined in `@theme`: `brand-orange` (#FF5500), `brand-black`, `brand-dark`, `brand-gray`
- Custom fonts: `font-display` (Unbounded), `font-body` (Inter)
- Components in `@layer components`: `.glass-panel`, `.nav-link` with hover effects, `.glitch-text`
- Base styles in `@layer base`: Section fade effects (::before/::after gradients)

### JavaScript Data
`script.js` contains `appData` object with hardcoded mixes and playlists for YouTube, MixCloud, and Spotify. The music section dynamically renders cards based on platform filter selection.

### SEO
- Structured data (JSON-LD) in both HTML files for MusicGroup schema
- `sitemap.xml` with video schema for YouTube content
- `robots.txt` blocking dev files

### Forms
Contact form uses Netlify Forms with AJAX submission (no page reload).
