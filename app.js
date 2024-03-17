const puppeteer = require('puppeteer');
const Discord = require('discord.js');



console.log(`Canal de twitch introducido correctamente: ${twitchUser}`);

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

(async () => {
    // Inicia Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navega a la página del chat de Twitch
    await page.goto(`https://www.twitch.tv/popout/${process.env.TWITCH_USER}/chat`);

    // Espera a que se cargue el chat
    await page.waitForSelector('.chat-line__message');

    // Almacena el último mensaje para comparar
    let lastMessage = '';

    setInterval(async () => {
        // Obtiene el último mensaje del chat
        let message = await page.evaluate(() => {
            let elements = Array.from(document.querySelectorAll('.chat-line__message'));
            let lastElement = elements[elements.length - 1];
            return lastElement.innerText;
        });

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
})();