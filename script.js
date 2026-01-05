/* Application Logic */

// Data Store
const appData = {
    mixes: [
        {
            title: "House Music Therapy / #LetsMixIt Contest",
            genre: "House / Tech House",
            desc: "High-energy rooftop set recorded in Novi Sad for the #LetsMixIt competition.",
            icon: "fa-solid fa-play",
            link: "https://www.youtube.com/watch?v=IzkAZcbyCSI",
            thumbnail: "https://img.youtube.com/vi/IzkAZcbyCSI/maxresdefault.jpg",
            alt: "Zippy's Let's Mix It Submission - House and Tech House mix",
            featured: true
        },
        {
            title: "House Music Therapy / Deep & Tech Grooves",
            genre: "Deep House / Tech House",
            desc: "A curated mix blending deep basslines with rhythmic tech house elements.",
            icon: "fa-solid fa-play",
            link: "https://www.youtube.com/watch?v=c1M_dMg_CcU",
            thumbnail: "https://img.youtube.com/vi/c1M_dMg_CcU/maxresdefault.jpg",
            alt: "Zippy's House Therapy Session - Deep House mix",
            featured: false
        },
        {
            title: "EXIT 2024 | AS FM Stage Live",
            genre: "Tech House",
            desc: "Full live performance recording from the AS FM stage at Exit Festival 2024.",
            icon: "fa-solid fa-play",
            link: "https://www.youtube.com/watch?v=pbT603mKdsc",
            thumbnail: "https://img.youtube.com/vi/pbT603mKdsc/maxresdefault.jpg",
            alt: "Zippy's Deep House Vibes - House music selection",
            featured: false
        },
        {
            title: "EXIT 2024 | AS FM Stage Full Show",
            genre: "Tech House",
            desc: "The complete high-energy audio recording from the Exit Festival performance.",
            icon: "fa-brands fa-mixcloud",
            link: "https://www.mixcloud.com/zovumezippy/exit-2024-zippy-live-at-as-fm-stage-full-show/",
            thumbnail: "",
            alt: "Zippy's House Music Therapy Vol. 12 - MixCloud set",
            featured: false
        },
        {
            title: "House Music Therapy / Deep & Tech Grooves",
            genre: "Deep Tech",
            desc: "Studio mix focused on sophisticated, deeper layers of house music.",
            icon: "fa-brands fa-mixcloud",
            link: "https://www.mixcloud.com/zovumezippy/house-music-therapy-with-dj-zippy-deep-and-tech-grooves/",
            thumbnail: "",
            alt: "Zippy's Club Kult Warmup - MixCloud set",
            featured: false
        },
        {
            title: "House Music Therapy / Live from Singing Forest",
            genre: "House / Organic House",
            desc: "Live set recorded in nature, blending house rhythms with an open-air vibe.",
            icon: "fa-brands fa-mixcloud",
            link: "https://www.mixcloud.com/zovumezippy/house-music-therapy-with-dj-zippy-live-from-singing-forest/",
            thumbnail: "",
            alt: "Zippy's Live from Singing Forest - MixCloud set",
            featured: false
        }
    ],
    playlists: [
        {
            title: "Selector's Choice: House",
            genre: "Spotify Playlist",
            desc: "Tracks that never leave my USB.",
            icon: "fa-brands fa-spotify",
            link: "https://open.spotify.com/playlist/1760y5mR1hdF7PdnAErYRA",
            thumbnail: "",
            alt: "Zippy's Selector Choice House - Spotify playlist"
        },
        {
            title: "Afterhours Techno",
            genre: "Spotify Playlist",
            desc: "When the lights go down and the mood gets darker.",
            icon: "fa-brands fa-spotify",
            link: "https://open.spotify.com/playlist/17bauJGzLkXVRa89n3WEF0",
            thumbnail: "",
            alt: "Zippy's Afterhours Techno - Spotify playlist"
        },
        {
            title: "Tech House Essentials",
            genre: "Spotify Playlist",
            desc: "Driving beats and underground selections.",
            icon: "fa-brands fa-spotify",
            link: "https://open.spotify.com/playlist/04y1SsxxufHRI92QPbrIo3",
            thumbnail: "",
            alt: "Zippy's Tech House Essentials - Spotify playlist"
        }
    ]
};

// DOM Elements
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const musicGrid = document.getElementById('music-grid');
const btnYoutube = document.getElementById('filter-youtube');
const btnMixcloud = document.getElementById('filter-mixcloud');
const btnSpotify = document.getElementById('filter-spotify');
const platformLink = document.getElementById('platform-link');

// State
let currentFilter = 'youtube';

