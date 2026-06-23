const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { Colors, successEmbed, errorEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a member with a DM')
    .addUserOption(option =>
      option.setName('member')
        .setDescription('Member to warn')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for warning')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction) {
    const targetMember = interaction.options.getMember('member');
    const reason = interaction.options.getString('reason');

    if (!targetMember) {
      return interaction.reply({ 
        embeds: [errorEmbed(interaction, 'Error', 'Member not found!')],
        ephemeral: true 
      });
    }

    try {
      // Send DM to the member
      let dmSent = false;
      try {
        const dmEmbed = new EmbedBuilder()
          .setColor(Colors.WARNING)
          .setTitle('⚠️ You Have Been Warned')
          .addFields(
            { name: 'Server', value: interaction.guild.name, inline: true },
            { name: 'Reason', value: reason, inline: false }
          )
          .setTimestamp()
          .setFooter({ text: 'Please follow the rules in the future!' });
        
        await targetMember.send({ embeds: [dmEmbed] });
        dmSent = true;
      } catch (dmErr) {
        console.log('Could not send DM:', dmErr);
      }
      
      const warnEmbed = new EmbedBuilder()
        .setColor(Colors.WARNING)
        .setTitle('⚠️ Member Warned')
        .addFields(
          { name: '👤 Member', value: `${targetMember.user.tag}`, inline: true },
          { name: '👮 Moderator', value: `${interaction.user.tag}`, inline: true },
          { name: '📅 Reason', value: reason, inline: false },
          { name: '✉️ DM Sent', value: dmSent ? 'Yes' : 'No (DMs disabled)', inline: true }
        )
        .setThumbnail(targetMember.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setFooter({ 
          text: interaction.guild.name, 
          iconURL: interaction.guild.iconURL({ dynamic: true }) 
        });

      await interaction.reply({ embeds: [warnEmbed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ 
        embeds: [errorEmbed(interaction, 'Error', 'Failed to warn the member!')],
        ephemeral: true 
      });
    }
  },
};
