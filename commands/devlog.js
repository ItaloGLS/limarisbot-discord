
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('devlog')
    .setDescription('Envia um devlog para o canal designado')
    .addStringOption(option =>
      option.setName('titulo')
        .setDescription('Título do devlog')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('conteudo')
        .setDescription('Conteúdo do devlog')
        .setRequired(true))
    .addAttachmentOption(option =>
      option.setName('imagem')
        .setDescription('Imagem para acompanhar o devlog (opcional)'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction) {
    if (!config.devlogChannelId) {
      return interaction.reply({ content: 'Canal de devlogs não configurado! Use /setdevlog.', ephemeral: true });
    }

    const channel = interaction.guild.channels.cache.get(config.devlogChannelId);
    if (!channel) {
      return interaction.reply({ content: 'Canal de devlogs não encontrado!', ephemeral: true });
    }

    const title = interaction.options.getString('titulo');
    const content = interaction.options.getString('conteudo');
    const image = interaction.options.getAttachment('imagem');

    const embed = new EmbedBuilder()
      .setColor('#8B5CF6')
      .setTitle(`📝 Devlog: ${title}`)
      .setDescription(content)
      .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();

    if (image) {
      embed.setImage(image.url);
    }

    await channel.send({ embeds: [embed] });
    await interaction.reply({ content: 'Devlog enviado com sucesso!', ephemeral: true });
  },
};
