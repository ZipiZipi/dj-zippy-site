// Translation dictionaries.
//
// English is the source of truth: `Dict` is derived from it, so the Serbian
// object fails to type-check the moment a key is added to `en` and not to `sr`.
//
// Values ending in `Html` are rendered with `set:html` — they carry inline
// markup (<span>, <strong>) that prose needs. They are authored here, never
// user input.
//
// Headings that mix a plain and an orange-highlighted half are split into
// numbered parts (`heading1` / `heading2`) rather than baked into HTML, so the
// Tailwind classes stay in the template where they can be seen.

export const languages = {
  en: 'English',
  sr: 'Srpski',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'en';

/** BCP-47 tags for <html lang>, hreflang and Intl date formatting. */
export const htmlLang: Record<Lang, string> = {
  en: 'en',
  sr: 'sr-Latn',
};

/** og:locale values. */
export const ogLocale: Record<Lang, string> = {
  en: 'en_US',
  sr: 'sr_RS',
};

/** Short month labels used by the event date blocks. */
export const months: Record<Lang, string[]> = {
  en: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
  sr: ['JAN', 'FEB', 'MAR', 'APR', 'MAJ', 'JUN', 'JUL', 'AVG', 'SEP', 'OKT', 'NOV', 'DEC'],
};

const en = {
  // Prose that only ever appears inside JSON-LD.
  schema: {
    personDescription:
      "DJ Zippy (Veljko Nedeljković) is a House and Tech-House DJ and selector based in Belgrade, Serbia, known for the 'House Music Therapy' mix series and performances at Exit Festival and major regional clubs.",
    personDescriptionShort:
      "DJ Zippy (Veljko Nedeljković) is a House and Tech-House DJ and selector based in Belgrade, Serbia, creator of the 'House Music Therapy' mix series.",
    orgDescription:
      'House Music Therapy - DJ brand curating frequencies, grooves, and the journey through house music.',
    eventDescription: (title: string, location: string) =>
      `DJ Zippy (Zippy) performing live at ${title} in ${location}. House Music Therapy.`,
  },

  langSwitch: {
    label: 'Language',
    toOther: 'Srpski',
    ariaOther: 'Prikaži sajt na srpskom',
  },

  nav: {
    home: 'Home',
    about: 'About',
    mixes: 'Mixes',
    events: 'Events',
    links: 'Links',
    book: 'Book Now',
    openMenu: 'Open menu',
  },

  breadcrumb: {
    home: 'Home',
    about: 'About',
    mixes: 'Mixes',
    events: 'Events',
    gallery: 'Gallery',
    label: 'Breadcrumb',
  },

  footer: {
    heading1: "Let's ",
    heading2: 'Connect',
    blurb:
      'Available for club bookings, private events, and festivals — bringing the House Music Therapy to your event.',
    raProfile: 'Resident Advisor Profile',
    name: 'Name',
    venue: 'Venue/Event',
    email: 'Email Address',
    message: 'Tell me about the gig...',
    submit: 'Send Request',
    sending: 'Sending...',
    sent: 'Sent ✓',
    error: 'Error — try veljkoned@gmail.com',
    subject: 'DJ Zippy — Booking Request',
    copyright: '© 2025 DJ Zippy. All Rights Reserved. House Music Therapy.',
    allLinks: 'All Links',
  },

  home: {
    title: 'Zippy | House Music Therapy | DJ from Serbia',
    description:
      'Official website of Zippy (DJ Zippy). House Music Therapy creator from Belgrade, Serbia. Curator, selector, and vibe architect. Book now.',
    featured1: 'Featured ',
    featured2: 'Mixes',
    featuredSub: "Listen to DJ Zippy's latest sets and mixes.",
    listenNow: 'Listen Now',
    upcoming1: 'Upcoming ',
    upcoming2: 'Therapy',
    noUpcoming: 'No upcoming events scheduled.',
    viewAllEvents: 'View All Events & Past Highlights',
    prev: 'Previous',
    next: 'Next',
  },

  about: {
    title: 'About DJ Zippy | House Music Therapy Creator from Belgrade',
    description:
      'Learn about DJ Zippy (Veljko Nedeljkovic), the House Music Therapy creator from Belgrade, Serbia. A selector dedicated to the groove, the vibe, and the journey.',
    heading1: 'About ',
    heading2: 'DJ Zippy',
    lead:
      'DJ Zippy curates frequencies from club nights to festival main stages, dedicated to the groove, the vibe, and the journey.',
    photoAlt: 'DJ Zippy a DJ from Serbia, creator of House Music Therapy.',
    badge: 'THE ARTIST',
    subheading1: 'Not a Producer.',
    subheading2: 'A ',
    subheading3: 'Selector.',
    bio1Html:
      "DJ Zippy's brand, <span class=\"text-white font-semibold\">House Music Therapy</span>, is built on the belief that the right groove can heal. While his foundation is strictly <span class=\"text-white font-semibold\">House</span>, Zippy adapts to the energy of the night, shifting into <span class=\"text-white font-semibold\">Techno</span> when the atmosphere demands darker, driving rhythms.",
    bio2Html:
      'In an era dominated by production credits, the art of selection is the true therapy. DJ Zippy specializes in <strong>reading the room</strong>, bridging the gap between the DJ booth and the dancefloor.',
    bio3Html:
      '<strong>Reliability is key.</strong> Through his collaboration with <strong class="text-white">Go2 Travel</strong>, DJ Zippy has proven his adaptability, making him a safe and exciting bet for any promoter.',
    memberOf: 'Proud Member of:',
    kultDesc:
      "Platform for those who dare to experiment, learn, and evolve — the artists who will soon define tomorrow's sound.",
    izuvanjeDesc:
      'Non-EDM party concept blending all kinds of genres and generations operating since 2022.',
    kultTitle: 'Kult Talents Member',
    go2Title: 'Trusted by Go2 Travel',
    raTitle: 'Resident Advisor',
    faqHeading1: 'Frequently Asked ',
    faqHeading2: 'Questions',
    faq: [
      {
        q: 'Who is DJ Zippy?',
        aHtml:
          'DJ Zippy (Veljko Nedeljković) is a House and Tech-House DJ and selector from Belgrade, Serbia. He is the creator of the <strong>House Music Therapy</strong> mix series and has performed at Exit Festival and leading regional clubs.',
        aText:
          "DJ Zippy (Veljko Nedeljković) is a House and Tech-House DJ and selector from Belgrade, Serbia. He is the creator of the 'House Music Therapy' mix series and has performed at Exit Festival and leading regional clubs.",
      },
      {
        q: 'What music genres does DJ Zippy play?',
        aHtml:
          'DJ Zippy specializes in House, Tech House, Deep House and Organic House, and shifts into Techno when the night calls for darker, driving rhythms.',
        aText:
          'DJ Zippy specializes in House, Tech House, Deep House and Organic House, and shifts into Techno when the night calls for darker, driving rhythms.',
      },
      {
        q: 'Where is DJ Zippy based?',
        aHtml:
          'DJ Zippy is based in Belgrade, Serbia, and performs regularly across Serbia and the wider region, including Novi Sad, Smederevo and Greece.',
        aText:
          'DJ Zippy is based in Belgrade, Serbia, and performs regularly across Serbia and the wider region, including Novi Sad, Smederevo and Greece.',
      },
      {
        q: 'How can I book DJ Zippy for an event?',
        aHtml:
          'Bookings for clubs, private events and festivals go through <a href="mailto:veljkoned@gmail.com" class="text-brand-orange hover:text-white">veljkoned@gmail.com</a> or the <a href="{contact}" class="text-brand-orange hover:text-white">contact form</a>.',
        aText:
          'Bookings for clubs, private events and festivals go through veljkoned@gmail.com or the contact form at https://zippydj.com/#contact.',
      },
      {
        q: 'What is House Music Therapy?',
        aHtml:
          "House Music Therapy is DJ Zippy's brand and ongoing mix series, built on the belief that the right groove can heal. It focuses on house music as a journey through frequencies and moods.",
        aText:
          "House Music Therapy is DJ Zippy's brand and ongoing mix series, built on the belief that the right groove can heal. It focuses on house music as a journey through frequencies and moods.",
      },
      {
        q: 'Has DJ Zippy performed at Exit Festival?',
        aHtml:
          'Yes. DJ Zippy performed at the AS FM Stage at Exit Festival 2024 and at the Dance Arena and Students Stage at Exit Festival 2025.',
        aText:
          'Yes. DJ Zippy performed at the AS FM Stage at Exit Festival 2024 and at the Dance Arena and Students Stage at Exit Festival 2025.',
      },
    ],
    schemaPageName: 'About DJ Zippy',
    schemaPageDesc:
      'Learn about DJ Zippy (Veljko Nedeljkovic), the House Music Therapy creator from Belgrade, Serbia.',
  },

  mixes: {
    title: 'DJ Zippy Mixes | House Music Therapy Sessions & Playlists',
    description:
      'Stream all DJ Zippy mixes and playlists. House Music Therapy sessions on YouTube, MixCloud, Spotify, SoundCloud, and Deezer. Deep house, tech house, and grooves from Belgrade.',
    heading: 'Stream DJ Zippy',
    subheading1: 'All ',
    subheading2: 'Mixes',
    subheading3: ' & Playlists',
    lead: 'Every House Music Therapy session. YouTube, MixCloud, Spotify, SoundCloud, and Deezer.',
    filterLabel: 'Filter mixes by platform',
    featuredBadge: 'FEATURED',
    listenNow: 'Listen Now',
    empty: 'No mixes found.',
    schemaName: 'DJ Zippy Mixes & Playlists',
    schemaDesc:
      "Complete collection of DJ Zippy's mixes and playlists across YouTube, MixCloud, Spotify, SoundCloud, and Deezer.",
  },

  events: {
    title: 'DJ Zippy Events | Live Shows & Festival Performances',
    description:
      "Explore DJ Zippy's live performances, festival appearances, and club nights across Serbia including Exit Festival and Belgrade events.",
    heading: 'DJ Zippy',
    subheading: 'Live Events & Festival Performances',
    lead: 'From intimate club nights to major festival stages. House Music Therapy live.',
    upcoming1: 'Upcoming ',
    upcoming2: 'Events',
    noUpcoming: 'No upcoming events scheduled.',
    past1: 'Past ',
    past2: 'Highlights',
    highlightBadge: 'Highlight',
    backHome: 'Back to Homepage',
  },

  gallery: {
    title: 'DJ Zippy Gallery | Live Performances & House Music Therapy Moments',
    description:
      "Photo gallery of DJ Zippy's live performances, festival appearances, and House Music Therapy moments across Serbia including Exit Festival and Belgrade venues.",
    heading: 'DJ Zippy Gallery',
    subheading: 'Live Performances & House Music Therapy Moments',
    lead: 'Capturing the energy of the dancefloor. From club nights to festival stages.',
    photos: [
      'DJ Zippy performing house music at Exit Festival Dance Arena, Novi Sad, 2025',
      'DJ Zippy performing house music at Exit Festival Students Stage, Novi Sad, 2025',
      'DJ Zippy performing house music at Club Kult, Belgrade, 2025',
      'DJ Zippy performing house music at Exit Festival AS FM Stage, Novi Sad, 2024',
      'DJ Zippy performing house music at Krivi Put, Smederevo, 2022',
      'House Music Therapy session in the studio, Belgrade, 2024',
    ],
    firstCaption: 'Exit Festival - Dance Arena',
    firstCaptionSub: 'Novi Sad, 2025',
    more: 'More photos coming soon.',
    backHome: 'Back to Homepage',
    schemaName: 'DJ Zippy Photo Gallery',
    schemaDesc:
      "Live performance photos and House Music Therapy moments from DJ Zippy's events and festival appearances.",
  },

  notFound: {
    title: '404 - Page Not Found | DJ Zippy',
    description: "The page you're looking for doesn't exist. Return to DJ Zippy's official website.",
    kicker: 'Track Not Found',
    lead: 'This page dropped off the playlist. Head back and keep the vibe going.',
    backHome: 'Back to Home',
  },

  links: {
    title: 'DJ Zippy | Official Links & Socials',
    description:
      'Official links for Zippy (DJ Zippy). Connect with House Music Therapy, tour dates, Spotify, SoundCloud, Deezer, and Resident Advisor profiles. Based in Belgrade, Serbia.',
    ogDescription:
      'All official DJ Zippy links — streaming, socials, events and bookings. House Music Therapy from Belgrade, Serbia.',
    twitterDescription: 'All official DJ Zippy links — streaming, socials, events and bookings.',
    avatarAlt: 'Zippy (DJ Zippy) - House Music Therapy Profile',
    tagline: 'House Music Therapy',
    mainLabel: 'Main Links',
    streamFollow: 'Stream & Follow',
    website: 'Official Website',
    youtube: 'Watch on YouTube',
    mixcloud: 'Latest Mixes (MixCloud)',
    secondaryLabel: 'Secondary Links',
    alsoOn: 'Also on',
    navLabel: 'Site Navigation',
    explore: 'Explore the site',
    events: 'Events & Performances',
    about: 'About DJ Zippy',
    mixes: 'Mixes & Playlists',
    contact: 'Bookings / Contact',
    visit: 'Visit Website',
    copyright: '© 2025 Zippy',
  },

  blog: {
    title: 'DJ Zippy Blog | House Music Articles & Insights',
    description:
      'Read articles about house music, production tips, event reviews, and more from DJ Zippy.',
    heading: 'BLOG',
    lead: 'House Music Articles, Tips & Insights',
    featured: 'Featured',
    latest: 'Latest Articles',
    readArticle: 'Read Article',
    read: 'Read',
    empty: 'No posts published yet',
    ctaHeading: 'Stay Updated',
    ctaLead: 'Get notified when new articles are published',
    ctaButton: 'Subscribe to Updates',
    readTime: '5 min read',
    aboutAuthor: 'About the Author',
    authorBio:
      'is a house music curator and producer based in Belgrade, Serbia. He creates immersive sonic experiences that blend classic selections with contemporary sounds.',
    share: 'Share:',
    shareTwitter: 'Share on Twitter',
    shareFacebook: 'Share on Facebook',
    shareLinkedIn: 'Share on LinkedIn',
    moreArticles: 'More Articles',
    prevArticle: '← Previous Article',
    nextArticle: 'Next Article →',
    backToBlog: 'Back to Blog',
  },
};

export type Dict = typeof en;

const sr: Dict = {
  schema: {
    personDescription:
      "DJ Zippy (Veljko Nedeljković) je house i tech-house DJ i selektor iz Beograda, poznat po serijalu mikseva 'House Music Therapy' i nastupima na Exit festivalu i u velikim regionalnim klubovima.",
    personDescriptionShort:
      "DJ Zippy (Veljko Nedeljković) je house i tech-house DJ i selektor iz Beograda, tvorac serijala mikseva 'House Music Therapy'.",
    orgDescription:
      'House Music Therapy - DJ brend koji bira frekvencije, groove i vodi kroz putovanje house muzikom.',
    eventDescription: (title: string, location: string) =>
      `DJ Zippy (Zippy) nastupa uživo u ${title}, ${location}. House Music Therapy.`,
  },

  langSwitch: {
    label: 'Jezik',
    toOther: 'English',
    ariaOther: 'View the site in English',
  },

  nav: {
    home: 'Početna',
    about: 'O meni',
    mixes: 'Miksevi',
    events: 'Nastupi',
    links: 'Linkovi',
    book: 'Rezerviši',
    openMenu: 'Otvori meni',
  },

  breadcrumb: {
    home: 'Početna',
    about: 'O meni',
    mixes: 'Miksevi',
    events: 'Nastupi',
    gallery: 'Galerija',
    label: 'Putanja',
  },

  footer: {
    heading1: 'Hajde da se ',
    heading2: 'čujemo',
    blurb:
      'Dostupan za klupske nastupe, privatne žurke i festivale — House Music Therapy stiže na tvoj event.',
    raProfile: 'Resident Advisor profil',
    name: 'Ime',
    venue: 'Klub/Event',
    email: 'Email adresa',
    message: 'Napiši mi nešto o nastupu...',
    submit: 'Pošalji upit',
    sending: 'Šaljem...',
    sent: 'Poslato ✓',
    error: 'Greška — piši na veljkoned@gmail.com',
    subject: 'DJ Zippy — Upit za nastup',
    copyright: '© 2025 DJ Zippy. Sva prava zadržana. House Music Therapy.',
    allLinks: 'Svi linkovi',
  },

  home: {
    title: 'Zippy | House Music Therapy | DJ iz Srbije',
    description:
      'Zvanični sajt Zippyja (DJ Zippy). Tvorac House Music Therapy iz Beograda. Kurator, selektor i arhitekta vibe-a. Rezerviši nastup.',
    featured1: 'Izdvojeni ',
    featured2: 'miksevi',
    featuredSub: 'Poslušaj najnovije setove i mikseve DJ Zippyja.',
    listenNow: 'Slušaj odmah',
    upcoming1: 'Sledeća ',
    upcoming2: 'terapija',
    noUpcoming: 'Trenutno nema zakazanih nastupa.',
    viewAllEvents: 'Pogledaj sve nastupe i arhivu',
    prev: 'Prethodni',
    next: 'Sledeći',
  },

  about: {
    title: 'O DJ Zippyju | Tvorac House Music Therapy iz Beograda',
    description:
      'Saznaj sve o DJ Zippyju (Veljko Nedeljković), tvorcu House Music Therapy iz Beograda. Selektor posvećen grooveu, vibe-u i putovanju kroz zvuk.',
    heading1: 'O ',
    heading2: 'DJ Zippyju',
    lead:
      'DJ Zippy bira frekvencije — od klupskih večeri do festivalskih bina — posvećen grooveu, vibe-u i putovanju kroz zvuk.',
    photoAlt: 'DJ Zippy, DJ iz Srbije i tvorac House Music Therapy.',
    badge: 'ARTIST',
    subheading1: 'Nije producent.',
    subheading2: 'Već ',
    subheading3: 'selektor.',
    bio1Html:
      'Brend DJ Zippyja, <span class="text-white font-semibold">House Music Therapy</span>, počiva na uverenju da pravi groove leči. Iako mu je temelj isključivo <span class="text-white font-semibold">house</span>, Zippy se prilagođava energiji noći i prelazi u <span class="text-white font-semibold">techno</span> kada atmosfera traži mračnije i jače ritmove.',
    bio2Html:
      'U vremenu u kom sve zavisi od producentskih kredita, umetnost selekcije je prava terapija. DJ Zippy je specijalista za <strong>čitanje publike</strong> i spaja DJ pult sa podijumom.',
    bio3Html:
      '<strong>Pouzdanost je ključna.</strong> Kroz saradnju sa <strong class="text-white">Go2 Travel</strong> DJ Zippy je dokazao svoju prilagodljivost, što ga čini sigurnim i uzbudljivim izborom za svakog promotera.',
    memberOf: 'Ponosni član:',
    kultDesc:
      'Platforma za one koji smeju da eksperimentišu, uče i razvijaju se — artiste koji će uskoro definisati zvuk sutrašnjice.',
    izuvanjeDesc:
      'Non-EDM party koncept koji spaja različite žanrove i generacije, aktivan od 2022.',
    kultTitle: 'Član Kult Talents',
    go2Title: 'Saradnja sa Go2 Travel',
    raTitle: 'Resident Advisor',
    faqHeading1: 'Često postavljana ',
    faqHeading2: 'pitanja',
    faq: [
      {
        q: 'Ko je DJ Zippy?',
        aHtml:
          'DJ Zippy (Veljko Nedeljković) je house i tech-house DJ i selektor iz Beograda. Tvorac je serijala mikseva <strong>House Music Therapy</strong> i nastupao je na Exit festivalu i u vodećim regionalnim klubovima.',
        aText:
          "DJ Zippy (Veljko Nedeljković) je house i tech-house DJ i selektor iz Beograda. Tvorac je serijala mikseva 'House Music Therapy' i nastupao je na Exit festivalu i u vodećim regionalnim klubovima.",
      },
      {
        q: 'Koje žanrove pušta DJ Zippy?',
        aHtml:
          'DJ Zippy je specijalizovan za house, tech house, deep house i organic house, a prelazi u techno kada noć traži mračnije i jače ritmove.',
        aText:
          'DJ Zippy je specijalizovan za house, tech house, deep house i organic house, a prelazi u techno kada noć traži mračnije i jače ritmove.',
      },
      {
        q: 'Odakle je DJ Zippy?',
        aHtml:
          'DJ Zippy je iz Beograda i redovno nastupa širom Srbije i regiona, uključujući Novi Sad, Smederevo i Grčku.',
        aText:
          'DJ Zippy je iz Beograda i redovno nastupa širom Srbije i regiona, uključujući Novi Sad, Smederevo i Grčku.',
      },
      {
        q: 'Kako mogu da rezervišem DJ Zippyja za event?',
        aHtml:
          'Booking za klubove, privatne žurke i festivale ide preko <a href="mailto:veljkoned@gmail.com" class="text-brand-orange hover:text-white">veljkoned@gmail.com</a> ili preko <a href="{contact}" class="text-brand-orange hover:text-white">kontakt forme</a>.',
        aText:
          'Booking za klubove, privatne žurke i festivale ide preko veljkoned@gmail.com ili preko kontakt forme na https://zippydj.com/sr#contact.',
      },
      {
        q: 'Šta je House Music Therapy?',
        aHtml:
          'House Music Therapy je brend DJ Zippyja i serijal mikseva koji traje, zasnovan na uverenju da pravi groove leči. Fokus je na house muzici kao putovanju kroz frekvencije i raspoloženja.',
        aText:
          'House Music Therapy je brend DJ Zippyja i serijal mikseva koji traje, zasnovan na uverenju da pravi groove leči. Fokus je na house muzici kao putovanju kroz frekvencije i raspoloženja.',
      },
      {
        q: 'Da li je DJ Zippy nastupao na Exit festivalu?',
        aHtml:
          'Jeste. DJ Zippy je nastupao na AS FM bini na Exit festivalu 2024, kao i na Dance Areni i Studentskoj bini na Exitu 2025.',
        aText:
          'Jeste. DJ Zippy je nastupao na AS FM bini na Exit festivalu 2024, kao i na Dance Areni i Studentskoj bini na Exitu 2025.',
      },
    ],
    schemaPageName: 'O DJ Zippyju',
    schemaPageDesc:
      'Saznaj sve o DJ Zippyju (Veljko Nedeljković), tvorcu House Music Therapy iz Beograda.',
  },

  mixes: {
    title: 'Miksevi DJ Zippyja | House Music Therapy setovi i plejliste',
    description:
      'Slušaj sve mikseve i plejliste DJ Zippyja. House Music Therapy setovi na YouTube, MixCloud, Spotify, SoundCloud i Deezer. Deep house, tech house i groove iz Beograda.',
    heading: 'Slušaj DJ Zippyja',
    subheading1: 'Svi ',
    subheading2: 'miksevi',
    subheading3: ' i plejliste',
    lead: 'Svaka House Music Therapy sesija. YouTube, MixCloud, Spotify, SoundCloud i Deezer.',
    filterLabel: 'Filtriraj mikseve po platformi',
    featuredBadge: 'IZDVOJENO',
    listenNow: 'Slušaj',
    empty: 'Nema mikseva za ovu platformu.',
    schemaName: 'Miksevi i plejliste DJ Zippyja',
    schemaDesc:
      'Kompletna kolekcija mikseva i plejlista DJ Zippyja na YouTube, MixCloud, Spotify, SoundCloud i Deezer platformama.',
  },

  events: {
    title: 'Nastupi DJ Zippyja | Svirke uživo i festivali',
    description:
      'Pogledaj nastupe DJ Zippyja uživo, festivalske svirke i klupske večeri širom Srbije, uključujući Exit festival i beogradske klubove.',
    heading: 'DJ Zippy',
    subheading: 'Nastupi uživo i festivalske bine',
    lead: 'Od intimnih klupskih večeri do velikih festivalskih bina. House Music Therapy uživo.',
    upcoming1: 'Naredni ',
    upcoming2: 'nastupi',
    noUpcoming: 'Trenutno nema zakazanih nastupa.',
    past1: 'Iz ',
    past2: 'arhive',
    highlightBadge: 'Izdvojeno',
    backHome: 'Nazad na početnu',
  },

  gallery: {
    title: 'Galerija DJ Zippyja | Nastupi uživo i House Music Therapy trenuci',
    description:
      'Foto galerija nastupa DJ Zippyja uživo, festivalskih svirki i House Music Therapy trenutaka širom Srbije, uključujući Exit festival i beogradske klubove.',
    heading: 'Galerija DJ Zippyja',
    subheading: 'Nastupi uživo i House Music Therapy trenuci',
    lead: 'Energija podijuma na jednom mestu. Od klupskih večeri do festivalskih bina.',
    photos: [
      'DJ Zippy pušta house muziku na Dance Areni, Exit festival, Novi Sad, 2025',
      'DJ Zippy pušta house muziku na Studentskoj bini, Exit festival, Novi Sad, 2025',
      'DJ Zippy pušta house muziku u klubu Kult, Beograd, 2025',
      'DJ Zippy pušta house muziku na AS FM bini, Exit festival, Novi Sad, 2024',
      'DJ Zippy pušta house muziku u Krivom Putu, Smederevo, 2022',
      'House Music Therapy sesija u studiju, Beograd, 2024',
    ],
    firstCaption: 'Exit festival - Dance Arena',
    firstCaptionSub: 'Novi Sad, 2025',
    more: 'Uskoro još fotografija.',
    backHome: 'Nazad na početnu',
    schemaName: 'Foto galerija DJ Zippyja',
    schemaDesc:
      'Fotografije sa nastupa uživo i House Music Therapy trenuci sa eventova i festivalskih svirki DJ Zippyja.',
  },

  notFound: {
    title: '404 - Stranica nije pronađena | DJ Zippy',
    description: 'Stranica koju tražiš ne postoji. Vrati se na zvanični sajt DJ Zippyja.',
    kicker: 'Numera nije pronađena',
    lead: 'Ova stranica je ispala sa plejliste. Vrati se i nastavi vibe.',
    backHome: 'Nazad na početnu',
  },

  links: {
    title: 'DJ Zippy | Zvanični linkovi i mreže',
    description:
      'Zvanični linkovi Zippyja (DJ Zippy). House Music Therapy, datumi nastupa, Spotify, SoundCloud, Deezer i Resident Advisor profil. Iz Beograda, Srbija.',
    ogDescription:
      'Svi zvanični linkovi DJ Zippyja — striming, mreže, nastupi i booking. House Music Therapy iz Beograda.',
    twitterDescription: 'Svi zvanični linkovi DJ Zippyja — striming, mreže, nastupi i booking.',
    avatarAlt: 'Zippy (DJ Zippy) - House Music Therapy profil',
    tagline: 'House Music Therapy',
    mainLabel: 'Glavni linkovi',
    streamFollow: 'Slušaj i prati',
    website: 'Zvanični sajt',
    youtube: 'Gledaj na YouTube-u',
    mixcloud: 'Najnoviji miksevi (MixCloud)',
    secondaryLabel: 'Ostali linkovi',
    alsoOn: 'Takođe na',
    navLabel: 'Navigacija sajta',
    explore: 'Istraži sajt',
    events: 'Nastupi i svirke',
    about: 'O DJ Zippyju',
    mixes: 'Miksevi i plejliste',
    contact: 'Booking / Kontakt',
    visit: 'Poseti sajt',
    copyright: '© 2025 Zippy',
  },

  blog: {
    title: 'Blog DJ Zippyja | Tekstovi o house muzici',
    description:
      'Tekstovi o house muzici, saveti za produkciju, utisci sa eventova i još toga, iz pera DJ Zippyja.',
    heading: 'BLOG',
    lead: 'Tekstovi o house muzici, saveti i uvidi',
    featured: 'Izdvojeno',
    latest: 'Najnoviji tekstovi',
    readArticle: 'Pročitaj tekst',
    read: 'Pročitaj',
    empty: 'Još nema objavljenih tekstova',
    ctaHeading: 'Budi u toku',
    ctaLead: 'Javimo ti kada izađu novi tekstovi',
    ctaButton: 'Prijavi se',
    readTime: '5 min čitanja',
    aboutAuthor: 'O autoru',
    authorBio:
      'je kurator i producent house muzike iz Beograda. Pravi zvučna iskustva koja spajaju klasične selekcije sa savremenim zvukom.',
    share: 'Podeli:',
    shareTwitter: 'Podeli na Twitteru',
    shareFacebook: 'Podeli na Facebooku',
    shareLinkedIn: 'Podeli na LinkedInu',
    moreArticles: 'Još tekstova',
    prevArticle: '← Prethodni tekst',
    nextArticle: 'Sledeći tekst →',
    backToBlog: 'Nazad na blog',
  },
};

export const ui: Record<Lang, Dict> = { en, sr };
