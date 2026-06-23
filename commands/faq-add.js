const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { successEmbed, errorEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('faq-add')
    .setDescription('Add a new FAQ entry (Admin only)')
    .addStringOption(option =>
      option.setName('keywords')
        .setDescription('Comma-separated keywords (ex: cargo,role,pegar cargo)')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('question')
        .setDescription('The question')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('answer')
        .setDescription('The answer')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    try {
      const keywords = interaction.options.getString('keywords').split(',').map(k => k.trim());
      const question = interaction.options.getString('question');
      const answer = interaction.options.getString('answer');
      
      const faqPath = path.join(__dirname, '../data/faq.json');
      const faqData = JSON.parse(fs.readFileSync(faqPath, 'utf8'));
      
      faqData.faqs.push({ keywords, question, answer });
      fs.writeFileSync(faqPath, JSON.stringify(faqData, null, 2));
      
      await interaction.reply({ 
        embeds: [successEmbed(interaction, 'FAQ Added', 'New FAQ entry has been added!')],
        ephemeral: true 
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({ 
        embeds: [errorEmbed(interaction, 'Error', 'Failed to add FAQ entry!')],
        ephemeral: true 
      });
    }
  },
};
