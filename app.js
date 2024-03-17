//const puppeteer = require('puppeteer');
const Discord = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');

// Declare and initialize lastMessage

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
let lastMessage = '';

setInterval(async () => {
    try {
        const response = await axios.get(`https://www.twitch.tv/popout/${process.env.TWITCH_USER}/chat`);
        const $ = cheerio.load(response.data);
        const message = $('.chat-line__message').last().text();
        console.log(message);

        if (!process.env.DISCORD_CLIENT_ID) {
            throw new Error('DISCORD_CLIENT_ID is not set');
        }

        if (!process.env.TWITCH_USER) {
            throw new Error('TWITCH_USER is not set');
        }

        if (message !== lastMessage) {
            const discordChannel = discordClient.channels.cache.get(process.env.DISCORD_CLIENT_ID);
            if (!discordChannel) {
                throw new Error('Discord channel not found');
            }
            discordChannel.send(message);
            lastMessage = message;
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}, 1000);