// --- Platform Link Update ---
function updatePlatformLink(platform) {
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
        url = 'https://open.spotify.com/user/31aj2g4yokqhpoxwkpo5odxegsle';
        icon = 'fa-brands fa-spotify';
        text = 'View full profile on Spotify';
    }
    platformLink.href = url;
    platformLink.innerHTML = `<i class="${icon}"></i> ${text}`;
}

// --- Navigation Logic ---
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

document.querySelectorAll('.nav-link, #mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        if (mobileMenu) mobileMenu.classList.add('hidden');
    });
});

// --- Content Rendering ---
function renderMusic(type) {
    if (!musicGrid) return;
    musicGrid.innerHTML = '';
    let data;
    if (type === 'youtube') {
        data = appData.mixes.filter(item => item.icon === 'fa-solid fa-play');
    } else if (type === 'mixcloud') {
        data = appData.mixes.filter(item => item.icon === 'fa-brands fa-mixcloud');
    } else if (type === 'spotify') {
        data = appData.playlists;
    } else {
        data = appData.mixes; // fallback
    }

    data.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'group bg-brand-gray border border-white/5 p-0 overflow-hidden relative rounded-xl hover:border-brand-orange/50 transition-all duration-300 animate-fade-in';
        // Add slight delay for cascade effect
        card.style.animationDelay = `${index * 100}ms`;

        const featuredBadge = item.featured ?
            `<div class="absolute top-4 right-4 bg-brand-orange text-white text-xs font-bold px-2 py-1 rounded z-20">FEATURED</div>` : '';

        card.innerHTML = `
            <div class="h-48 bg-gradient-to-br from-gray-800 to-black relative flex items-center justify-center overflow-hidden">
                    ${item.thumbnail ? `<img src="${item.thumbnail}" alt="${item.alt}" class="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-700">` : ''}
                    <div class="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors"></div>
                    <div class="w-16 h-16 rounded-full border-2 border-white/50 flex items-center justify-center z-10 group-hover:bg-brand-orange group-hover:border-brand-orange transition-all cursor-pointer">
                    <a href="${item.link}" target="_blank" class="w-full h-full flex items-center justify-center">
                        <i class="${item.icon} text-2xl text-white"></i>
                    </a>
                    </div>
                    ${featuredBadge}
            </div>
            <div class="p-6">
                <div class="text-xs text-brand-orange font-bold uppercase mb-2">${item.genre}</div>
                <h3 class="text-xl font-bold text-white mb-2 leading-tight">${item.title}</h3>
                <p class="text-gray-400 text-sm mb-4">${item.desc}</p>
                <a href="${item.link}" class="inline-block text-sm font-bold border-b border-white/20 pb-1 hover:text-brand-orange hover:border-brand-orange transition-colors">LISTEN NOW</a>
            </div>
        `;
        musicGrid.appendChild(card);
    });
}

// --- Event Listeners for Filter ---
if (btnYoutube) {
    btnYoutube.addEventListener('click', () => {
        currentFilter = 'youtube';
        btnYoutube.classList.add('text-white', 'border-brand-orange');
        btnYoutube.classList.remove('text-gray-500', 'border-transparent');
        btnMixcloud.classList.remove('text-white', 'border-brand-orange');
        btnMixcloud.classList.add('text-gray-500', 'border-transparent');
        btnSpotify.classList.remove('text-white', 'border-brand-orange');
        btnSpotify.classList.add('text-gray-500', 'border-transparent');
        renderMusic('youtube');
        updatePlatformLink('youtube');
    });
}

if (btnMixcloud) {
    btnMixcloud.addEventListener('click', () => {
        currentFilter = 'mixcloud';
        btnMixcloud.classList.add('text-white', 'border-brand-orange');
        btnMixcloud.classList.remove('text-gray-500', 'border-transparent');
        btnYoutube.classList.remove('text-white', 'border-brand-orange');
        btnYoutube.classList.add('text-gray-500', 'border-transparent');
        btnSpotify.classList.remove('text-white', 'border-brand-orange');
        btnSpotify.classList.add('text-gray-500', 'border-transparent');
        renderMusic('mixcloud');
        updatePlatformLink('mixcloud');
    });
}

if (btnSpotify) {
    btnSpotify.addEventListener('click', () => {
        currentFilter = 'spotify';
        btnSpotify.classList.add('text-white', 'border-brand-orange');
        btnSpotify.classList.remove('text-gray-500', 'border-transparent');
        btnYoutube.classList.remove('text-white', 'border-brand-orange');
        btnYoutube.classList.add('text-gray-500', 'border-transparent');
        btnMixcloud.classList.remove('text-white', 'border-brand-orange');
        btnMixcloud.classList.add('text-gray-500', 'border-transparent');
        renderMusic('spotify');
        updatePlatformLink('spotify');
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderMusic('youtube');
    updatePlatformLink('youtube');
});