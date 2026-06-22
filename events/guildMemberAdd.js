
const { Events, EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    if (!config.welcomeChannelId) return;
    const channel = member.guild.channels.cache.get(config.welcomeChannelId);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle('Bem-vindo(a) ao Limaris Studios!')
      .setDescription(`Olá ${member}, seja muito bem-vindo(a) ao servidor da Limaris Studios! Estamos felizes em ter você aqui para acompanhar o desenvolvimento do nosso jogo de terror com elementos de liminal space!`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setFooter({ text: 'Limaris Studios' });

    await channel.send({ embeds: [embed] });
  },
};
