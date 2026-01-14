const API_BASE_URL = "https://levant-backend.onrender.com"; 

window.onload = async () => {
    const loadingScreen = document.getElementById('loading-screen');
    const urlParams = new URLSearchParams(window.location.search);
    let userId = urlParams.get('uid');
    let userName = urlParams.get('name');
    let userAvatarHash = urlParams.get('avatar');

    // Session Logic
    if (!userId) {
        userId = localStorage.getItem('levant_uid');
        userName = localStorage.getItem('levant_name');
        userAvatarHash = localStorage.getItem('levant_av');
        if(!userId) { window.location.href = '../index.html'; return; }
    } else {
        localStorage.setItem('levant_uid', userId);
        localStorage.setItem('levant_name', userName);
        localStorage.setItem('levant_av', userAvatarHash);
        window.history.replaceState({}, document.title, "dashboard.html");
    }

    // UI Initial Setup
    setupUI(userName, userId, userAvatarHash);
    await fetchUserData(userId);

    // Loader Out
    if(loadingScreen) {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => loadingScreen.style.display = 'none', 600);
        }, 800);
    }
};

function setupUI(name, uid, avatarHash) {
    const avatarUrl = avatarHash && avatarHash !== 'null' 
        ? `https://cdn.discordapp.com/avatars/${uid}/${avatarHash}.png`
        : 'https://cdn.discordapp.com/embed/avatars/0.png';
    
    const setText = (id, txt) => { const el = document.getElementById(id); if(el) el.innerText = txt; };
    const setSrc = (id, src) => { const el = document.getElementById(id); if(el) el.src = src; };

    setText('nav-user-name', name);
    setText('user-display-name', name);
    setSrc('nav-avatar', avatarUrl);
    setSrc('user-avatar', avatarUrl);
    
    // Mobile Nav Avatar
    const mobileAv = document.querySelector('.mobile-profile img');
    if(mobileAv) mobileAv.src = avatarUrl;
}

async function fetchUserData(uid) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/user-info/${uid}`);
        if (response.ok) {
            const data = await response.json();
            
            // Role
            const roleBadge = document.querySelector('.badge');
            if(roleBadge) roleBadge.innerText = data.roleName || "Mercury";

            // Stats (Level & XP)
            const levelEl = document.getElementById('calculated-level');
            if (levelEl) levelEl.innerText = data.level;

            // Loyalty()
            if (document.getElementById('joined-on')) {
                const joinedDate = new Date(data.joinedAt);
                const timeString = timeSince(joinedDate);
                document.getElementById('joined-on').innerText = timeString;

                const label = document.querySelector('.loyalty-label');
                if(label) label.innerText = "Since Joining";
            }
        }
    } catch (error) { console.error("Fetch Error:", error); }
}

// Loyalty Helper Function
function timeSince(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;

    if (interval > 1) return Math.floor(interval) + " Years";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " Months";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " Days";
    return "Newborn";
}

// Tab Switching & Mobile Menu
function switchTab(tabName, btn) {
    document.querySelectorAll('.content-view').forEach(view => view.style.display = 'none');
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));

    const selectedView = document.getElementById(`view-${tabName}`);
    if (selectedView) selectedView.style.display = 'block';
    
    if (btn) btn.classList.add('active');

    const sidebar = document.querySelector('.sidebar');
    if (window.innerWidth <= 1024) {
        sidebar.classList.remove('open');
        document.querySelector('.hamburger').classList.remove('active');
    }
}

// Mobile Menu Toggle
function toggleMenu() {
    const sidebar = document.querySelector('.sidebar');
    const hamburger = document.querySelector('.hamburger');
    sidebar.classList.toggle('open');
    hamburger.classList.toggle('active');
}

// LogOut()
function logout() {
    localStorage.clear();
    window.location.href = '../index.html'; 
}
