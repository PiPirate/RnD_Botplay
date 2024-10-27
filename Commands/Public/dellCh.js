const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('@discordjs/builders');
const Character = require('../../Models/Character.js');


module.exports = {
    data: 
    new SlashCommandBuilder()
        .setName('eliminar_personaje')
        .setDescription('Elimina un personaje existente'),

    async execute(interaction) {
        const characters = await Character.find({ userID: interaction.user.id });

        if (!characters.length) {
            return interaction.reply({ content: 'No tienes personajes registrados.', ephemeral: true });
        }

        const characterNames = characters.map(character => character.name);
        const selectMenu = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('character_select')
                    .setPlaceholder('Selecciona un personaje para eliminar')
                    .addOptions(characterNames.map(name => ({ label: name, value: name })))
            );

        await interaction.reply({ content: 'Por favor, selecciona el personaje que deseas eliminar:', components: [selectMenu], ephemeral: true });

    },
};

