const fs = require('fs');
const ascii = require('ascii-table');

async function loadCommands(client) {
    const table = new ascii().setHeading("Comandos", "Estado");

    // Limpiar comandos existentes
    await client.commands.clear();

    let commandsArray = [];
    const commandFolder = fs.readdirSync('./Commands');

    for (const folder of commandFolder) {
        const commandFiles = fs.readdirSync(`./Commands/${folder}`).filter((file) => file.endsWith(".js"));

        for (const file of commandFiles) {
            const commandFile = require(`../Commands/${folder}/${file}`);

            const properties = {
                folder,
                ...commandFile
            };

            // Asegúrate de que commandFile.data exista y tenga una propiedad 'name'
            if (commandFile.data && commandFile.data.name) {
                client.commands.set(commandFile.data.name, properties);
                commandsArray.push(commandFile.data.toJSON());
                table.addRow(file, 'Cargado');
            } else {
                console.error(`Error al cargar el comando en el archivo ${file}. Asegúrate de que 'data' y 'name' estén definidos correctamente.`);
            }
        }
    }

    await client.application.commands.set(commandsArray);
    console.log("\n" + table.toString() + "\nComandos cargados.");
}

module.exports = {
    loadCommands
};
