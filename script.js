document.addEventListener('DOMContentLoaded', function() {

    // --- AOS (ANIMATE ON SCROLL) INITIALIZATION ---
    AOS.init({
        duration: 800,
        once: true,
        offset: 100,
    });

    // --- NAVIGATION SCROLL EFFECT ---
    const navbar = document.getElementById("navbar");
    if (navbar) {
        window.addEventListener("scroll", function() {
            if (window.scrollY > 50) {
                navbar.classList.add("nav-scrolled");
            } else {
                navbar.classList.remove("nav-scrolled");
            }
        });
    }

    // --- MOBILE MENU TOGGLE ---
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("navLinks");
    if (hamburger && navLinks) {
        hamburger.addEventListener("click", function() {
            hamburger.classList.toggle("active");
            navLinks.classList.toggle("active");
        });

        const links = navLinks.querySelectorAll("a");
        links.forEach(link => {
            link.addEventListener("click", function() {
                // Do not close if it's just a dropdown toggle, etc.
                // For this simple menu, we always close.
                hamburger.classList.remove("active");
                navLinks.classList.remove("active");
            });
        });
    }

    // --- SMOOTH SCROLLING FOR ON-PAGE ANCHOR LINKS ---
    document.querySelectorAll('a[href^="#"], a[href^="index.html#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            let href = this.getAttribute('href');
            
            // Check if it's a link to an anchor on the current page
            let isOnPageLink = href.startsWith('#') || (window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html')) && href.includes('#');

            if (isOnPageLink) {
                e.preventDefault();
                
                // Extract the hash from the href
                let hash = href.substring(href.indexOf('#'));
                
                // If it's just a hash, scroll to top
                if (hash === '#') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                }
                
                const targetElement = document.querySelector(hash);
                if (targetElement) {
                    const navbarHeight = document.getElementById('navbar').offsetHeight;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // --- LIGHTBOX FUNCTIONALITY ---
    const lightboxLinks = document.querySelectorAll('.lightbox');
    if (lightboxLinks.length > 0) {
        const lightboxOverlay = document.createElement('div');
        lightboxOverlay.classList.add('lightbox-overlay');
        document.body.appendChild(lightboxOverlay);
        const lightboxImage = document.createElement('img');
        lightboxOverlay.appendChild(lightboxImage);

        lightboxLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const imgSrc = link.getAttribute('href');
                lightboxImage.setAttribute('src', imgSrc);
                lightboxOverlay.classList.add('active');
            });
        });

        lightboxOverlay.addEventListener('click', () => {
            lightboxOverlay.classList.remove('active');
        });
    }

    // --- AJAX CONTACT FORM SUBMISSION ---
    const form = document.getElementById('booking-form');
    const formStatus = document.getElementById('form-status');
    if (form && formStatus) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(form);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);
            
            formStatus.innerHTML = "Sending...";
            formStatus.style.color = 'var(--light-gray)';

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: json
                });
                
                const result = await response.json();
                
                if (result.success) {
                    formStatus.innerHTML = "Message sent successfully!";
                    formStatus.style.color = 'var(--success)';
                    form.reset();
                } else {
                    formStatus.innerHTML = "Something went wrong. Please try again.";
                    formStatus.style.color = 'var(--error)';
                    console.error('Form submission error:', result);
                }
            } catch (error) {
                console.error('Fetch error:', error);
                formStatus.innerHTML = "An error occurred. Please try again later.";
                formStatus.style.color = 'var(--error)';
            }

            setTimeout(() => {
                formStatus.innerHTML = '';
            }, 5000);
        });
    }
});