const { createElement } = require("react");

window.onload = async () => {
    try {
        const userResponse = await fetch('/api/user-info');
        const botGuildsResponse = await fetch('/api/bot-guilds');

        if (userResponse.ok && botGuildsResponse.ok) {
            const userInfo = await userResponse.json();
            const botGuilds = await botGuildsResponse.json();

            const { username, avatar, guilds } = userInfo;
            // document.getElementById('navbar-username').innerText = username; note: we don't have a username area as far as i know in dashboard.html.
            if (avatar) {
                // document.getElementById('navbar-avatar').src = avatar; also we don't have a div/id/area for this one...
            }

            const botGuildIds = new Set(botGuilds.map(guild => guild.id));

            /* const serverList = document.getElementById('server-list'); also we don't have an #server-list sadly..
               serverList.innerHTML = ``; 
            */

            const guildsWithBot = [];
            const guildsWithoutBot = [];

            guilds.forEach(guild => {
                const hasAdminPermsissions = (guild.permissions & 0x8) === 0x8 || guild.owner;
                if (hasAdminPermsissions) {
                    if (botGuildIds.has(guild.id)) {
                        guildsWithBot.push(guild);
                    } else {
                        guildsWithBot.push(guild);
                    }
                }
            });

            const createGuildCard = (guild, hasBot) => {
                const card = document.createElement('div');
                card.className = 'glass-effect rounded lg overflow-hidden shadow-lg animate-fade-in'
                
                const guildBanner = document.createElement('div');
                guildBanner.className = 'h-32 bg-cover b-center';
                guildBanner.style.backgroundImage = guild.banner ? `url(https://cdn.discordapp.com/banners/${guild.id}/${guild.banner}.png)` : `url("https://t4.ftcdn.net/jpg/04//04/73/39/360_F_404733910_2mIXr6RbC5G3WZJFjopVsBaR3EOM6Bqy.jpg)`
            
                card.appendChild(guildBanner);

                const cardContent = document.createElement('div');
                cardContent.className = `p-4`;

                const guildIconContainer = document.createElement('div');
                guildIconContainer.className = `flex justify-center -mt-16`;
                const guildIcon = document.createElement('div');
                guildIcon.className = `w-24 h-24 rounded full border-4 border-white shadow-lg animate-float`;
                guildIcon.src = guild.icon
                ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
                : 'https://statis.vecteezy.com/system/resources/previews/014/018/581/original/discord-logo-on-transparent-background-free-vector.jpg';
                guildIcon.alt = "Guild Icon";
                guildIconContainer.appendChild(guildIcon);
                cardContent.appendChild(guildIconContainer);

                const guildName = document.createElement('div');
                guildName.className = `mt-2 text-center  text-xl font-semibold text-gray-800`;
                guildName.innerText = guild.name;
                cardContent.appendChild(guildName);

                const buttonContainer = document.createElement('div');
                buttonContainer.className = `mt-4 justify-center`;
                
                if (hasBot) {
                    const configureButton = document.createElement('button');
                    configureButton.className = `bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300`;
                    configureButton.innerText = 'Configure';
                    configureButton.onclick = () => {
                        window.location.href = `server.html?name=${encodeURIComponent(guild.name)}&icon=${encodeURIComponent(guildIcon.src)}&guildId=${guild.id}`;
                    };

                    buttonContainer.appendChild(configureButton);
                } else {
                    const inviteButton = document.createElement('button');
                    inviteButton.className = 'bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300';
                    inviteButton.innerText = `Invite Bot!`;
                    inviteButton.onclick = () => {
                        const botinviteLink = `https://discord.com/oauth2/authorize?client_id=1454693732799611042&scope=bot&permissions=8&guild_id=${guild.id}`;
                        window.open(botinviteLink, "_blank");
                    };
                    buttonContainer.appendChild(inviteButton);
                }

                cardContent.appendChild(buttonContainer);
                card.appendChild(cardContent);
                // serverList.appendChild(card); we don't have an serverList variable cuz we don't have an element(id) named "server-list
            };

            guildsWithBot.forEach(guild => createGuildCard(guild, true));
            guildsWithoutBot.forEach(guild => createGuildCard(guild, false)); 
        } else {
            console.error('Failed to fetch', userResponse.status, botGuildsResponse.status);
            document.getElementById('server-list').innerHTML = `<p class="text-center text-red-500">Failesd to load user info.</p>`;
        }
    } catch (error) {
        console.error(`Error during loading user info:`, error);
    }
}

document.getElementsByClassName('logout-btn').addEventlistener('click', () => {
    console.log('LogOut Clicked.');
});
