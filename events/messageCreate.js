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
    console.log('📩 New message received from:', message.author.tag);
    
    // Ignore bots and DMs
    if (message.author.bot || !message.guild) {
      console.log('ℹ️ Ignoring message (bot or DM)');
      return;
    }
    
    // ========== LEVEL 3: MODERATION FIRST ==========
    console.log('🔍 Checking for spam...');
    const isSpam = checkSpam(message.author.id);
    if (isSpam) {
      try {
        await message.delete();
        console.log('🗑️ Spam message deleted');
        const modEmbed = createModerationEmbed('Mensagem Deletada', 'Spam detectado');
        await message.channel.send({ embeds: [modEmbed] });
      } catch (err) {
        console.error('❌ Could not handle spam:', err);
      }
      return;
    }
    
    console.log('🔍 Checking for prohibited words...');
    const hasProhibited = checkProhibitedWords(message.content);
    if (hasProhibited) {
      try {
        await message.delete();
        console.log('🗑️ Prohibited word message deleted');
        const modEmbed = createModerationEmbed('Mensagem Deletada', 'Palavra proibida detectada');
        await message.channel.send({ embeds: [modEmbed] });
      } catch (err) {
        console.error('❌ Could not handle prohibited word:', err);
      }
      return;
    }
    
    // ========== LEVEL 1: FAQ SYSTEM ==========
    console.log('🔍 Checking for FAQ match...');
    const faqMatch = checkFAQ(message);
    if (faqMatch) {
      console.log('✅ FAQ match found!');
      const faqEmbed = createFAQEmbed(faqMatch, message.member);
      try {
        await message.reply({ embeds: [faqEmbed] });
        console.log('✅ FAQ response sent!');
      } catch (err) {
        console.error('❌ Could not send FAQ reply:', err);
      }
      return;
    }
    
    // ========== LEVEL 2: AI SYSTEM ==========
    const botMentioned = message.mentions.has(message.client.user);
    console.log('🤖 Bot mentioned?', botMentioned);
    console.log('🤖 AI enabled?', aiConfig.enabled);
    
    if (aiConfig.enabled && botMentioned) {
      console.log('🤖 AI is enabled and bot was mentioned!');
      try {
        await message.channel.sendTyping();
        console.log('⌨️ Typing indicator sent');
        
        const aiResponse = await generateAIResponse(message);
        console.log('🤖 AI response received:', !!aiResponse);
        
        if (aiResponse) {
          const aiEmbed = new EmbedBuilder()
            .setColor(Colors.PRIMARY)
            .setTitle('🤖 Resposta da IA')
            .setDescription(aiResponse)
            .setFooter({ text: 'Limaris Studios AI' })
            .setTimestamp();
          
          await message.reply({ embeds: [aiEmbed] });
          console.log('✅ AI response sent!');
        } else {
          console.log('⚠️ No AI response, falling back...');
          const fallbackEmbed = new EmbedBuilder()
            .setColor(Colors.WARNING)
            .setTitle('🤖 IA Temporariamente Indisponível')
            .setDescription('Desculpe, estou com problemas técnicos no momento. Por favor, tente novamente mais tarde ou crie um ticket!')
            .setFooter({ text: 'Limaris Studios Bot' })
            .setTimestamp();
          
          await message.reply({ embeds: [fallbackEmbed] });
        }
      } catch (error) {
        console.error('❌ Fatal error in message handler:', error);
        try {
          const errorEmbed = new EmbedBuilder()
            .setColor(Colors.ERROR)
            .setTitle('❌ Erro')
            .setDescription('Desculpe, ocorreu um erro inesperado. Por favor, tente novamente mais tarde!')
            .setFooter({ text: 'Limaris Studios Bot' })
            .setTimestamp();
          
          await message.reply({ embeds: [errorEmbed] });
        } catch (fallbackError) {
          console.error('❌ Could not even send fallback error message:', fallbackError);
        }
      }
    } else {
      console.log('ℹ️ Skipping AI (not mentioned or AI disabled)');
    }
  }
};
