# ONE RECORD, EVERY HORIZON — produkcioni plan

> Scroll-priča za zippydj.com: jedna vinilna ploča putuje kao nebesko telo kroz pejzaže.
> Svaki pejzaž = vajb jednog tipa prostora u kom Zippy nastupa (festival / klub / bar / afterhours),
> bez prikazivanja ijednog stvarnog prostora. Na kraju ploča nalazi svoj gramofon — i sviće.
>
> **Status: ČEKA HIGGSFIELD PLAN.** Sve dole je spremno za izvršenje onog dana kad se kupi licenca.
> Krediti na nalogu: 0 (free plan, video generisanje zaključano — vidi memoriju projekta).

## Niti koje drže celu priču (već postoje na sajtu)

| Nit | Gde već živi | Uloga u priči |
|---|---|---|
| Vinilna ploča (CSS disk) | coverflow na home | Nebesko telo: pomračenje → sunce → mesec → portal → ploča na gramofonu |
| Talasna forma / EKG | `.therapy-wave` (act-needle) | Linija horizonta u svakom pejzažu |
| EQ barovi | `.eq-bars` u hero | Treperenje vreline u kanjonu |
| Particle sistem | `.dust` (prašina) | Ista čestica, prefarbana: prašina → svici → mehurići |
| Sunrise gradijent | `.sunrise` (act-afterglow) | Finale na planinskom vrhu |
| Motion gate | `html.reduce-motion` + `__motionOff()` | Sve novo MORA kroz isti gate |
| GSAP + Lenis + pin/scrub | story skripta u index.astro | Mehanika premotavanja scena |

## Storyboard po skrolu

### 0–10% — POMRAČENJE
- Crn ekran, pulsna linija. Iz dna izranja crni disk sa narandžastim obodom (eclipse).
- Tekst (typewriter): *"Every night, somewhere, a floor needs therapy."*
- Izvedba: postojeći CSS disk (DOM element, ne video) — putuje kroz scene kao fiksirani "junak".

### 10–30% — KANJON *(festival / Exit energija)*
- Disk = sunce koje skrol diže; snopovi svetla šetaju po stenama kao reflektori; prašina = haze.
- Caption: *"FESTIVAL — open sky. One groove, fifty thousand hearts."*

### 30–50% — NOĆNA ŠUMA *(klub / intimna hipnoza)*
- Ulazak među drveće; disk = mesec kroz granje; magla po tlu; **svici pulsiraju u 4/4** i sinhronizuju se što dublje skroluješ.
- Caption: *"CLUB — four walls of trees. Hypnosis at 124 BPM."*

### 50–65% — PUČINA U SUMRAK *(bar / rooftop / sunset set)*
- Mirno more, mesec-disk se ogleda; **odraz na vodi = talasna forma**; spor zibav = spor groove.
- Caption: *"GOLDEN HOUR — salt air, slow grooves."*

### 65–80% — POD POVRŠINOM *(afterhours, 5AM)*
- Zaron: podvodna pećina, stubovi svetla, mehurići se dižu u ritmu; disk = portal u dubini.
- Caption: *"AFTERHOURS — weightless. The deep end of therapy."*

### 80–100% — IZNAD OBLAKA *(zora / kraj seanse)*
- Izranjanje iznad oblaka, planinski vrh, na vrhu čeka **gramofon**; disk se spušta, igla pada, zora se izlije.
- Caption: *"Wherever your floor is — bring the therapy."* → Book CTA + eventi + newsletter.
- Ispod priče ostaju postojeće sekcije (crate-digging coverflow, events, lead magnet).

## Higgsfield production sheet

Model: `seedance_2_0` (podržava `start_image`/`end_image` — ključno za morph tranzicije).
Format: 21:9, 5–6 s, loop-friendly završeci. Posle generisanja: 9:16 reframe za Reels kroz postojeći teaser pipeline.

