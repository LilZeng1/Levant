const BackendUrl = "https://levant-backend.onrender.com";

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const storedToken = sessionStorage.getItem('access_token');

    if (code) {
        window.history.replaceState({}, document.title, "/dashboard.html");
        await fetchData({ code: code });
    } 
    else if (storedToken) {
        await fetchData({ access_token: storedToken });
    } 
    else {
        window.location.href = 'index.html';
    }
});

async function fetchData(payload) {
    const loadingScreen = document.getElementById('loading-screen');
    
    try {
        const res = await fetch(`${BackendUrl}/userinfo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.status === 401) {
            sessionStorage.clear();
            window.location.href = 'index.html';
            return;
        }

        const data = await res.json();
        if (data.Error) throw new Error(data.Error);

        if (data.new_access_token) {
            sessionStorage.setItem('access_token', data.new_access_token);
        }

        updateUI(data);
        checkLevelUp(data.level);

    } catch (err) {
        console.error("Dashboard Error:", err);
    } finally {
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => loadingScreen.remove(), 500);
        }
    }
}

function updateUI(user) {
    // İsim
    document.getElementById('user-display-name').innerText = user.global_name || user.username;
    document.getElementById('nav-user-name').innerText = user.username;
    
    // Avatar
    const avatarUrl = user.avatar 
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` 
        : `https://cdn.discordapp.com/embed/avatars/0.png`;
        
    document.getElementById('user-avatar').src = avatarUrl;
    document.getElementById('nav-avatar').src = avatarUrl;
    
    // Level
    document.getElementById('calculated-level').innerText = user.level || 1;
    
    // Calculating Days etc.
    const joined = new Date(user.joinedAt);
    const now = new Date();
    const diffTime = Math.abs(now - joined);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    document.getElementById('joined-on').innerText = diffDays;
}

// Level Up Pop-up Logic
function checkLevelUp(currentLevel) {
    const lastLevel = localStorage.getItem('last_level');

    if (lastLevel && parseInt(currentLevel) > parseInt(lastLevel)) {
        showLevelPopup(currentLevel);
    }
    
    localStorage.setItem('last_level', currentLevel);
}

function showLevelPopup(lvl) {
    const win = document.getElementById('level-popup');
    document.getElementById('popup-text').innerText = `You have ascended to Level ${lvl}. New privileges unlocked.`;
    
    win.style.display = 'flex';
    void win.offsetWidth; 
    win.classList.add('active');
    
    setTimeout(() => closePopup(), 4000);
}

function closePopup() {
    const win = document.getElementById('level-popup');
    win.classList.remove('active');
    win.classList.add('closing');
    
    setTimeout(() => {
        win.style.display = 'none';
        win.classList.remove('closing');
    }, 500);
}

// Logout Function
window.logout = function() {
    sessionStorage.clear();
    window.location.href = 'index.html';
}
