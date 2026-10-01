# zippydj.com — lista unapređenja (analiza 2026-09-28)

Ovaj fajl je trajna to-do lista. Svaki task je samostalan: novi chat ne mora da zna
ništa o prethodnoj analizi.

## Kako se koristi

1. Otvori novi chat u folderu `F:\ZippySite\dj-zippy-site` i izaberi **model i effort** iz tabele.
2. Napiši samo: **`Uradi Task T5 iz docs/TASKS.md`**. Druga mogućnost je da iskopiraš blok "Prompt" iz taska.
3. Kad se task završi, u tabeli se štiklira `[x]` i upiše datum.

**Paralelni chatovi:** taskovi koji menjaju iste fajlove (kolona *Fajlovi*) ne smeju da rade
u isto vreme, jer se izmene sudaraju. Najsigurnije je raditi ih redom i commit-ovati posle svakog.

## Pravila za svaki task (važe uvek)

- Radi na grani na kojoj je sesija počela (live sajt je `main`). **Nikad ne menjaj granu sam.**
  Grana `dev` ima veliki eksperimentalni redizajn koji NIJE na sajtu. Sme da se čita kao referenca
  (`git show dev:putanja`), ali se ne merge-uje i ne checkout-uje.
- Štedi tokene: `npm run build` najviše jednom po tasku. Nema ponavljanja istih komandi. Ako nešto
  pukne, prvo dijagnoza, pa tek onda sledeći pokušaj.
- Proveri promenu uživo: pokreni dev server (`.claude/launch.json` → "dev") u browseru, proveri
  desktop (1440px) i mobilni (390px), pa priloži screenshot.
- Sajt je dvojezičan: svaka tekstualna izmena ide u **oba** jezika u `src/i18n/ui.ts` (en + sr, latinica).
- **Ne commit-uj i ne push-uj bez pitanja**, jer push na `main` = deploy.
- Na kraju u ovom fajlu štikliraj task (`[x]`), upiši datum i jednu rečenicu šta je urađeno.

## Pregled

