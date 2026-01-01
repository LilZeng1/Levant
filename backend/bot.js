// DiscordJS
const { Client, GatewayIntentBits } = require("discord.js");

// Client
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

client.login(process.env.BOT_TOKEN);

module.exports = client;
