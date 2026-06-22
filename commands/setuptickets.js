const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { Colors, successEmbed, errorEmbed } = require('../utils/embeds');
const config = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setuptickets')
    .setDescription('Set up the ticket creation interface')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    if (!config.ticketChannelId) {
      return interaction.reply({ 
        embeds: [errorEmbed(interaction, 'Error', 'Please set a ticket channel first with /setticketchannel!')],
        ephemeral: true 
      });
    }

    const channel = interaction.guild.channels.cache.get(config.ticketChannelId);
    if (!channel) {
      return interaction.reply({ 
        embeds: [errorEmbed(interaction, 'Error', 'Ticket channel not found!')],
        ephemeral: true 
      });
    }

    // Create the ticket panel embed
    const ticketEmbed = new EmbedBuilder()
      .setColor(Colors.PRIMARY)
      .setTitle('🎫 Create a Support Ticket')
      .setDescription('Click the button below to create a new support ticket!\n\nOur staff team will assist you as soon as possible.')
      .setFooter({ 
        text: 'Limaris Studios Support', 
        iconURL: interaction.guild.iconURL({ dynamic: true }) 
      });

    // Create the button
    const buttonRow = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('create_ticket')
          .setLabel('Create Ticket')
          .setEmoji('🎫')
          .setStyle(ButtonStyle.Primary)
      );

    // Send the ticket panel
    await channel.send({ embeds: [ticketEmbed], components: [buttonRow] });
    
    await interaction.reply({ 
      embeds: [successEmbed(interaction, 'Ticket System Setup', 'Ticket interface has been created successfully!')],
      ephemeral: true 
    });
  },
};
