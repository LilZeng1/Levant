// Reveal Animations
const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, observerOptions);

document.querySelectorAll(".reveal").forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
    observer.observe(el);
});

// Sync Language with LocalStorage
window.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('levant_lang') || 'en';
    const toggle = document.getElementById('lang-toggle-dash');
    if(savedLang === 'ar') {
        toggle.checked = true;
        document.body.setAttribute('dir', 'rtl');
        document.body.classList.add('rtl-mode');
    }
    // Initial translation call
    const translateElements = document.querySelectorAll('.translate-dash');
    translateElements.forEach(el => {
        const text = el.getAttribute(`data-${savedLang}`);
        if (text) el.innerText = text;
    });
});
