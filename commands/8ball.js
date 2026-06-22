const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Colors, createBaseEmbed } = require('../utils/embeds');

// Classic 8-ball responses
const responses = [
  "It is certain.",
  "It is decidedly so.",
  "Without a doubt.",
  "Yes definitely.",
  "You may rely on it.",
  "As I see it, yes.",
  "Most likely.",
  "Outlook good.",
  "Yes.",
  "Signs point to yes.",
  "Reply hazy, try again.",
  "Ask again later.",
  "Better not tell you now.",
  "Cannot predict now.",
  "Concentrate and ask again.",
  "Don't count on it.",
  "My reply is no.",
  "My sources say no.",
  "Outlook not so good.",
  "Very doubtful."
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Ask the magic 8-ball a question')
    .addStringOption(option =>
      option.setName('question')
        .setDescription('Your question for the 8-ball')
        .setRequired(true)),
  async execute(interaction) {
    const question = interaction.options.getString('question');
    const answer = responses[Math.floor(Math.random() * responses.length)];

    const embed = createBaseEmbed(interaction)
      .setColor(Colors.FUN)
      .setTitle('🎱 Magic 8-Ball')
      .addFields(
        { name: '❓ Your Question', value: question, inline: false },
        { name: '🎱 My Answer', value: `**${answer}**`, inline: false }
      )
      .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Magic_8-Ball.jpg/800px-Magic_8-Ball.jpg');

    await interaction.reply({ embeds: [embed] });
  },
};
