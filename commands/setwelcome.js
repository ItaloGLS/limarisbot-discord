
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setwelcome')
    .setDescription('Define o canal de boas-vindas')
    .addChannelOption(option =>
      option.setName('canal')
        .setDescription('Canal para enviar mensagens de boas-vindas')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const channel = interaction.options.getChannel('canal');
    const configPath = path.join(__dirname, '../config.json');
    const config = require(configPath);
    config.welcomeChannelId = channel.id;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    await interaction.reply(`Canal de boas-vindas definido para ${channel}!`);
  },
};
