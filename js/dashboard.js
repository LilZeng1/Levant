const API_BASE_URL = "https://levant-backend.onrender.com"; 

window.onload = async () => {
    const loadingScreen = document.getElementById('loading-screen');
    const urlParams = new URLSearchParams(window.location.search);
    let userId = urlParams.get('uid');
    let userName = urlParams.get('name');
    let userAvatarHash = urlParams.get('avatar');

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

    updateUI(userName, userId, userAvatarHash);
    await fetchStats(userId);

    if(loadingScreen) {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => loadingScreen.style.display = 'none', 600);
        }, 800);
    }
};

function updateUI(name, uid, avatarHash) {
    const avatarUrl = avatarHash && avatarHash !== 'null' 
        ? `https://cdn.discordapp.com/avatars/${uid}/${avatarHash}.png`
        : 'https://cdn.discordapp.com/embed/avatars/0.png';
    
    const setEl = (id, val, attr='innerText') => { const el = document.getElementById(id); if(el) el[attr] = val; };

    setEl('nav-user-name', name);
    setEl('user-display-name', name);
    setEl('nav-avatar', avatarUrl, 'src');
    setEl('user-avatar', avatarUrl, 'src');
    
    const mobileImg = document.querySelector('.mobile-profile-img');
    if(mobileImg) mobileImg.src = avatarUrl;
}

async function fetchStats(uid) {
    try {
        const res = await fetch(`${API_BASE_URL}/api/user-info/${uid}`);
        if(res.ok) {
            const data = await res.json();
            
            const levelEl = document.getElementById('calculated-level');
            if(levelEl) levelEl.innerText = data.level;

            const joinedEl = document.getElementById('joined-on');
            if(joinedEl) {
                const date = new Date(data.joinedAt);
                joinedEl.innerText = formatTimeAgo(date); 
                joinedEl.style.fontSize = "3rem";
            }
        }
    } catch(err) { console.error(err); }
}

function formatTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;

    if (interval > 1) return Math.floor(interval) + " Years";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " Months";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " Days";
    return "Newborn";
}

function switchTab(tabName, btn) {
    document.querySelectorAll('.content-view').forEach(view => view.style.display = 'none');
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));

    const view = document.getElementById(`view-${tabName}`);
    if(view) view.style.display = 'block';
    if(btn) btn.classList.add('active');

    const sidebar = document.querySelector('.sidebar');
    if(sidebar.classList.contains('active')) toggleMobileMenu();
}

function toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
}

function logout() {
    localStorage.clear();
    window.location.href = '../index.html'; 
}

const updateNickBtn = document.querySelector('.action-btn');
if(updateNickBtn) {
    updateNickBtn.onclick = async () => {
        const newNick = document.getElementById('nickname-input').value;
        const uid = localStorage.getItem('levant_uid');
        if(!newNick) return alert("Enter a name.");
        
        try {
            const res = await fetch(`${API_BASE_URL}/api/user/update-nick`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: uid, nickname: newNick })
            });
            if(res.ok) alert("Updated!");
        } catch (e) { alert("Error"); }
    };
}
