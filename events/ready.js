const { Events, ActivityType } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`✅ Successfully logged in as ${client.user.tag}`);
    console.log(`📊 Connected to ${client.guilds.cache.size} servers`);
    console.log(`👥 Managing ${client.users.cache.size} users`);
    
    // Set rich presence
    client.user.setActivity({
      name: 'Limaris Studios',
      type: ActivityType.Watching,
      state: 'the community grow'
    });

    console.log('🎮 Presence set successfully');
  },
};