**Tehnika kontinuiteta:** prvo generisati 5 STILOVA (slike, jeftino) → odobriti look → svaki klip animirati image-to-video sa tim stilom kao `start_image`. Morph klipovi koriste `end_image` = still sledeće scene.

### Loop klipovi (5)

1. **CANYON** — `Vast desert canyon at golden hour, enormous low sun glowing burnt orange #FF5500, god rays sweeping across rock walls like stage lights, fine dust floating in warm air, cinematic 35mm, photoreal, slow majestic motion, seamless loop, no people, no text`
2. **FOREST** — `Dense night forest, full moon glowing through branches with warm orange halo #FF5500, ground fog drifting like club smoke, fireflies pulsing rhythmically in unison, near-black ambience, cinematic, photoreal, slow hypnotic motion, seamless loop, no people, no text`
3. **SEA** — `Calm open sea at deep dusk, large moon low over horizon, its burnt-orange reflection #FF5500 rippling across gentle swells like an audio waveform, warm haze, cinematic 35mm, photoreal, slow rolling motion, seamless loop, no text`
4. **UNDERWATER** — `Underwater cave, volumetric light shafts piercing dark water, streams of bubbles rising in steady rhythm, a glowing warm-orange circular light #FF5500 deep below like a portal, weightless slow motion, photoreal, cinematic, seamless loop, no text`
5. **SUMMIT** — `Mountain peak above a sea of clouds at dawn, first sunlight flooding warm orange #FF5500 across cloud tops, a lone turntable silhouette on the summit rock, rising mist, cinematic 35mm, photoreal, slow reveal, no people, no text`

### Morph tranzicije (4)
`start_image` = poslednji frame prethodne scene, `end_image` = prvi frame sledeće:
- M1 kanjon→šuma: *sun sets behind canyon rim, darkness rises, treeline grows into frame*
- M2 šuma→more: *trees part, ground turns to water, moon stays fixed*
- M3 more→podvodno: *camera dives below the surface*
- M4 podvodno→vrh: *rise through water into clouds, breach into dawn sky*

### Procena kredita
Po izmerenim cenama (std 4s/480p = 12 cr; fast 6s/720p = 21 cr): 9 klipova × 12–30 cr = **~150–300 kredita** + ~10 cr za stilove. Prvo generisati SVE stilove i 1 probni klip, pa tek onda seriju.

## Tehnička izvedba (kad klipovi stignu)

1. **Frame-sequence scrub** (Apple tehnika): ffmpeg izvuče ~60–80 frejmova po klipu → webp sprite/niz u `public/images/journey/` → `<canvas>` crta frejm po `ScrollTrigger` progress-u. Fallback za slabije uređaje: crossfade između loop `<video>` elemenata na tačkama tranzicije.
2. Novi `src/components/Journey.astro` — pinovana full-viewport sekcija na vrhu home (zamenjuje act-silence → act-needle deo priče; crate-digging coverflow ostaje ispod kao "biblioteka").
3. Disk = DOM element animiran GSAP-om duž putanje (scale/position per scene); na 100% se "spušta" i morfuje u aktivni coverflow disk (`Flip` plugin).
4. Particle sistem: jedna komponenta, tri boje/ponašanja (prašina/svici/mehurići) vezana za scenu.
5. Sve kroz `window.__motionOff()` gate; mobile: bez pina, scene kao swipe-snap sekcije.
6. LCP čuvar: prva scena = poster slika; canvas/video se aktiviraju posle idle (kao postojeći hero video).

## Redosled izvršenja (dan kupovine plana)

1. `balance` provera → generisati 5 stilova (slike) → Zippy odobrava look
2. 1 probni klip (CANYON) → provera loop kvaliteta → ostala 4 + 4 morpha
3. ffmpeg frame extraction + Journey.astro + GSAP scrub
4. 9:16 reframe svih scena → teaser pipeline → Reels paket
5. Sve na `dev`, pregled, pa odluka o merge-u
