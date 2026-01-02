// Dashboard.js
document.addEventListener("DOMContentLoaded", () => {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const [accessToken, tokenType] = [fragment.get('access_token'), fragment.get('token_type')];

    if (!accessToken) {
        console.log("No token found, showing demo mode.");
        simulateDashboard({
            username: "Guest User",
            discriminator: "0000",
            id: "12345",
            avatar: null
        });
        return;
    }

    fetch('https://discord.com/api/users/@me', {
        headers: {
            authorization: `${tokenType} ${accessToken}`,
        },
    })
    .then(result => result.json())
    .then(response => {
        updateDashboard(response);
    })
    .catch(console.error);
});

function updateDashboard(user) {
    const loadingScreen = document.getElementById("loading-screen");
    const dashboardContent = document.getElementById("dashboard-content");

    loadingScreen.classList.add("hidden");
    dashboardContent.classList.remove("hidden");

    document.getElementById("nav-username").innerText = user.username;
    document.getElementById("nav-user-pill").classList.remove("hidden");
    
    document.getElementById("user-display-name").innerText = user.global_name || user.username;
    document.getElementById("user-discriminator").innerText = `@${user.username}`;
    
    const avatarImg = document.getElementById("user-avatar");
    if (user.avatar) {
        avatarImg.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`;
    } else {
        avatarImg.src = "https://cdn.discordapp.com/embed/avatars/0.png";
    }
}

function simulateDashboard(mockUser) {
    setTimeout(() => {
        updateDashboard(mockUser);
    }, 1500);
}

// Logout()
document.getElementById("logout-btn").addEventListener("click", () => {
    window.location.href = "index.html"; 
});
