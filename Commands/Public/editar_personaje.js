const { SlashCommandBuilder } = require('@discordjs/builders');
const Character = require('../../Models/Character.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('editar_personaje')
        .setDescription('Edita un personaje existente')
        
        .addStringOption(option =>
            option.setName('nombre')
                .setDescription('El nombre del personaje')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('edad')
                .setDescription('La nueva edad del personaje')
        )
        .addStringOption(option =>
            option.setName('historia')
                .setDescription('La nueva historia del personaje')
        )
        .addStringOption(option =>
            option.setName('imagen')
                .setDescription('La nueva imagen del personaje')
        )
        .addIntegerOption(option =>
            option.setName('nivel')
                .setDescription('El nuevo nivel del personaje')
        )
        .addIntegerOption(option =>
            option.setName('experiencia')
                .setDescription('La nueva experiencia del personaje')
        )
        .addStringOption(option =>
            option.setName('frase')
                .setDescription('La nueva frase del personaje')
        ),

    async execute(interaction) {
        const characterName = interaction.options.getString('nombre');
        const character = await Character.findOne({ name: characterName, userID: interaction.user.id });

        if (!character) {
            return interaction.reply({ content: `No se encontró ningún personaje con el nombre ${characterName} que pertenezca a ti.`, ephemeral: true });
        }

        const updatedData = {
            age: interaction.options.getInteger('edad') || character.age,
            background: interaction.options.getString('historia') || character.background,
            image: interaction.options.getString('imagen') || character.image,
            level: interaction.options.getInteger('nivel') || character.level,
            experience: interaction.options.getInteger('experiencia') || character.experience,
            phrase: interaction.options.getString('frase') || character.phrase
        };

        await Character.updateOne({ name: characterName, userID: interaction.user.id }, updatedData);

        return interaction.reply({ content: `El personaje ${characterName} ha sido actualizado.`, ephemeral: true });
    },
};
