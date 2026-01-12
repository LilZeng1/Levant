const BackendUrl = "https://levant-backend.onrender.com";

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const token = localStorage.getItem('access_token');

    if (code) {
        await handleLogin(code);
    } else if (token) {
        await syncSession(token);
    } else {
        window.location.href = 'index.html';
    }
});

async function handleLogin(code) {
    try {
        const res = await fetch(`${BackendUrl}/userinfo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
        });
        const data = await res.json();
        
        if (data.access_token) {
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('user_data', JSON.stringify(data));
            window.history.replaceState({}, document.title, "/dashboard.html");
            updateUI(data);
        } else {
            logout();
        }
    } catch (err) {
        logout();
    }
}

async function syncSession(token) {
    const cachedData = localStorage.getItem('user_data');
    if (cachedData) {
        updateUI(JSON.parse(cachedData));
    } else {
        logout();
    }
}

function updateUI(user) {
    const loader = document.getElementById('loading-screen');
    if(loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 500);
    }

    document.getElementById('nav-user-name').innerText = user.global_name || user.username;
    document.getElementById('user-display-name').innerText = user.global_name || user.username;
    
    const avatarUrl = user.avatar 
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
        : `https://cdn.discordapp.com/embed/avatars/0.png`;
        
    document.getElementById('nav-avatar').src = avatarUrl;
    document.getElementById('user-avatar').src = avatarUrl;
    document.getElementById('calculated-level').innerText = user.level || 1;
}

function switchTab(tabId, el) {
    document.querySelectorAll('.content-view').forEach(v => v.style.display = 'none');
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    document.getElementById(`view-${tabId}`).style.display = 'block';
    el.classList.add('active');
}

function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}
