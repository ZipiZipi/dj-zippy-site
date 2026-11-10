# Praćenje posetilaca, kolačići i UTM linkovi

Sve što prati posete na zippydj.com, gde je podešeno i kako se koristi.
Stanje: 10. novembar 2026.

## Šta je gde

| Šta | ID | Gde se menja |
|---|---|---|
| Google Tag Manager (web) | `GTM-KLGKHMGM` | tagmanager.google.com → kontejner www.zippydj.com |
| GA4 property „zippydj.com” | property `563466754`, Measurement ID `G-WVP8PY00Q1`, stream `16313145361` | analytics.google.com |
| Google Ads („Zippy”, 262-208-8543) | `AW-17997341905`, konverzija „Booking request (website form)”, label `eN3eCMKn3LUdENHJ5oVD` | ads.google.com → Goals → Conversions |
| Meta Pixel / dataset „Zippy” | `3891455414321405` (business „DJ Zippy” `725537379516375`) | Events Manager |
| Meta ad nalog „Veljko” | `1120733826729625` (povezan sa pixelom) | Ads Manager |
| Search Console | domen `zippydj.com` | search.google.com/search-console |
| Wikidata | `Q138220521` (nazivi i opisi na en, sr, sr-el; Instagram, YouTube, Facebook, TikTok, RA, Mixcloud, SoundCloud, MusicBrainz) | wikidata.org |
| Google Knowledge Graph | `/g/11yzq0r1fb`; nalog je verifikovan („DJ Zippy on Google”, „Suggest edits”) | google.com/search?kgmid=/g/11yzq0r1fb |

Veze između servisa:
- GA4 ↔ Google Ads (personalizovano oglašavanje i auto-tagging uključeni)
- GA4 ↔ Search Console
- Meta Pixel ↔ ad nalog „Veljko”, plus **Conversions API with Meta** (Meta šalje događaje i preko servera, bez koda)
- Meta allow lista: samo zippydj.com (i poddomeni) sme da šalje događaje pixelu

GTM konfiguracija je sačuvana u `docs/tracking/gtm-web-container.json`. Ako se nešto pokvari, uvozi
se u GTM: Admin → Import Container → Overwrite, pa Submit → Publish.

## Kako radi na sajtu

- `src/components/Analytics.astro`: Google Consent Mode v2. Sve je odbijeno dok posetilac ne
  izabere. GTM se učitava uvek: bez saglasnosti Google dobija samo signale bez kolačića.
  Meta Pixel se **ne učitava** dok marketing nije dozvoljen.
- Tagovi rade **samo na zippydj.com**: localhost, preview i kopije sajta ništa ne šalju (i u kodu
  i u GTM triggerima). Za proveru na drugom hostu dodaj `?tags=on` na adresu.
- `src/components/CookieConsent.astro`: baner (EN/SR). „Prihvati sve” i „Odbij” su iste veličine.
  Izbor se čuva u kolačiću `zippy_consent` 6 meseci. Kad se promeni tekst politike, podigni
  `VERSION` u Analytics.astro i svi će biti pitani ponovo.
- „Podešavanja kolačića”: svaki element sa `data-consent-open` (footer, /privacy, /links) ponovo
  otvara baner.
- `/privacy` i `/sr/privacy`: politika privatnosti i kolačića (noindex).
- `src/scripts/track.ts`: klikovi → `dataLayer` (GA4 preko GTM-a) i Meta (samo uz saglasnost).
- `src/scripts/attribution.ts`: UTM pravila (dole) i izvor posete u booking formi.

### Događaji

| dataLayer event | Kad | GA4 | Meta |
|---|---|---|---|
| `booking_form_submit` | poslat booking formular | `generate_lead` (key event) + Ads konverzija | `Lead` |
| `contact_click` | email, telefon, WhatsApp, Instagram DM | `contact_click` (key event) | `Contact` |
| `social_click` | Instagram, YouTube, Spotify, Mixcloud, RA… | `social_click` | `SocialClick` |
| `mix_open` | klik na miks (kartica ili ploča u heru) | `mix_open` | `ViewContent` |
| `calendar_add` | Check calendar / Google / .ics / pretplata | `calendar_add` | `AddToCalendar` |
| `side_switch` | A/B prekidač ili filter strane | `side_switch` | `SideSwitch` |
| `language_switch` | EN/SR | `language_switch` | — |

