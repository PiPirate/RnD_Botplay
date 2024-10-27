const Discord = require ("discord.js");
const { SlashCommandBuilder, EmbedBuilder, Client, ChatInputCommandInteraction } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('random')
        .setDescription('Genera un número aleatorio del 1 al 10'),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */

    async execute(interaction, client) {
        const randomNumber = Math.floor(Math.random() * 10) + 1;
        await interaction.reply(`Número aleatorio: ${randomNumber}`);
    },
};