const fs = require('fs');
const ascii = require('ascii-table');

async function loadEvents(client) {
    const table = new ascii().setHeading("Eventos", "Estado");

    // Limpiar eventos existentes
    client.events.clear();

    const eventFolder = fs.readdirSync('./Events');

    for (const folder of eventFolder) {
        const files = fs.readdirSync(`./Events/${folder}`).filter((file) => file.endsWith(".js"));


        for (const file of files) {
            const event = require(`../Events/${folder}/${file}`);

            if (event.rest) {
                if (event.once) client.rest.once(event.name, (...args) => event.execute(...args, client));
                else client.rest.on(event.name, (...args) => event.execute(...args, client));
            } else {
                if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
                else client.on(event.name, (...args) => event.execute(...args, client));
            }

            table.addRow(file, "Cargado.");
        }
    }

    console.log(table.toString(), "\nEventos cargados.");
}

module.exports = {
    loadEvents
};