| ✓ | Task | Prioritet | Model | Effort | Fajlovi |
|---|------|-----------|-------|--------|---------|
| [x] 2026-09-29 | T1 Favicon od 2.7 MB + keširanje asseta — favicon.svg zamenjen „Z.“ znakom sa dev grane (247 B), dodat `public/_headers` sa dugim keširanjem za _astro/fonts/images/videos. | 🔴 P0 | Sonnet 5.5 | medium | `public/images/favicon.svg`, `public/_headers` |
| [x] 2026-09-29 | T2 Pokvarena 404 stranica (error 523) — dodata SSR ruta `src/pages/[...slug].astro` koja renderuje englesku 404 (worker više ne dohvata /404.html sam od sebe, što je davalo 523). | 🔴 P0 | Sonnet 5.5 | high | `src/pages/[...slug].astro`, blog slug |
| [x] 2026-09-29 | T3 Sitne SEO/tehničke ispravke — robots.txt spojen u jednu grupu, lažni lastmod izbačen iz sitemap-a, © godina dinamička, dateModified osvežen, opisi /mixes i /links ≤ 155 znakova. | 🟠 P1 | Haiku 4.5 | medium | `public/robots.txt`, `sitemap.xml.ts`, `ui.ts` |
| [x] 2026-09-29 | T4 Prava OG slika za deljenje (1200×630) — nova `og-dj-zippy.jpg` (1200×630, 35 KB, Unbounded) kao default og:image/twitter:image u Layout i Links, sa og:image:alt (en/sr) i tipom; schema ImageObject na početnoj ispravljen na 800×800. | 🟠 P1 | Sonnet 5.5 | medium | `Layout.astro`, `LinksPage.astro`, schema |
| [x] 2026-09-29 | T5 Vinili na početnoj: svetliji + mobilni + tastatura — etiketa 48% bez tamnog sloja, bočni diskovi zatamnjeni filterom (ne opacity), fiksni sheen, natpisi i „Listen Now“ na tamnim pilulama; mobilni: veći aktivni disk + ±1 sused, strelice i tačkice ispod; svaki disk je `<a>` (bočni role=button), strelice ←/→ i Space rade; beskonačni „revolver“: slobodno prevlačenje mišem/prstom/trackpadom sa inercijom posle zamaha, uvek staje na disk; YouTube hqdefault fallback. MixCloud slike čekaju upis u D1. | 🔴 P0 | Opus 5.5 | high | `HomePage.astro` |
| [x] 2026-09-29 | T6 Links stranica: ceo link narandžast na hover/tap — kartice se na hover (samo `hover:hover`), fokus i tap pune narandžastom (#cc4400 pozadina zbog kontrasta 4.7:1, #ff5500 ivica i glow), bela ikonica i tekst, `:active` scale(0.98), bez sivog tap highlight-a; Explore linkovi dobijaju narandžast tekst i strelicu. | 🔴 P0 | Sonnet 5.5 | low | `LinksPage.astro` |
| [x] 2026-09-30 | T7 EN/SR prekidač: globus se preklapa — segmented control sa unutrašnjim paddingom (p-1), globus 12px od ivice i 6px od opcija, EN/SR kao zasebne pilule (aktivna narandžasta sa crnim tekstom zbog kontrasta), 32px visine i 40px tap zona na dodir; isto na Links stranici; header na md (768–1024) dobio manji razmak i text-xs da se srpski meni ne lomi. | 🔴 P0 | Sonnet 5.5 | medium | `LanguageSwitcher.astro`, `LinksPage.astro` |
| [x] 2026-09-30 | T8 Traka (marquee) na početnoj: novi tekst + jači izgled — varijanta B: narandžasta „tape“ traka (−1.5°, crni Unbounded, 1.75rem na desktopu) sa fiksnom labelom „PLAYED AT“/„SVIRAO NA“ i pravim nastupima iz ui.ts, plus tanja crna traka (+1.1°, HOUSE MUSIC THERAPY ✦ SERBIAN HOUSE DJ ✦ žanrovi) u suprotnom smeru; prva lista je pravi `<ul>` za screen reader, kopije aria-hidden; pauza na hover, bez horizontalnog skrola; za reduced-motion stoji i može da se prevlači. | 🔴 P0 | Opus 5.5 | high | `HomePage.astro`, `global.css`, `ui.ts` |
| [x] 2026-09-30 | T9 "Srpski DJ" pozicioniranje kroz ceo sajt — novi title/description svih stranica (en+sr, ≤60/≤155) sa „Serbian house DJ“ / „srpski house DJ“ napred, bio/FAQ/schema opisi bez „iz Beograda“ i bez „vibe architect“, schema jobTitle „Serbian House DJ & Selector“ i adresa samo RS, llms.txt „Based in: Serbia“; lokacije nastupa i fotki ostale. | 🔴 P0 | Opus 5.5 | high | `ui.ts`, `llms.txt`, schema u stranicama |
| [x] 2026-09-30 | T10 Početna: H1 + uvodna sekcija sa fotkom (SEO) — H1 sada glasi „ZIPPY. — Serbian House DJ“ / „… Srpski house DJ“ (kicker iznad imena preko flex-col-reverse, izgled isti); nova sekcija posle Upcoming: prava `<img>` (800×800, lazy, alt en/sr), H2 „The selector behind House Music Therapy“, 3 rečenice bio-a, 4 čipa (Exit 2024 & 2025, 3 Exit bine, Kult Talents, Srbija · Grčka) i CTA „Book Zippy“ + „Full bio“; Events H1 „DJ Zippy Live Events“ / „Nastupi DJ Zippyja“; jedan H1 i logični H2 na / i /sr. | 🟠 P1 | Opus 5.5 | high | `HomePage.astro`, `ui.ts` |
| [x] 2026-09-30 | T11 Booking forma: labele + praćenje konverzija — vidljive labele (for/id, en/sr) + autocomplete name/organization/email; posle uspešnog slanja: GTM `booking_form_submit`, Meta `Lead` i Google Ads konverzija (čeka label u konstanti `ADS_CONVERSION_LABEL` u Footer.astro), sve u try/catch; web3forms `botcheck` honeypot. Koraci za booking@zippydj.com su u odgovoru chata (DNS nije diran). | 🟠 P1 | Sonnet 5.5 | medium | `Footer.astro` |
| [x] 2026-09-30 | T12 Mixes i Events stranice: dorada izgleda — mix kartice: čista slika bez gradijenta, žanr/naslov/„Listen Now“ ispod slike na crnoj kartici, hover zoom + narandžasta ivica, 1 kolona na mobilnom; Events: istaknuti nastupi kao kartice u 2 kolone, ostali u kompaktnoj `<details>` listi „All past gigs (N)“ bez JS-a, lokacije i godine podignute na gray-300/400; scroll-reveal kraći (0.45 s, 12px) i kreće čim element uđe u ekran (threshold 0, rootMargin +6%). | 🟡 P2 | Sonnet 5.5 | high | `MixesPage.astro`, `EventsPage.astro` |
| [x] 2026-09-30 | T13 Performanse: skripte, fontovi, video — Pixel/GTM/Ads u `Analytics.astro` (stubovi odmah, skripte na prvu interakciju ili ~3 s posle load-a + idle; virtualni PageView za View Transitions; ispravljen gtag koji je slao niz umesto `arguments`); Unbounded + Inter self-hostovani (latin + latin-ext, `fonts.css`), Google Fonts izbačen; preload fotke samo na About i Links; coverflow koristi YouTube hqdefault (~30 KB umesto ~130 KB); links video 2.5 MB → 0.7 MB (540×960, bez zvuka, faststart) + poster 8 KB, ne učitava se na Save-Data/2G. Lighthouse mobile: / 55 → 98, /links 49 → 98 (posle meren na lokalnom build-u, tabela u chatu). | 🟠 P1 | Opus 5.5 | high | `Layout.astro`, `LinksPage.astro`, `content.ts` |
| [x] 2026-09-30 | T14 Blog i sadržaj: strategija (opciono) — plan je na dnu fajla („T14 rezultat“): kada skinuti noindex sa bloga i galerije, 10 tema za članke, off-site profili i backlink-ovi, EPK; iz njega su nastali T15–T22. | 🟡 P2 | Opus 5.5 | high | plan, pa `posts.ts` |
| [ ] | T15 Blog: prava infrastruktura (jezik, schema, sitemap) | 🟠 P1 | Sonnet 5.5 | high | `posts.ts`, `types/database.ts`, `BlogIndexPage.astro`, `BlogPostPage.astro`, `sitemap.xml.ts`, `migrations/` |
| [ ] | T16 Prvi pravi članak: Exit 2025 recap (en + sr) | 🟠 P1 | Opus 5.5 | high | D1 `posts` (preko admina) |
| [ ] | T17 Galerija: prave fotke + indeksiranje | 🟠 P1 | Sonnet 5.5 | medium | `GalleryPage.astro`, `public/images/gallery/`, `sitemap.xml.ts`, `ui.ts` |
| [ ] | T18 Off-site profili: isti bio svuda (checklist) | 🔴 P0 | Sonnet 5.5 | low | `docs/offsite-profiles.md` (novi) |
| [x] 2026-10-01 | T19 Wikidata + MusicBrainz dopune — unos radio Claude kroz Chrome uz potvrdu. MusicBrainz: aliasi „Zippy DJ“ i „Zipi“ (search hint), legal name „Veljko Nedeljković“, veza ka Wikidata Q138220521, tagovi house / tech house / techno / deep house. Wikidata: sr-el labela, opis „srpski house DJ i selektor“ i aliasi; reference (P854) na occupation (RA profil) te na citizenship i svih 5 žanrova (zippydj.com). Ostaje samo Spotify artist ID, tek kad postoji artist profil. | 🟡 P2 | Sonnet 5.5 | medium | ručno, uz uputstvo |
| [ ] | T20 EPK (press kit) stranica za bukere | 🟠 P1 | Opus 5.5 | high | `src/pages/epk.astro`, `sr/epk.astro`, `EpkPage.astro`, `ui.ts` |
| [ ] | T21 booking@zippydj.com + Google Ads label | 🟠 P1 | Sonnet 5.5 | low | `Footer.astro`, `ui.ts`, schema, `llms.txt` |
| [ ] | T22 Ostaci iz 2026-09-30: MixCloud slike, GTM tag, Inter | 🟡 P2 | Sonnet 5.5 | medium | D1 `mixes`, GTM (ručno), `global.css` |
| [x] 2026-10-01 | T23 Hero: nova scena umesto narandžasto-belog gradijenta | 🔴 P0 | Opus 5.5 | high | `HomePage.astro`, `global.css` |
| [ ] | T24 Plava kao druga boja: open format strana | 🟠 P1 | Sonnet 5.5 | medium | `tailwind.config.mjs`, `global.css`, `HomePage.astro`, `EventsPage.astro`, `AboutPage.astro` |
| [ ] | T25 Vinili: klik pušta miks u plejeru na dnu (MixCloud widget), hover pali ploču | 🟠 P1 | Opus 5.5 | high | `HomePage.astro`, `Layout.astro`, `content.ts` |
| [ ] | T26 Stranica za svaki miks (`/mixes/[slug]`) sa tracklistom | 🟡 P2 | Opus 5.5 | high | `src/pages/mixes/[slug].astro`, `sr/…`, `MixPage.astro`, `content.ts`, `sitemap.xml.ts` |
| [ ] ⏸ odloženo 2026-10-01 | T27 Tekstovi: novi glas bez DJ klišea (en + sr) — korisnik: „ostavi za kasnije“ | 🔴 P0 | Opus 5.5 | high | `ui.ts`, `llms.txt`, schema opisi |
| [ ] | T28 About kao priča: put od 2022. do danas (rešava B9) | 🟠 P1 | Opus 5.5 | high | `AboutPage.astro`, `ui.ts` |
| [ ] | T29 „U torbi“: ploče koje Zippy trenutno pušta | 🟡 P2 | Sonnet 5.5 | medium | `HomePage.astro` ili `MixesPage.astro`, `ui.ts` ili D1 |
| [–] otkazano 2026-10-01 | ~~T30 Potpisi identiteta: HMT kataloški brojevi, mono metapodaci, zrno~~ — korisnik: „nećemo“ | 🟡 P2 | Sonnet 5.5 | medium | `global.css`, `MixesPage.astro`, `HomePage.astro`, `fonts.css` |
| [ ] | T31 Bug: `/mixes/` i `/events/` sa kosom crtom na kraju daju 404 | 🔴 P0 | Sonnet 5.5 | low | `src/middleware/index.ts` |

Preporučeni redosled: **T1 → T2 → T6 → T7 → T9 → T8 → T5 → T10 → T3 → T4 → T11 → T13 → T12 → T14**.
Posle toga: **T18 → T21 → T15 → T16 → T17 → T20 → T19 → T22**. T18 i T21 su skoro bez koda, a daju najviše za pozicioniranje i konverzije.
Identitet (pregled 2026-10-01): **T31 → T23 → T24 → T25 → T26 → T29**, pa **T27 → T28** kad korisnik odluči (T27 je
odložen, T28 zavisi od njegovih tekstova). T30 je otkazan. T23, T24 i T25 menjaju `HomePage.astro`, pa se rade
jedan po jedan. T23 je urađen (varijanta S, vidi dole).
T9 ide pre T8 i T10 zato što oni koriste njegove tekstove. T5, T8 i T10 menjaju `HomePage.astro`,
pa se rade jedan po jedan.

---

## Nalazi iz analize (kontekst)

Provereno uživo na zippydj.com (Chrome, desktop + mobilni 390px) i u kodu na `main` grani.

**Tehničko / brzina**
- `public/images/favicon.svg` ima **2.7 MB**. Chrome preferira SVG favicon, pa ga svaki novi posetilac
  skida na svakoj stranici. Na `dev` grani već postoji mala verzija (commit `bfb2a7d`).
- Nijedan asset se ne kešira: `/_astro/*`, fontovi, slike i video idu sa `Cache-Control: max-age=0, must-revalidate`.
  Ne postoji `public/_headers` (na `dev` postoji).
- Nepostojeća stranica na engleskom (`/nesto`) i nepostojeći blog post vraćaju golo **"error code: 523"**
  (text/plain) umesto brendirane 404 stranice. Srpska 404 (`/sr/nesto`) radi.
- `/about/` vraća **307** (privremeni) redirect umesto 301.
- Links stranica: pozadinski video ima 2.5 MB, a to je stranica na koju dolazi Instagram saobraćaj sa mobilnog.
- GTM, Meta Pixel i Google Ads se učitavaju odmah, blokirajući. Google Fonts su render-blocking.
  Slika `dj-zippy-house-music-dj.webp` se preload-uje na SVAKOJ stranici, iako se na početnoj ne prikazuje.

**SEO**
- H1 na početnoj je samo "ZIPPY.", a na Events stranici samo "DJ Zippy". Nema ključnih reči.
- Na početnoj nema nijedne prave `<img>` fotografije (vinili su CSS pozadine) i ima vrlo malo teksta.
- OG slika je proglašena kao 1200×630, schema kaže 1200×1200, a slika je zapravo **800×800 webp**.
  Pri deljenju linka (WhatsApp/FB/Viber) preview je kvadrat koji se seče.
- `robots.txt`: posebne grupe za Googlebot, Bingbot i AI botove imaju samo `Allow: /`. Po standardu to
  **poništava** `Disallow: /admin` i `/api` iz `*` grupe, pa za njih admin nije zabranjen.
- `sitemap.xml` stavlja `lastmod` = trenutak zahteva, pa Google ignoriše lastmod.
- "© 2025" je hardkodovano. `dateModified` u schema je 2025-07-13.
- Meta description na /mixes i /links je ~170 znakova, pa se odseca u Google-u.
- Kroz tekstove piše "from Belgrade" / "iz Beograda" (44 mesta u `ui.ts`, plus `llms.txt` i schema).
  Želja je pozicioniranje **srpski DJ**.

**Izgled / UX**
- Vinili: `.cf-label::before` stavlja **50% crni sloj** preko slike. Etiketa zauzima samo 38% diska.
  Bočni diskovi imaju `opacity` 0.5/0.35, pa kroz njih probija narandžasta i izgledaju smeđe-mutno.
  MixCloud i Spotify mixevi nemaju sliku.
- "Youtube" i "Listen Now" ispod vinila su sivi na narandžastom i skoro se ne vide.
- Marquee traka: tekst je `text-white/15` (15% vidljivosti), a reči "Selector" i "Grooves" su generičke.
- EN/SR prekidač: ikonica globusa je 10px od zaobljene ivice pilule. Zaobljenje je jače od paddinga,
  pa se globus vizuelno "zaglavi" u ivicu, a pravougaona narandžasta EN pločica udara u njega. Isti problem ima i Links stranica.
- Links: hover je samo tanka narandžasta ivica. Na telefonu hover ne postoji, pa nema nikakvog feedback-a na tap.
- Vinili (`<article>` sa click-om) nisu dostupni tastaturom.
- Kontakt forma ima samo placeholder-e, bez `<label>`. Po uspešnom slanju ne okida **nijedna konverzija**
  (ni Google Ads ni Meta Lead), pa oglasi ne mogu da se optimizuju.
- Mobilni coverflow: 5 diskova se gura u 375px, strelice leže preko diskova, a natpisi bočnih diskova su nečitljivi.

---

## T1 — Favicon od 2.7 MB + keširanje asseta

**Model:** Sonnet 5.5 · **Effort:** medium

**Prompt:**
```
Sajt zippydj.com (Astro 4 + Tailwind, deploy na Cloudflare Workers sa static assets), folder F:\ZippySite\dj-zippy-site.
Ostani na trenutnoj grani (ne menjaj granu), build najviše jednom, ne commit-uj bez pitanja.

Problem 1: public/images/favicon.svg ima 2.7 MB (verovatno ugrađen raster). Chrome preferira SVG favicon,
pa ga svaki posetilac skida. Na grani dev postoji mala verzija: `git show dev:public/images/favicon.svg`
(NE checkout-uj dev, samo pročitaj fajl). Zameni fajl malom verzijom, proveri da vizuelno odgovara
favicon-96x96.png i da je < 5 KB.

Problem 2: nijedan asset se ne kešira (sve je Cache-Control: public, max-age=0, must-revalidate).
Napravi public/_headers po uzoru na `git show dev:public/_headers`:
/_astro/* i /fonts/* → max-age=31536000, immutable; /images/* i /videos/* → max-age=604800.
Proveri da public/.assetsignore ne ignoriše _headers i da Cloudflare Workers static assets
podržava _headers (podržava od 2025). Posle builda proveri da je dist/_headers tu.

Na kraju mi daj curl komande kojima posle deploya proveravam header-e, pa u docs/TASKS.md
štikliraj T1 sa datumom.
```

---

## T2 — Pokvarena 404 stranica

**Model:** Sonnet 5.5 · **Effort:** high

**Prompt:**
```
Sajt zippydj.com (Astro 4 hybrid output + @astrojs/cloudflare, Workers static assets; wrangler.jsonc ima
not_found_handling: "404-page"), folder F:\ZippySite\dj-zippy-site. Ostani na trenutnoj grani, build najviše
jednom, ne commit-uj bez pitanja.

Problem: https://zippydj.com/nepostoji i https://zippydj.com/blog/nepostoji vraćaju status 404 sa telom
"error code: 523" (text/plain) umesto brendirane 404 stranice. Srpska varijanta /sr/nepostoji radi ispravno
preko src/pages/sr/[...slug].astro.

Uradi:
1. Pogledaj kako radi src/pages/sr/[...slug].astro i src/pages/404.astro.
2. Dodaj englesku catch-all rutu (npr. src/pages/[...slug].astro, prerender = false) koja renderuje
   NotFoundPage lang="en" sa Astro.response.status = 404. Pazi da ne "pojede" postojeće rute
   (/, /about, /mixes, /events, /links, /gallery, /blog, /admin, /api/*, /sitemap.xml, statičke fajlove).
3. Blog post sa nepostojećim slug-om (en i sr) mora da vrati 404 stranicu, ne 523.
4. 404 stranica mora imati <meta name="robots" content="noindex">.
5. Lokalno proveri (dev server) statuse za: /nepostoji, /blog/nepostoji, /sr/nepostoji, /about, /links,
   /sitemap.xml, /robots.txt, /images/favicon-96x96.png. Svi postojeći moraju ostati 200.
Na kraju u docs/TASKS.md štikliraj T2 sa datumom.
```

---

## T3 — Sitne SEO/tehničke ispravke

**Model:** Haiku 4.5 · **Effort:** medium

**Prompt:**
```
Sajt zippydj.com (Astro 4), folder F:\ZippySite\dj-zippy-site. Ostani na trenutnoj grani, build najviše
jednom, ne commit-uj bez pitanja. Sve tekstualne izmene u src/i18n/ui.ts rade se za en i sr.

1. public/robots.txt: posebne grupe (Googlebot, Bingbot, GPTBot, ClaudeBot itd.) imaju samo "Allow: /",
   što po standardu poništava Disallow iz "User-agent: *" grupe. Za te botove /admin i /api više nisu zabranjeni.
   Prepravi tako da SVAKA grupa ima Disallow: /admin i Disallow: /api, ili spoji grupe gde je moguće.
   Ukloni Crawl-delay za Googlebot (Google ga ignoriše). Zadrži da su AI botovi dozvoljeni.
2. src/pages/sitemap.xml.ts: lastmod je "sada" pri svakom zahtevu. Zameni ga realnim datumom po stranici
   (za /events: datum najnovijeg eventa iz baze/getEvents; za ostale: fiksni datum poslednje izmene)
   ili ga izostavi.
3. Copyright "© 2025" u src/i18n/ui.ts (4 mesta: footer + links, en + sr): neka godina bude dinamička
   (new Date().getFullYear()). Ako je ui.ts čist rečnik stringova, uradi to preko funkcije ili zamene u komponenti.
4. src/components/pages/HomePage.astro: schema 'dateModified' (2025-07-13) neka bude datum builda/zahteva
   ili ažuran fiksni datum.
5. Meta description za /mixes i /links (en i sr) skrati na ≤ 155 znakova bez gubitka ključnih reči.
Na kraju u docs/TASKS.md štikliraj T3 sa datumom.
```

---

## T4 — Prava OG slika za deljenje (1200×630)

**Model:** Sonnet 5.5 · **Effort:** medium

**Prompt:**
```
Sajt zippydj.com (Astro 4), folder F:\ZippySite\dj-zippy-site. Ostani na trenutnoj grani, build najviše
jednom, ne commit-uj bez pitanja.

Problem: og:image je public/images/dj-zippy-house-music-dj.webp, koja je zapravo 800×800. U
src/layouts/Layout.astro je proglašena kao 1200×630, a u schema (HomePage.astro, AboutPage.astro) kao 1200×1200.
Kad se link podeli na WhatsApp/Viber/FB, preview se seče, a neki klijenti ne vole webp.

Uradi:
1. Napravi public/images/og-dj-zippy.jpg, 1200×630, < 250 KB: fotografija sa leve strane (iz postojeće webp slike),
   crna pozadina (#050505), desno "ZIPPY." (bela, narandžasta tačka #FF5500) i ispod "SERBIAN HOUSE DJ ·
   HOUSE MUSIC THERAPY". Za generisanje koristi sharp iz node_modules ako postoji (npx/Node skripta u scratchpad-u),
   ili SVG → JPG. Font: Unbounded ako je dostupan, inače bold sans.
2. Postavi je kao default ogImage u Layout.astro i LinksPage.astro (og:image + twitter:image),
   sa tačnim width/height i og:image:alt (en/sr).
3. U schema ImageObject-ima ispravi width/height na stvarne dimenzije slike koju referenciraju (800×800 za webp).
4. Pokaži mi generisanu sliku pre nego što završiš.
Na kraju u docs/TASKS.md štikliraj T4 sa datumom.
```

---

## T5 — Vinili na početnoj: svetliji + mobilni + tastatura

**Model:** Opus 5.5 · **Effort:** high

**Prompt:**
```
Sajt zippydj.com (Astro 4 + Tailwind), folder F:\ZippySite\dj-zippy-site. Ostani na trenutnoj grani, build
najviše jednom, ne commit-uj bez pitanja. Brend: crna #050505, narandžasta #FF5500, font Unbounded/Inter.

Na početnoj (src/components/pages/HomePage.astro, <style is:global> blok + skripta initCoverflow) je
3D coverflow sa vinilima za featured mixeve. Vlasnik kaže da su vinili "dosta tamni, slika na njima je tamna".
Uzroci koje sam našao:
- .cf-label::before stavlja rgba(0,0,0,0.5) preko slike. Ukloni ga ili spusti na najviše 0.1.
- Etiketa (.cf-label) je samo 38% diska, pa je slika sitna. Podigni na ~46-50%.
- Bočni diskovi dobijaju opacity 0.5/0.35 (u update()), pa kroz crni disk probija narandžasta pozadina
  i izgledaju smeđe-mutno. Umesto opacity koristi filter: brightness()/saturate() (opacity samo za |off|>2),
  da disk ostane crn i čist.
- Disk je skoro ravna crna površina. Dodaj diskretan "sheen" (conic/linear highlight) da se čita kao vinil
  na narandžastoj pozadini. Suptilno, bez kiča.
- MixCloud i Spotify mixevi nemaju thumbnail (prazno polje u bazi), pa prikazuju samo narandžastu etiketu
  "ZIPPY / MIXCLOUD". Predloži kako da dobiju pravu sliku (MixCloud API api.mixcloud.com/<user>/<slug>/ →
  pictures, Spotify oEmbed → thumbnail_url) i gde da se to čuva (D1 mixes.thumbnail preko admina ili
  fallback u src/lib/content.ts). Pitaj me pre upisa u produkcionu bazu.
- Za YouTube koristi hqdefault kao fallback ako maxresdefault ne postoji.

Kontrast: tekst ispod diska ("Youtube" text-gray-500) i link "Listen Now" (text-gray-400) su skoro nevidljivi
na narandžastom gradijentu. Neka budu čitljivi (bela/crna sa senkom ili tamna pilula), WCAG AA.

Mobilni (<640px): trenutno se 5 diskova gura u 375px, strelice leže preko diskova, a natpisi bočnih su nečitljivi.
Na mobilnom prikaži aktivni disk veći i samo ±1 susednog (ostali skriveni), strelice pomeri tako da ne prekrivaju
disk ili ih zameni tačkicama ispod. Swipe mora i dalje da radi.

Pristupačnost: .coverflow-item je <article> sa click handlerom i nije dostupan tastaturom. Neka aktivni bude
pravi <a href target=_blank rel=noopener>, a neaktivni <button> (ili tabindex+role+Enter/Space), sa
aria-label "Play <naslov> on <platforma>". Strelice levo/desno na tastaturi neka menjaju disk.

Animacija vrtenja (global.css .cf-disc vinyl-spin) ostaje. Poštuj način na koji ovaj repo na ovoj grani
gasi animacije za reduced-motion.
Proveri desktop 1440px i mobilni 390px, pošalji before/after screenshot. Na kraju u docs/TASKS.md
štikliraj T5 sa datumom.
```

---

## T6 — Links stranica: ceo link narandžast na hover/tap

**Model:** Sonnet 5.5 · **Effort:** low

**Prompt:**
```
Sajt zippydj.com, fajl src/components/pages/LinksPage.astro (samostalna link-in-bio stranica, bez Tailwind-a,
sopstveni <style>). Folder F:\ZippySite\dj-zippy-site. Ostani na trenutnoj grani, build najviše jednom,
ne commit-uj bez pitanja.

Sada hover na linku (a.link-primary / a.link-secondary) samo pravi tanku narandžastu ivicu, što je
preslabo. Vlasnik želi da kad se pređe mišem preko linka, CELA kartica postane narandžasta.
- a.link-primary:hover i :focus-visible → pozadina var(--orange) #ff5500, ivica ista, tekst i ikonica beli,
  blagi narandžasti glow. Zadrži translateY(-2px).
- a.link-secondary:hover → isto narandžasto (može malo prigušenije, npr. rgba(255,85,0,0.85)),
  ikonica i tekst beli.
- Najveći deo saobraćaja stiže sa Instagrama na TELEFONU, gde hover ne postoji. Dodaj :active stanje
  (narandžasto + scale(0.98)) i -webkit-tap-highlight-color: transparent, da tap ima jasan feedback.
- a.link-site (Explore sekcija) → na hover narandžast tekst i strelica.
- Proveri da je kontrast belog teksta na #ff5500 dovoljan za bold tekst ≥ 16px. Ako nije, koristi malo tamniju
  narandžastu (#e64d00) za pozadinu na hover.
Uradi u @media (hover:hover) za hover, a :active i :focus-visible van nje.
Pošalji screenshot hover i active stanja. Na kraju u docs/TASKS.md štikliraj T6 sa datumom.
```

---

## T7 — EN/SR prekidač: globus se preklapa

**Model:** Sonnet 5.5 · **Effort:** medium

**Prompt:**
```
Sajt zippydj.com (Astro 4 + Tailwind), folder F:\ZippySite\dj-zippy-site. Ostani na trenutnoj grani, build
najviše jednom, ne commit-uj bez pitanja.

Prekidač jezika src/components/LanguageSwitcher.astro (koristi se u src/components/Header.astro na desktopu
i mobilnom) je pilula rounded-full visine 30px. Ikonica fa-globe je u <span class="pl-2.5 pr-1">, samo 10px
od zaobljene leve ivice čiji je radijus 15px, pa se globus vizuelno "zaglavi" u krivinu ivice.
Aktivna EN/SR opcija je pravougaona narandžasta pločica koja udara direktno u globus. Vlasnik to vidi kao preklapanje.

Redizajniraj kao čist segmented control:
- kontejner sa unutrašnjim paddingom (npr. p-0.5 / p-1), blaga pozadina bg-white/5 i border-white/15;
- opcije EN/SR kao zasebne rounded-full pilule; aktivna je narandžasta, a neaktivna siva sa hover-om;
- globus ili izbaci, ili ga stavi sa dovoljno prostora (≥ 12px od ivice i ≥ 6px od prve opcije),
  vertikalno centriran;
- klikabilna površina svake opcije ≥ 32px visine (na mobilnom ≥ 40px) zbog prsta;
- na md breakpoint-u (768-1024px) proveri da se ne sudara sa nav linkovima (space-x-8 u Header.astro).
Isti vizuelni fix primeni i na sopstveni prekidač u src/components/pages/LinksPage.astro (.lang-switch, čist CSS).
Proveri na 390px, 800px i 1440px i pošalji zumirane screenshot-ove. Na kraju u docs/TASKS.md štikliraj T7 sa datumom.
```

---

## T8 — Traka (marquee) na početnoj: novi tekst + jači izgled

**Model:** Opus 5.5 · **Effort:** high · **Zavisi od:** T9 (ton teksta)

**Prompt:**
```
Sajt zippydj.com (Astro 4 + Tailwind), folder F:\ZippySite\dj-zippy-site. Ostani na trenutnoj grani, build
najviše jednom, ne commit-uj bez pitanja. Brend: crna #050505, narandžasta #FF5500, Unbounded font.

Na početnoj, ispod hero sekcije, je beskonačna traka (src/components/pages/HomePage.astro, niz `ticker`
+ .marquee u src/styles/global.css). Sada:
- reči su 'House Music Therapy', 'Exit Festival', 'Belgrade', 'Deep House', 'Tech House', 'Novi Sad',
  'Selector', 'Grooves'. Vlasniku je to "malo cringe", a gradovi su suprotni njegovom pozicioniranju
  (on je SRPSKI DJ, ne beogradski/novosadski);
- tekst je text-white/15, skoro nevidljiv. Traka treba da "dođe do izražaja".

Novi sadržaj (preporuka, social proof koji zanima bukere): traka "PLAYED AT" / "SVIRAO NA" sa pravim nastupima
iz src/lib/content.ts:
  EXIT FESTIVAL · DANCE ARENA ✦ EXIT FESTIVAL · AS FM STAGE ✦ EXIT FESTIVAL · STUDENTS STAGE ✦ CLUB KULT ✦
  TOUCAN · ZAKYNTHOS ✦ CAPITAL · LEFKADA ✦ BORISOV ATELJE ✦ RAY BAR ✦ KULT TALENTS
Fiksna labela "PLAYED AT" (en) / "SVIRAO NA" (sr) stoji levo, van pokretnog dela. Tekstove stavi u ui.ts (en/sr).
Pre implementacije mi ukratko pokaži ovaj predlog i 1-2 alternative, pa sačekaj moj izbor.

Izgled (predlog): puna narandžasta traka (bg #FF5500) sa crnim Unbounded tekstom, blago zarotirana (-1.5deg)
kao festivalska "tape" traka i šira od ekrana. Opciono druga, tanja crna traka sa belim tekstom ide u
suprotnom smeru i ukršta se sa njom. Tekst ≥ text-2xl na desktopu, čitljiv na mobilnom. Na hover pauza
ostaje. Bez horizontalnog skrola stranice (overflow-x), bez CLS-a.
SEO/a11y: prva kopija liste neka bude čitljiva screen reader-u (ul sa stavkama), a duplikat za loop aria-hidden.
Animaciju gasi za reduced-motion na način na koji ovaj repo to radi na ovoj grani.
Proveri 390px i 1440px i pošalji screenshot. Na kraju u docs/TASKS.md štikliraj T8 sa datumom.
```

---

## T9 — "Srpski DJ" pozicioniranje kroz ceo sajt

**Model:** Opus 5.5 · **Effort:** high

**Prompt:**
```
Sajt zippydj.com (Astro 4, dvojezičan en + sr latinica), folder F:\ZippySite\dj-zippy-site. Ostani na
trenutnoj grani, build najviše jednom, ne commit-uj bez pitanja.

Cilj: kroz ceo sajt naglasiti da je DJ Zippy (Veljko Nedeljković) SRPSKI DJ ("Serbian house DJ" /
"srpski house DJ", "DJ iz Srbije"), a NE beogradski ili novosadski. Sada skoro svaki title, description i bio kaže
"from Belgrade, Serbia" / "iz Beograda".

Gde:
- src/i18n/ui.ts: ~44 pominjanja Belgrade/Beograd/Novi Sad (home/about/mixes/events/links/gallery/blog
  title, description, bio, FAQ "Where is DJ Zippy based?", schema.personDescription). Kod title-a stavi ključnu
  frazu napred, npr. home: "DJ Zippy – Serbian House DJ | House Music Therapy" /
  "DJ Zippy – srpski house DJ | House Music Therapy". About: "About DJ Zippy – Serbian House & Tech House DJ".
  Title ≤ 60 znakova, description ≤ 155.
- public/llms.txt: "Based in: Belgrade, Serbia" → "Serbia", i opis.
- JSON-LD u src/components/pages/HomePage.astro i AboutPage.astro: jobTitle → "Serbian House DJ & Selector",
  address/homeLocation → samo addressCountry RS (bez grada). birthPlace ostaje (činjenica). nationality ostaje.
  U description dodaj "Serbian".
- src/lib/posts.ts i sitemap.xml.ts (po jedno pominjanje): proveri kontekst.
NE MENJAJ činjenične lokacije nastupa (event location "Novi Sad", "Belgrade", alt tekstovi galerije sa
bine/grada, podaci u src/lib/content.ts i src/pages/api/sync/events.ts). To su lokacije događaja, ne identitet.
Ton: samouveren, bez fraza tipa "vibe architect". Srpski tekst mora zvučati prirodno, ne kao prevod.
Pre izmena mi pokaži tabelu staro → novo za title i description svih stranica (en + sr) i sačekaj potvrdu.
Na kraju u docs/TASKS.md štikliraj T9 sa datumom.
```

---

## T10 — Početna: H1 + uvodna sekcija sa fotkom (SEO)

**Model:** Opus 5.5 · **Effort:** high · **Zavisi od:** T9

**Prompt:**
```
Sajt zippydj.com (Astro 4 + Tailwind), folder F:\ZippySite\dj-zippy-site. Ostani na trenutnoj grani, build
najviše jednom, ne commit-uj bez pitanja. Brend: crna, narandžasta #FF5500, Unbounded + Inter.

Početna (src/components/pages/HomePage.astro) je SEO-tanka:
- H1 je samo "ZIPPY.", a "HOUSE MUSIC THERAPY" je H2. Nema ključne fraze "Serbian house DJ" / "srpski house DJ".
- Nema nijedne prave <img> fotografije umetnika (vinili su CSS pozadine), a teksta ima vrlo malo.
- Redosled je: hero sa coverflow-om → marquee → Upcoming → footer forma.

Uradi:
1. Iznad "ZIPPY." dodaj mali kicker "SERBIAN HOUSE DJ" / "SRPSKI HOUSE DJ" (tracking-widest, narandžast ili beo).
   H1 neka semantički obuhvati "ZIPPY." + kicker, tako da izgled ostane isti a H1 glasi npr. "Zippy — Serbian House DJ".
   "HOUSE MUSIC THERAPY" ostaje vizuelno isto.
2. Posle Upcoming sekcije dodaj kratku "About/Intro" sekciju: prava <img> (/images/dj-zippy-house-music-dj.webp,
   width/height, loading=lazy, alt "DJ Zippy, Serbian house DJ" en/sr), 2-3 rečenice bio-a sa ključnim frazama,
   3-4 kredencijala kao brojke/čipovi (npr. "Exit Festival 2024 & 2025", "3 Exit stages", "Kult Talents",
   "Serbia · Greece"), i dva CTA-a: "Book Zippy" (#contact) i "Full bio" (/about). Tekstove u ui.ts (en/sr),
   u tonu iz T9 (bez klišea). Na mobilnom slika ide iznad teksta.
3. Na Events stranici (src/components/pages/EventsPage.astro) H1 je samo "DJ Zippy". Neka bude
   "DJ Zippy Live Events" / "Nastupi DJ Zippyja" (vizuelno može ostati slično).
4. Proveri redosled naslova (jedan H1, logični H2) na / i /sr.
Pošalji screenshot desktop i mobilnog. Na kraju u docs/TASKS.md štikliraj T10 sa datumom.
```

---

## T11 — Booking forma: labele + praćenje konverzija

**Model:** Sonnet 5.5 · **Effort:** medium · **Treba od tebe:** Google Ads conversion label

**Prompt:**
```
Sajt zippydj.com (Astro 4 + Tailwind), folder F:\ZippySite\dj-zippy-site. Ostani na trenutnoj grani, build
najviše jednom, ne commit-uj bez pitanja.

Booking forma je u src/components/Footer.astro (web3forms, fetch u initContactForm).
1. Polja imaju samo placeholder, bez <label>. Dodaj labele (vizuelno male iznad polja ili floating label),
   povezane preko for/id, en/sr iz ui.ts, uz autocomplete atribute (name, email).
2. Po uspešnom slanju (res.ok) ne okida se NIJEDNA konverzija, iako je na sajtu Google Ads (AW-975400552),
   GTM (GTM-KLGKHMGM) i Meta Pixel. Dodaj:
   - gtag('event','conversion',{send_to:'AW-975400552/<LABEL>'}). PITAJ ME za <LABEL> (Google Ads →
     Goals → Conversions) i ne izmišljaj ga;
   - fbq('track','Lead');
   - dataLayer.push({event:'booking_form_submit'}) za GTM.
   Sve to umotaj u try/catch i proveri da gtag/fbq postoje (moguće je da se učitavaju odloženo).
3. Poruka o grešci sada upućuje na veljkoned@gmail.com. Predloži mi i domen-adresu (npr. booking@zippydj.com
   preko Cloudflare Email Routing). Ništa ne menjaj u DNS-u, samo mi daj korake.
4. Dodaj honeypot polje protiv spama (web3forms podržava botcheck).
Na kraju u docs/TASKS.md štikliraj T11 sa datumom.
```

---

## T12 — Mixes i Events stranice: dorada izgleda

**Model:** Sonnet 5.5 · **Effort:** high

**Prompt:**
```
Sajt zippydj.com (Astro 4 + Tailwind), folder F:\ZippySite\dj-zippy-site. Ostani na trenutnoj grani, build
najviše jednom, ne commit-uj bez pitanja. Brend: crna, narandžasta #FF5500.

1. /mixes (src/components/pages/MixesPage.astro): kartice imaju gradient from-black/90 via-black/40 preko cele
   slike, pa su thumbnail-ovi mutni, a naslov kartice se sudara sa tekstom koji je već na YouTube thumbnail-u
   (npr. "HOUSE MUSIC"). Slika neka bude čista (gradient samo u donjih ~35%) ili neka naslov/žanr/Listen
   Now budu ispod slike, na tamnoj podlozi kartice. Hover: blagi zoom slike + narandžasta ivica. Na mobilnom 1 kolona.
2. /events (src/components/pages/EventsPage.astro): "Past Highlights" je dugačka lista od ~20 tekstualnih redova.
   Napravi kompaktniji prikaz: highlight nastupi (featured, npr. Exit Festival) kao veće kartice u gridu
   (2 kolone na desktopu), a ostali prošli nastupi kao kompaktna lista ili "Show all" (details/summary, bez JS-a).
   Location tekst (text-gray-500 na #1f1f1f) podigni na čitljiv kontrast.
3. Scroll-reveal (data-reveal u Layout.astro) ostavlja prazne crne površine dok se brzo skroluje. Smanji
   translateY/trajanje ili otkrivaj ranije (rootMargin), da ne bude "praznih ekrana".
Pošalji screenshot desktop i mobilnog. Na kraju u docs/TASKS.md štikliraj T12 sa datumom.
```

---

## T13 — Performanse: skripte, fontovi, video

**Model:** Opus 5.5 · **Effort:** high · **Posle:** T1

**Prompt:**
```
Sajt zippydj.com (Astro 4 + Tailwind, Cloudflare Workers), folder F:\ZippySite\dj-zippy-site. Ostani na
trenutnoj grani, build najviše jednom, ne commit-uj bez pitanja. Praćenje (GTM, Meta Pixel, Google Ads)
MORA i dalje da radi.

Prvo izmeri polazno stanje: Lighthouse mobile za / i /links (PageSpeed Insights API ili lokalni lighthouse).
Zapiši LCP, TBT, CLS i ukupnu težinu.

Pa uradi:
1. src/layouts/Layout.astro: GTM, Meta Pixel i gtag (AW-975400552) se učitavaju odmah u <head>. Odloži ih
   do prve interakcije ili requestIdleCallback-a (sa timeout fallback-om ~3-4s, da se PageView ipak zabeleži).
   Referenca postoji u commit-u bfb2a7d na dev grani: `git show bfb2a7d -- src/layouts/Layout.astro src/pages/links.astro`
   (samo čitaj, ne checkout-uj dev). Isto uradi u src/components/pages/LinksPage.astro.
   Proveri i da li GTM već sadrži Google Ads tag (duplo učitavanje).
2. Google Fonts (Unbounded 400/700/900 + Inter 300/400/600) su render-blocking. Self-host-uj woff2
   (samo latin + latin-ext zbog č/ć/š/ž/đ) u public/fonts, sa @font-face font-display: swap i preload
   za 1-2 najbitnija fajla. Ukloni preconnect/link ka Google Fonts.
3. Layout preload-uje /images/dj-zippy-house-music-dj.webp na SVAKOJ stranici, iako se na početnoj ne vidi.
   Preload stavi samo na stranice gde je slika iznad pregiba (about, links).
4. Coverflow i mixes koriste YouTube maxresdefault.jpg (100-200 KB svaki). Za diskove je dovoljan
   hqdefault ili i.ytimg.com/vi_webp/<id>/hqdefault.webp (src/lib/content.ts + gde se thumbnail koristi).
5. Links stranica: public/videos/links-bg.mp4 ima 2.5 MB (Instagram saobraćaj sa telefona). Ako je ffmpeg
   dostupan, napravi verziju ≤ 800 KB (720p ili manje, CRF ~30, bez zvuka, faststart) i poster JPG
   od prvog kadra (≤ 40 KB). Ako ffmpeg nije dostupan, daj mi tačnu komandu. Za Save-Data/2G ne učitavaj video.
Na kraju ponovo izmeri i daj tabelu pre → posle. U docs/TASKS.md štikliraj T13 sa datumom.
```

---

## T14 — Blog i sadržaj: strategija (opciono)

**Model:** Opus 5.5 · **Effort:** high

**Prompt:**
```
Sajt zippydj.com (Astro 4, en + sr), folder F:\ZippySite\dj-zippy-site. Ostani na trenutnoj grani, ne
commit-uj bez pitanja. U ovom tasku se NIŠTA ne implementira bez moje potvrde.

/blog i /gallery su trenutno noindex (src/components/pages/BlogIndexPage.astro, GalleryPage.astro), a u
src/lib/posts.ts ima 2 posta. Cilj je da sajt rangira za "Serbian house DJ", "DJ Srbija", "house DJ za
klub/festival/privatnu žurku", "House Music Therapy".
Napravi plan:
1. Da li i kada skinuti noindex sa bloga i galerije (šta im fali da budu vredni za indeks).
2. 8-10 tema za članke (en + sr) sa ciljnom ključnom frazom i intentom, npr. Exit Festival recap,
   "Kako izgleda House Music Therapy set", "Booking DJ-a za privatnu žurku u Srbiji — šta pitati".
3. Off-site SEO: koje profile ažurirati da svuda stoji isto ("Serbian house DJ", link na zippydj.com):
   RA, MixCloud, SoundCloud, Spotify, Instagram bio, Wikidata Q138220521, MusicBrainz. Plus ideje za
   backlink-ove (klubovi, festivali, lokalni mediji, Kult Talents).
4. EPK (press kit) stranica za bukere: šta sadrži i da li je vredi napraviti.
Rezultat upiši kao novu sekciju na dnu docs/TASKS.md i dodaj nove taskove u tabelu (T15+), u istom formatu.
```

---

## T14 rezultat — plan sadržaja i SEO-a (2026-09-30)

Cilj: da sajt rangira za „Serbian house DJ“, „DJ Srbija“, „house DJ za klub/festival/privatnu žurku“
i „House Music Therapy“. Ništa od ovoga još nije implementirano; svaki korak je task T15–T22 ispod.

### 1. Blog i galerija: kada skinuti noindex

**Galerija (/gallery)** ima jednu pravu fotku (istu kao profilna) i 5 praznih placeholder-a sa
tekstom „More photos coming soon“. Takva stranica bi u indeksu bila „thin content“, pa **noindex ostaje**
dok ne važi sve sledeće:
- najmanje 12 pravih fotki sa nastupa (Exit Dance Arena, Students Stage, AS FM, Club Kult, Toucan,
  Capital, Krivi Put…), webp ≤ 200 KB, sa width/height i lazy load;
- svaka ima alt i kratak caption (bina · grad · godina). Alt tekstovi već postoje u `ui.ts` (`gallery.photos`);
- nema placeholder-a.
Tada skini noindex, dodaj /gallery i /sr/gallery u sitemap sa `<image:image>` i `ImageGallery` schema → **T17**.

**Blog (/blog)** ima 2 generička sample posta („The Evolution of House Music“, „Deep House Vibes for
Summer“) na engleskom. Isti engleski tekst stoji i na /sr/blog. Takav sadržaj ne rangira i razvodnjava
sajt, pa **noindex ostaje** dok ne važi sve sledeće:
- `posts` tabela zna jezik (kolona `locale` ili par slug-ova en/sr), da /sr/blog prikazuje srpske tekstove;
- sample postovi su obrisani;
- postoje bar 3 prava teksta iz iskustva DJ Zippyja (tema 1–3 ispod);
- svaki post ima autora, datum, `BlogPosting` schema, realan `lastmod` u sitemap-u i interne linkove
  ka /events, /mixes i #contact.
Infrastruktura je **T15**, prvi članak je **T16**.

### 2. Teme za članke (en + sr)

| # | Tema (en / sr) | Ciljna fraza | Intent |
|---|----------------|--------------|--------|
| 1 | Exit Festival 2025: playing the Dance Arena and the Students Stage / Exit 2025: kako izgleda set na Dance Areni | „Exit Festival DJ“, „DJ na Exit festivalu“ | dokaz za bukere + informativno |
| 2 | What a House Music Therapy set sounds like (with tracklist) / Kako zvuči House Music Therapy set | „House Music Therapy“ | brend |
| 3 | Booking a DJ for a private party in Serbia: 10 questions to ask / Kako da rezervišeš DJ-a za privatnu žurku: 10 pitanja | „DJ za privatnu žurku“, „DJ za proslavu Srbija“ | komercijalni (booking) |
| 4 | House, tech house, deep house: the difference, explained by a DJ / House, tech house i deep house: u čemu je razlika | „šta je tech house“, „deep house vs tech house“ | informativno (vrh levka) |
| 5 | How I prepare a festival set / Kako spremam festivalski set | „DJ set priprema“, „festival DJ set“ | autoritet |
| 6 | The Serbian house scene: clubs and nights worth knowing / Srpska house scena: klubovi i večeri koje vredi znati | „house muzika Srbija“, „house klubovi Srbija“ | lokalni SEO + tekst koji klubovi rado dele (backlink) |
| 7 | Summer in Greece: Toucan Zakynthos and Capital Lefkada / Leto u Grčkoj: Zakintos i Lefkada | „Serbian DJ Greece“, „DJ Zakynthos“ | inostrani bukeri |
| 8 | Club set vs festival set: what changes / Klub ili festival: šta se menja u setu | „club DJ vs festival DJ“ | informativno |
| 9 | Kult Talents from the inside / Kult Talents iz ugla člana | „Kult Talents“ | brend + backlink sa Kulta |
| 10 | Monthly House Music Therapy selection (10 tracks + Spotify) / Mesečna House Music Therapy selekcija | „house music playlist 2026“ | povratne posete + Spotify |

Ritam: jedan tekst mesečno je dovoljan. Svaki tekst se piše na oba jezika, a ne mašinski prevodi.

### 3. Off-site SEO

Svuda isto ime, ista rečenica i isti link. To Google-u potvrđuje entitet i hrani knowledge panel.
- **Ime:** DJ Zippy (alternativno Zippy)
- **Bio (en):** Serbian house DJ · creator of House Music Therapy · Exit Festival 2024 & 2025
- **Bio (sr):** Srpski house DJ · tvorac House Music Therapy · Exit festival 2024. i 2025.
- **Link:** https://zippydj.com (na Instagramu i TikTok-u https://zippydj.com/links)

| Profil | Šta uraditi |
|--------|-------------|
| Resident Advisor (ra.co/dj/zippy-2) | bio (en), lokacija Serbia, link na sajt, prošli nastupi (Exit, Kult) upisani kao RA eventi |
| MixCloud / SoundCloud | bio + link, cover slike za svaki miks (rešava i miksove bez slike na sajtu), tagovi house / tech house |
| Spotify (plejliste) | opis svake plejliste: „… by DJ Zippy, Serbian house DJ — zippydj.com“ |
| Instagram (@zovumezippy) | bio iznad + link na /links |
| YouTube | opis kanala i linkovi; u opisu svakog seta tracklist i zippydj.com |
| Facebook / TikTok | isti bio i link |
| Wikidata Q138220521 | P106 zanimanje (disc jockey), P27 državljanstvo (Serbia), P136 žanr (house, tech house), P856 zvanični sajt, P2003 Instagram, P2397 YouTube kanal, P434 MusicBrainz ID; opis en/sr „Serbian house DJ“ |
| MusicBrainz | tip Person, area Serbia, alias „Zippy“, URL veze (sajt, Instagram, YouTube, SoundCloud, MixCloud, Spotify, RA, Wikidata) |
| Google Business Profile | kategorija „DJ service“, service area Srbija, link i fotke. Donosi prisustvo u Maps/lokalnoj pretrazi za „DJ za žurku“ |

**Backlink ideje (od najlakšeg):**
- Klubovi i organizatori gde je svirao (Club Kult, Ray Bar, KC Lab, Borisov Atelje, Krivi Put, Toucan, Capital):
  da ime na event stranici ili FB eventu linkuje na zippydj.com.
- Exit arhiva lineup-a 2024/2025 i AS FM (bina njihovog imena): link na artist profil; kod AS FM i guest mix ili intervju.
- Kult Talents: profil člana sa linkom. Go2 Travel: partner/testimonial sa linkom.
- Lokalni mediji i portali za noćni život (gradski portali, studentski mediji zbog Students Stage-a):
  priča „srpski DJ na tri bine Exita“ + House Music Therapy.
- Tekstovi 6 i 9 iznad su pisani da ih klubovi i Kult rado podele.

### 4. EPK (press kit) stranica

**Isplati se.** Bukeri festivala i klubova u inostranstvu traže jedan link, a ne Instagram.
Predlog: /epk i /sr/epk, van glavnog menija (link iz footera, sa /links i u mejlovima), indeksirana.
Sadržaj:
- bio u dve dužine (≈50 i ≈150 reči), en + sr, sa dugmetom „kopiraj“;
- 4–6 press fotki u visokoj rezoluciji (portret + landscape, sa kreditom fotografa) i ZIP za preuzimanje;
- logo „ZIPPY.“ (SVG/PNG, svetli i tamni);
- highlights: 3 bine Exita (2024, 2025), Club Kult, Grčka, Kult Talents;
- 3 najbolja seta (YouTube/MixCloud), žanrovi, BPM raspon, dužine setova;
- tehnički rider (npr. 2–3× CDJ-3000 + DJM-900NXS2/A9, booth monitori) i hospitality rider kao PDF;
- booking kontakt (booking@zippydj.com), teritorija (Srbija, EU), rok odgovora.
To je **T20**.

---

## T15 — Blog: prava infrastruktura (jezik, schema, sitemap)

**Model:** Sonnet 5.5 · **Effort:** high

**Prompt:**
```
Sajt zippydj.com (Astro 4, en + sr, D1 baza), folder F:\ZippySite\dj-zippy-site. Ostani na trenutnoj grani,
build najviše jednom, ne commit-uj bez pitanja. Pročitaj „T14 rezultat“ u docs/TASKS.md.

Blog je noindex jer ima 2 sample posta na engleskom (src/lib/posts.ts), a /sr/blog prikazuje iste engleske tekstove.
Pripremi infrastrukturu, ali noindex NE skidaj dok ne postoje 3 prava teksta:
1. D1 tabela posts dobija kolonu `locale` ('en' | 'sr') i `translation_of` (slug para). Napiši migraciju u migrations/,
   ažuriraj src/types/database.ts, API (src/pages/api/posts*.ts) i admin (src/pages/admin/posts.astro) da biraju jezik.
   Pitaj me pre pokretanja migracije na produkcionoj bazi.
2. /blog prikazuje samo en postove, /sr/blog samo sr. Post bez prevoda nema hreflang ka drugom jeziku.
3. BlogPostPage: BlogPosting schema (author = #person, datePublished/Modified, image, inLanguage), breadcrumb,
   linkovi ka /events, /mixes i #contact na kraju teksta.
4. sitemap.xml.ts: /blog i postovi sa realnim lastmod, ali samo kad je blog indeksiran (jedan flag, npr. BLOG_INDEXABLE u posts.ts).
5. Obriši sample postove iz posts.ts (fallback neka bude prazna lista sa porukom „uskoro“).
Na kraju u docs/TASKS.md štikliraj T15 sa datumom.
```

---

## T16 — Prvi pravi članak: Exit 2025 recap (en + sr)

**Model:** Opus 5.5 · **Effort:** high · **Zavisi od:** T15 · **Treba od tebe:** fotke, tracklist, par anegdota

**Prompt:**
```
Sajt zippydj.com, folder F:\ZippySite\dj-zippy-site. Ne commit-uj bez pitanja. Pročitaj „T14 rezultat“ u docs/TASKS.md
(tema 1 u tabeli) i ton iz T9 (srpski DJ, bez klišea tipa „vibe architect“).

Napiši članak „Exit Festival 2025: playing the Dance Arena and the Students Stage“ i srpsku verziju
„Exit 2025: kako izgleda set na Dance Areni“ (ne prevod, nego prirodan srpski tekst), 700–1000 reči.
Pre pisanja me pitaj: kako je došlo do nastupa, satnica, publika, 5–10 numera iz seta, jedan trenutak
koji pamtim, i koje fotke imam. Ciljne fraze: „Exit Festival DJ“ / „DJ na Exit festivalu“, „Serbian house DJ“.
Struktura: uvod, priprema, set, publika, šta sledi + CTA za booking. Meta title ≤ 60, description ≤ 155.
Upis ide preko admina u D1 (pitaj me pre upisa u produkciju). Na kraju štikliraj T16.
```

---

## T17 — Galerija: prave fotke + indeksiranje

**Model:** Sonnet 5.5 · **Effort:** medium · **Treba od tebe:** 12+ fotki sa nastupa (i ime fotografa)

**Prompt:**
```
Sajt zippydj.com (Astro 4 + Tailwind), folder F:\ZippySite\dj-zippy-site. Ostani na trenutnoj grani, build
najviše jednom, ne commit-uj bez pitanja.

/gallery (src/components/pages/GalleryPage.astro) ima jednu fotku i 5 placeholder-a, pa je noindex.
Fotke koje ti dam stavi u public/images/gallery/ kao webp (sharp iz node_modules, dugačka strana 1600px, ≤ 200 KB)
plus 600px thumbnail. Grid sa pravim <img> (width/height, lazy, srcset), alt i caption (bina · grad · godina)
iz src/i18n/ui.ts (en + sr), lightbox bez biblioteke (<dialog>). Ukloni placeholder-e i tekst „coming soon“.
Kad ima ≥ 12 fotki: skini noindex, dodaj /gallery i /sr/gallery u sitemap.xml.ts sa <image:image>,
ImageGallery schema. Proveri 390px i 1440px. Na kraju štikliraj T17.
```

---

## T18 — Off-site profili: isti bio svuda (checklist)

**Model:** Sonnet 5.5 · **Effort:** low · **Radiš ti** (Claude priprema tekstove)

**Prompt:**
```
Folder F:\ZippySite\dj-zippy-site. Pročitaj „T14 rezultat“ → „3. Off-site SEO“ u docs/TASKS.md.
Napravi docs/offsite-profiles.md: za svaki profil (RA, MixCloud, SoundCloud, Spotify plejliste, Instagram,
YouTube, Facebook, TikTok, Google Business Profile) gotov tekst za copy-paste, en i sr gde platforma to podržava,
u granici broja znakova te platforme (Instagram bio 150), sa linkom i checkbox-om „urađeno“.
Kod se ne menja. Na kraju štikliraj T18.
```

---

## T19 — Wikidata + MusicBrainz dopune

**Model:** Sonnet 5.5 · **Effort:** medium · **Radiš ti** (Claude vodi korak po korak)

**Prompt:**
```
Pomozi mi da dopunim Wikidata stavku Q138220521 (DJ Zippy) i MusicBrainz artist
a6a53c2e-8fa0-4612-8e43-8de7af43dc2a. Pročitaj „T14 rezultat“ → „3. Off-site SEO“ u
F:\ZippySite\dj-zippy-site\docs\TASKS.md. Prvo pročitaj trenutno stanje obe stranice (samo čitanje),
pa mi daj tačnu listu izjava/veza koje fale, sa vrednostima i izvorima (reference URL). Unos radim ja.
Ništa ne menjaj u mom nalogu. Na kraju štikliraj T19.
```

---

## T20 — EPK (press kit) stranica za bukere

**Model:** Opus 5.5 · **Effort:** high · **Treba od tebe:** press fotke, logo fajl, rider

**Prompt:**
```
Sajt zippydj.com (Astro 4 + Tailwind, en + sr), folder F:\ZippySite\dj-zippy-site. Ostani na trenutnoj grani,
build najviše jednom, ne commit-uj bez pitanja. Pročitaj „T14 rezultat“ → „4. EPK“ u docs/TASKS.md.

Napravi /epk i /sr/epk (src/components/pages/EpkPage.astro + rute), van glavnog menija, sa linkom iz footera
i sa /links. Sadržaj po planu iz T14: bio u 2 dužine sa dugmetom „kopiraj“, press fotke + ZIP, logo, highlights,
3 seta, tehnički i hospitality rider (PDF), booking kontakt. Tekstovi idu u ui.ts (en + sr), ton iz T9.
Schema: ProfilePage + Person (#person). Pre pisanja ridera me pitaj za opremu. Proveri 390px i 1440px.
Na kraju štikliraj T20.
```

---

## T21 — booking@zippydj.com + Google Ads label

**Model:** Sonnet 5.5 · **Effort:** low · **Treba od tebe:** Email Routing podešen na Cloudflare-u, Ads conversion label

Koraci za adresu (radiš ti, u Cloudflare dashboard-u; kod se ne dira):
1. Cloudflare → zippydj.com → **Email** → **Email Routing** → *Get started / Enable*. Cloudflare sam dodaje
   MX i SPF (TXT) zapise. Ako domen već ima MX za neki drugi mail, prvo proveri da ga ne gaziš.
2. **Destination addresses** → dodaj veljkoned@gmail.com i potvrdi link iz mejla.
3. **Routing rules** → *Create address*: `booking@zippydj.com` → *Send to* veljkoned@gmail.com.
4. (Opciono) Da odgovaraš SA te adrese: u Gmail-u Settings → Accounts → „Send mail as“ → booking@zippydj.com.
   Za to treba SMTP (npr. Gmail app password ili neki transactional servis). Do tada odgovori stižu sa gmail-a, što je ok.
5. Pošalji probni mejl na booking@zippydj.com sa nekog drugog naloga.

**Prompt:**
```
Sajt zippydj.com, folder F:\ZippySite\dj-zippy-site. Ostani na trenutnoj grani, build najviše jednom, ne commit-uj bez pitanja.
1. Email Routing za booking@zippydj.com je podešen (pitaj me da potvrdim). Zameni javno prikazanu adresu
   veljkoned@gmail.com sa booking@zippydj.com u: src/components/Footer.astro (link + poruka o grešci u ui.ts),
   FAQ u src/i18n/ui.ts (en + sr), schema contactPoint u HomePage.astro, public/llms.txt.
2. U src/components/Footer.astro upiši Google Ads conversion label u konstantu ADS_CONVERSION_LABEL
   (pitaj me za vrednost, ne izmišljaj je).
Na kraju štikliraj T21.
```

---

## T22 — Ostaci iz 2026-09-30: MixCloud slike, GTM tag, Inter

**Model:** Sonnet 5.5 · **Effort:** medium

Tri sitnice primećene dok su rađeni T5–T13:
- **MixCloud miksevi nemaju sliku** na vinilima i na /mixes (prazno `cover_image` u D1). Slika se dobija iz
  API-ja: link `www.mixcloud.com/zovumezippy/<slug>/` → `api.mixcloud.com/zovumezippy/<slug>/` → `pictures.extra_large`. Upis u produkcionu bazu traži potvrdu.
- **GTM kontejner GTM-KLGKHMGM** ima Google tag sa ID-jem „zippydj“, što nije validan tag ID (očekuje se G-… ili AW-…).
  Google Ads tag (AW-975400552) NIJE u GTM-u, nego se učitava direktno sa sajta, pa nema duplog učitavanja.
  GTM ima i „Form Submission“ okidač; za booking konverziju je pouzdaniji custom event `booking_form_submit` (T11).
- **Inter** se učitava samo na /links. Na ostatku sajta tekst ide sistemskim fontom, jer Tailwind `font-body`
  nigde nije primenjen. Treba odlučiti da li body tekst prebaciti na Inter (vizuelna promena, +48 KB).

**Prompt:**
```
Sajt zippydj.com, folder F:\ZippySite\dj-zippy-site. Ostani na trenutnoj grani, build najviše jednom, ne commit-uj bez pitanja.
Pročitaj T22 u docs/TASKS.md.
1. Za svaki MixCloud miks iz D1 (tabela mixes, platform = 'mixcloud') povuci pictures.extra_large sa MixCloud API-ja
   i pokaži mi listu slug → URL. Posle moje potvrde upiši cover_image u produkcionu D1 (wrangler d1 execute --remote),
   pa proveri vinile na početnoj i kartice na /mixes.
2. Napiši mi korake za GTM: šta je Google tag „zippydj“ i kako da ga ispravim ili uklonim, i kako da napravim
   okidač na custom event booking_form_submit. U GTM ne ulaziš ti.
3. Napravi screenshot početne sa body tekstom u Inter-u i bez njega (samo lokalno), pa me pitaj koji ostaje.
Na kraju štikliraj T22.
```

---

## Greške primećene posle deploy-a (2026-09-30)

Korisnik šalje screenshotove jednu po jednu. Urađene stavke imaju „[x] urađeno“ ispod naslova.

### B1 — Ružan prvi frame početne (flash pre nego što se vinili učitaju)
- **[x] 2026-10-01 urađeno:** server sada sam računa početni raspored vinila (ista formula kao skripta, razmak kao CSS `--cf-gap` po širini ekrana) i prvi disk dobija `active` već u HTML-u, pa je prvi frame isti kao konačni na desktopu i mobilnom (provereno bez JS-a, iste koordinate).
- **Šta se vidi:** u prvoj sekundi posle učitavanja početne (desktop ~1920 px) prikazuje se hero sa velikim
  „ZIPPY.“ i „HOUSE MUSIC THERAPY“, ali se **„Featured Mixes“ naslov + podnaslov već vide usred hero-a, ispod
  glavnog naslova**, bez ikakvog razmaka. Ispod je prazan narandžasti prostor, pa tek jedan disk (vinil) i dugme
  „Listen Now“; bočni diskovi nisu tu, strelice ←/→ već stoje. Ceo ekran izgleda nedovršeno i „sklepano“,
  pa se posle <1 s složi u pravi raspored.
- **Screenshot:** `C:\Users\Zippy\AppData\Local\Temp\claude\F--ZippySite-dj-zippy-site\0b489fb4-877d-4f76-93a6-c366f8f7b6e5\images\1.webp`
- **Sumnja (neproverena):** vinili/coverflow u `HomePage.astro` se pozicioniraju JS-om tek posle hidratacije, a
  do tada je raspored u CSS-u pogrešan (ili je sekcija „Featured Mixes“ vidljiva pre pozicioniranja). Izgleda kao
  regresija iz T5 (coverflow) ili T12/T13 (brži reveal, odloženi skripti). Proveriti: početno stanje bez JS-a,
  da li se sekcija krije do `is-ready` klase, i da li reveal animacija (0.45 s) ne otkriva nepripremljen sadržaj.
- **Očekivano:** ili da se ništa ne prikaže dok layout nije spreman (opacity 0 → 1 kad je poravnat), ili da
  statički/SSR raspored odmah bude isti kao konačni (rezervisana visina, centralni disk + susedi u CSS-u).

### B2 — Spotify kartice na /mixes: slike su pomerene za jedno mesto
- **[x] 2026-10-01 urađeno:** greška je bila u D1, ne u šablonu: `cover_image` za Spotify redove 10 i 11 ispravljen (Spotify oEmbed), a redu 9 („House Music Therapy“) slika skinuta jer njegov link vraća 404 na Spotify-u (plejlista obrisana ili privatna). Ostali tabovi nisu pomereni; SoundCloud kartice nemaju sliku, MixCloud koristi profilnu (T22).
- **Šta se vidi:** na tabu SPOTIFY prva kartica („House Music Therapy with DJ Zippy“, FEATURED) prikazuje
  sliku koja pripada drugoj plejlisti (Guilty Trep), druga kartica („Guilty Trep Pleasures“) ima kolaž
  (Duboko EP / Niške strasti) koji pripada trećoj, a treća („Chill Balkan RnB Vibes“) nema sliku, samo
  Spotify logo kao placeholder. Dakle, slike su **pomerene za jedno mesto** (off-by-one): prvoj kartici fali
  njena slika, a svaka sledeća ima sliku svog prethodnika/sledbenika.
- **Screenshot:** `C:\Users\Zippy\AppData\Local\Temp\claude\F--ZippySite-dj-zippy-site\0b489fb4-877d-4f76-93a6-c366f8f7b6e5\images\2.png`
- **Sumnja (neproverena):** ili su `cover_image` vrednosti u D1 (`mixes`, platform = 'spotify') upisane pomereno,
  ili se u `MixesPage.astro` (T12 redizajn kartica) slika bira po indeksu iz drugog niza nego naslov/link
  (npr. filtriran vs. nefiltriran niz, ili featured kartica preskače indeks). Proveriti prvo D1 redove
  (id, title, cover_image, sort_order), pa tek onda šablon. Proveriti i da isto ne važi za ostale tabove
  (YouTube, MixCloud, SoundCloud, Deezer) i za vinile na početnoj.

### B3 — Links stranica na desktopu: pikselizovan pozadinski video
- **[x] 2026-10-01 urađeno:** na ≥768 px video ide u svom obliku 9:16 kao kolona pune visine iza kartica (~1:1, oštar), sa mekim ivicama, a strane popunjava zamućen poster (8 KB, već keširan); telefon nepromenjen.
- **Šta se vidi:** na /links u desktop browseru (~1900 px) pozadinski video je očigledno niske rezolucije
  (vidljivi veliki pikseli, mutno), dok na telefonu izgleda lepo.
- **Uzrok (verovatan, iz T13):** video je smanjen na 540×960 (vertikalni, 0.7 MB) i na širokom ekranu se
  razvlači preko celog viewporta (`object-cover`), pa se uvećava ~3.5×. Na telefonu je skoro 1:1, zato tamo radi.
- **Mogući pravci:** (a) na desktopu (`min-width: 768px`) umesto videa prikazati zamućenu/zatamnjenu statičnu
  pozadinu ili poster, (b) dodati drugi, horizontalni izvor (npr. 1280×720) učitan samo na širokim ekranima
  preko `<source media=...>`, (c) ograničiti video na širinu kolone i ostatak ispuniti gradijentom/blur-om.
  Voditi računa da Lighthouse (98) i Save-Data/2G isključenje ostanu.
- **Screenshot:** `C:\Users\Zippy\AppData\Local\Temp\claude\F--ZippySite-dj-zippy-site\0b489fb4-877d-4f76-93a6-c366f8f7b6e5\images\3.webp`

### B4 — Links stranica: razdelna linija između sekcija izgleda kao fleka
- **[x] 2026-10-01 urađeno:** razdelnik je sada tanka linija preko cele kolone kartica (bela 14 %, krajevi blede).
- **Šta se vidi:** između „Stream & Follow“ i „Also on“ je kratka svetla linija (~40 px, oko y=750 na screenshotu)
  koja se na tamnom/video pozadini vidi kao mutna fleka, a ne kao namerni razdelnik.
- **Očekivano:** ili čista tanka linija pune širine kolone (npr. `border-white/10`), ili ukloniti razdelnik
  i osloniti se na razmak i naslov „ALSO ON“. Proveriti u `LinksPage.astro` (gradient/blur element između lista).
- **Screenshot:** isti kao B3 (`images\3.webp`).

### B5 — Vinili na početnoj: senka se okreće zajedno sa diskom i seče se na vrhu sekcije
- **[x] 2026-10-01 urađeno:** spoljna senka i narandžasti glow prebačeni sa `.cf-disc` (koji se vrti) na statični `.cf-vinyl`; na disku ostali samo centrirani ring i unutrašnja senka. Maska vinila dobila više mesta gore/dole (negativne margine, raspored se ne pomera).
- **Šta se vidi:** oko centralnog (i bočnih) diskova senka/glow nije ravnomerna: sa gornje strane je odsečena
  pravom horizontalnom ivicom (oko y≈30 na screenshotu, iznad centralnog diska), a na bočnim diskovima je
  senka nesimetrična. Izgleda kao da se senka **obrće zajedno sa diskom** (box-shadow/drop-shadow je na
  elementu koji rotira), pa se u toku rotacije menja oblik i ugao, a kontejner sekcije je `overflow: hidden`
  pa je seče.
- **Screenshot:** `C:\Users\Zippy\AppData\Local\Temp\claude\F--ZippySite-dj-zippy-site\0b489fb4-877d-4f76-93a6-c366f8f7b6e5\images\4.png`
- **Sumnja (neproverena, korisnikova):** senka je na istom elementu koji ima `animation: spin`. Rešenje je da
  senka ide na statični roditelj (ili poseban pseudo-element koji se ne rotira), a rotira se samo unutrašnji
  disk; i da sekcija vinila dobije dovoljno gornjeg/donjeg padding-a ili `overflow: visible` (clip samo po
  horizontali), da senka ne bude odsečena. Proveriti i filter zatamnjenja bočnih diskova iz T5.

### B6 — Početna: narandžasti okvir oko fotke u uvodnoj sekciji izgleda čudno
- **[x] 2026-10-01 urađeno:** pomereni okvir izbačen; fotka je u ramu od 2 px sa gradijentom (narandžasta gore levo → bleda bela) koji je prati sa sve četiri strane, uz blagi narandžasti sjaj ispod.
- **Šta se vidi:** u uvodnoj sekciji (T10, „The selector behind House Music Therapy“) fotka ima narandžasti
  okvir samo sa **desne i donje strane** (+ zaobljeni uglovi gore-desno i dole-levo/desno), a sa leve i
  gornje strane ga nema. Pošto je fotka na crnoj pozadini, okvir deluje kao odvojena linija koja „visi“ pored
  slike: slika se stapa sa crnim (nema ivice), a okvir ne prati sliku, nego je pomeren/veći od nje.
  Izgleda kao greška, ne kao namerni dekorativni okvir.
- **Screenshot:** `C:\Users\Zippy\AppData\Local\Temp\claude\F--ZippySite-dj-zippy-site\0b489fb4-877d-4f76-93a6-c366f8f7b6e5\images\5.png`
- **Sumnja (neproverena):** dekorativni offset okvir (pseudo-element ili pomereni `div` sa `border` i
  `translate`) iz T10, koji je delimično van kadra ili odsečen `overflow: hidden`, pa se vide samo dve ivice.
- **Mogući pravci:** ili okvir koji tačno prati sliku (`rounded` + `ring`/`border` narandžast 1–2 px oko same
  fotke, ravnomerno sa sve četiri strane), ili ga ukloniti, ili fotku staviti na karticu sa blagim gradijentom
  da se ivica slike vidi. Proveriti i mobilni prikaz.

### B7 — About: FAQ je gola lista ispod bio-a, treba da bude harmonika (accordion) i lepša
- **[x] 2026-10-01 urađeno:** FAQ je nativna `<details name="faq">` harmonika (bez JS-a): tamne kartice sa ivicom, prvo pitanje otvoreno, `+` koji postaje `−` i narandžast naslov kad je otvoreno, ceo red klikabilan (≥ 48 px), vidljiv fokus, kratko otvaranje isključeno za reduced-motion; H3 i FAQPage schema netaknuti.
- **Šta se vidi:** „Frequently Asked Questions“ na /about (i /sr/about) je prikazan kao običan tekst: 6 pitanja
  (H3) sa odgovorima uvek otvorenim, jedno ispod drugog, bez ikakvog okvira, razdelnika ili indikatora.
  Deluje kao „nalepljeno“ ispod About sekcije.
- **Zahtev korisnika:** pitanja sklopljena, klik otvara odgovor (accordion), i da ceo blok izgleda lepše.
- **Screenshot:** `C:\Users\Zippy\AppData\Local\Temp\claude\F--ZippySite-dj-zippy-site\0b489fb4-877d-4f76-93a6-c366f8f7b6e5\images\6.png`
- **Smernice za popravku:**
  - Koristiti nativni `<details>/<summary>` (bez JS-a, kao „All past gigs“ u T12): tekst odgovora ostaje u HTML-u
    pa SEO i FAQPage schema nisu ugroženi; schema u stranici se ne dira.
  - Kartica po pitanju: tamna pozadina (`bg-white/5`), tanka ivica, zaobljenje, razmak između; `+` / `−` ili
    chevron koji se okreće, narandžast na hover/open; `summary` cela zona klika (min. 48 px visine), vidljiv fokus.
  - Samo jedno otvoreno odjednom nije obavezno (može `name="faq"` atribut za exclusive accordion).
  - Užа kolona (max-w-3xl), razmak od bio sekcije i jasan H2 sa narandžastom rečju kao sada; animacija otvaranja
    kratka i uz `prefers-reduced-motion`.
  - Oba jezika iz `ui.ts`; proveriti desktop i mobilni. Proveriti da se FAQ ne prikazuje i na drugim
    stranicama kao gola lista (npr. početna).

### B8 — Traka (marquee) na početnoj: levi kraj izgleda odsečeno, pogrešna reč na srpskom, pogrešni žanrovi
- **[x] 2026-10-01 urađeno:** labela ima kosu desnu ivicu (clip-path) i narandžaste ivice gore/dole, pa se ne stapa sa crnom trakom; nazivi klubova izlaze ispod nje uz kratak fade (mask). SR labela „Nastupao na“, a u bio-u „Nastupao je na“. Crna traka: Deep Tech · Minimal · Deep House · French House · Groove · Disco · Funk · Jazz (bez HMT i „Serbian House DJ“). Ista lista je i u FAQ-u o žanrovima (en+sr), u schema `genre` (početna i About, plus „House“ kao krovni žanr) i u llms.txt. Naslovi i bio „house i tech house DJ“ nisu menjani.
- **Screenshot:** `C:\Users\Zippy\AppData\Local\Temp\claude\F--ZippySite-dj-zippy-site\0b489fb4-877d-4f76-93a6-c366f8f7b6e5\images\7.png`
- **(a) Levi kraj:** fiksna labela „SVIRAO NA“ je pravougaonik sa ravnom ivicom, a narandžasta traka je nagnuta
  (−1.5°). Na spoju se vidi oštar stepenik: labela je tamna i uspravna, traka kosa, pa traka izgleda kao
  da je odsečena (i labela se poklapa sa donjom crnom trakom). Treba da labela prati nagib trake (isti
  rotate) ili da ima skošenu desnu ivicu (`clip-path`/skew) i da se spoji sa trakom, ili da ima blagi
  fade (gradient mask) umesto tvrde ivice teksta koji „ulazi ispod“ labele.
- **(b) Tekst labele (sr):** „Svirao na“ → treba **„Nastupao na“** (DJ nastupa, ne svira). Može i „Nastupi:“.
  EN „Played at“ ostaje. Ključ u `src/i18n/ui.ts`; proveriti i druge mesta gde se koristi „svirao“.
- **(c) Donja crna traka — žanrovi:** sada piše HOUSE MUSIC THERAPY ✦ SERBIAN HOUSE DJ ✦ House, Tech House,
  Deep House, Organic House… Treba da pokazuje samo žanrove house muzike koje korisnik želi:
  **Deep Tech, Minimal, Deep House, French House, Groove, Disco, Funk, Jazz** (korisnik je napisao
  „Deep Tech Minimal (nije isto što i Deep), Deep, French, Groove, Disco, Funk, Jazz“). Napomena: Deep Tech/
  Minimal i Deep House su različiti žanrovi, ne spajati ih. Preformulisati da lepše izgleda, npr. kao
  „Deep Tech · Minimal · Deep House · French House · Groove House · Disco House · Funk · Jazzy House“;
  ukloniti ostale žanrove (Tech House, Organic House) i „HOUSE MUSIC THERAPY / SERBIAN HOUSE DJ“ ako ne
  treba. Oba jezika u `ui.ts`; isti tekst i u meta/schema opisima žanrova proveriti da li treba uskladiti
  (npr. `genre` u schema, „What music genres does DJ Zippy play?“ u FAQ-u, `llms.txt`).

### B9 — About stranica je zastarela: treba novi, lepši i kreativniji About
- **Šta se vidi:** blok „Proud Member of:“ sa dve identične tamne kartice (KULT TALENTS, IZUVANJE) sa narandžastom
  levom ivicom i suvim opisom. Izgleda generički i zastarelo, a cela About stranica (bio → „Proud Member of“ →
  FAQ, vidi B7) je niz običnih blokova bez priče i vizuelnog ritma.
- **Zahtev korisnika:** osmisliti bolji, lepši i kreativniji About page (ne samo popraviti ovaj blok).
- **Screenshot:** `C:\Users\Zippy\AppData\Local\Temp\claude\F--ZippySite-dj-zippy-site\0b489fb4-877d-4f76-93a6-c366f8f7b6e5\images\8.png`
- **Pre implementacije (faza 1, samo predlog):** pročitati trenutni `AboutPage.astro` i tekstove u `ui.ts`, pa
  pokazati 2–3 koncepta (skica ili kratak opis) i pitati korisnika koji ide dalje. Ideje za koncepte:
  - „Priča“ kao vertikalna vremenska linija (početak → klubovi → Exit 2024 → Exit 2025 → Grčka) sa
    narandžastim tačkama i godinama, blago otkrivanje pri skrolu (kratak reveal iz T12).
  - Krupni brojevi/statistika (Exit 2024 & 2025, 3 Exit bine, godine iskustva…) kao red „stat“ pločica.
  - „Kolektivi i sceneˮ: umesto dve ravne kartice, logo/wordmark + rečenica + link (Kult Talents, Izuvanje),
    u horizontalnom nizu ili kao „traka“ u stilu marquee-a iz T8; dodati i mesta gde je nastupao.
  - Velika fotka (kadar sa nastupa) uz citat/manifest „House Music Therapy“; druga fotka u galeriji.
  - Na kraju CTA „Book Zippy“ (+ FAQ kao harmonika iz B7).
- **Ograničenja:** tekstovi u oba jezika (`ui.ts`, en + sr, latinica), „Serbian house DJ“ pozicioniranje iz T9,
  H1/H2 hijerarhija, prave `<img>` sa alt-om, Lighthouse ≥ 95, mobilni 390 px. Ne izmišljati činjenice:
  nove tvrdnje, brojeve i citate korisnik mora da potvrdi.
- **Zavisnosti:** radi se zajedno ili posle B7 (FAQ harmonika), jer oba menjaju `AboutPage.astro`.

### B10 — Events: kartice „Past highlights“ treba vizuelno da se razlikuju od „Upcoming“ (nije bug, UX)
- **Šta je problem:** na /events su istaknuti prošli nastupi (T12, kartice u 2 kolone) stilizovani isto ili
  vrlo slično kao predstojeći, pa nije odmah jasno šta je nadolazeće, a šta je prošlo/highlight.
- **Zahtev korisnika:** jasna razlika između nadolazećih i prošlih (highlight) kartica.
- **Smernice:**
  - Upcoming: upadljivije, narandžasti akcenat (ivica/glow), oznaka „UPCOMING“ / „NADOLAZI“, datum krupno,
    dugme (tickets/info) ako ima link.
  - Past highlights: prigušeno (tamna kartica bez narandžaste ivice, blago desaturisana slika ili sivlji
    tekst), oznaka „PAST · 2025“ / „PROŠLO · 2025“ ili „HIGHLIGHT“, bez CTA dugmeta.
  - Razdvojiti sekcije jasnim H2 naslovima („Upcoming gigs“ / „Past highlights“) i razmakom.
  - Proveriti i uvodne „Upcoming“ kartice na početnoj da koriste isti jezik oznaka.
  - Labele u oba jezika u `ui.ts`; kontrast teksta ≥ 4.5:1 i na prigušenim karticama.
- **Fajlovi:** `EventsPage.astro`, `HomePage.astro` (Upcoming), `ui.ts`.

### B11 — Upcoming lista: desna kolona treba da prikazuje žanrove koje Zippy pušta, ne „House Music Therapy“
- **[x] 2026-10-01 urađeno:** nova kolona `events.genres` (migracija 0008, primenjena na prod i lokalnu D1): prazno = „Deep Tech · Minimal · Deep House · Disco · Funk“, `open_format` = plava kartica + čip OPEN FORMAT, ili sopstvena lista po nastupu (admin polje „Genres“). „House Music Therapy“ se više ne prikazuje kao naziv; Lazino Tele 31/10 = „Core Memories“ + open format. Isto na početnoj i /events. Sheet sync šalje `genres` (y2k/90s/komerc/open → open format, „Core Memories“ samo za Lazino Tele) — novi `scripts/sheet-sync.gs` treba ponovo nalepiti u Sheet.
- **Šta se vidi:** u „Upcoming Therapy“ listi (početna, verovatno i /events) svaki red ima levo klub + grad, a
  desno naziv događaja. Za Raybar (17/10/2026) i Klub Kažite (30/10/2026) piše „House Music Therapy“, a za
  Lazino Tele „Millenial Shuffle“ (31/10/2026), uz datum i vreme ispod.
- **Zahtev korisnika:** u desnom redu ne treba „House Music Therapy“, nego **žanrovi koje pušta** na tom nastupu.
- **Screenshot:** `C:\Users\Zippy\AppData\Local\Temp\claude\F--ZippySite-dj-zippy-site\0b489fb4-877d-4f76-93a6-c366f8f7b6e5\images\9.png`
- **Otvorena pitanja (rešiti pre implementacije):**
  - Odakle dolazi tekst: najverovatnije polje naslova/događaja u D1 tabeli `events` (proveriti kolone u
    `types/database.ts` i `migrations/`). Ako je to polje `title`, žanrove treba dodati kao novo polje
    (npr. `genres`) ili ih izvesti iz konstante; naziv događaja (npr. „Millenial Shuffle“) možda ipak treba
    da ostane negde, npr. sitnije ispod ili uz datum. Pitati korisnika.
  - Koje žanrove prikazati: ista lista kao u B8 (Deep Tech, Minimal, Deep House, French House, Groove, Disco,
    Funk, Jazz) ili po nastupu različito (Raybar vs. Lazino Tele)? Predlog: po-nastupa polje `genres` sa
    podrazumevanom vrednošću iz B8 liste.
  - Format: kratko, odvojeno tačkom/✦, npr. „Deep Tech · Minimal · Disco · Funk“; jedan red, skraćeno na mobilnom.
- **Povezano:** B8 (lista žanrova), B10 (izgled Upcoming kartica). Upis u produkcionu D1 traži potvrdu.

**Dopuna B11 (od korisnika):** Lazino Tele (31/10/2026) nije „Millenial Shuffle“ nego **Core Memories**, i to je
**open format** žurka (ne house). Zato tu desni red ne sme da prikaže house žanrove, nego treba da kaže
„Open format“ / „Open format“ (sr: „Open format“) i da se to **istakne** — bojom (npr. druga boja akcenta ili
narandžasta pilula/čip „OPEN FORMAT“ umesto sive liste žanrova) ili natpisom. Naziv događaja „Core Memories“
ostaje vidljiv (ispravljen u D1, umesto „Millenial Shuffle“). Dakle, po redu:
- Raybar, Klub Kažite → žanrovi (lista iz B8, ili polje `genres`).
- Lazino Tele → „Core Memories“ + istaknut čip „Open format“.
Znači da polje `genres` mora da podrži i posebnu vrednost/zastavicu `open_format` (ili `tag`) da šablon zna
kad da prikaže čip umesto liste žanrova.

---

## Pregled 2026-10-01: identitet artiste (da sajt ne bude generičan)

Pregledano uživo na zippydj.com (Chrome, 1440 px, sve stranice) i u kodu na `main`. Cilj korisnika:
sajt treba da ga ustanovi kao **artistu**, a ne da deluje kao šablon „klišej DJ“ sajta.

### Dijagnoza: zašto deluje generično

1. **Svaki vizuelni element je čest DJ šablon, a nijedan nije samo njegov.** Narandžasti „zalazak sunca“ gradijent
   (crno → narandžasto → skoro belo `#ffe6d8` → narandžasto, `.hero-gradient` u `HomePage.astro`), glitch hover sa
   cijan senkom (`.glitch-text:hover`, `#00E5FF`), spotlight koji prati kursor, marquee trake i coverflow. Na prvom
   ekranu nema ničeg ličnog. Jedina prava fotka je tek u trećoj sekciji.
2. **Tekst je saopštenje za štampu u trećem licu, pun apstrakcija:** „curates frequencies“, „the groove, the vibe,
   and the journey“, „bridging the gap between the DJ booth and the dancefloor“, „Reliability is key… a safe and
   exciting bet for any promoter“, „Proud Member of“, „the artists who will soon define tomorrow's sound“.
   Na srpskom je još gore: „posvećen grooveu, vibe-u i putovanju kroz zvuk“.
3. **Tekstovi protivreče jedni drugima:**
   - About: „his foundation is strictly House… shifting into Techno“. Lista žanrova (B8) kaže deep tech, minimal,
     deep house, french house, disco, funk, jazz, a na sajtu su i open format večeri (Izuvanje, Core Memories).
   - About lead: „festival main stages“. Exit nastupi su bili Dance Arena, Students Stage i AS FM, a ne main stage.
   - Blog opis obećava „production tips“ / „saveti za produkciju“, a About kaže „Not a Producer“.
   - Srpski meni kaže „O meni“ (prvo lice), a ceo sadržaj je u trećem licu.
4. **Prava priča postoji u bazi, ali se nigde ne priča.** Iz `events`: prvi javni nastup u kafiću Krivi Put u
   Smederevu (2022) → silent disco u KC LAB (2023) → KST (2024) → Exit AS FM (2024, „first major festival stage“)
   → Capital na Lefkadi, Borisov Atelje → dve bine Exita (2025) → Toucan na Zakintosu → Club Kult → rezidencija u
   Ray Baru (2026) → Zippy x Naya live (2026). Četiri godine od kafića do Exita uverljivije su od svakog prideva.
5. **„Selektor“ bez selekcije.** Sajt tvrdi da je on selektor, ali nigde ne pokazuje šta bira: nema tracklista
   ni ploča koje trenutno pušta.
6. **Lični znakovi postoje, ali se ne koriste:** majica sa vanzemaljcem (glavna fotka i YouTube thumbnailovi),
   sopstveni thumbnailovi („GROOVE FUNK“, „DEEP GROOVE“), biljke u kućnom studiju, i dve strane njegovog rada:
   house (House Music Therapy, narandžasto) i open format (Izuvanje, Core Memories, plavo).
7. **Bug:** `/mixes/`, `/events/` i `/sr/mixes/` sa kosom crtom na kraju vraćaju 404, a `/about/` i ostale
   prerenderovane stranice preusmere. Vidi T31.


---

## T23 — Hero: nova scena umesto narandžasto-belog gradijenta

**Prioritet:** 🔴 P0 · **Model:** Opus 5.5 · **Effort:** high · **Pitaj me:** koja varijanta (A/B/C/D)

**Problem:** `.hero-gradient` je linearni „sunset“ (crno → narandžasto → `#ffe6d8` → narandžasto → crno) koji se
pomera na skrol. Bela traka dole desno ubija kontrast vinila i izgleda kao stock pozadina. `HOUSE MUSIC THERAPY`
je gradijent narandžasto → belo, a glitch hover sa cijan senkom i cursor spotlight su šablonski efekti.

**Varijante** (skice u `hero-varijante.html`):
- **A · Svetlo iz kabine (preporuka):** crna scena, jedno toplo narandžasto radijalno svetlo odozdo iza vinila
  (kao iz DJ pulta), hladno plavo kontra-svetlo (`#38bdf8`, ~20 % alfe) u gornjem desnom uglu, zrno filma
  (SVG `feTurbulence`, opacity ~0.08, `mix-blend-mode: overlay`). HMT u punoj narandžastoj, ne gradijent.
- **B · Brazde:** pozadina je ploča. `repeating-radial-gradient` brazde iz centra aktivnog vinila, utapaju se u crno,
  narandžasti sjaj u centru, HMT kao kontura, plavi prsten oko vinila koji svira (veza sa T25).
- **C · Duotone portret:** velika crno-narandžasta fotka desno, ime levo, vinili ispod. Traži bar jednu dobru
  horizontalnu fotku sa nastupa (sada postoji samo kvadratna studijska `dj-zippy-house-music-dj.webp`).
- **D · Omot ploče:** ravna `#FF5500` + zrno, crna slova, kataloški broj u uglu, plava okrugla „nalepnica“.
  Najhrabrije, ali menja ton cele početne.

**Druga runda (2026-10-01, posle odgovora korisnika):** korisniku se dopada A, hoće nešto dinamično kao B, ali
brazde u tom obliku deluju čudno, a D mu je zanimljiv. Nove skice su u `hero-varijante-2.html`
(animirane, otvoriti u Chrome-u). Sve imaju A kao osnovu:
- **E · Svetlo + odsjaj ploče:** dva meka odsjaja svetla (conic-gradient) i jedva vidljivi široki krugovi oko
  vinila, sve se okreće vrlo sporo (48 s po krugu).
- **F · Svetlo + puls na 124 BPM:** iz vinila na svaka 2 takta izađe mek, zamućen talas (svaki treći plav), a svetlo
  iz pulta „diše“ u ritmu takta (1 takt = 4 × 60/124 s ≈ 1.94 s).
- **G · Omot u kabini:** ime odštampano na narandžastom omotu (`#FF5500` + zrno, crna slova, rotate −1.6°) u mraku
  kabine, kataloški broj u mono fontu i plava nalepnica „Ray Bar resident“.
- **H · Omot + puls (preporuka):** G + F zajedno.

**Treća runda (2026-10-01):** korisniku se dopada tamno + narandžasto + malo plavog svetla; ne želi „Ray Bar resident“
odmah na hero-u. Skice u `hero-varijante-3.html`, sve na A osnovi, pokret na 124 BPM:
- **I · Reflektori:** plavi snop iz ugla sporo šeta (moving head), topli stub svetla iza vinila diše u taktu.
- **J · Dim u kabini:** narandžasti (dole) i plavi (gore) oblaci dima sporo plove.
- **K · Plavi odsjaj na ploči (preporuka):** ploča se vrti, odsjaj stoji (plavo gore, toplo dole, tanka plava ivica);
  ispod jedan mono red „SLEDEĆE · datum · veče“ iz rasporeda nastupa.
- **L · Horizont + ekvilajzer:** vinili na liniji svetla, ekvilajzer na četvrtine, traka sa nastupima na dnu (Ray Bar
  samo tu, kao fusnota).

**Četvrta runda (2026-10-01):** korisniku je L „kao radio“, želi CDJ waveform koji klizi zdesna nalevo umesto stubova;
iz K mu se dopada svetlo ploče i red sa najavom. Skice u `hero-varijante-4.html` (waveform se crta jednom u
canvas i klizi preko `transform`, 40 px po udarcu = 124 BPM):
- **M · Waveform iznad ploča:** traka sa belom glavom u sredini i bit-gridom, bez svetla ploče.
- **N · Ploča je glava (preporuka):** waveform prolazi kroz red vinila, ploča koja svira stoji na mestu glave; svetlo iz K + najava.
- **O · CDJ ekran sa najavom:** svetlo iz K, najava kao displej CDJ-a (NEXT, veče, datum, odbrojavanje, BPM, mali pregled waveforma).
- **P · Dva deka:** narandžasta (house) i plava (open format) traka, jedna glava.

**Peta runda (2026-10-01):** korisnik pita za kasetu, CD, fleš i vinil u omotu pored vinila. Skice u
`hero-varijante-5.html`, sve na N osnovi: **Q** svi formati u redu, **R** samo vinili u omotima, ploča koja
svira izlazi iz omota (preporuka; omot = cover miksa, veza sa T25), **S** svaki format nešto znači (vinil = HMT,
kaseta = Core Memories, fleš = CDJ danas), sto u kabini. Mišljenje: omot da, fleš kao detalj, kaseta/CD samo sa
značenjem (Zippy počinje 2022, retro kolaž nije njegova priča).

**Trenutni izbor korisnika (2026-10-01): S.** Sviđa mu se simbolika: svaki predmet je jedan set (Core Memories na kaseti je kasnije izbačen).
Odluke korisnika: coverflow ostaje (vrti se u krug i pokazuje setove), samo se ikone diverzifikuju; waveform ne treba;
samo tri predmeta (vinil u omotu, kaseta, fleš) na „tanjiru“ koji se okreće: prevuci i pusti, vrti se po inerciji i
stane na najbližem; sam prelazi na sledeći na 2 takta; kaseta i fleš nakrivljeni. Vinil u omotu =
najnoviji House Music Therapy, kaseta (bez „Core Memories“, set je house / tech house, narandžasta traka) odmah pušta
EXIT 2024 set, fleš vodi na /mixes i na
njemu ispod ZIPPY piše „ALL MIXES →“ / „SVI MIKSEVI →“. Ispod je red sa sledećim nastupom (iz K, klik na Events).
Svetlo ploče iz K ne ide (ne uklapa se u estetiku). Skica: `hero-varijante-6.html`.

**Urađeno (2026-10-01): varijanta S.** Skice (šest rundi) su obrisane iz repoa, ostao je samo ovaj opis.
- Hero je crna scena sa toplim svetlom iz pulta, plavim kontra-svetlom u uglu i zrnom; gradijent, glitch i cursor
  spotlight su uklonjeni (`global.css`, `Layout.astro`), HMT je u punoj narandžastoj.
- Umesto coverflow-a su tri predmeta na „tanjiru“ koji se okreće (drag / flick sa inercijom, strelice, tačkice,
  tastatura ← →): vinil u omotu = najnoviji House Music Therapy set, kaseta = EXIT set, fleš = /mixes
  („ALL MIXES →“ / „SVI MIKSEVI →“). Sam prelazi na sledeći na 4 takta (124 BPM) dok ga niko ne dirne.
- Ispod je red sa sledećim nastupom (plava reč = open format veče); kad nema nastupa, prikazuje najnoviji set.
- Predmeti se biraju sami iz baze miksa (naslov), pa `featured` u adminu više ne utiče na početnu.

**Prompt (istorija):**
> Uradi Task T23 iz docs/TASKS.md. Korisnik je izabrao varijantu ___ (pitaj ako nije upisano). U
> `src/components/pages/HomePage.astro` zameni `.hero-gradient` novom scenom po skici iz
> `hero-varijante-2.html` (E–H) ili `hero-varijante.html` (A–D). Pokret (puls, odsjaj, okretanje)
> se gasi pod reduced motion, kao ostale animacije na `main`. Talasi idu preko `transform`/`opacity` (GPU), bez
> animiranja `box-shadow` ili `filter` po frejmu. Na telefonu omot ne sme da gura vinile ispod prvog ekrana. Zadrži: H1 strukturu iz T10, coverflow i njegov SSR raspored iz B1, scrim
> za čitljivost naslova, `overflow-x-clip`. Pomeranje pozadine na skrol (`--hero-shift`) zadrži samo ako ima smisla
> za novu scenu (A: svetlo može blago da se diže; B: brazde mogu sporo da rotiraju, pod `prefers-reduced-motion`
> stoji). Zrno je jedan mali inline SVG data URI, bez novih fajlova. Ukloni glitch hover sa „ZIPPY.“ (i
> `.glitch-text` iz `global.css` ako se nigde drugde ne koristi) i cursor spotlight na hero-u (`data-spotlight`, JS u
> `Layout.astro`), osim ako korisnik kaže da ih zadrži. HMT u punoj boji. Proveri kontrast natpisa ispod vinila
> (≥ 4.5:1), desktop 1440 i mobilni 390, i da Lighthouse mobile na `/` ostane ≥ 95 (nema novih slika ni fontova).
> Ne diraj boje ostatka sajta.

---

## T24 — Plava kao druga boja: open format strana

**Prioritet:** 🟠 P1 · **Model:** Sonnet 5.5 · **Effort:** medium

**Ideja:** plava (`sky-400` `#38bdf8` za ivice i svetla, `sky-300` `#7dd3fc` za tekst na crnom) dobija **značenje**:
narandžasta = House Music Therapy (house strana), plava = open format (Izuvanje, Core Memories). Tako plava nije
ukras nego drugi glas, i zato sme da se pojavi na još par mesta. Pravilo: najviše ~5 % površine ekrana, nikad na
CTA dugmićima (Book / Send ostaju narandžasti), nikad kao pozadina velikih površina.

**Mesta:**
1. Token u `tailwind.config.mjs`: `brand.blue: '#38bdf8'`, `brand.blueText: '#7dd3fc'` i `.open-chip` prebaciti na njih.
2. Hero: plavo kontra-svetlo (ako je u T23 izabrana A) ili plavi prsten na vinilu koji svira (B / T25).
3. About: kartica/odeljak **Izuvanje** u plavom (ivica, naslov), Kult Talents u narandžastom. Vizuelno: dve strane.
4. Events lead objašnjava boju: „Plavo znači open format veče.“ (tekst iz T27; dok je T27 odložen, T24 sme da promeni samo
   `events.lead` u en + sr). Datum open format nastupa je već plav.
5. `:focus-visible` prsten za tastaturu u plavoj (bolje se vidi od narandžaste na narandžastim dugmićima) i
   `::selection` (označen tekst) u plavoj sa crnim tekstom.
6. Mixes: ako postoje open format miksevi, čip „Open format“ na kartici (isti `.open-chip`).
7. Ukloniti stari cijan `#00E5FF` iz glitch efekta (ako ga T23 već nije uklonio), da ne postoje dve različite plave.

**Prompt:**
> Uradi Task T24 iz docs/TASKS.md. Uvedi `brand.blue` / `brand.blueText` token i primeni plavu samo na mestima sa
> liste u tasku (proveri šta je T23 već uradio). Kontrast plavog teksta na crnom/`#1f1f1f` ≥ 4.5:1. Oba jezika.
> Desktop + mobilni screenshot.

---

## T25 — Vinili: klik pušta miks u plejeru na dnu, hover „pali“ ploču

**Prioritet:** 🟠 P1 · **Model:** Opus 5.5 · **Effort:** high · **Pitaj me:** ništa od fajlova (korisnik nema vremena da seče audio)

**Kako radi sada:** aktivni (centralni) disk je `<a href={m.link} target="_blank">` i klik otvara miks na platformi
(YouTube, MixCloud, Spotify) u novom tabu. Klik na bočni disk ga samo dovede u centar (`HomePage.astro`, ~red 846).
Zvuka na sajtu nema.

**Istraživanje (2026-10-01): šta je moguće.**
1. **Autoplay pravilo browsera.** Zvuk sme da krene tek posle *korisničke aktivacije* stranice (klik, tap, taster).
   **Hover nije aktivacija**, pa „zvuk na sam prelaz mišem“ na sveže otvorenoj stranici ne može da radi ni na
   jednom sajtu. Radi tek posle prvog klika, i samo do kraja te posete.
2. **Sopstveni kratki klipovi** (prvi predlog) bili bi najbrži, ali traže da neko iseče audio. Korisnik nema
   vremena za to, pa otpada.
3. **MixCloud ima zvanični widget sa JS API-jem** (`Mixcloud.PlayerWidget`): `load(key, startPlaying)`, `play()`,
   `pause()`, `seek(sekunde)`, `getDuration()`, događaji `play`/`pause`/`progress`/`ended`. Jedan iframe može da
   menja mikseve preko `load()`, bez fajlova i bez ručnog posla. Mini oblik (`mini=1&hide_cover=1`) je ~60 px visok.
   MixCloud API (`api.mixcloud.com/zovumezippy/cloudcasts/`) javno daje sve mikseve, trajanje i opis.
4. Skriven plejer nije dobar: YouTube traži vidljiv plejer (najmanje 200×200 px), a skriven MixCloud widget je u sivoj
   zoni njihovih uslova (muzika je licencirana preko njihovog plejera). Zato plejer mora da se vidi.

**Predlog (bez ijednog fajla):**
- **Klik na centralni vinil pušta miks** u malom plejeru („dock“) koji se pojavi na dnu ekrana: MixCloud mini widget
  za MixCloud mikseve, Spotify kompaktni embed (80 px) za plejlistu. Za YouTube-only miks: ako isti set postoji na
  MixCloud-u (npr. Ray Bar), pušta se MixCloud verzija; ako ne, otvara se YouTube kao sada.
- **Automatski početak bez intro-a:** posle `play` događaja `seek(getDuration() × 0.2)`, pa set kreće od
  ~20 % (gde je obično već „ušao u groove“). Niko ne mora da bira minut. Dugme „od početka“ u dock-u.
- **Hover je vizuelni, ne zvučni:** ploča ubrza kao kad se gramofon pali, oko etikete se upali tanak plavi prsten
  (T24), natpis „▶ Pusti“. Klik na bočni disk ga dovede u centar (kao sada), drugi klik pušta.
- **Dok svira:** centralni disk se vrti, plavi prsten pokazuje napredak (`progress` događaj), u dock-u naslov +
  pauza + „Otvori na MixCloud-u“ + X. Samo jedan miks u isto vreme.
- **Muzika ne staje pri prelasku na druge stranice** (cilj): sajt već koristi `<ViewTransitions />`, pa dock dobija
  `transition:persist`. Proveriti: premeštanje iframe-a u DOM-u ga u nekim browserima ponovo učita; ako se to desi
  u Astro 4.16, plejer radi samo na početnoj, pa to reći korisniku umesto da se krpi.
- **Učitavanje:** widget skripta i iframe se učitavaju tek na prvi klik (ili hover kao nagoveštaj namere). Do tada
  nula bajtova, pa Lighthouse ostaje isti.
- **Telefon:** isto, tap na centralni disk pušta u dock-u; „Otvori na MixCloud-u“ je u dock-u.
- **Pristupačnost:** dock je `role="region"` sa labelom, pauza i X dostupni tastaturom, Esc zatvara.

**Alternativa ako korisnik ipak želi zvuk na hover:** isti MixCloud widget, ali tek posle prvog klika na stranici:
hover na centralni disk posle ~300 ms učita miks i preskoči na 20 %. Mane: kašnjenje 1–3 s pre zvuka, plejer i dalje
mora da bude vidljiv, i prvi hover na stranici je uvek nem. Ne preporučujem kao glavni način.

**Prompt:**
> Uradi Task T25 iz docs/TASKS.md (predlog sa dock plejerom, bez audio fajlova). Mapiranje miks → MixCloud ključ
> uzmi iz `mixes.link` (MixCloud URL) ili iz MixCloud API-ja po naslovu; za YouTube miks koji ima MixCloud verziju
> pitaj korisnika jednom za potvrdu para. Implementiraj u `HomePage.astro` + mali dock komponent u `Layout.astro`
> (zbog `transition:persist`), bez novih npm paketa (widget skripta sa `widget.mixcloud.com` tek na klik). Testiraj:
> klik na centralni i bočni disk, pauza/X/Esc, prelaz na /mixes i nazad (da li muzika ide dalje), mobilni 390 px,
> reduced motion, tastatura. Lighthouse mobile `/` ≥ 95.

---

## T26 — Stranica za svaki miks (`/mixes/[slug]`) sa tracklistom

**Prioritet:** 🟡 P2 · **Model:** Opus 5.5 · **Effort:** high · **Pitaj me:** tracklistovi

**Zašto:** sada klik na vinil ili karticu izbacuje posetioca na YouTube/MixCloud. Sopstvena stranica miksa drži ga na
sajtu i **dokazuje selekciju**: tracklist je najbolji dokaz za „selektor“. Usput dobija SEO stranicu po miksu
(„House Music Therapy — Deep & Tech Grooves tracklist“). Tabela `mixes` već ima `slug` i `description`.

**Provereno 2026-10-01:** MixCloud API (`api.mixcloud.com/zovumezippy/cloudcasts/`) daje 6 setova sa trajanjem,
tagovima i opisom (npr. Ray Bar 2. rođendan, 30. 5. 2026), ali **tracklistovi su prazni** (`sections: []`). Pošto
korisnik nema vremena za ručni rad: stranica miksa kreće sa opisom i tagovima povučenim iz MixCloud API-ja + plejer
(T25 dock) + linkovi, a tracklist se dodaje kasnije samo ako ga korisnik upiše na MixCloud (onda ga API sam vrati).
Usput: na MixCloud-u postoje i setovi kojih nema na sajtu („live from Singing Forest“, „Summer House & Dance Mix for
ASFM“, „Live @ KCLAB“), proveriti sa korisnikom da li idu na /mixes.

**Sadržaj stranice:** veliki vinil/cover, naslov, žanr, datum i mesto (ako je live), embed player platforme (vidljiv,
po ToS), kratka beleška u njegovom glasu (2–3 rečenice: gde je sniman, kakvo je veče bilo), **tracklist** (izvođač –
naslov, opciono vreme), dugmad „Slušaj na …“ za sve platforme, prethodni/sledeći miks, Book CTA. Schema
`MusicRecording`/`MusicPlaylist` sa `track` listom.

**Prompt:**
> Uradi Task T26 iz docs/TASKS.md. Pitaj korisnika za tracklistove i beleške (može za početak 2–3 miksa). Dodaj
> kolonu `tracklist` (JSON ili tekst red po red) migracijom (0009), polje u adminu, SSR rutu `/mixes/[slug]` i
> `/sr/mixes/[slug]`, link sa kartica na /mixes i sa centralnog vinila (T25). Sitemap + hreflang. Bez tracklista
> stranica se ne pravi (kartica i dalje vodi na platformu). Desktop + mobilni.

---

## T27 — Tekstovi: novi glas bez DJ klišea (en + sr)

> **⏸ Odloženo 2026-10-01** (korisnik: „T27 ostavi za kasnije“). Ne raditi dok korisnik ne kaže.

**Prioritet:** 🔴 P0 · **Model:** Opus 5.5 · **Effort:** high · **Pitaj me:** samo preostale ⚠ činjenice

**Odluke korisnika (2026-10-01):** tekstovi ostaju u **trećem licu**. Ray Bar rezidencija: tačno. Go2 Travel:
ukupno **tri** puta: Lefkada i Zakintos (Grčka) i **Ohrid (Severna Makedonija)**. **Kult Talents: više nije član**;
bio je jedan period u njihovom kursu i community-ju i ostao u kontaktu. Svuda gde piše „member“ / „član“ to je sada
netačno i mora da se ispravi (lista ispod tabele).

**Pravila za novi glas:**
- **Činjenice umesto prideva.** Godine, mesta, bine, imena. Nijedno „vibe“, „journey“, „frequencies“, „energy of
  the dancefloor“, „take you on a journey“, „safe bet“, „proud member“.
- **Kratko.** Rečenica do ~20 reči. Bez „In an era dominated by…“.
- **Bez odbrane.** Ne objašnjavati šta nije („Not a producer“), nego šta radi.
- **Lice:** sve u **trećem licu** (odluka korisnika). Zato srpski meni i breadcrumb „O meni“ postaju „O Zippyju“.
  Footer bez „ja“: „Pošalji datum, grad i mesto.“ je imperativ i ostaje.
- Tamo gde piše „DJ Zippy“ tri puta u pasusu, u telu teksta ostaje „Zippy“; puno ime samo u naslovima i meta.
- Srpski: manje anglicizama (`vibe-u`, `event`, `svirke`). „Booking“ može da ostane jer je industrijski termin.

**Prepravke (predlog; ⚠ = korisnik mora da potvrdi činjenicu):**

| Ključ (`ui.ts`) | Sada | Predlog EN | Predlog SR |
|---|---|---|---|
| `about.lead` | curates frequencies from club nights to festival main stages, dedicated to the groove, the vibe, and the journey | Serbian house DJ. First public set in a Smederevo café in 2022, three Exit Festival stages by 2025, a Ray Bar residency in 2026. | Srpski house DJ. Prvi javni nastup u smederevskom kafiću 2022, tri bine Exit festivala do 2025, rezidencija u Ray Baru 2026. |
| `about.subheading1–3` | Not a Producer. A Selector. | The records are other people's. The order is his. | Ploče su tuđe. Redosled je njegov. |
| `about.bio1Html` | right groove can heal… strictly House… shifting into Techno | House Music Therapy started as a mix series and became the name of his nights: deep tech and minimal for the late hours, deep and French house to open, disco, funk and jazz running underneath. | House Music Therapy je počeo kao serijal mikseva, a postao ime njegovih večeri: deep tech i minimal za kasne sate, deep i french house za početak, a disco, funk i jazz provlače se ispod svega. |
| `about.bio2Html` | In an era dominated by production credits… bridging the gap between the DJ booth and the dancefloor | He reads the room first and plays second. The set gets built during the night, not before it. ⚠ | Prvo čita publiku, pa tek onda pušta. Set se slaže tokom večeri, ne pre nje. ⚠ |
| `about.bio3Html` | Reliability is key… Go2 Travel… safe and exciting bet for any promoter | Three summer trips with Go2 Travel: Capital in Lefkada (2024), Toucan in Zakynthos (2025) and Ohrid in North Macedonia (⚠ godina i mesto). | Tri leta sa Go2 Travel: Capital na Lefkadi (2024), Toucan na Zakintosu (2025) i Ohrid u Severnoj Makedoniji (⚠ godina i mesto). |
| `about.memberOf` | Proud Member of: | Crews | Ekipe |
| `about.kultTitle` | Kult Talents Member | Kult Talents alumni | Kult Talents alumni |
| `about.kultDesc` | Platform for those who dare to experiment… define tomorrow's sound | Went through Club Kult's talent course and community in Belgrade; played Kult in 2025 and 2026. | Prošao kurs i community kluba Kult u Beogradu; nastupao u Kultu 2025. i 2026. |
| `about.izuvanjeDesc` | Non-EDM party concept blending all kinds of genres and generations operating since 2022 | His open-format side: a non-EDM party running since 2022, where any decade can end up in the set. | Njegova open format strana: non-EDM žurka od 2022, gde u set može da upadne bilo koja decenija. |
| `schema.orgDescription` | DJ brand curating frequencies, grooves, and the journey through house music | DJ Zippy's mix series and club nights: deep tech, minimal and deep house with disco and funk underneath. | Serijal mikseva i klupske večeri DJ Zippyja: deep tech, minimal i deep house, sa disco i funk podlogom. |
| `footer.blurb` | bringing the House Music Therapy to your event | Clubs, festivals, private events. Send the date, the city and the venue. ⚠ (+ „I reply within 48 h“ ako je tačno) | Klubovi, festivali, privatne žurke. Pošalji datum, grad i mesto. ⚠ (+ „Odgovaram za 48 h“ ako je tačno) |
| `home.featuredSub` | Listen to DJ Zippy's latest sets and mixes. | Live recordings and House Music Therapy sessions. (posle T25: Hover a record to hear it.) | Snimci sa nastupa i House Music Therapy sesije. (posle T25: Pređi mišem preko ploče da je čuješ.) |
| `home.introChips` | Exit Festival 2024 & 2025 · 3 Exit Festival stages · … | 3 Exit stages · 2024–25 · Ray Bar resident · Serbia · Greece · North Macedonia | 3 bine Exita · 2024–25 · Rezident Ray Bara · Srbija · Grčka · S. Makedonija |
| `home.venues` | … Ray Bar · Kult Talents | Izbaciti „Kult Talents“ (nije mesto). Dodati „Krivi Put · Smederevo“ (prvi nastup), „Ohrid“ (⚠ ime mesta) i/ili „Lazino Tele“. | isto |
| `events.lead` | From intimate club nights to major festival stages. House Music Therapy live. | Where to hear it next. Blue means an open-format night. | Gde se sledeće čuje. Plavo znači open format veče. |
| `gallery.lead` | Capturing the energy of the dancefloor. | Exit, Kult, Ray Bar — from behind the decks. | Exit, Kult, Ray Bar — iza pulta. |
| `blog.description` | …production tips, event reviews… | Notes on house music, records and nights behind the decks. | Beleške o house muzici, pločama i noćima iza pulta. |
| `blog.authorBio` | blend classic house selections with contemporary sounds | isti tekst kao `schema.personDescriptionShort` | isto |
| `notFound.lead` | This page dropped off the playlist. Head back and keep the vibe going. | This one's not in the crate. | Ove ploče nema u gajbi. |

**Kult Talents „član“ je sada netačno, ispraviti svuda:** `ui.ts` `home.introChips` (en „Kult Talents member“, sr
„Član Kult Talents“), `about.kultTitle` (en + sr), `home.venues` (en + sr, nije mesto), schema `memberOf` u
`HomePage.astro` (~red 104) i `AboutPage.astro` (~red 62): izbaciti Kult Talents (Izuvanje ostaje), `public/llms.txt`
(„Affiliations: Kult Talents…“ → „Alumni: Kult Talents talent program“). Izvan sajta (T18): Instagram/RA bio ako
negde piše da je član.

**Go2 Travel / Ohrid:** dodati prošli nastup u Ohridu u D1 `events` (⚠ datum i ime mesta od korisnika; upis u prod
D1 traži potvrdu), FAQ „Where is DJ Zippy from?“ dopuniti sa „…summer club nights in Greece and North Macedonia“.

Ostalo što ostaje: „reads the room first and plays second“ (dobra rečenica, sada se koristi i na About),
„The selector behind House Music Therapy“, „Let's Connect / Hajde da se čujemo“, „Track not found“.
Naslovi i meta iz T9 („Serbian house DJ“, „house i tech house“) se ne diraju zbog SEO-a.

**Prompt:**
> Uradi Task T27 iz docs/TASKS.md. Lice (treće) i većina činjenica su već odlučeni (vidi „Odluke korisnika“). Jednim
> AskUserQuestion pitaj samo preostale ⚠: godina i mesto u Ohridu, „set se slaže tokom večeri“, rok za odgovor na
> upit. Ispravi Kult Talents svuda po listi. Zatim primeni tabelu u `src/i18n/ui.ts` (en + sr).
> Neproverene ⚠ rečenice izostavi umesto da ih izmisliš. Uskladi `llms.txt` i schema opise (Person/Organization)
> sa novim tekstom, bez promene naslova i meta iz T9. Proveri da nijedna stranica ne puca (tipovi `Dict`), build
> jednom, screenshot About i početne na en i sr.

---

## T28 — About kao priča: put od 2022. do danas (rešava B9)

**Prioritet:** 🟠 P1 · **Model:** Opus 5.5 · **Effort:** high · **Zavisi od:** T27 (tekstovi), B7 (FAQ harmonika, gotovo)

**Koncept:** umesto bio → „Proud Member of“ kartice → FAQ, About priča njegov put kroz **prave nastupe iz baze**:
1. Vrh: velika fotka (ista sa vanzemaljcem, ne menja se) + kratak lead iz T27, u trećem licu (odluka korisnika).
2. **„Put“**: vertikalna vremenska linija sa godinama i mestima: 2022 Krivi Put, Smederevo (prvi javni nastup) →
   2023 KC LAB, silent disco → 2024 Exit AS FM (prva festivalska bina), Capital Lefkada, Borisov Atelje → 2025 Exit
   Dance Arena + Students Stage, Toucan Zakintos, Club Kult (posle Kult Talents kursa) → Ohrid (⚠ godina) → 2026
   Ray Bar rezidencija, Zippy x Naya. Narandžaste tačke za house večeri, plave za open format (T24). Podaci iz
   `events` (featured + ključni), ne hardkodovano.
3. **Dve strane:** House Music Therapy (narandžasto) | Izuvanje / open format (plavo), po 2 rečenice.
4. Umesto „Proud Member of“: Izuvanje (open format ekipa) i Kult Talents kao **alumni** (kurs i community, nije više
   član), sa linkovima.
5. FAQ harmonika (B7) + Book CTA.

**Prompt:**
> Uradi Task T28 iz docs/TASKS.md (zamenjuje „fazu 1“ iz B9: koncept je izabran). Tekst u trećem licu. Pitaj
> korisnika samo da potvrdi godine/mesta na liniji (i Ohrid ako T27 to još nije rešio). Gradi iz `getEvents(db)`, sa fallback-om iz seed liste. Reveal kratak
> (T12), reduced motion bez animacije, prave `<img>` sa alt-om, H1/H2 hijerarhija, oba jezika, 390 px.
> Lighthouse ≥ 95.

---

## T29 — „U torbi“: ploče koje Zippy trenutno pušta

**Prioritet:** 🟡 P2 · **Model:** Sonnet 5.5 · **Effort:** medium · **Pitaj me:** lista numera

**Ideja:** selektor se dokazuje izborom. Mali blok „U torbi ovog meseca“ / „In the bag this month“: 6–8 numera
(izvođač – naslov – label) sa linkom (Bandcamp/Beatport/Spotify), datum ažuriranja. Na početnoj ispod Upcoming ili
na /mixes. Menja se jednom mesečno, pa je to i razlog da se ljudi vraćaju, i svež sadržaj za Google.

**Prompt:**
> Uradi Task T29 iz docs/TASKS.md. Pitaj korisnika za listu i gde je želi (početna ili /mixes). Za početak lista u
> `ui.ts` (zajednička za en i sr) ili mala D1 tabela `crate` ako korisnik želi da je menja iz admina. Bez cover
> slika (brzina). Oba jezika, mobilni.

---

## T30 — Potpisi identiteta: HMT kataloški brojevi, mono metapodaci, zrno

> **Otkazano 2026-10-01** (korisnik: „T30 nećemo“). Ne raditi. Ostaje samo kao zapis ideje.

**Prioritet:** 🟡 P2 · **Model:** Sonnet 5.5 · **Effort:** medium · **Pitaj me:** redosled HMT brojeva

Sitni detalji koji zajedno daju osećaj izdavačke kuće (record label), a ne šablona:
- **Kataloški brojevi:** svaka House Music Therapy sesija dobija broj `HMT 001`, `HMT 002`… (po datumu objave) na
  kartici miksa, na vinilu i na stranici miksa.
- **Mono font za metapodatke:** datumi, BPM, kataloški brojevi, „Novi Sad · 22:00“ u monospace (npr. JetBrains Mono
  ili IBM Plex Mono, self-host latin + latin-ext, samo 1 težina) kao na omotima ploča. Unbounded ostaje za naslove,
  Inter za tekst.
- **Zrno** (isti SVG šum iz T23) blago preko fotki i tamnih sekcija, da sajt ne bude „plastično“ digitalan.
- **Vanzemaljac** sa majice. Odgovor korisnika (2026-10-01): bio je slučajan, ali ljudi su ga zapamtili jer je ista
  fotka dugo u upotrebi, i razmišlja da ga uvede u brend (npr. da na nastupima nosi samo majice sa vanzemaljcima).
  Predlog: **fotku ne menjati**, to je već prepoznatljivo. Znak neka raste spolja: majice sa vanzemaljcem na nastupima i
  fotkama nekoliko meseci. Na sajtu za sada samo 1–2 sitna „easter egg“ detalja: 404 „Ova stranica je oteta“ /
  „This page got abducted“ sa malim SVG vanzemaljcem, eventualno glif kao separator u crnoj traci umesto ✦. Logo
  „ZIPPY.“ i favicon „Z.“ se ne diraju dok znak ne zaživi van sajta.

**Prompt:**
> Uradi Task T30 iz docs/TASKS.md. Vanzemaljac: samo easter egg na 404 (i separator ako korisnik želi), fotka ostaje.
> Pitaj da li HMT brojevi idu po datumu objave. Font samo jedna težina, preload ne treba. Lighthouse ≥ 95. Desktop + mobilni.

---

## T31 — Bug: `/mixes/` i `/events/` sa kosom crtom na kraju daju 404

**Prioritet:** 🔴 P0 · **Model:** Sonnet 5.5 · **Effort:** low

**Provereno 2026-10-01:** `/mixes/`, `/events/` i `/sr/mixes/` vraćaju **404**, a `/mixes` i `/events` 200.
Prerenderovane stranice (`/about/`, `/links/`, `/gallery/`, `/blog/`) se preusmere bez kose crte. Uzrok:
`trailingSlash: 'never'` u `astro.config.mjs`, a SSR stranice (`prerender = false`: `/`, `/mixes`, `/events`, `/sr/…`)
sa kosom crtom ne odgovaraju ruti i padnu u `[...slug].astro` (404). Ko podeli link sa `/` na kraju (Instagram bio,
neki bukeri, Google ako ga negde nađe) dobija 404.

**Prompt:**
> Uradi Task T31 iz docs/TASKS.md. U `src/middleware/index.ts`, pre admin provere, za svaki GET/HEAD zahtev čiji
> `pathname` ima više od 1 znaka i završava se sa `/` vrati **301** na isti put bez kose crte (zadrži query string).
> Ne diraj `/` i `/api/*`. Proveri na `wrangler dev` (ne `astro dev`): `/mixes/`, `/events/`, `/sr/mixes/`,
> `/sr/events/`, `/mixes/?x=1` → 301, a `/mixes` 200. Build jednom.
