const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { Colors, successEmbed, errorEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout a member (castigo)')
    .addUserOption(option =>
      option.setName('member')
        .setDescription('Member to timeout')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('duration')
        .setDescription('Duration in minutes (max 40320)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(40320))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for timeout'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const targetMember = interaction.options.getMember('member');
    const duration = interaction.options.getInteger('duration');
    const reason = interaction.options.getString('reason') || 'No reason specified';

    if (!targetMember) {
      return interaction.reply({ 
        embeds: [errorEmbed(interaction, 'Error', 'Member not found!')],
        ephemeral: true 
      });
    }

    if (targetMember.id === interaction.user.id) {
      return interaction.reply({ 
        embeds: [errorEmbed(interaction, 'Error', 'You cannot timeout yourself!')],
        ephemeral: true 
      });
    }

    if (targetMember.roles.highest.position >= interaction.member.roles.highest.position && interaction.user.id !== interaction.guild.ownerId) {
      return interaction.reply({ 
        embeds: [errorEmbed(interaction, 'Error', 'You cannot timeout this member!')],
        ephemeral: true 
      });
    }

    if (!targetMember.moderatable) {
      return interaction.reply({ 
        embeds: [errorEmbed(interaction, 'Error', 'I cannot timeout this member!')],
        ephemeral: true 
      });
    }

    try {
      // Apply timeout
      await targetMember.timeout(duration * 60 * 1000, reason);
      
      // Send DM to the member
      try {
        const dmEmbed = new EmbedBuilder()
          .setColor(Colors.WARNING)
          .setTitle('⏰ You Have Been Timed Out')
          .addFields(
            { name: 'Server', value: interaction.guild.name, inline: true },
            { name: 'Duration', value: `${duration} minute(s)`, inline: true },
            { name: 'Reason', value: reason, inline: false }
          )
          .setTimestamp();
        
        await targetMember.send({ embeds: [dmEmbed] });
      } catch (dmErr) {
        console.log('Could not send DM:', dmErr);
      }
      
      const timeoutEmbed = new EmbedBuilder()
        .setColor(Colors.WARNING)
        .setTitle('⏰ Member Timed Out')
        .addFields(
          { name: '👤 Member', value: `${targetMember.user.tag}`, inline: true },
          { name: '👮 Moderator', value: `${interaction.user.tag}`, inline: true },
          { name: '⏱️ Duration', value: `${duration} minute(s)`, inline: true },
          { name: '📅 Reason', value: reason, inline: false }
        )
        .setThumbnail(targetMember.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setFooter({ 
          text: interaction.guild.name, 
          iconURL: interaction.guild.iconURL({ dynamic: true }) 
        });

      await interaction.reply({ embeds: [timeoutEmbed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ 
        embeds: [errorEmbed(interaction, 'Error', 'Failed to timeout the member!')],
        ephemeral: true 
      });
    }
  },
};
