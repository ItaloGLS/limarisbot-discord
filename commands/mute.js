const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { Colors, successEmbed, errorEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mute a member (timeout + role)')
    .addUserOption(option =>
      option.setName('member')
        .setDescription('Member to mute')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the mute'))
    .addIntegerOption(option =>
      option.setName('duration')
        .setDescription('Duration in minutes (optional, max 40320)')
        .setMinValue(1)
        .setMaxValue(40320))
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
      // First, try to find or create a "Muted" role
      let mutedRole = interaction.guild.roles.cache.find(r => r.name === 'Muted');
      
      if (!mutedRole) {
        // Create muted role if it doesn't exist
        mutedRole = await interaction.guild.roles.create({
          name: 'Muted',
          color: Colors.ERROR,
          permissions: [],
          reason: 'Created for mute command'
        });

        // Apply role permissions to all channels
        for (const [, channel] of interaction.guild.channels.cache) {
          try {
            await channel.permissionOverwrites.create(mutedRole, {
              SendMessages: false,
              Speak: false,
              SendMessagesInThreads: false,
              AddReactions: false
            });
          } catch (err) {
            console.error('Could not update channel permissions:', err);
          }
        }
      }

      // Add the muted role
      await targetMember.roles.add(mutedRole, reason);

      // Try to apply timeout if duration is specified
      if (duration) {
        const timeoutMs = duration * 60 * 1000;
        try {
          await targetMember.timeout(timeoutMs, reason);
        } catch (timeoutErr) {
          console.error('Timeout failed, but role still applied:', timeoutErr);
        }
      }
      
      const muteEmbed = new EmbedBuilder()
        .setColor(Colors.WARNING)
        .setTitle('🔇 Member Muted')
        .addFields(
          { name: '👤 Member', value: `${targetMember.user.tag} (${targetMember.user.id})`, inline: true },
          { name: '👮 Moderator', value: `${interaction.user.tag}`, inline: true },
          { name: '📅 Reason', value: reason, inline: false },
          { name: '⏱️ Duration', value: duration ? `${duration} minute(s)` : 'Until manually unmuted', inline: true }
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
