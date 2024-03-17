const puppeteer = require('puppeteer');
const Discord = require('discord.js');



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
const axios = require('axios');
const cheerio = require('cheerio');

setInterval(async () => {
    // Hace una solicitud HTTP a la página del chat de Twitch
    const response = await axios.get(`https://www.twitch.tv/popout/${process.env.TWITCH_USER}/chat`);

    // Analiza el HTML devuelto
    const $ = cheerio.load(response.data);

    // Obtiene el último mensaje del chat
    let message = $('.chat-line__message').last().text();

    // Si el mensaje es nuevo
    if (message !== lastMessage) {
        // Encuentra el canal de Discord
        const discordChannel = discordClient.channels.cache.get(process.env.DISCORD_CLIENT_ID);

        // Envia el mensaje al canal de Discord
        discordChannel.send(message);

        // Actualiza el último mensaje
        lastMessage = message;
    }
}, 1000); // Comprueba cada segundo