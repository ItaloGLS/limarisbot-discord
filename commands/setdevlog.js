const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { successEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setdevlog')
    .setDescription('Set the devlog channel')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Channel to send devlogs')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const configPath = path.join(__dirname, '../config.json');
    const config = require(configPath);
    
    config.devlogChannelId = channel.id;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    
    await interaction.reply({ 
      embeds: [successEmbed(interaction, 'Devlog Channel Set', `Devlogs will now be sent to ${channel}!`)] 
    });
  },
};
