// The gig archive in numbers, for the About page. They come from the
// "Odradjene zurke" sheet, which lists every gig; the site's database holds
// only the nights worth showing, so counting it would undersell the archive.
// When the sheet grows, update `asOf` and the numbers. Gigs in the database
// dated after `asOf` are added on top automatically (AboutPage.astro).
// Fees and other private columns of the sheet never come here.
export const GIG_STATS = {
  asOf: '2026-10-31',
  // every gig in the sheet, the first private party (2020) included
  gigs: 131,
  // distinct public venues (private parties and weddings left out); shown as "40+"
  venues: 40,
  // Serbia, Greece, North Macedonia (Ohrid)
  countries: 3,
  // AS FM Stage 2024; Students Stage and Dance Arena 2025
  exitStages: 3,
  // per year: all gigs, and how many were B side (house) by the sheet's genres
  years: {
    '2020': { total: 1, b: 0 },
    '2022': { total: 11, b: 2 },
    '2023': { total: 12, b: 0 },
    '2024': { total: 26, b: 1 },
    '2025': { total: 45, b: 14 },
    '2026': { total: 36, b: 17 },
  } as Record<string, { total: number; b: number }>,
};
