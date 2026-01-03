// Dashboard.js
const GUILD_ID = "1452829028267327511";

const initDashboard = async () => {
    // Extract token from URL hash
    const hash = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hash.get('access_token');
    const tokenType = hash.get('token_type') || 'Bearer';

    // DEBUG LOGS
    console.log("Token check:", accessToken ? "Token exists" : "No token");

    if (!accessToken) {
        console.error("No access token found in URL.");
        setTimeout(() => window.location.href = "index.html", 2000);
        return;
    }

    try {
        console.log("Fetching user profile...");
        const userResp = await fetch('https://discord.com/api/users/@me', {
            headers: { 'Authorization': `${tokenType} ${accessToken}` }
        });

        if (!userResp.ok) throw new Error("Discord profile fetch failed");
        const user = await userResp.json();
        console.log("User received:", user.username);

        let memberData = null;
        try {
            console.log("Fetching guild member data...");
            const memberResp = await fetch(`https://discord.com/api/users/@me/guilds/${GUILD_ID}/member`, {
                headers: { 'Authorization': `${tokenType} ${accessToken}` }
            });
            if (memberResp.ok) {
                memberData = await memberResp.json();
                console.log("Member data received!");
            }
        } catch (guildErr) {
            console.warn("Could not fetch guild data (CORS or Scope issue):", guildErr);
        }

        renderDashboard(user, memberData);

    } catch (err) {
        console.error("Main init error:", err);
        const loadingScreen = document.getElementById("loading-screen");
        if (loadingScreen) {
            loadingScreen.innerHTML = `<h3>Vibe Check Failed</h3><p style="color:red">${err.message}</p><p>Check Console (F12) for details.</p>`;
        }
    }
};

function renderDashboard(user, memberData) {
    const loader = document.getElementById("loading-screen");
    const content = document.getElementById("dashboard-content");
    
    if (loader) loader.style.display = "none";
    if (content) content.classList.remove("hidden");

    // Profile Info
    document.getElementById("nav-username").innerText = user.username;
    document.getElementById("user-display-name").innerText = user.global_name || user.username;
    document.getElementById("user-discriminator").innerText = `@${user.username}`;
    document.getElementById("nav-user-pill").classList.remove("hidden");

    // Avatar
    const avatar = user.avatar 
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`
        : "https://cdn.discordapp.com/embed/avatars/0.png";
    document.getElementById("user-avatar").src = avatar;

    // Rank & Join Date
    const rankValue = document.getElementById("rank-value");
    const joinDateEl = document.getElementById("join-date");

    if (memberData && memberData.joined_at) {
        rankValue.innerText = "Ascendant";
        rankValue.style.color = "#5865F2";
        const date = new Date(memberData.joined_at);
        joinDateEl.innerText = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } else {
        rankValue.innerText = "Lurker";
        joinDateEl.innerText = "Not Synced";
    }
}

window.onload = initDashboard;