GA4 custom dimenzije: Site side, Booking side, Booking set, Booking genres, Link platform,
Contact method, Calendar type, Mix title. Pregledi stranica, skrol i izlazni klikovi se mere
automatski (GA4 enhanced measurement).

## UTM linkovi

Pravilo: sve malim slovima, crtice umesto razmaka.

| Parametar | Vrednosti |
|---|---|
| `utm_source` | `instagram`, `facebook`, `tiktok`, `youtube`, `whatsapp`, `email`, `press`, `qr` |
| `utm_medium` | `social` (bio, objave, story), `paid_social` (Meta oglasi), `cpc` (Google oglasi), `referral`, `email`, `qr` |
| `utm_campaign` | npr. `bio`, `story-raybar-2026-11-21`, `hmt-mix-launch`, `b-side-jesen` |
| `utm_content` | varijanta (koji story, koja kreativa), po želji |

**Strana i jezik iz linka**:
- `?side=a` otvara sajt na A strani (open format, plavo), `?side=b` na B strani. Isto važi ako
  `utm_campaign`, `utm_content` ili `utm_term` sadrži `a-side`, `open-format` ili `core-memories`
  (to je A), odnosno `b-side`, `underground`, `hmt` ili `house-music-therapy` (to je B).
- Za srpsku publiku linkuj direktno `/sr/...` adrese. Postoji i `?lang=sr` (prebacuje na srpski),
  ali direktan `/sr` link je brži.

**Gotovi linkovi**

- Instagram bio:
  `https://zippydj.com/links?utm_source=instagram&utm_medium=social&utm_campaign=bio`
- Instagram story za B veče (Kaz'te, Charlie…):
  `https://zippydj.com/sr/events?utm_source=instagram&utm_medium=social&utm_campaign=story-b-side`
- Instagram story za A veče (Lažino tele, Izuvanje…):
  `https://zippydj.com/sr/events?utm_source=instagram&utm_medium=social&utm_campaign=story-a-side`
- Novi House Music Therapy miks:
  `https://zippydj.com/sr/mixes?utm_source=instagram&utm_medium=social&utm_campaign=hmt-mix&side=b`
- WhatsApp deljenje:
  `https://zippydj.com/sr?utm_source=whatsapp&utm_medium=social&utm_campaign=share`
- Email potpis:
  `https://zippydj.com/?utm_source=email&utm_medium=email&utm_campaign=signature`
- Promoterima / press:
  `https://zippydj.com/about?utm_source=press&utm_medium=referral&utm_campaign=epk`

**Meta oglasi**: u oglasu, pod „URL parameters”, upiši:
`utm_source=facebook&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}`
(Meta sama popunjava imena). Za A kampanje dodaj `&side=a`.

**Google Ads**: auto-tagging (gclid) je uključen, pa UTM ne treba.

## Publike za remarketing

Meta (ad nalog „Veljko”):
- `Web - all visitors 180d (Zippy pixel)`: svi posetioci sajta, 180 dana
- `Web - booking requests (Lead) 180d`: poslali booking upit
- `Web - gig page visitors 90d`: gledali /events
- `ProfilPrate`: Instagram angažman (postojala od ranije)

Google: GA4 publike se dele sa Google Ads nalogom preko veze GA4 ↔ Ads. Google Ads tag
(AW-17997341905) puni i listu posetilaca sajta.

Kad nova verzija sajta bude objavljena, pa stignu događaji `SideSwitch` sa `side=A` / `side=B`,
mogu se praviti i publike „A strana” i „B strana”.

## Otvoreno / za odluku

- Baner za kolačiće i novi kod za praćenje rade tek kad se `dev` objavi. Do tada sajt šalje
  podatke u GA4 i Ads bez banera, kao što je ranije slao Meta Pixel.
- Stari Google Ads tag `AW-975400552` (zatvoreni nalog) uklonjen je iz koda. Na sajtu radi dok
  se ne objavi nova verzija; ne smeta.
- Dataset „Zippy Website” (`1569015614157064`) je prazan, a publika „SaVebsajta” verovatno je
  vezana za njega. Mogu se obrisati.
- Lični ad nalog `2020372741544295` nije u biznis portfoliju i nije povezan sa pixelom. Oglase
  treba voditi sa naloga „Veljko”.
- Server GTM kontejner `GTM-N6MSNZ3Z` se ne koristi. Conversions API već radi preko Mete.
- U GA4 postoji jedna moja test poseta sa `utm_source=claude_test` (10. 11.).
