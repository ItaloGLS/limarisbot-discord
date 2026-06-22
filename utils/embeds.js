const { EmbedBuilder } = require('discord.js');

// Consistent color palette
const Colors = {
  PRIMARY: '#5865F2',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  INFO: '#3B82F6',
  DEVLOG: '#8B5CF6',
  WELCOME: '#06B6D4',
  FUN: '#EC4899'
};

// Create a base embed with server info
function createBaseEmbed(interaction) {
  return new EmbedBuilder()
    .setTimestamp()
    .setFooter({ 
      text: interaction.guild.name, 
      iconURL: interaction.guild.iconURL({ dynamic: true }) 
    });
}

// Success embed
function successEmbed(interaction, title, description) {
  return createBaseEmbed(interaction)
    .setColor(Colors.SUCCESS)
    .setTitle(`✅ ${title}`)
    .setDescription(description);
}

// Error embed
function errorEmbed(interaction, title, description) {
  return createBaseEmbed(interaction)
    .setColor(Colors.ERROR)
    .setTitle(`❌ ${title}`)
    .setDescription(description);
}

// Info embed
function infoEmbed(interaction, title, description) {
  return createBaseEmbed(interaction)
    .setColor(Colors.INFO)
    .setTitle(`ℹ️ ${title}`)
    .setDescription(description);
}

module.exports = {
  Colors,
  createBaseEmbed,
  successEmbed,
  errorEmbed,
  infoEmbed
};
