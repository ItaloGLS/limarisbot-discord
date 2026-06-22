const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { Colors, successEmbed, errorEmbed } = require('../utils/embeds');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mute a member')
    .addUserOption(option =>
      option.setName('member')
        .setDescription('Member to mute')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the mute'))
    .addIntegerOption(option =>
      option.setName('duration')
        .setDescription('Duration in minutes (optional, permanent if not set)')
        .setMinValue(1))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const targetMember = interaction.options.getMember('member');
    const reason = interaction.options.getString('reason') || 'No reason specified';
    const duration = interaction.options.getInteger('duration');

    if (!targetMember) {
      return interaction.reply({ 
        embeds: [errorEmbed(interaction, 'Error', 'Member not found!')],
        ephemeral: true 
      });
    }

    if (targetMember.id === interaction.user.id) {
      return interaction.reply({ 
        embeds: [errorEmbed(interaction, 'Error', 'You cannot mute yourself!')],
        ephemeral: true 
      });
    }

    if (targetMember.roles.highest.position >= interaction.member.roles.highest.position && interaction.user.id !== interaction.guild.ownerId) {
      return interaction.reply({ 
        embeds: [errorEmbed(interaction, 'Error', 'You cannot mute this member! Their role is higher than or equal to yours.')],
        ephemeral: true 
      });
    }

    if (!targetMember.moderatable) {
      return interaction.reply({ 
        embeds: [errorEmbed(interaction, 'Error', 'I cannot mute this member! Please check my role position and permissions.')],
        ephemeral: true 
      });
    }

    try {
      await targetMember.timeout(duration ? duration * 60 * 1000 : null, reason);
      
      const muteEmbed = new EmbedBuilder()
        .setColor(Colors.WARNING)
        .setTitle('🔇 Member Muted')
        .addFields(
          { name: '👤 Member', value: `${targetMember.user.tag} (${targetMember.user.id})`, inline: true },
          { name: '👮 Moderator', value: `${interaction.user.tag}`, inline: true },
          { name: '📅 Reason', value: reason, inline: false },
          { name: '⏱️ Duration', value: duration ? `${duration} minute(s)` : 'Permanent', inline: true }
        )
        .setThumbnail(targetMember.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setFooter({ 
          text: interaction.guild.name, 
          iconURL: interaction.guild.iconURL({ dynamic: true }) 
        });

      await interaction.reply({ embeds: [muteEmbed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ 
        embeds: [errorEmbed(interaction, 'Error', 'Failed to mute the member! Please try again.')],
        ephemeral: true 
      });
    }
  },
};
