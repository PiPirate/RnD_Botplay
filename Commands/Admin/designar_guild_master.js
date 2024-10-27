const { SlashCommandBuilder } = require('@discordjs/builders');
const Guild = require('../../Models/Guild.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('designar_guild_master')
        .setDescription('Designa el rol de los Guild Masters, quienes podrán usar comandos especificos.')
        .addRoleOption(option =>
            option.setName('rol')
                .setDescription('El rol a designar como Guild Master')
                .setRequired(true)
        ),
    async execute(interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({ content: 'Solo un administrador puede usar este comando.', ephemeral: true });
        }

        const role = interaction.options.getRole('rol');

        const guild = await Guild.findOne({ guildID: interaction.guild.id });
        if (guild) {
            guild.guildMasterRoleID = role.id;
            await guild.save();
        } else {
            await Guild.create({ guildID: interaction.guild.id, guildMasterRoleID: role.id });
        }

        return interaction.reply({ content: `El rol ${role.name} ha sido designado como Guild Master.`, ephemeral: true });
    },
};
