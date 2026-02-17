document.addEventListener("DOMContentLoaded", () => {
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.style.opacity = "0";
            setTimeout(() => {
                loadingScreen.style.display = "none";
            }, 800);
        }, 1500);
    }
});

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

const translations = document.querySelectorAll('.translate');
const btnEn = document.getElementById('btn-en');
const btnAr = document.getElementById('btn-ar');

function setLang(lang) {
    localStorage.setItem('levant_lang', lang);

    if (lang === 'ar') {
        document.body.classList.add('rtl-mode');
        document.body.setAttribute('dir', 'rtl');
        if (btnAr) btnAr.classList.add('active');
        if (btnEn) btnEn.classList.remove('active');
    } else {
        document.body.classList.remove('rtl-mode');
        document.body.setAttribute('dir', 'ltr');
        if (btnEn) btnEn.classList.add('active');
        if (btnAr) btnAr.classList.remove('active');
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

    const grid = document.getElementById('grid');
    if (grid) {
        grid.style.opacity = '0';
        grid.style.transform = 'translateY(20px)';
        grid.style.transition = 'all 0.8s ease';
        setTimeout(() => {
            grid.style.opacity = '1';
            grid.style.transform = 'translateY(0)';
        }, 300);
    }
});

const ClickSound = new Audio("./ChillTunes/click-sound-1.mp3");
const BgMusic = new Audio("./ChillTunes/lofi-chill-track-1.mp3");

ClickSound.preload = "auto";
BgMusic.preload = "auto";
BgMusic.loop = true;
BgMusic.volume = 0.2;

let isPlaying = false;

function toggleMusic() {
    const musicBtn = document.getElementById('music-toggle-btn');
    const icon = musicBtn.querySelector('i');

    if (isPlaying) {
        BgMusic.pause();
        if (icon) icon.className = "ph-bold ph-speaker-slash";
    } else {
        BgMusic.play().catch(e => console.log("Music play failed:", e));
        if (icon) icon.className = "ph-bold ph-speaker-high";
    }
    isPlaying = !isPlaying;
}

document.addEventListener('mousedown', (e) => {
    if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.bento-card')) {
        const clone = ClickSound.cloneNode();
        clone.volume = 0.5;
        clone.play().catch(() => { });
    }
});
