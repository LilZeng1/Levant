document.addEventListener('DOMContentLoaded', () => {
    const langToggle = document.getElementById('lang-toggle');
    const translatables = document.querySelectorAll('.translate');

    // Load saved language preference
    const savedLang = localStorage.getItem('levant-lang') || 'en';
    if(savedLang === 'ar') {
        langToggle.checked = true;
        document.body.classList.add('rtl');
        document.body.setAttribute('lang', 'ar');
    }

    // UpdateLanguage() Func
    function updateLanguage() {
        const isArabic = langToggle.checked;
        const lang = isArabic ? 'ar' : 'en';

        if (isArabic) {
            document.body.classList.add('rtl');
            document.body.setAttribute('lang', 'ar');
        } else {
            document.body.classList.remove('rtl');
            document.body.setAttribute('lang', 'en');
        }

        // Update translatable elements
        translatables.forEach(el => {
            const text = el.getAttribute(`data-${lang}`);
            if (text) {
                el.innerText = text;

                if(el.classList.contains('glitch-text') || el.hasAttribute('data-text')) {
                    el.setAttribute('data-text', text);
                }
            }
        });

        // add the language preference to localStorage
        localStorage.setItem('levant-lang', lang);
    }

    langToggle.addEventListener('change', updateLanguage);
    
    updateLanguage();

    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.m-link');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            
            // İkonu değiştir (Liste -> Çarpı)
            const icon = menuBtn.querySelector('i');
            if (mobileMenu.classList.contains('active')) {
                icon.classList.replace('ph-list', 'ph-x');
            } else {
                icon.classList.replace('ph-x', 'ph-list');
            }
        });

        // Close menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                const icon = menuBtn.querySelector('i');
                if(icon) icon.classList.replace('ph-x', 'ph-list');
            });
        });
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    const cardsContainer = document.querySelector('.bento-grid');
    const cards = document.querySelectorAll('.bento-card');

    if (cardsContainer) {
        cardsContainer.addEventListener("mousemove", (e) => {
            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                card.style.setProperty("--x", `${x}px`);
                card.style.setProperty("--y", `${y}px`);
            });
        });
    }

});
