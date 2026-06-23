const { Events, EmbedBuilder } = require('discord.js');
const { 
  checkFAQ, 
  createFAQEmbed,
  generateAIResponse,
  checkSpam, 
  checkProhibitedWords, 
  createModerationEmbed,
  aiConfig
} = require('../utils/ai-handler');
const { Colors } = require('../utils/embeds');

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    // Ignore bots
    if (message.author.bot) return;
    
    // Ignore DMs
    if (!message.guild) return;
    
    // ========== LEVEL 3: MODERATION FIRST ==========
    // Check for spam
    const isSpam = checkSpam(message.author.id);
    if (isSpam) {
      try {
        await message.delete();
        const modEmbed = createModerationEmbed('Mensagem Deletada', 'Spam detectado');
        await message.channel.send({ embeds: [modEmbed] });
      } catch (err) {
        console.error('Could not handle spam:', err);
      }
      return;
    }
    
    // Check for prohibited words
    const hasProhibited = checkProhibitedWords(message.content);
    if (hasProhibited) {
      try {
        await message.delete();
        const modEmbed = createModerationEmbed('Mensagem Deletada', 'Palavra proibida detectada');
        await message.channel.send({ embeds: [modEmbed] });
      } catch (err) {
        console.error('Could not handle prohibited word:', err);
      }
      return;
    }
    
    // ========== LEVEL 1: FAQ HANDLER ==========
    const faqMatch = checkFAQ(message);
    if (faqMatch) {
      const faqEmbed = createFAQEmbed(faqMatch, message.member);
      try {
        await message.reply({ embeds: [faqEmbed] });
      } catch (err) {
        console.error('Could not send FAQ reply:', err);
      }
      return;
    }
    
    // ========== LEVEL 2: AI HANDLER ==========
    if (aiConfig.enabled) {
      // Only respond if the bot is mentioned or in a specific channel
      const botMentioned = message.mentions.has(message.client.user);
      const isDM = !message.guild;
      
      if (botMentioned || isDM) {
        try {
          await message.channel.sendTyping();
          const aiResponse = await generateAIResponse(message);
          
          if (aiResponse) {
            const aiEmbed = new EmbedBuilder()
              .setColor(Colors.PRIMARY)
              .setTitle('🤖 Resposta da IA')
              .setDescription(aiResponse)
              .setFooter({ text: 'Limaris Studios AI' })
              .setTimestamp();
            
            await message.reply({ embeds: [aiEmbed] });
          }
        } catch (error) {
          console.error('AI Response Error:', error);
        }
      }
    }
  }
};
