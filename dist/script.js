/* ============================================================
   DJ Zippy — Application Logic
   Handles: navigation, homepage music grid, mixes page platform
   filtering, and Netlify contact form AJAX submission.
   ============================================================ */

// === DATA STORE ===
// All mixes and playlists used across the site.
// Each item includes an explicit `platform` field for filtering
// and an `icon` field for Font Awesome display.
const appData = {
    mixes: [
        {
            title: "House Music Therapy / #LetsMixIt Contest",
            genre: "House / Tech House",
            desc: "DJ Zippy's high-energy rooftop set recorded in Novi Sad for the #LetsMixIt competition.",
            icon: "fa-solid fa-play",
            platform: "youtube",
            link: "https://www.youtube.com/watch?v=IzkAZcbyCSI",
            thumbnail: "https://img.youtube.com/vi/IzkAZcbyCSI/maxresdefault.jpg",
            alt: "DJ Zippy's Let's Mix It Submission - House and Tech House mix",
            featured: true
        },
        {
            title: "House Music Therapy / Deep & Tech Grooves",
            genre: "Deep House / Tech House",
            desc: "DJ Zippy's curated mix blending deep basslines with rhythmic tech house elements.",
            icon: "fa-solid fa-play",
            platform: "youtube",
            link: "https://www.youtube.com/watch?v=c1M_dMg_CcU",
            thumbnail: "https://img.youtube.com/vi/c1M_dMg_CcU/maxresdefault.jpg",
            alt: "DJ Zippy's House Therapy Session - Deep House mix",
            featured: false
        },
        {
            title: "EXIT 2024 | AS FM Stage Live",
            genre: "Tech House",
            desc: "DJ Zippy's full live performance recording from the AS FM stage at Exit Festival 2024.",
            icon: "fa-solid fa-play",
            platform: "youtube",
            link: "https://www.youtube.com/watch?v=pbT603mKdsc",
            thumbnail: "https://img.youtube.com/vi/pbT603mKdsc/maxresdefault.jpg",
            alt: "DJ Zippy's live set at EXIT 2024 AS FM Stage house music selection",
            featured: false
        },
        {
            title: "EXIT 2024 | AS FM Stage Full Show",
            genre: "Tech House",
            desc: "DJ Zippy's complete high-energy audio recording from the Exit Festival performance.",
            icon: "fa-brands fa-mixcloud",
            platform: "mixcloud",
            link: "https://www.mixcloud.com/zovumezippy/exit-2024-zippy-live-at-as-fm-stage-full-show/",
            thumbnail: "",
            alt: "DJ Zippy's House Music Therapy Vol. 12 - MixCloud set",
            featured: false
        },
        {
            title: "House Music Therapy / Deep & Tech Grooves",
            genre: "Deep Tech",
            desc: "DJ Zippy's mix focused on sophisticated, deeper layers of house music.",
            icon: "fa-brands fa-mixcloud",
            platform: "mixcloud",
            link: "https://www.mixcloud.com/zovumezippy/house-music-therapy-with-dj-zippy-deep-and-tech-grooves/",
            thumbnail: "",
            alt: "DJ Zippy's Deep & Tech Grooves - MixCloud set",
            featured: false
        },
        {
            title: "House Music Therapy / Live from Singing Forest",
            genre: "House / Organic House",
            desc: "DJ Zippy's live set recorded in Singing Forest, blending house rhythms with an jazzy vibe.",
            icon: "fa-brands fa-mixcloud",
            platform: "mixcloud",
            link: "https://www.mixcloud.com/zovumezippy/house-music-therapy-with-dj-zippy-live-from-singing-forest/",
            thumbnail: "",
            alt: "DJ Zippy's Live from Singing Forest - MixCloud set",
            featured: false
        }
    ],
    playlists: [
        {
            title: "House Music Therapy with DJ Zippy",
            genre: "Spotify Playlist",
            desc: "DJ Zippy's selection of tracks that never leave his USB.",
            icon: "fa-brands fa-spotify",
            platform: "spotify",
            link: "https://open.spotify.com/playlist/1760y5mR1hdF7PdnAErYRA",
            thumbnail: "",
            alt: "DJ Zippy's Selector Choice House - Spotify playlist"
        },
        {
            title: "Guilty Trep Pleasures with DJ Zippy",
            genre: "Spotify Playlist",
            desc: "DJ Zippy's playlist for when the lights go down and the mood gets darker.",
            icon: "fa-brands fa-spotify",
            platform: "spotify",
            link: "https://open.spotify.com/playlist/17bauJGzLkXVRa89n3WEF0",
            thumbnail: "",
            alt: "DJ Zippy's Afterhours guilty pleasure - Spotify playlist"
        },
        {
            title: "Chill Balkan RnB Vibes with DJ Zippy",
            genre: "Spotify Playlist",
            desc: "DJ Zippy's chill summer vibes with a Balkan twist.",
            icon: "fa-brands fa-spotify",
            platform: "spotify",
            link: "https://open.spotify.com/playlist/5wyLKeoY4Jf3FrGcPj9ly2",
            thumbnail: "",
            alt: "DJ Zippy's Chill Balkan RnB Vibe Essentials - Spotify playlist"
        }
    ]
};

