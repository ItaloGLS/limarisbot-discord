const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { Colors, successEmbed, errorEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Purge messages from a channel')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Number of messages to delete (1-100)')
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true))
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Only delete messages from this user (optional)')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');
    const targetUser = interaction.options.getUser('user');

    const messages = await interaction.channel.messages.fetch({ limit: amount });
    
    let messagesToDelete = messages;
    if (targetUser) {
      messagesToDelete = messages.filter(m => m.author.id === targetUser.id);
    }

    try {
      const deleted = await interaction.channel.bulkDelete(messagesToDelete, true);
      
      const clearEmbed = new EmbedBuilder()
        .setColor(Colors.SUCCESS)
        .setTitle('🧹 Messages Cleared')
        .setDescription(`Successfully deleted **${deleted.size}** message(s)!`)
        .setTimestamp()
        .setFooter({ 
          text: interaction.guild.name, 
          iconURL: interaction.guild.iconURL({ dynamic: true }) 
        });

      await interaction.reply({ embeds: [clearEmbed], ephemeral: true });

      // Auto-delete the confirmation after 5 seconds
      setTimeout(async () => {
        if (interaction.replied) {
          await interaction.deleteReply();
        }
      }, 5000);
      
    } catch (error) {
      console.error(error);
      await interaction.reply({ 
        embeds: [errorEmbed(interaction, 'Error', 'I could not delete some or all of the messages! Messages older than 14 days cannot be deleted.')],
        ephemeral: true 
      });
    }
  },
};
