const API_BASE_URL = "https://levant-backend.onrender.com"; 

window.onload = async () => {
    const loadingScreen = document.getElementById('loading-screen');
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('uid');
    const userName = urlParams.get('name');
    const userAvatarHash = urlParams.get('avatar');

    if (!userId) {
        const storedId = localStorage.getItem('levant_uid');
        if(storedId) {
            fetchUserData(storedId, localStorage.getItem('levant_name'), localStorage.getItem('levant_av'));
        } else {
            // If there's nothing sg
            window.location.href = '../index.html';
            return;
        }
    } else {
        // New SignIn(): Save data in browser.
        localStorage.setItem('levant_uid', userId);
        localStorage.setItem('levant_name', userName);
        localStorage.setItem('levant_av', userAvatarHash);
        
        window.history.replaceState({}, document.title, "dashboard.html");
        
        fetchUserData(userId, userName, userAvatarHash);
    }

    // Removing Loading Screen
    if(loadingScreen) {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 600);
        }, 800);
    }
};

async function fetchUserData(uid, name, avatarHash) {
    // Logo ve Avatar Yolları
    const logoImg = document.querySelector('.brand img');
    if(logoImg) logoImg.src = "../assets/Levant-Logo.png";

    const avatarUrl = avatarHash && avatarHash !== 'null' 
        ? `https://cdn.discordapp.com/avatars/${uid}/${avatarHash}.png`
        : 'https://cdn.discordapp.com/embed/avatars/0.png';
    
    // UI Elementlerini güncelle
    if (document.getElementById('nav-user-name')) document.getElementById('nav-user-name').innerText = name;
    if (document.getElementById('user-display-name')) document.getElementById('user-display-name').innerText = name;
    if (document.getElementById('nav-avatar')) document.getElementById('nav-avatar').src = avatarUrl;
    if (document.getElementById('user-avatar')) document.getElementById('user-avatar').src = avatarUrl;

    try {
        const response = await fetch(`${API_BASE_URL}/api/user-info/${uid}`);
        if (response.ok) {
            const data = await response.json();
            
            // Role ShowUps() || Badges
            const roleEl = document.querySelector('.badge-text');
            if(roleEl) roleEl.innerText = data.displayRole;

            // Stats
            if (document.getElementById('calculated-level')) document.getElementById('calculated-level').innerText = data.level;
            
            // JoinedAt Data()
            if (document.getElementById('joined-on')) {
                const joinedDate = new Date(data.joinedAt);
                const diffDays = Math.ceil(Math.abs(new Date() - joinedDate) / (1000 * 60 * 60 * 24)); 
                document.getElementById('joined-on').innerText = diffDays;
            }
        }
    } catch (error) { console.error("Fetch Error:", error); }
}

function updateStats(data) {
    // Leveling Up()
    const levelEl = document.getElementById('calculated-level');
    if (levelEl) levelEl.innerText = data.level || 1;

    // Loyalty()
    const joinedEl = document.getElementById('joined-on');
    if (joinedEl) {
        const joinedDate = new Date(data.joinedAt);
        const today = new Date();
        const diffTime = Math.abs(today - joinedDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        joinedEl.innerText = diffDays;
    }
}

// Sekme (Dashboard / Members / Settings)
function switchTab(tabName, btn) {
    document.querySelectorAll('.content-view').forEach(view => {
        view.style.display = 'none';
    });
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    const selectedView = document.getElementById(`view-${tabName}`);
    if(selectedView) selectedView.style.display = 'block';
    if(btn) btn.classList.add('active');
}

const updateNickBtn = document.querySelector('.action-btn');
if(updateNickBtn) {
    updateNickBtn.onclick = async () => {
        const newNick = document.getElementById('nickname-input').value;
        const uid = localStorage.getItem('levant_uid');
        if(!newNick) return alert("Please enter a name.");

        try {
            const res = await fetch(`${API_BASE_URL}/api/user/update-nick`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: uid, nickname: newNick })
            });
            if(res.ok) alert("Nickname updated!");
            else alert("Error: Bot cannot change your name (High role?)");
        } catch (err) { alert("Server error."); }
    };
}

// LogOut()
function logout() {
    localStorage.removeItem('levant_uid');
    localStorage.removeItem('levant_name');
    localStorage.removeItem('levant_av');
    window.location.href = '../index.html'; 
}

// Danger Zone: DELETING DATA & INFORMATION
const wipeBtn = document.querySelector('.danger-btn');
if(wipeBtn) {
    wipeBtn.onclick = async () => {
        const uid = localStorage.getItem('levant_uid');
        if(!uid) return;

        if(confirm("Emin misin? Tüm XP, Seviye verilerin silinecek ve Discord rolün alınacak.")) {
            try {
                const res = await fetch(`${API_BASE_URL}/api/danger/wipe`, { 
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: uid })
                });
                
                if(res.ok) {
                    alert("Veriler sıfırlandı.");
                    logout();
                }
            } catch (err) {
                alert("İşlem başarısız oldu.");
            }
        }
    }
}
