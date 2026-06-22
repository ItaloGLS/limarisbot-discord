const { Events, EmbedBuilder } = require('discord.js');
const config = require('../config.json');
const { Colors } = require('../utils/embeds');

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    if (!config.welcomeChannelId) return;
    const channel = member.guild.channels.cache.get(config.welcomeChannelId);
    if (!channel) return;

    // Calculate account age
    const accountAge = Date.now() - member.user.createdTimestamp;
    const ageDays = Math.floor(accountAge / (1000 * 60 * 60 * 24));
    const ageWeeks = Math.floor(ageDays / 7);
    const ageMonths = Math.floor(ageDays / 30);

    const embed = new EmbedBuilder()
      .setColor(Colors.WELCOME)
      .setTitle('🎉 Welcome to Limaris Studios!')
      .setDescription(`Hello ${member}! We're thrilled to have you here in our community for our upcoming horror game with liminal space elements!`)
      .addFields(
        { name: '📅 Account Age', value: ageMonths > 0 ? `${ageMonths} month(s) old` : ageWeeks > 0 ? `${ageWeeks} week(s) old` : `${ageDays} day(s) old`, inline: true },
        { name: '👤 Member #', value: `${member.guild.memberCount}th member!`, inline: true }
      )
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
      .setImage('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1000&h=300&fit=crop') // Nice liminal-space-like header
      .setTimestamp()
      .setFooter({ 
        text: 'Limaris Studios • Welcome aboard!', 
        iconURL: member.guild.iconURL({ dynamic: true }) 
      });

    await channel.send({ 
      content: `Welcome ${member}! 👋`,
      embeds: [embed] 
    });
  },
};
