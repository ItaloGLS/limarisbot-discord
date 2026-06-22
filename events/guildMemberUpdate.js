const { Events } = require('discord.js');

module.exports = {
  name: Events.GuildMemberUpdate,
  async execute(oldMember, newMember) {
    // Check if timeout was removed
    if (oldMember.isCommunicationDisabled() && !newMember.isCommunicationDisabled()) {
      // Find muted role
      const mutedRole = newMember.guild.roles.cache.find(r => r.name === 'Muted');
      
      // Remove muted role if present
      if (mutedRole && newMember.roles.cache.has(mutedRole.id)) {
        try {
          await newMember.roles.remove(mutedRole);
        } catch (error) {
          console.error('Failed to remove muted role after timeout:', error);
        }
      }
    }
  },
};
