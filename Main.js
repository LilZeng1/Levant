/* Mouse Tracking Glow Effect */
const cards = document.querySelectorAll(".bento-card");

document.addEventListener("mousemove", (e) => {
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
    });
});

/* Language Logic */
const translations = document.querySelectorAll('.translate');
const btnEn = document.getElementById('btn-en');
const btnAr = document.getElementById('btn-ar');

function setLang(lang) {
    // Save preference
    localStorage.setItem('levant_lang', lang);

    if(lang === 'ar') {
        document.body.classList.add('rtl-mode');
        document.body.setAttribute('dir', 'rtl');
        btnAr.classList.add('active');
        btnEn.classList.remove('active');
    } else {
        document.body.classList.remove('rtl-mode');
        document.body.setAttribute('dir', 'ltr');
        btnEn.classList.add('active');
        btnAr.classList.remove('active');
    }

    translations.forEach(el => {
        el.style.opacity = '0';
        setTimeout(() => {
            el.innerText = el.getAttribute(`data-${lang}`);
            el.style.opacity = '1';
        }, 200);
    });
}

window.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('levant_lang') || 'en';
    setLang(savedLang);
    
    // Basic Grid Animation
    const grid = document.getElementById('grid');
    grid.style.opacity = '0';
    grid.style.transform = 'translateY(20px)';
    grid.style.transition = 'all 0.8s ease';
    
    setTimeout(() => {
        grid.style.opacity = '1';
        grid.style.transform = 'translateY(0)';
    }, 300);
});
