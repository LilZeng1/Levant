// Levant Guild ID
const LEVANT_GUILD_ID = "1452829028267327511";

const initDashboard = async () => {
    const hash = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hash.get('access_token');
    const tokenType = hash.get('token_type') || 'Bearer';

    if (!accessToken) {
        window.location.href = "index.html";
        return;
    }

    try {
        const userResp = await fetch('https://discord.com/api/users/@me', {
            headers: { 'Authorization': `${tokenType} ${accessToken}` }
        });
        const user = await userResp.json();

        const guildResp = await fetch(`https://discord.com/api/users/@me/guilds/${LEVANT_GUILD_ID}/member`, {
            headers: { 'Authorization': `${tokenType} ${accessToken}` }
        });
        
        let guildData = null;
        if (guildResp.ok) {
            guildData = await guildResp.json();
        }

        renderDashboard(user, guildData);
    } catch (err) {
        console.error("Vibe check failed:", err);
        document.getElementById("loading-screen").innerHTML = "<h3>Something went wrong. High ping?</h3>";
    }
};

function renderDashboard(user, guildData) {
    document.getElementById("loading-screen").style.display = "none";
    document.getElementById("dashboard-content").classList.remove("hidden");

    // Names
    document.getElementById("nav-username").innerText = user.username;
    document.getElementById("user-display-name").innerText = user.global_name || user.username;
    document.getElementById("user-discriminator").innerText = `@${user.username}`;
    document.getElementById("nav-user-pill").classList.remove("hidden");

    // Avatar
    const avatar = user.avatar 
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`
        : "https://cdn.discordapp.com/embed/avatars/0.png";
    document.getElementById("user-avatar").src = avatar;

    // Rank 
    const rankEl = document.querySelector(".stat-value");
    rankEl.innerText = guildData ? "Ascendant" : "Guest";

    // (Joined On)
    const joinEl = document.getElementById("join-date");
    if (guildData && guildData.joined_at) {
        const date = new Date(guildData.joined_at);
        joinEl.innerText = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } else {
        joinEl.innerText = "Not in Server";
    }
}

// Logout
document.getElementById("logout-btn").addEventListener("click", () => {
    window.location.href = "index.html";
});

window.onload = initDashboard;
