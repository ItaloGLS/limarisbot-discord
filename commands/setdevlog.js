
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setdevlog')
    .setDescription('Define o canal de devlogs')
    .addChannelOption(option =>
      option.setName('canal')
        .setDescription('Canal para enviar devlogs')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const channel = interaction.options.getChannel('canal');
    const configPath = path.join(__dirname, '../config.json');
    const config = require(configPath);
    config.devlogChannelId = channel.id;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    await interaction.reply(`Canal de devlogs definido para ${channel}!`);
  },
};
