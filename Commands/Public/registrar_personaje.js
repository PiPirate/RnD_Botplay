const { SlashCommandBuilder } = require('@discordjs/builders');
const Request = require('../../Models/Request.js');
const Character = require('../../Models/Character.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('registrar_personaje')
        .setDescription('Registra un nuevo personaje')

        .addStringOption(option =>
            option.setName('nombre')
                .setDescription('El nombre del personaje')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('edad')
                .setDescription('La edad del personaje')
        )
        .addStringOption(option =>
            option.setName('raza')
                .setDescription('La raza del personaje')
        )
        .addStringOption(option =>
            option.setName('clase')
                .setDescription('La clase del personaje')
        )
        .addStringOption(option =>
            option.setName('dios')
                .setDescription('El dios al que venera el personaje.')
        )
        .addStringOption(option =>
            option.setName('nacion')
                .setDescription('Lugar de donde proviene tu personaje.')
        )
        .addStringOption(option =>
            option.setName('historia')
                .setDescription('La historia del personaje')
        )
        .addStringOption(option =>
            option.setName('imagen')
                .setDescription('La imagen del personaje')
        )
        .addIntegerOption(option =>
            option.setName('nivel')
                .setDescription('El nivel del personaje')
        )
        .addIntegerOption(option =>
            option.setName('experiencia')
                .setDescription('La experiencia del personaje')
        )
        .addStringOption(option =>
            option.setName('frase')
                .setDescription('La frase del personaje')
        ),


    async execute(interaction) {

        const characterName = interaction.options.getString('nombre');
        const existingCharacter = await Character.findOne({ name: { $regex: new RegExp('^' + characterName + '$', 'i') } });

        if (existingCharacter) {
            return await interaction.reply({ content: `El personaje ${characterName} ya existe. Por favor, elige otro nombre.`, ephemeral: true });
        }


        const requests = await Request.find({ userID: interaction.user.id });
        const characters = await Character.find({ userID: interaction.user.id });

        if (requests.length + characters.length >= 2) {
            return interaction.reply({ content: 'Ya has registrado o enviado dos personajes a revisión. No puedes registrar más.', ephemeral: true });
        }

        const request = new Request({
            userID: interaction.user.id,
            name: interaction.options.getString('nombre'),
            age: interaction.options.getInteger('edad'),
            race: interaction.options.getString('raza'),
            class: interaction.options.getString('clase'),
            god: interaction.options.getString('dios'),
            background: interaction.options.getString('historia'),
            image: interaction.options.getString('imagen'),
            level: interaction.options.getInteger('nivel'),
            experience: interaction.options.getInteger('experiencia'),
            phrase: interaction.options.getString('frase'),
            nation: interaction.options.getString('nacion'),
            status: 'pendiente'
        });
        await request.save();
        return interaction.reply({ content: 'Tu solicitud de registro de personaje ha sido enviada y está pendiente de revisión.', ephemeral: true });
    },
};
