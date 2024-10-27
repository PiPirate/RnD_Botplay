const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('@discordjs/builders');
const Request = require('../../Models/Request.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('solicitud_fichas')
        .setDescription('Consulta las solicitudes de ficha de personaje'),

    async execute(interaction) {

        ///////////////////////////////////// SISTEMA DE VISUALIZACIÓN DE LAS SOLICITUDES ///////////////////////////////////////

        // Obtener todas las solicitudes pendientes
        const requests = await Request.find({ status: 'pendiente' });
        if (requests.length === 0) {
            return interaction.reply({ content: 'No hay solicitudes pendientes.', ephemeral: true });
        }

        // Crear las opciones del menú select
        const options = requests.map(request => ({label: request.name, value: request._id.toString()}));

        // Crear el menú select
        const solicitud_menu = new StringSelectMenuBuilder()
            .setCustomId('solicitudes_ficha_menu')
            .setPlaceholder('Selecciona una solicitud')
            .addOptions(options);

        // Crear el ActionRow
        const row_menu = new ActionRowBuilder()
            .addComponents(solicitud_menu);

        return interaction.reply({ content: 'Aquí están las solicitudes pendientes:', components: [row_menu], ephemeral: true });
        
    },
};
