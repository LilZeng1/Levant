// DiscordJS
const { Client, GatewayIntentBits, EmbedBuilder, Events, Partials } = require("discord.js");
const mongoose = require("mongoose");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildPresences
    ], partials: [ 
        Partials.Message, 
        Partials.GuildMessageReactions, 
        Partials.Channel, 
        Partials.MessageReactionAdd, 
        Partials.MessageReactionRemove,
        Partials.Reaction ]
})

// Express App()
const express = require("express");
const axios = require("axios");
const session = require("express-session");
require("dotenv").config();

// Route
const { Routes } = require("discord-api-types/v10");
const { REST } = require("@discordjs/rest");
const bodyParser = require("body-parser");
const url = require("url");
const port = 1500;

// Defining App()
const app = express();
const rest = new REST({
    version: '10'
}).setToken(process.env.token)

// App()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'IrJFEt7tBBH3Y7IWeyyQfSk2dRsypPQL',
    resave: false,
    saveUninitialized: true
}));

app.use('/', express.static('dashboard.html/html'));
app.use('/', express.static('dashboard.js/js'));
app.use('/', express.static('dashboard.css/css'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "html/index.html" )
});

mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log(`MongoDB Connected`))
    .catch(err => console.error(`MongoDB conncection error`, err));

// Start Server
app.listen(port, () => {
    console.log(`Running on: http://localhost${port}`);
});

app.get('/api/auth/discord/redirect', async (req, res) => {
    const { code } = req.query;

    if (code) {
        const formData = new url.URLSearchParams({
            client_id: process.env.ClientID,
            client_secret: process.env.ClientSecret,
            grant_type: 'authorization_code',
            code: code.toString(),
            redirect_uri: "https://lilzeng1.github.io/Levant/html/dashboard.html/api/auth/discord/redirect",
        });

        try {
            const output = await axios.post('https://discord.com/api/v10/oauth2/token',
                formData.toString(), {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            if (output.data) {
                const access = output.data.access_token;
                const userinfo = await axios.get('https://discord.com/api/v10/users/@me', {
                    headers: {
                        'Authorization': `Bearer ${access}`,
                    },
                });

                const guilds = await axios.get('https://discord.com/api/v10/users/@me/guilds', {
                    headers: {
                        'Authorization': `Bearer ${access}`,
                    },
                });

                const avatarUrl = `https://cdn.discordapp.com/avatars/${userinfo.data.id}/${userinfo.data.avatar}.png`;
                req.session.user = {
                    username: userinfo.data.username,
                    avatar: avatarUrl,
                    guilds: guilds.data
                };

                res.redirect('/dashboard.html')

            }


        } catch (error) {
            console.error('Error durinf OAuth2 token exchange', error);
            res.status(500).send('Authentication Failed!');
        }
    } else {
        res.status(400).send("No codep provided.");
    }
})


app.get('/api/user-info', (req, res) => {
    if (req.session.user) {
        res.json(req.session.user);
    } else {
        res.status(400).send(`Unauthorized`);
    }
});

app.get('/api/bot-guilds/', async (req, res) => {
    try {
        const botGuilds = await rest.get(Routes.userGuilds());
        res.json(botGuilds);
    } catch (error) {
        console.error(`Error fetching the bot guilds.`, error);
        res.status(500).send(`Internal Server Error`);
    }
})

client.login(process.env.token);
