const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { Colors, errorEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member from the server')
    .addUserOption(option =>
      option.setName('member')
        .setDescription('Member to kick')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the kick'))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  async execute(interaction) {
    const targetMember = interaction.options.getMember('member');
    const reason = interaction.options.getString('reason') || 'No reason specified';

    if (!targetMember) {
      return interaction.reply({ 
        embeds: [errorEmbed(interaction, 'Error', 'Member not found!')],
        ephemeral: true 
      });
    }

    if (targetMember.id === interaction.user.id) {
      return interaction.reply({ 
        embeds: [errorEmbed(interaction, 'Error', 'You cannot kick yourself!')],
        ephemeral: true 
      });
    }

    if (targetMember.roles.highest.position >= interaction.member.roles.highest.position && interaction.user.id !== interaction.guild.ownerId) {
      return interaction.reply({ 
        embeds: [errorEmbed(interaction, 'Error', 'You cannot kick this member! Their role is higher than or equal to yours.')],
        ephemeral: true 
      });
    }

    if (!targetMember.kickable) {
      return interaction.reply({ 
        embeds: [errorEmbed(interaction, 'Error', 'I cannot kick this member! Please check my role position and permissions.')],
        ephemeral: true 
      });
    }

    await targetMember.kick(reason);
    
    const kickEmbed = new EmbedBuilder()
      .setColor(Colors.WARNING)
      .setTitle('👟 Member Kicked')
      .addFields(
        { name: '👤 Member', value: `${targetMember.user.tag} (${targetMember.user.id})`, inline: true },
        { name: '👮 Moderator', value: `${interaction.user.tag}`, inline: true },
        { name: '📅 Reason', value: reason, inline: false }
      )
      .setThumbnail(targetMember.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setFooter({ 
        text: interaction.guild.name, 
        iconURL: interaction.guild.iconURL({ dynamic: true }) 
      });

    await interaction.reply({ embeds: [kickEmbed] });
  },
};
