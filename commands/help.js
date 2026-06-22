const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Colors, createBaseEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show all available commands'),
  async execute(interaction) {
    const embed = createBaseEmbed(interaction)
      .setColor(Colors.PRIMARY)
      .setTitle('📚 Limaris Studios Bot - Help')
      .setDescription('Here are all the available commands:')
      .addFields(
        { 
          name: '🛡️ Moderation', 
          value: '`/ban` - Ban a member\n`/kick` - Kick a member\n`/mute` - Mute a member\n`/unmute` - Unmute a member\n`/promote` - Assign a role\n`/clear` - Purge messages', 
          inline: true 
        },
        { 
          name: '⚙️ Configuration', 
          value: '`/setwelcome` - Set welcome channel\n`/setdevlog` - Set devlog channel\n`/setticketchannel` - Set ticket channel\n`/setuptickets` - Create ticket interface', 
          inline: true 
        },
        { 
          name: '📢 Announcement', 
          value: '`/announce` - Send DM announcements to all members', 
          inline: true 
        },
        { 
          name: 'ℹ️ Information', 
          value: '`/serverinfo` - Server information\n`/userinfo` - User information\n`/ping` - Check latency', 
          inline: true 
        },
        { 
          name: '🎮 Other', 
          value: '`/devlog` - Send a devlog\n`/8ball` - Ask the magic 8-ball a question', 
          inline: true 
        }
      )
      .setAuthor({ 
        name: interaction.client.user.username, 
        iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) 
      });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
