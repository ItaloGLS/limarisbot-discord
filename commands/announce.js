const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { Colors, successEmbed, errorEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('announce')
    .setDescription('Send an announcement via DM to all server members (Admin only)')
    .addStringOption(option =>
      option.setName('title')
        .setDescription('Title of the announcement')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('message')
        .setDescription('Content of the announcement')
        .setRequired(true))
    .addAttachmentOption(option =>
      option.setName('image')
        .setDescription('Optional image for the announcement')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const title = interaction.options.getString('title');
    const message = interaction.options.getString('message');
    const image = interaction.options.getAttachment('image');

    await interaction.deferReply({ ephemeral: true });

    const announcementEmbed = new EmbedBuilder()
      .setColor(Colors.PRIMARY)
      .setTitle(`📢 ${title}`)
      .setDescription(message)
      .setAuthor({ 
        name: interaction.guild.name, 
        iconURL: interaction.guild.iconURL({ dynamic: true }) 
      })
      .setTimestamp();

    if (image) {
      announcementEmbed.setImage(image.url);
    }

    let sentCount = 0;
    let failedCount = 0;
    const members = interaction.guild.members.cache.filter(m => !m.user.bot);

    const statusEmbed = new EmbedBuilder()
      .setColor(Colors.INFO)
      .setTitle('📢 Sending Announcement...')
      .setDescription(`Sending to ${members.size} members...\n\n**Sent:** ${sentCount}\n**Failed:** ${failedCount}`)
      .setTimestamp();

    const statusMsg = await interaction.editReply({ embeds: [statusEmbed] });

    // Send DM to each member
    for (const [, member] of members) {
      try {
        await member.send({ embeds: [announcementEmbed] });
        sentCount++;
      } catch (error) {
        console.error(`Failed to DM ${member.user.tag}:`, error);
        failedCount++;
      }

      // Update status every 10 members
      if (sentCount + failedCount % 10 === 0 || sentCount + failedCount === members.size) {
        statusEmbed.setDescription(`Sending to ${members.size} members...\n\n**Sent:** ${sentCount}\n**Failed:** ${failedCount}`);
        await statusMsg.edit({ embeds: [statusEmbed] });
      }
      
      // Add small delay to avoid hitting rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const finalEmbed = successEmbed(
      interaction,
      'Announcement Complete',
      `Successfully sent the announcement!\n\n✅ **Sent:** ${sentCount}\n❌ **Failed:** ${failedCount}`
    );

    await interaction.editReply({ embeds: [finalEmbed] });
  },
};
