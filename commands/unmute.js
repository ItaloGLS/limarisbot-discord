const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { Colors, successEmbed, errorEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Unmute a member')
    .addUserOption(option =>
      option.setName('member')
        .setDescription('Member to unmute')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const targetMember = interaction.options.getMember('member');

    if (!targetMember) {
      return interaction.reply({ 
        embeds: [errorEmbed(interaction, 'Error', 'Member not found!')],
        ephemeral: true 
      });
    }

    if (!targetMember.isCommunicationDisabled()) {
      return interaction.reply({ 
        embeds: [errorEmbed(interaction, 'Error', 'This member is not muted!')],
        ephemeral: true 
      });
    }

    try {
      await targetMember.timeout(null);
      
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
        embeds: [errorEmbed(interaction, 'Error', 'Failed to unmute the member! Please try again.')],
        ephemeral: true 
      });
    }
  },
};
