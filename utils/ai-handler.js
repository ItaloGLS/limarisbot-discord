const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');
const { Colors } = require('./embeds');
require('dotenv').config();

// Load all data files
const faqDataPath = path.join(__dirname, '../data/faq.json');
const moderationRulesPath = path.join(__dirname, '../data/moderation-rules.json');
const aiConfigPath = path.join(__dirname, '../data/ai-config.json');

let faqData, moderationRules, aiConfig;

try {
  faqData = JSON.parse(fs.readFileSync(faqDataPath, 'utf8'));
  moderationRules = JSON.parse(fs.readFileSync(moderationRulesPath, 'utf8'));
  aiConfig = JSON.parse(fs.readFileSync(aiConfigPath, 'utf8'));
} catch (err) {
  console.error('Error loading data files:', err);
  faqData = { faqs: [] };
  moderationRules = { prohibited_words: [], rules: [] };
  aiConfig = { enabled: false };
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
  console.log('ℹ️ OpenAI not configured');
}

try {
  if (process.env.GEMINI_API_KEY) {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log('✅ Gemini client initialized');
  }
} catch (err) {
  console.log('ℹ️ Gemini not configured');
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
  if (!aiConfig.enabled) {
    return null;
  }
  
  try {
    const serverInfo = `
      Server Name: ${message.guild.name}
      Rules: ${moderationRules.rules.map(r => `- ${r.name}: ${r.description}`).join('\n')}
      FAQ: ${faqData.faqs.map(f => `- Q: ${f.question} A: ${f.answer}`).join('\n')}
    `.trim();
    
    const systemPrompt = `${aiConfig.system_prompt}\n\nServer Context:\n${serverInfo}`;
    
    if (aiConfig.provider === 'openai' && openaiClient) {
      const response = await openaiClient.chat.completions.create({
        model: aiConfig.model || 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message.content }
        ],
        temperature: 0.7,
        max_tokens: 500
      });
      
      return response.choices[0].message.content;
    } else if (aiConfig.provider === 'gemini' && geminiClient) {
      const model = geminiClient.getGenerativeModel({ 
        model: aiConfig.model || 'gemini-pro' 
      });
      
      const result = await model.generateContent(
        `${systemPrompt}\n\nUser: ${message.content}`
      );
      
      const response = await result.response;
      return response.text();
    }
    
    return null;
  } catch (error) {
    console.error('AI Error:', error);
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
