const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require(`discord.js`);
const Character = require('../../Models/Character.js');
global.fichaEmbeds = {};


      module.exports = {
        data: new SlashCommandBuilder()
        .setName('ficha')
        .setDescription('Consulta la ficha de un personaje')
        .addStringOption(option =>
            option.setName('nombre')
                .setDescription('El nombre del personaje')
                .setRequired(false)
        ),

        async execute(interaction) {
            
        ///////////////////////////////////// PROCESO DE BUSQUEDA DE PERSONAJE /////////////////////////////////////
        const name = interaction.options.getString('nombre');
        const userID = name ? null : interaction.user.id;
        const character = await Character.findOne({ $or: [{ userID }, { name }] });
        if (!character) {
            return interaction.reply({ content: 'No se encontró el personaje.', ephemeral: true });
        }


        ///////////////////////////////////// CREACIÓN DEL MENÚ /////////////////////////////////////
          const cmp = new ActionRowBuilder()
          .addComponents(
            new StringSelectMenuBuilder()
            .setCustomId("Menu")
            .setPlaceholder("Selecciona una opción") 
            .addOptions([
              {
                label: "Información General",
                description: "Muestra información general del personaje.",
                value: "uno",
                emoji: "🏡",
              },
              {
                label: "Habilidades",
                description: "Muestra las habilidades del personaje.",
                value: "dos",
                emoji: "🛠️",
              },
              {
                label: "Estadisticas",
                description: "Muestra las estadisticas del personje.",
                value: "tres",
                emoji: "🔨",
              },
              {
                label: "Trasfondo",
                description: "Muestra las más datos del personje.",
                value: "cuatro",
                emoji: "❤️",
              },
            ])
          );


          ///////////////////////////////////// CREACIÓN DE LOS EMBEDS /////////////////////////////////////
          const embed = new EmbedBuilder()
            .setTitle('Ficha de personaje')
            .setDescription(`**Nombre: **${character.name}\n**Edad:** ${character.age} años\n**Raza: **${character.race}\n**Dios: **${character.god}\n**País: **${character.nation}\n\n`)
            .setColor(16777215)
            .setThumbnail(character.image)
            .addFields(
                { name: 'Frase:', value: `*${character.phrase}*`},
                { name: '‎ ', value: `🗡️ **Clase:** ${character.class}\n⭐ **Nivel:** ${character.level}\n⚡ **Exp:** ${character.experience}` },
                { name: 'ㅤㅤㅤㅤㅤㅤㅤㅤ', value: '🌟: 0 \n💠: 0 \n☘️: 0', inline: true },
                { name: 'ㅤ', value: '♥️: 0 \n♠️: 0 \n♦️: 0', inline: true }
            );

      
          let mensaje = await interaction.reply({embeds: [embed], components: [cmp]});

          const embed1 = new EmbedBuilder()
          .setTitle (`Habilidades de ${character.name}`)
          .setDescription ('**Sub Clase: **[Requiere Nivel 05] \n**Sub Clase:** [Requiere Nivel 10] \n**Sub Clase:** [Requiere Nivel 20] \n\n')
          .setColor(16777215)
          .setThumbnail(character.image)
          .addFields (
              {name: 'Indiferencia carismática', value: '**Nivel:** 1\nE: ', inline: true},
              {name: 'Psique inhumana', value: '**Nivel:** 1\nE: ', inline: true},
              {name: 'Sentidos aumentados', value: '**Nivel:** 1\nE: ', inline: true},
              {name: 'Nombre de habilidad', value: '**Nivel:** 1\nE: ', inline: true},
              {name: 'Nombre de habilidad', value: '**Nivel:** 1\nE: ', inline: true},
              {name: 'Nombre de habilidad', value: '**Nivel:** 1\nE: ', inline: true},
          );
      
          const embed2 = new EmbedBuilder()
          .setTitle (`Estadisticas de ${character.name}`)
          .setColor(16777215)
          .setThumbnail(character.image)
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
          .setTitle (`Trasfondo de ${character.name}`)
          .setColor(16777215)
          .setThumbnail(character.image)
          .addFields (
              {name: '💼 **Profesiones:** ', value: '(profesión del personaje)', inline: true},
              {name: '💍 **Matrimonios:**', value: '(Otros personajes con los cuales se encuentre casados)', inline: true},
              {name: 'Historia', value: `${character.background}`},
          );

          global.fichaEmbeds[interaction.user.id] = [embed, embed1, embed2, embed3];
  },
};