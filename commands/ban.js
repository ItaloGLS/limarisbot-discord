const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { Colors, successEmbed, errorEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member from the server')
    .addUserOption(option =>
      option.setName('member')
        .setDescription('Member to ban')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the ban'))
    .addIntegerOption(option =>
      option.setName('delete-messages')
        .setDescription('Number of days to delete messages (0-7)')
        .setMinValue(0)
        .setMaxValue(7))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    const targetMember = interaction.options.getMember('member');
    const reason = interaction.options.getString('reason') || 'No reason specified';
    const deleteDays = interaction.options.getInteger('delete-messages') || 0;

    if (!targetMember) {
      return interaction.reply({ 
        embeds: [errorEmbed(interaction, 'Error', 'Member not found!')],
        ephemeral: true 
      });
    }

    if (targetMember.id === interaction.user.id) {
      return interaction.reply({ 
        embeds: [errorEmbed(interaction, 'Error', 'You cannot ban yourself!')],
        ephemeral: true 
      });
    }

    if (targetMember.roles.highest.position >= interaction.member.roles.highest.position && interaction.user.id !== interaction.guild.ownerId) {
      return interaction.reply({ 
        embeds: [errorEmbed(interaction, 'Error', 'You cannot ban this member! Their role is higher than or equal to yours.')],
        ephemeral: true 
      });
    }

    if (!targetMember.bannable) {
      return interaction.reply({ 
        embeds: [errorEmbed(interaction, 'Error', 'I cannot ban this member! Please check my role position and permissions.')],
        ephemeral: true 
      });
    }

    await targetMember.ban({ deleteMessageSeconds: deleteDays * 24 * 60 * 60, reason });
    
    const banEmbed = new EmbedBuilder()
      .setColor(Colors.ERROR)
      .setTitle('🔨 Member Banned')
      .addFields(
        { name: '👤 Member', value: `${targetMember.user.tag} (${targetMember.user.id})`, inline: true },
        { name: '👮 Moderator', value: `${interaction.user.tag}`, inline: true },
        { name: '📅 Reason', value: reason, inline: false },
        { name: '🗑️ Messages Deleted', value: `${deleteDays} day(s)`, inline: true }
      )
      .setThumbnail(targetMember.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setFooter({ 
        text: interaction.guild.name, 
        iconURL: interaction.guild.iconURL({ dynamic: true }) 
      });

    await interaction.reply({ embeds: [banEmbed] });
  },
};
