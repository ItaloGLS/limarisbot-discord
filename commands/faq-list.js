const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { Colors, errorEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('faq-list')
    .setDescription('List all FAQ entries (Admin only)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    try {
      const faqPath = path.join(__dirname, '../data/faq.json');
      const faqData = JSON.parse(fs.readFileSync(faqPath, 'utf8'));
      
      if (faqData.faqs.length === 0) {
        return interaction.reply({ 
          embeds: [errorEmbed(interaction, 'No FAQs', 'There are no FAQ entries yet!')],
          ephemeral: true 
        });
      }
      
      const embed = new EmbedBuilder()
        .setColor(Colors.INFO)
        .setTitle('📚 FAQ List')
        .setDescription('All FAQ entries:');
      
      faqData.faqs.forEach((faq, index) => {
        embed.addFields({
          name: `#${index + 1} - ${faq.question}`,
          value: `**Keywords:** ${faq.keywords.join(', ')}\n**Answer:** ${faq.answer}`,
          inline: false
        });
      });
      
      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({ 
        embeds: [errorEmbed(interaction, 'Error', 'Failed to list FAQ entries!')],
        ephemeral: true 
      });
    }
  },
};
