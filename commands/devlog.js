const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const config = require('../config.json');
const { Colors, successEmbed, errorEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('devlog')
    .setDescription('Send a devlog to the designated channel')
    .addStringOption(option =>
      option.setName('title')
        .setDescription('Title of the devlog')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('content')
        .setDescription('Content of the devlog')
        .setRequired(true))
    .addAttachmentOption(option =>
      option.setName('image')
        .setDescription('Image to accompany the devlog (optional)'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction) {
    if (!config.devlogChannelId) {
      return interaction.reply({ 
        embeds: [errorEmbed(interaction, 'Error', 'Devlog channel not configured! Use /setdevlog.')],
        ephemeral: true 
      });
    }

    const channel = interaction.guild.channels.cache.get(config.devlogChannelId);
    if (!channel) {
      return interaction.reply({ 
        embeds: [errorEmbed(interaction, 'Error', 'Devlog channel not found!')],
        ephemeral: true 
      });
    }

    const title = interaction.options.getString('title');
    const content = interaction.options.getString('content');
    const image = interaction.options.getAttachment('image');

    const embed = new EmbedBuilder()
      .setColor(Colors.DEVLOG)
      .setTitle(`📝 Devlog: ${title}`)
      .setDescription(content)
      .setAuthor({ 
        name: interaction.user.tag, 
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
      })
      .setTimestamp()
      .setFooter({ 
        text: 'Limaris Studios Development Update', 
        iconURL: interaction.guild.iconURL({ dynamic: true }) 
      });

    if (image) {
      embed.setImage(image.url);
    }

    await channel.send({ embeds: [embed] });
    await interaction.reply({ 
      embeds: [successEmbed(interaction, 'Devlog Sent', 'Your devlog has been posted successfully!')],
      ephemeral: true 
    });
  },
};
