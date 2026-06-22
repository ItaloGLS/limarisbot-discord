const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Colors, createBaseEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check the bot\'s latency'),
  async execute(interaction) {
    const sent = await interaction.deferReply({ ephemeral: true });
    const ping = sent.createdTimestamp - interaction.createdTimestamp;
    const websocketPing = interaction.client.ws.ping;

    const embed = createBaseEmbed(interaction)
      .setColor(Colors.PRIMARY)
      .setTitle('🏓 Pong!')
      .addFields(
        { name: '📡 API Latency', value: `${websocketPing}ms`, inline: true },
        { name: '💬 Bot Latency', value: `${ping}ms`, inline: true }
      );

    await interaction.editReply({ embeds: [embed] });
  },
};
