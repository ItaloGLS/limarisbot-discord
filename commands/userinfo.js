const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Colors, createBaseEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Show detailed information about a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to get info about (defaults to yourself)')
        .setRequired(false)),
  async execute(interaction) {
    const targetUser = interaction.options.getUser('user') || interaction.user;
    const targetMember = interaction.options.getMember('user') || interaction.member;

    const embed = createBaseEmbed(interaction)
      .setColor(targetMember ? targetMember.displayHexColor : Colors.PRIMARY)
      .setTitle(`👤 User Info: ${targetUser.tag}`)
      .setThumbnail(targetUser.displayAvatarURL({ dynamic: true, size: 256 }))
      .addFields(
        { name: '🆔 User ID', value: `\`${targetUser.id}\``, inline: true },
        { name: '🤖 Bot?', value: targetUser.bot ? 'Yes' : 'No', inline: true },
        { name: '📅 Account Created', value: `<t:${Math.floor(targetUser.createdTimestamp / 1000)}:F>`, inline: false },
        { name: '📥 Joined Server', value: `<t:${Math.floor(targetMember.joinedTimestamp / 1000)}:F>`, inline: false },
        { name: '🏷️ Roles', value: targetMember.roles.cache.size > 1 ? targetMember.roles.cache.map(r => r.toString()).slice(1).join(' ') : 'None', inline: false }
      );

    if (targetUser.banner) {
      embed.setImage(targetUser.bannerURL({ dynamic: true, size: 1024 }));
    }

    await interaction.reply({ embeds: [embed] });
  },
};
