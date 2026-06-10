# Higgsfield promo-teaser pipeline

Automatski tok: **novi event u adminu → AI video tizer → hero pozadina na sajtu + download za Reels/TikTok**.

## Arhitektura (ko šta radi)

Higgsfield MCP konektor je dostupan Claude-u (Claude Code / Claude sesiji), ne Cloudflare Workeru.
Zato je pipeline podeljen:

| Korak | Ko | Šta |
|---|---|---|
| 1. Trigger | sajt (Worker) | `POST/PUT /api/admin/events` markira upcoming event sa `teaser_status='pending'` |
| 2. Queue | sajt (Worker) | `GET /api/admin/teaser` vraća pending evente + **gotov Higgsfield prompt** po eventu |
| 3. Generacija | Claude + Higgsfield MCP | `generate_video` (Seedance 2.0, 9:16, 720p, ~6s) sa promptom iz koraka 2 |
| 4. Ingest | sajt (Worker) | `POST /api/admin/teaser {event_id, video_url}` → video se skida u R2 (`teasers/<slug>.mp4`), event postaje `done`, `site_settings.hero_video_url` se upisuje |
| 5. Prikaz | sajt | Home hero lazy-učitava video (posle LCP-a) + prikazuje "Download Promo Video" dugme; fajl se servira kroz `/media/teasers/<slug>.mp4` (bez CDN domena) |

## Pokretanje petlje (Claude sesija)

Prompt za Claude Code (ručno ili kao scheduled rutina):

> Pozovi GET https://zippydj.com/api/admin/teaser (Access service token u headerima).
> Za svaki event iz odgovora: generiši video preko Higgsfield MCP `generate_video`
> (model `seedance_2_0`, aspect_ratio 9:16, resolution 720p, duration 6, mode fast,
> prompt = polje `prompt` iz odgovora). Kada je job gotov, uzmi URL videa i pozovi
> POST https://zippydj.com/api/admin/teaser sa {"event_id": <id>, "video_url": "<url>"}.

### Autentikacija za automatizaciju (Access service token)

1. CF dashboard → Zero Trust → Access → Service Auth → **Create Service Token** (npr. `teaser-bot`).
2. U Access aplikaciji koja pokriva `/api/admin*` dodaj policy **Service Auth** koja dozvoljava taj token.
3. Pozivi tada nose hedere:
   - `CF-Access-Client-Id: <id>.access`
   - `CF-Access-Client-Secret: <secret>`

Cloudflare na validan service token injektuje `Cf-Access-Jwt-Assertion`, što naš middleware očekuje (fail-closed).

## Ručni ingest (bez automatizacije)

Tizer možeš napraviti i ručno u Higgsfield app-u pa samo uraditi ingest:

```bash
curl -X POST https://zippydj.com/api/admin/teaser \
  -H "CF-Access-Client-Id: ..." -H "CF-Access-Client-Secret: ..." \
  -H "Content-Type: application/json" \
  -d '{"event_id": 21, "video_url": "https://...mp4"}'
```

`set_hero: false` u body-ju ako ne želiš da tizer odmah postane hero pozadina.

## Lokalni razvoj

- `astro dev` preskače Access proveru, pa endpointi rade direktno na `http://localhost:4321`.
- Lokalna D1/R2 su miniflare kopije — primeni migraciju: `npx wrangler d1 execute dj-zippy-db --local --file migrations/0005_marketing.sql`.

## Troškovi / krediti

Free Higgsfield plan ima ograničene kredite — jedna 6s 720p generacija troši većinu free paketa.
Za produkcijsku automatizaciju (tizer po svakom eventu) treba plaćeni plan; do tada petlju pokrećemo ručno po potrebi.
