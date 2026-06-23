const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../utils/embeds');
const { aiConfig, saveAIConfig, openaiClient, geminiClient } = require('../utils/ai-handler');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ai-set-provider')
    .setDescription('Set AI provider (OpenAI or Gemini) (Admin only)')
    .addStringOption(option =>
      option.setName('provider')
        .setDescription('AI provider to use')
        .setRequired(true)
        .addChoices(
          { name: 'OpenAI (ChatGPT)', value: 'openai' },
          { name: 'Google Gemini', value: 'gemini' }
        ))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    try {
      const provider = interaction.options.getString('provider');
      
      if (provider === 'openai' && !openaiClient) {
        return interaction.reply({ 
          embeds: [errorEmbed(interaction, 'Error', 'OpenAI not configured! Add OPENAI_API_KEY in .env')],
          ephemeral: true 
        });
      }
      
      if (provider === 'gemini' && !geminiClient) {
        return interaction.reply({ 
          embeds: [errorEmbed(interaction, 'Error', 'Gemini not configured! Add GEMINI_API_KEY in .env')],
          ephemeral: true 
        });
      }
      
      aiConfig.provider = provider;
      saveAIConfig();
      
      await interaction.reply({ 
        embeds: [successEmbed(interaction, 'AI Provider Set', `AI provider set to **${provider}**!`)],
        ephemeral: true 
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({ 
        embeds: [errorEmbed(interaction, 'Error', 'Failed to set AI provider!')],
        ephemeral: true 
      });
    }
  },
};
