const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');
const { Colors } = require('./embeds');
require('dotenv').config();

// Load all data files with fallbacks
const faqDataPath = path.join(__dirname, '../data/faq.json');
const moderationRulesPath = path.join(__dirname, '../data/moderation-rules.json');
const aiConfigPath = path.join(__dirname, '../data/ai-config.json');

let faqData, moderationRules, aiConfig;

try {
  faqData = JSON.parse(fs.readFileSync(faqDataPath, 'utf8'));
} catch (err) {
  console.error('Error loading FAQ data, using defaults:', err);
  faqData = { faqs: [] };
}

try {
  moderationRules = JSON.parse(fs.readFileSync(moderationRulesPath, 'utf8'));
} catch (err) {
  console.error('Error loading moderation rules, using defaults:', err);
  moderationRules = { prohibited_words: [], rules: [] };
}

try {
  aiConfig = JSON.parse(fs.readFileSync(aiConfigPath, 'utf8'));
  console.log('✅ AI Config loaded successfully');
} catch (err) {
  console.error('Error loading AI config, using defaults:', err);
  aiConfig = { enabled: false, provider: 'gemini', model: 'gemini-1.5-pro-latest' };
}

// Initialize AI providers
let openaiClient = null;
let geminiClient = null;

try {
  if (process.env.OPENAI_API_KEY) {
    const { OpenAI } = require('openai');
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    console.log('✅ OpenAI client initialized');
  }
} catch (err) {
  console.log('ℹ️ OpenAI not configured:', err.message);
}

try {
  if (process.env.GEMINI_API_KEY) {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log('✅ Gemini client initialized');
  }
} catch (err) {
  console.log('ℹ️ Gemini not configured:', err.message);
}

// ================== LEVEL 1: FAQ SYSTEM ==================
function checkFAQ(message) {
  const content = message.content.toLowerCase();
  
  for (const faq of faqData.faqs) {
    const hasKeyword = faq.keywords.some(keyword => 
      content.includes(keyword.toLowerCase())
    );
    
    if (hasKeyword) {
      return faq;
    }
  }
  return null;
}

function createFAQEmbed(faq, member) {
  return new EmbedBuilder()
    .setColor(Colors.INFO)
    .setTitle('🤖 Resposta Automática')
    .addFields(
      { name: 'Pergunta', value: faq.question, inline: false },
      { name: 'Resposta', value: faq.answer, inline: false }
    )
    .setFooter({ text: 'Resposta automática • Não foi o que precisa? Crie um ticket!' });
}

// ================== LEVEL 2: AI SYSTEM ==================
async function generateAIResponse(message) {
  console.log('🔍 Generating AI response...');
  console.log('AI Config:', {
    enabled: aiConfig.enabled,
    provider: aiConfig.provider,
    model: aiConfig.model
  });

  if (!aiConfig.enabled) {
    console.log('ℹ️ AI is disabled');
    return null;
  }
  
  try {
    const serverInfo = `
      Server Name: ${message.guild.name}
      Rules: ${moderationRules.rules.map(r => `- ${r.name}: ${r.description}`).join('\n')}
      FAQ: ${faqData.faqs.map(f => `- Q: ${f.question} A: ${f.answer}`).join('\n')}
    `.trim();
    
    const systemPrompt = `${aiConfig.system_prompt}\n\nServer Context:\n${serverInfo}`;
    console.log('📝 Using prompt:', systemPrompt.substring(0, 200) + '...');
    
    if (aiConfig.provider === 'openai' && openaiClient) {
      console.log('🤖 Using OpenAI...');
      const response = await openaiClient.chat.completions.create({
        model: aiConfig.model || 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message.content }
        ],
        temperature: 0.7,
        max_tokens: 500
      });
      
      const result = response.choices[0].message.content;
      console.log('✅ OpenAI response received');
      return result;
    } else if (aiConfig.provider === 'gemini' && geminiClient) {
      console.log('🤖 Using Gemini...');
      const modelToUse = aiConfig.model || 'gemini-1.5-pro-latest';
      console.log('📋 Model:', modelToUse);
      
      const model = geminiClient.getGenerativeModel({ 
        model: modelToUse 
      });
      
      const result = await model.generateContent(
        `${systemPrompt}\n\nUser: ${message.content}`
      );
      
      const response = await result.response;
      const text = response.text();
      console.log('✅ Gemini response received');
      return text;
    }
    
    console.log('⚠️ No AI provider configured');
    return null;
  } catch (error) {
    console.error('❌ AI Error:', error.message);
    console.error('❌ Full error:', error);
    return null;
  }
}

// ================== LEVEL 3: MODERATION SYSTEM ==================
const spamTracker = new Map();

function checkSpam(userId) {
  const now = Date.now();
  let userData = spamTracker.get(userId);
  
  if (!userData) {
    userData = { messages: [] };
    spamTracker.set(userId, userData);
  }
  
  userData.messages.push(now);
  
  // Clean old messages
  const cutoff = now - moderationRules.spam_interval;
  userData.messages = userData.messages.filter(time => time > cutoff);
  
  return userData.messages.length >= moderationRules.spam_threshold;
}

function checkProhibitedWords(content) {
  const lowerContent = content.toLowerCase();
  return moderationRules.prohibited_words.some(word => 
    lowerContent.includes(word.toLowerCase())
  );
}

function createModerationEmbed(action, reason) {
  return new EmbedBuilder()
    .setColor(Colors.WARNING)
    .setTitle('⚠️ Ação de Moderação Automática')
    .addFields(
      { name: 'Ação', value: action, inline: true },
      { name: 'Motivo', value: reason, inline: false }
    )
    .setTimestamp();
}

// Helper to save AI config
function saveAIConfig() {
  fs.writeFileSync(aiConfigPath, JSON.stringify(aiConfig, null, 2));
}

module.exports = {
  checkFAQ,
  createFAQEmbed,
  generateAIResponse,
  checkSpam,
  checkProhibitedWords,
  createModerationEmbed,
  faqData,
  moderationRules,
  aiConfig,
  saveAIConfig,
  openaiClient,
  geminiClient
};
