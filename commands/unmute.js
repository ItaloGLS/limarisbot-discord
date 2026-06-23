const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { Colors, successEmbed, errorEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Unsilence a member in voice channels')
    .addUserOption(option =>
      option.setName('member')
        .setDescription('Member to unmute')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),
  async execute(interaction) {
    const targetMember = interaction.options.getMember('member');

    if (!targetMember) {
      return interaction.reply({ 
        embeds: [errorEmbed(interaction, 'Error', 'Member not found!')],
        ephemeral: true 
      });
    }

    if (!targetMember.voice.channel) {
      return interaction.reply({ 
        embeds: [errorEmbed(interaction, 'Error', 'This member is not in a voice channel!')],
        ephemeral: true 
      });
    }

    try {
      await targetMember.voice.setMute(false);
      
      const unmuteEmbed = new EmbedBuilder()
        .setColor(Colors.SUCCESS)
        .setTitle('🔊 Member Unmuted')
        .addFields(
          { name: '👤 Member', value: `${targetMember.user.tag}`, inline: true },
          { name: '👮 Moderator', value: `${interaction.user.tag}`, inline: true }
        )
        .setThumbnail(targetMember.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setFooter({ 
          text: interaction.guild.name, 
          iconURL: interaction.guild.iconURL({ dynamic: true }) 
        });

      await interaction.reply({ embeds: [unmuteEmbed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ 
        embeds: [errorEmbed(interaction, 'Error', 'Failed to unmute the member!')],
        ephemeral: true 
      });
    }
  },
};
