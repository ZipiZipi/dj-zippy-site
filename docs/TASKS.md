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
| [ ] | T7 EN/SR prekidač: globus se preklapa | 🔴 P0 | Sonnet 5.5 | medium | `LanguageSwitcher.astro`, `LinksPage.astro` |
| [ ] | T8 Traka (marquee) na početnoj: novi tekst + jači izgled | 🔴 P0 | Opus 5.5 | high | `HomePage.astro`, `global.css`, `ui.ts` |
| [ ] | T9 "Srpski DJ" pozicioniranje kroz ceo sajt | 🔴 P0 | Opus 5.5 | high | `ui.ts`, `llms.txt`, schema u stranicama |
| [ ] | T10 Početna: H1 + uvodna sekcija sa fotkom (SEO) | 🟠 P1 | Opus 5.5 | high | `HomePage.astro`, `ui.ts` |
| [ ] | T11 Booking forma: labele + praćenje konverzija | 🟠 P1 | Sonnet 5.5 | medium | `Footer.astro` |
| [ ] | T12 Mixes i Events stranice: dorada izgleda | 🟡 P2 | Sonnet 5.5 | high | `MixesPage.astro`, `EventsPage.astro` |
| [ ] | T13 Performanse: skripte, fontovi, video | 🟠 P1 | Opus 5.5 | high | `Layout.astro`, `LinksPage.astro`, `content.ts` |
| [ ] | T14 Blog i sadržaj: strategija (opciono) | 🟡 P2 | Opus 5.5 | high | plan, pa `posts.ts` |

Preporučeni redosled: **T1 → T2 → T6 → T7 → T9 → T8 → T5 → T10 → T3 → T4 → T11 → T13 → T12 → T14**.
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
