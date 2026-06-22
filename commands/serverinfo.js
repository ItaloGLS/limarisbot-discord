const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Colors, createBaseEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Show detailed information about the server'),
  async execute(interaction) {
    const guild = interaction.guild;
    
    // Calculate member stats
    const memberCount = guild.memberCount;
    const botCount = guild.members.cache.filter(m => m.user.bot).size;
    const humanCount = memberCount - botCount;

    // Calculate channel stats
    const textChannels = guild.channels.cache.filter(c => c.type === 0).size;
    const voiceChannels = guild.channels.cache.filter(c => c.type === 2).size;
    const categoryChannels = guild.channels.cache.filter(c => c.type === 4).size;

    const embed = createBaseEmbed(interaction)
      .setColor(Colors.INFO)
      .setTitle(`🏠 Server Info: ${guild.name}`)
      .setThumbnail(guild.iconURL({ dynamic: true, size: 256 }))
      .addFields(
        { name: '📅 Created On', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`, inline: true },
        { name: '👑 Owner', value: `<@${guild.ownerId}>`, inline: true },
        { name: '🆔 Server ID', value: `\`${guild.id}\``, inline: true },
        { name: '👥 Members', value: `Total: **${memberCount}**\nHumans: **${humanCount}**\nBots: **${botCount}**`, inline: true },
        { name: '📊 Channels', value: `Text: **${textChannels}**\nVoice: **${voiceChannels}**\nCategories: **${categoryChannels}**`, inline: true },
        { name: '🏷️ Roles', value: `**${guild.roles.cache.size}** roles`, inline: true },
        { name: '😀 Emojis', value: `**${guild.emojis.cache.size}** emojis`, inline: true },
        { name: '🔒 Verification Level', value: guild.verificationLevel, inline: true }
      );

    if (guild.banner) {
      embed.setImage(guild.bannerURL({ dynamic: true, size: 1024 }));
    }

    await interaction.reply({ embeds: [embed] });
  },
};