// === INITIALIZATION ===
// Sets up all event listeners and renders initial content
// once the DOM is fully loaded.
document.addEventListener('DOMContentLoaded', () => {

    // --- DOM element references ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const musicGrid = document.getElementById('music-grid');
    const btnYoutube = document.getElementById('filter-youtube');
    const btnMixcloud = document.getElementById('filter-mixcloud');
    const btnSpotify = document.getElementById('filter-spotify');
    const platformLink = document.getElementById('platform-link');
    const contactForm = document.getElementById('contact-form');

    // === FORM: Netlify AJAX submission ===
    // Intercepts the contact form, posts data via fetch,
    // and shows status feedback (SENDING / SENT / ERROR).
    if (contactForm) {
        contactForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;

            submitBtn.disabled = true;
            submitBtn.innerText = "SENDING...";

            const formData = new FormData(this);

            fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(formData).toString(),
            })
            .then(res => {
                if (res.ok) {
                    submitBtn.innerText = "REQUEST SENT!";
                    contactForm.reset();
                } else {
                    submitBtn.innerText = "ERROR";
                }
            })
            .catch(() => {
                submitBtn.innerText = "ERROR";
            })
            .finally(() => {
                // Reset button text after 3 seconds
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerText = originalText;
                }, 3000);
            });
        });
    }

    // === NAVIGATION: Mobile menu toggle ===
    // Opens/closes the hamburger menu on mobile viewports.
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Close mobile menu when any nav link is clicked
    document.querySelectorAll('.nav-link, #mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu) mobileMenu.classList.add('hidden');
        });
    });

    // === HOMEPAGE: Music grid renderer ===
    // Renders mix/playlist cards into the #music-grid on index.html.
    // Filters by platform type (youtube, mixcloud, spotify).
    function renderMusic(type) {
        if (!musicGrid) return;
        musicGrid.innerHTML = '';

        let data;
        if (type === 'youtube') {
            data = appData.mixes.filter(item => item.platform === 'youtube');
        } else if (type === 'mixcloud') {
            data = appData.mixes.filter(item => item.platform === 'mixcloud');
        } else if (type === 'spotify') {
            data = appData.playlists;
        }

        // Build a card for each item
        data.forEach((item) => {
            const card = document.createElement('div');
            card.className = 'group bg-brand-gray border border-white/5 p-0 overflow-hidden relative rounded-xl hover:border-brand-orange/50 transition-all duration-300';

            // Show "FEATURED" badge for highlighted mixes
            const featuredBadge = item.featured ?
                `<div class="absolute top-4 right-4 bg-brand-orange text-white text-xs font-bold px-2 py-1 rounded z-20">FEATURED</div>` : '';

            card.innerHTML = `
                <div class="aspect-video bg-gradient-to-br from-gray-800 to-black relative flex items-center justify-center overflow-hidden">
                    ${item.thumbnail ? `<img src="${item.thumbnail}" alt="${item.alt}" class="absolute inset-0 w-full h-full object-contain opacity-40 group-hover:scale-110 transition-transform duration-700">` : ''}
                    <div class="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors"></div>
                    <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="w-16 h-16 rounded-full border-2 border-white/50 flex items-center justify-center z-10 group-hover:bg-brand-orange group-hover:border-brand-orange transition-all cursor-pointer">
                        <i class="${item.icon} text-2xl text-white"></i>
                    </a>
                    ${featuredBadge}
                </div>
                <div class="p-6">
                    <div class="text-xs text-brand-orange font-bold uppercase mb-2">${item.genre}</div>
                    <h3 class="text-xl font-bold text-white mb-2 leading-tight">${item.title}</h3>
                    <p class="text-gray-400 text-sm mb-4">${item.desc}</p>
                    <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="inline-block text-sm font-bold border-b border-white/20 pb-1 hover:text-brand-orange hover:border-brand-orange transition-colors">LISTEN NOW</a>
                </div>
            `;
            musicGrid.appendChild(card);
        });
    }

    // === HOMEPAGE: Platform profile link updater ===
    // Updates the "View full profile on X" link below the music grid
    // to match the currently selected platform.
    function updatePlatformLink(platform) {
        if (!platformLink) return;
        let url, icon, text;
        if (platform === 'youtube') {
            url = 'https://www.youtube.com/@zovumezippy/';
            icon = 'fa-brands fa-youtube';
            text = 'View full profile on YouTube';
        } else if (platform === 'mixcloud') {
            url = 'https://www.mixcloud.com/zovumezippy/';
            icon = 'fa-brands fa-mixcloud';
            text = 'View full profile on MixCloud';
        } else if (platform === 'spotify') {
            url = 'https://open.spotify.com/user/zovumezippy';
            icon = 'fa-brands fa-spotify';
            text = 'View full profile on Spotify';
        }
        platformLink.href = url;
        platformLink.innerHTML = `<i class="${icon}"></i> ${text}`;
    }

    // === HOMEPAGE: Filter tab state manager ===
    // Highlights the active platform button and dims the others.
    // Then re-renders the music grid and platform link.
    function setFilter(platform, activeBtn, others) {
        activeBtn.classList.add('text-white', 'border-brand-orange');
        activeBtn.classList.remove('text-gray-500', 'border-transparent');
        others.forEach(btn => {
            btn.classList.remove('text-white', 'border-brand-orange');
            btn.classList.add('text-gray-500', 'border-transparent');
        });
        renderMusic(platform);
        updatePlatformLink(platform);
    }

    // Wire up homepage filter buttons (only exist on index.html)
    if (btnYoutube) btnYoutube.addEventListener('click', () => setFilter('youtube', btnYoutube, [btnMixcloud, btnSpotify]));
    if (btnMixcloud) btnMixcloud.addEventListener('click', () => setFilter('mixcloud', btnMixcloud, [btnYoutube, btnSpotify]));
    if (btnSpotify) btnSpotify.addEventListener('click', () => setFilter('spotify', btnSpotify, [btnYoutube, btnMixcloud]));

    // Default to YouTube on homepage load
    renderMusic('youtube');
    updatePlatformLink('youtube');

    // === MIXES PAGE: Platform filter + grid renderer ===
    // Used on mixes.html to display all mixes filtered by platform,
    // with an optional text search within the active platform.

    const mixesGrid = document.getElementById('mixes-grid');
    const mixesSearch = document.getElementById('mixes-search');

    // Track the currently active platform on the mixes page
    let activeMixesPlatform = 'youtube';

    // --- Platform icon/label mapping for card display ---
    const platformMeta = {
        youtube:    { label: 'YouTube',    icon: 'fa-brands fa-youtube',    fallbackIcon: 'fa-brands fa-youtube' },
        mixcloud:   { label: 'MixCloud',   icon: 'fa-brands fa-mixcloud',   fallbackIcon: 'fa-brands fa-mixcloud' },
        spotify:    { label: 'Spotify',    icon: 'fa-brands fa-spotify',    fallbackIcon: 'fa-brands fa-spotify' },
        soundcloud: { label: 'SoundCloud', icon: 'fa-brands fa-soundcloud', fallbackIcon: 'fa-brands fa-soundcloud' }
    };

    /**
     * renderMixesGrid — Renders cards into #mixes-grid on mixes.html
     * @param {string} platform  - 'youtube' | 'mixcloud' | 'spotify' | 'soundcloud'
     * @param {string} searchText - Optional text filter (matches title, genre, desc)
     */
    function renderMixesGrid(platform, searchText) {
        if (!mixesGrid) return;
        mixesGrid.innerHTML = '';

        // SoundCloud: show "Coming Soon" placeholder
        if (platform === 'soundcloud') {
            mixesGrid.innerHTML = `
                <div class="col-span-full text-center py-16">
                    <i class="fa-brands fa-soundcloud text-5xl text-brand-orange/40 mb-4 block"></i>
                    <p class="text-gray-400 text-lg font-display font-bold">Coming Soon</p>
                    <p class="text-gray-500 text-sm mt-2">SoundCloud content will appear here.</p>
                    <a href="https://soundcloud.com/zovumezippy" target="_blank" rel="noopener noreferrer"
                       class="inline-flex items-center gap-2 mt-6 text-brand-orange hover:underline text-sm">
                        <i class="fa-brands fa-soundcloud"></i> Follow on SoundCloud
                    </a>
                </div>
            `;
            return;
        }

        // Combine mixes and playlists, then filter by platform
        const allItems = [...appData.mixes, ...appData.playlists];
        let filtered = allItems.filter(item => item.platform === platform);

        // Apply text search if provided
        if (searchText) {
            filtered = filtered.filter(item =>
                item.title.toLowerCase().includes(searchText) ||
                item.genre.toLowerCase().includes(searchText) ||
                item.desc.toLowerCase().includes(searchText)
            );
        }

        // Empty state
        if (filtered.length === 0) {
            mixesGrid.innerHTML = '<p class="text-gray-400 text-center col-span-full py-12">No mixes found.</p>';
            return;
        }

        // Render cards with full-background thumbnail design
        filtered.forEach(function(item) {
            const card = document.createElement('div');
            card.className = 'group relative overflow-hidden rounded-xl border border-white/5 hover:border-brand-orange/50 transition-all duration-300 aspect-video cursor-pointer';

            // Featured badge (top-right corner)
            const featuredBadge = item.featured
                ? '<div class="absolute top-3 right-3 bg-brand-orange text-white text-xs font-bold px-2 py-1 rounded z-20">FEATURED</div>'
                : '';

            // Background: thumbnail image or gradient fallback
            const meta = platformMeta[item.platform] || platformMeta.youtube;
            let backgroundHTML;
            if (item.thumbnail) {
                // Use the actual thumbnail as a full-bleed background
                backgroundHTML = '<img src="' + item.thumbnail + '" alt="' + item.alt + '" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">';
            } else {
                // Gradient fallback with a large muted platform icon
                backgroundHTML = '<div class="absolute inset-0 bg-gradient-to-br from-brand-gray to-brand-black flex items-center justify-center"><i class="' + meta.fallbackIcon + ' text-6xl text-white/10"></i></div>';
            }

            card.innerHTML =
                backgroundHTML +
                featuredBadge +
                /* Dark gradient overlay for text readability */
                '<div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>' +
                /* Text content overlaid at the bottom of the card */
                '<div class="absolute bottom-0 left-0 right-0 p-5 z-10">' +
                    '<div class="text-xs text-brand-orange font-bold uppercase mb-1">' + item.genre + '</div>' +
                    '<h3 class="font-display text-base font-bold text-white leading-tight mb-3">' + item.title + '</h3>' +
                    '<a href="' + item.link + '" target="_blank" rel="noopener noreferrer" ' +
                       'class="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-brand-orange transition-colors">' +
                        '<i class="' + item.icon + '"></i> Listen Now' +
                    '</a>' +
                '</div>';

            // Wrap card in a clickable link to the mix
            card.addEventListener('click', function(e) {
                // Don't double-navigate if the inner <a> was clicked
                if (e.target.closest('a')) return;
                window.open(item.link, '_blank', 'noopener,noreferrer');
            });

            mixesGrid.appendChild(card);
        });
    }

    /**
     * setMixesFilter — Switches the active platform tab on mixes.html
     * Updates tab styling, aria-selected, and re-renders the grid.
     * @param {string} platform - The platform to activate
     */
    function setMixesFilter(platform) {
        activeMixesPlatform = platform;
        const tabs = document.querySelectorAll('#mixes-tabs button');

        tabs.forEach(tab => {
            const tabPlatform = tab.id.replace('mixes-tab-', '');
            if (tabPlatform === platform) {
                // Active tab: orange border + white text
                tab.classList.add('border-brand-orange', 'text-white');
                tab.classList.remove('border-transparent', 'text-gray-500');
                tab.setAttribute('aria-selected', 'true');
            } else {
                // Inactive tabs: transparent border + gray text
                tab.classList.remove('border-brand-orange', 'text-white');
                tab.classList.add('border-transparent', 'text-gray-500');
                tab.setAttribute('aria-selected', 'false');
            }
        });

        // Get current search text (if any) and re-render
        const searchText = mixesSearch ? mixesSearch.value.toLowerCase().trim() : '';
        renderMixesGrid(platform, searchText);
    }

    // --- Mixes page initialization ---
    // Only runs if #mixes-grid exists (i.e., on mixes.html)
    if (mixesGrid) {
        // Wire up platform tab click handlers
        const tabIds = ['mixes-tab-youtube', 'mixes-tab-mixcloud', 'mixes-tab-spotify', 'mixes-tab-soundcloud'];
        tabIds.forEach(id => {
            const tab = document.getElementById(id);
            if (tab) {
                const platform = id.replace('mixes-tab-', '');
                tab.addEventListener('click', () => setMixesFilter(platform));
            }
        });

        // Wire up search input to filter within the active platform
        if (mixesSearch) {
            mixesSearch.addEventListener('input', function() {
                renderMixesGrid(activeMixesPlatform, this.value.toLowerCase().trim());
            });
        }

        // Default to YouTube on page load
        renderMixesGrid('youtube', '');
    }
});
