//const puppeteer = require('puppeteer');
const Discord = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');

// Declare and initialize lastMessage
let lastMessage = '';

// Crea un nuevo cliente de Discord
const discordClient = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages
    ]
})

// Cuando el cliente de Discord esté listo, imprime un mensaje
discordClient.once('ready', () => {
    console.log('Discord bot is ready!');
});

// Inicia sesión en Discord con el token de tu bot
discordClient.login(process.env.BOT_TOKEN);



// Remove the duplicate declaration of 'lastMessage'
lastMessage = '';

setInterval(async () => {
    try {
        const response = await axios.get(`https://www.twitch.tv/popout/${process.env.TWITCH_USER}/chat`);
        const $ = cheerio.load(response.data);
        const message = $('.chat-line__message').last().text();

        if (message !== lastMessage) {
            const discordChannel = discordClient.channels.cache.get(process.env.DISCORD_CLIENT_ID);
            discordChannel.send(message);
            lastMessage = message;
        }
    } catch (error) {
        console.error(error);
    }
}, 1000);