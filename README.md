# Limaris Studios Discord Bot

A professional Discord bot for the Limaris Studios community, featuring moderation, welcome messages, devlogs, tickets, and announcements!

## Features

- 🎉 **Automatic Welcome Messages**: Beautiful, detailed welcome messages for new members
- 🛡️ **Moderation Tools**: Ban, kick, mute, unmute, and clear messages
- 📝 **Devlog System**: Post professional development updates
- 🎫 **Ticket System**: Easy-to-use support ticket system with buttons
- 📢 **Mass Announcements**: Send DM announcements to all server members
- ℹ️ **Information Commands**: Server info, user info, and bot status
- 🎮 **Fun Commands**: Magic 8-ball for entertainment
- ⚙️ **Configuration**: Easy channel setup for all features

## Commands

### Moderation
- `/ban <member> [reason] [delete-messages]` - Ban a member with optional message deletion
- `/kick <member> [reason]` - Kick a member
- `/mute <member> [reason] [duration]` - Mute a member temporarily or permanently
- `/unmute <member>` - Unmute a member
- `/promote <member> <role>` - Assign a role to a member
- `/clear <amount> [user]` - Purge messages from a channel

### Configuration
- `/setwelcome <channel>` - Set the welcome channel
- `/setdevlog <channel>` - Set the devlog channel
- `/setticketchannel <channel>` - Set the ticket creation channel
- `/setuptickets` - Create the ticket interface button

### Announcement
- `/announce <title> <message> [image]` - Send a professional announcement via DM to all members (Admin only)

### Information
- `/serverinfo` - Show detailed server information
- `/userinfo [user]` - Show user information (defaults to yourself)
- `/ping` - Check the bot's latency
- `/help` - Show all available commands

### Other
- `/devlog <title> <content> [image]` - Send a professional devlog
- `/8ball <question>` - Ask the magic 8-ball a question

## Ticket System Usage

1. **Set Ticket Channel**: Use `/setticketchannel` to set the channel where tickets can be created
2. **Setup Ticket Interface**: Use `/setuptickets` to create the ticket creation button
3. **Create Ticket**: Members click the "Create Ticket" button to open a support ticket
4. **Close Ticket**: Click the close button in the ticket channel to close and delete it

## Setup

1. **Create a Discord Application**: Go to [Discord Developers](https://discord.com/developers/applications) and create a new application.
2. **Add a Bot**: In the "Bot" tab, click "Add Bot" and copy your bot token.
3. **Enable Intents**: Enable "Server Members Intent" and "Message Content Intent" in the "Bot" tab.
4. **Invite the Bot**: Go to "OAuth2" → "URL Generator", check "bot" and "applications.commands", then check the necessary permissions (or Administrator for ease).
5. **Configure the Bot**:
   - Rename `.env.example` to `.env`
   - Fill in your bot token, client ID, and guild ID in the `.env` file
6. **Install Dependencies**: Run `npm install`
7. **Deploy Commands**: Run `npm run deploy`
8. **Start the Bot**: Run `npm start`

## Hosting on Render

1. **Push to GitHub**: Upload your code to a GitHub repository
2. **Connect to Render**: Go to [Render](https://render.com/) and create a new "Web Service"
3. **Configure**:
   - Connect your GitHub repository
   - Set the build command to `npm install`
   - Set the start command to `npm start`
4. **Environment Variables**: Add your `.env` variables (DISCORD_TOKEN, CLIENT_ID, GUILD_ID) in the Render dashboard
5. **Deploy**: Click "Create Web Service" and watch your bot go live!

### Keeping it Online 24/7

Use a service like [UptimeRobot](https://uptimerobot.com/) to ping your Render web service every 5-10 minutes to prevent it from sleeping.

## License

ISC
