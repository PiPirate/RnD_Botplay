const {Client, ButtonBuilder, StringSelectMenuBuilder, EmbedBuilder, ChatInputCommandInteraction, ActionRowBuilder} = require("discord.js");
const { embed_principal, embed1, embed2, embed3 } = require('../../Commands/Public/ficha.js');
const cooldown = new Set();
const Character = require('../../Models/Character.js');
const Request = require ('../../Models/Request.js');

module.exports = {
    name: "interactionCreate",
    once: false,

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {

        ///////////////////////////////////// PROCESO DE COMANDOS BASICOS /////////////////////////////////////
        if (!interaction.guild || !interaction.channel) return;
        if (interaction.isChatInputCommand()) 
        {
            const command = client.commands.get(interaction.commandName);
            const cooldowns = await command.Cooldown;

            if (command) 
            {
                if (!command) return interaction.reply({
                    content: `Comando invalido`,
                    ephemeral: true
                });

                if (command.Cooldown && cooldown.has(interaction.user.id)) return interaction.reply({
                    content: `Este comando tiene un tiempo de espera de ${cooldowns/1000} segundos para usarse`,
                    ephemeral: true 
                })

                cooldown.add(interaction.user.id);

                try 
                {
                    setTimeout(() => {
                        cooldown.delete(interaction.user.id)
                    }, cooldowns);

                    command.execute(interaction, client)

                } catch (error) 
                {
                    return interaction.reply({
                        content: `Ha ocurrido un error al ejecutar este comando`,
                        ephemeral: true
                        })
                }
            }  
        } 
        

        ///////////////////////////////////// PROCESO DE SOLICITUDES DE FICHA /////////////////////////////////////

        if (interaction.isStringSelectMenu()) {
                if (interaction.customId === 'solicitudes_ficha_menu') {
                    // Obtener la solicitud seleccionada
                    const requestId = interaction.values[0];
                    const request = await Request.findById(requestId);
                    if (!request) {
                        return interaction.reply({ content: 'No se encontró la solicitud.', ephemeral: true });
                    }

                    const name = interaction.options && interaction.options.getString('nombre');
                    const userID = name ? null : interaction.user.id;
                    const character = await Character.findOne({ $or: [{ userID }, { name }] })
        

        // Crear el embed con la información de la solicitud
          const embed = new EmbedBuilder()
          .setTitle('Ficha de personaje')
          .setDescription(`**Nombre: **${request.name}\n**Edad:** ${request.age} años\n**Raza: **${request.race}\n**Dios: **${request.god}\n**País: **${request.nation}\n\n`)
          .setColor(16777215)
          .setThumbnail(request.image)
          .addFields(
              { name: 'Frase:', value: `*${request.phrase}*`},
              { name: '‎ ', value: `🗡️ **Clase:** ${request.class}\n⭐ **Nivel:** ${request.level}\n⚡ **Exp:** ${request.experience}` },
              { name: 'ㅤㅤㅤㅤㅤㅤㅤㅤ', value: '🌟: 0 \n💠: 0 \n☘️: 0', inline: true },
              { name: 'ㅤ', value: '♥️: 0 \n♠️: 0 \n♦️: 0', inline: true }
          );

          const embed1 = new EmbedBuilder()
          .setTitle (`Habilidades de ${request.name}`)
          .setDescription ('**Sub Clase: **[Requiere Nivel 05] \n**Sub Clase:** [Requiere Nivel 10] \n**Sub Clase:** [Requiere Nivel 20] \n\n')
          .setColor(16777215)
          .setThumbnail(request.image)
          .addFields (
              {name: 'Indiferencia carismática', value: '**Nivel:** 1\nE: ', inline: true},
              {name: 'Psique inhumana', value: '**Nivel:** 1\nE: ', inline: true},
              {name: 'Sentidos aumentados', value: '**Nivel:** 1\nE: ', inline: true},
              {name: 'Nombre de habilidad', value: '**Nivel:** 1\nE: ', inline: true},
              {name: 'Nombre de habilidad', value: '**Nivel:** 1\nE: ', inline: true},
              {name: 'Nombre de habilidad', value: '**Nivel:** 1\nE: ', inline: true},
          );
      
          const embed2 = new EmbedBuilder()
          .setTitle (`Estadisticas de ${request.name}`)
          .setColor(16777215)
          .setThumbnail(request.image)
          .addFields (
              {name: 'Daño', value: '0', inline: true},
              {name: 'Vitalidad', value: '0', inline: true},
              {name: 'Defensa', value: '0', inline: true},
              {name: 'Energía', value: '0', inline: true},
              {name: 'Recuperación', value: '0', inline: true},
              {name: 'Resistencia', value: '0', inline: true},
              {name: 'Velocidad', value: '0', inline: true},
              {name: 'Carisma', value: '0', inline: true},
              {name: 'Inteligencia', value: '0', inline: true},
              {name: 'Destreza', value: '0', inline: true},
              {name: 'Sabiduría', value: '0', inline: true},
              {name: 'Maná', value: '0', inline: true},
              {name: 'Espíritu', value: '0', inline: true},
              {name: 'Percepción', value: '0', inline: true},
              {name: 'Suerte', value: '0', inline: true},
          );

      
          const embed3 = new EmbedBuilder()
          .setTitle (`Trasfondo de ${request.name}`)
          .setColor(16777215)
          .setThumbnail(request.image)
          .addFields (
              {name: '💼 **Profesiones:** ', value: '(profesión del personaje)', inline: true},
              {name: '💍 **Matrimonios:**', value: '(Otros personajes con los cuales se encuentre casados)', inline: true},
              {name: 'Historia', value: '(Historia del personaje)'},
          );
      
                    // Crear los botones para aceptar o rechazar la solicitud
                    const acceptButton = new ButtonBuilder()
                        .setCustomId('accept_request_' + requestId) // Asegúrate de que cada botón tenga un custom_id único
                        .setLabel('Aceptar')
                        .setStyle('Success');
                    const rejectButton = new ButtonBuilder()
                        .setCustomId('reject_request_' + requestId) // Asegúrate de que cada botón tenga un custom_id único
                        .setLabel('Rechazar')
                        .setStyle('Danger');

                    const solicitud_row = new ActionRowBuilder()
                        .addComponents(acceptButton, rejectButton);
        
                    return interaction.reply({ embeds: [ embed, embed1, embed2, embed3 ], components: [solicitud_row], ephemeral: true });
                }

            } else if (interaction.isButton()) {
                if (interaction.customId.startsWith('accept_request_')) {
                    // Obtener el ID de la solicitud
                    const requestId = interaction.customId.slice('accept_request_'.length);

                    // Buscar la solicitud en la base de datos
                    const request = await Request.findById(requestId);
                    if (!request) {
                        return interaction.reply({ content: 'No se encontró la solicitud.', ephemeral: true });
                    }

                    // Crear un nuevo Character con la información de la solicitud
                    const character = new Character(request.toObject());
                    await character.save();

                    // Eliminar la solicitud
                    await request.remove();

                    return interaction.reply({ content: 'La solicitud ha sido aceptada y el personaje ha sido creado.', ephemeral: true });
                    
                } else if (interaction.customId.startsWith('reject_request_')) {
                    // Obtener el ID de la solicitud
                    const requestId = interaction.customId.slice('reject_request_'.length);

                    // Buscar la solicitud en la base de datos
                    const request = await Request.findById(requestId);
                    if (!request) {
                        return interaction.reply({ content: 'No se encontró la solicitud.', ephemeral: true });
                    }

                    // Eliminar la solicitud
                    await request.remove();

                    return interaction.reply({ content: 'La solicitud ha sido rechazada y el personaje no ha sido creado.', ephemeral: true });

                    } 
                }
                
                ///////////////////////////////////// INTERACTION PARA MENU DE FICHA /////////////////////////////////////

    if (!interaction.isStringSelectMenu()) return;

    if (interaction.customId === 'Menu') {
        //obtiene las opciones a interactuar
        let selected = interaction.values[0];
        // Obtiene los embeds del objeto global
        let embeds = global.fichaEmbeds[interaction.user.id];

        //si quien interactua no es quien ejecuto el comando, no lo deja accionar
        if (interaction.user.id !== interaction.message.interaction.user.id) {
            return interaction.reply({ content: 'No puedes interactuar con este menú.', ephemeral: true });
        }
        

        switch (selected) {
            case 'uno':
                await interaction.update({embeds: [embeds[0]]});
                break;
            case 'dos':
                await interaction.update({embeds: [embeds[1]]});
                break;
            case 'tres':
                await interaction.update({embeds: [embeds[2]]});
                break;
            case 'cuatro':
                await interaction.update({embeds: [embeds[3]]});
                break;
        }
    }

    ///////////////////////////////////// INTERACTION PARA COMANDO DE ELIMINACION DE FICHAS /////////////////////////////////////

        if (!interaction.isStringSelectMenu()) return;
        if (!interaction.isButton()) return;
    
        if (interaction.customId === 'character_select') {
            const characterName = interaction.values[0];

            
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('confirm_delete')
                        .setLabel('Confirmar')
                        .setStyle('Danger'),
                    new ButtonBuilder()
                        .setCustomId('cancel_delete')
                        .setLabel('Cancelar')
                        .setStyle('Secondary')
                );

            await interaction.update({ content: `¿Estás seguro de que quieres eliminar el personaje ${characterName}?`, components: [row] });

        } else if (interaction.isButton()) {
            if (interaction.customId === 'confirm_delete') {
                const characterName = interaction.message.content.split(' ')[6];
                await Character.deleteOne({ userID: interaction.user.id, name: characterName });
                await interaction.update({ content: `El personaje ${characterName} ha sido eliminado.`, components: [] });
            } else if (interaction.customId === 'cancel_delete') {
                await interaction.update({ content: 'No se llevó a cabo la eliminación.', components: [] });
            }
        }

    }
}


