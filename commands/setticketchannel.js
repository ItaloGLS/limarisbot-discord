const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { successEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setticketchannel')
    .setDescription('Set the channel where tickets can be created')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Channel for ticket creation interface')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const configPath = path.join(__dirname, '../config.json');
    const config = require(configPath);
    
    config.ticketChannelId = channel.id;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    
    await interaction.reply({ 
      embeds: [successEmbed(interaction, 'Ticket Channel Set', `Ticket interface will be created in ${channel}!`)],
      ephemeral: true
    });
  },
};
