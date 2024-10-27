const { Client, GatewayIntentBits, Partials, Collection } = require ("discord.js");
const config = require ('./config.json');
const {loadEvents} = require ('./Functions/loadEvents');
const {loadCommands} = require ('./Functions/loadCommands');


//creacion del cliente
const client = new Client({
    intents:[Object.keys(GatewayIntentBits)],
    partials:[Object.keys(Partials)]
});

//creacion de comandos y eventos
client.commands = new Collection();
client.events = new Collection();
client.setMaxListeners(0);


// Comprobación de token y encendido
client.login(config.token).then(async () => {
    await loadEvents (client);
    await loadCommands (client);
}).catch((err) => {
    console.log(err);
});
