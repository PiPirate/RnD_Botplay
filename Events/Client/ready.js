const {Client} = require ("discord.js");
const mongoose = require ("mongoose");
const config = require ('../../config.json');
require('colors');

module.exports = {
    name: "ready",
    once: true,
    
    /**
     * 
     * @param {Client} client 
     */
    async execute (client) {

        mongoose.set('strictQuery', true);
        await mongoose.connect(config.database_url, {
            keepAlive: true,
        }).then ((result) => {
            console.log('[MongoDB] está conectado correctamente'.green);

        }).catch ((err) => {
            console.log(`No se pudo conectar con la base de datos: ${err}`.red);
        });
        
        console.log (`El bot ${client.user.username} está online.`);
        
    },
};