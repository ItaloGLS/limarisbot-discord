const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { Colors, errorEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('promote')
    .setDescription('Assign a role to a member')
    .addUserOption(option =>
      option.setName('member')
        .setDescription('Member to assign the role to')
        .setRequired(true))
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('Role to assign')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
  async execute(interaction) {
    const targetMember = interaction.options.getMember('member');
    const role = interaction.options.getRole('role');

    if (!targetMember) {
      return interaction.reply({ 
        embeds: [errorEmbed(interaction, 'Error', 'Member not found!')],
        ephemeral: true 
      });
    }

    if (role.position >= interaction.guild.members.me.roles.highest.position) {
      return interaction.reply({ 
        embeds: [errorEmbed(interaction, 'Error', 'I cannot manage this role! Please move my role above it.')],
        ephemeral: true 
      });
    }

    if (role.position >= interaction.member.roles.highest.position && interaction.user.id !== interaction.guild.ownerId) {
      return interaction.reply({ 
        embeds: [errorEmbed(interaction, 'Error', 'You cannot assign this role! It is higher than or equal to your highest role.')],
        ephemeral: true 
      });
    }

    await targetMember.roles.add(role);
    
    const promoteEmbed = new EmbedBuilder()
      .setColor(Colors.SUCCESS)
      .setTitle('🎖️ Role Assigned')
      .addFields(
        { name: '👤 Member', value: `${targetMember.user.tag}`, inline: true },
        { name: '🏷️ Role', value: `${role}`, inline: true },
        { name: '👮 Moderator', value: `${interaction.user.tag}` }
      )
      .setThumbnail(targetMember.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setFooter({ 
        text: interaction.guild.name, 
        iconURL: interaction.guild.iconURL({ dynamic: true }) 
      });

    await interaction.reply({ embeds: [promoteEmbed] });
  },
};
