const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../utils/embeds');
const { aiConfig, saveAIConfig, openaiClient, geminiClient } = require('../utils/ai-handler');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ai-toggle')
    .setDescription('Toggle AI system on/off (Admin only)')
    .addBooleanOption(option =>
      option.setName('enabled')
        .setDescription('Enable or disable the AI')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    try {
      const enabled = interaction.options.getBoolean('enabled');
      
      // Check if any provider is configured
      if (enabled && !openaiClient && !geminiClient) {
        return interaction.reply({ 
          embeds: [errorEmbed(interaction, 'Error', 'No AI provider configured! Add OPENAI_API_KEY or GEMINI_API_KEY in .env')],
          ephemeral: true 
        });
      }
      
      aiConfig.enabled = enabled;
      saveAIConfig();
      
      const status = enabled ? '✅ AI System ENABLED' : '❌ AI System DISABLED';
      await interaction.reply({ 
        embeds: [successEmbed(interaction, 'AI Status Changed', `${status}!')],
        ephemeral: true 
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({ 
        embeds: [errorEmbed(interaction, 'Error', 'Failed to toggle AI!')],
        ephemeral: true 
      });
    }
  },
};
