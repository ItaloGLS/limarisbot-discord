const { Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits } = require('discord.js');
const config = require('../config.json');
const { Colors, successEmbed, errorEmbed } = require('../utils/embeds');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    // Handle chat commands
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(`Error executing ${interaction.commandName}`);
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
          await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
      }
    }

    // Handle button interactions for tickets
    else if (interaction.isButton()) {
      // Ticket creation button
      if (interaction.customId === 'create_ticket') {
        await handleTicketCreation(interaction);
      }
      
      // Ticket closure button
      else if (interaction.customId === 'close_ticket') {
        await handleTicketClosure(interaction);
      }
      
      // Ticket confirmation close button
      else if (interaction.customId === 'confirm_close') {
        await confirmCloseTicket(interaction);
      }
      
      // Cancel close ticket button
      else if (interaction.customId === 'cancel_close') {
        await cancelCloseTicket(interaction);
      }
    }
  },
};

// Helper function to create a ticket
async function handleTicketCreation(interaction) {
  await interaction.deferReply({ ephemeral: true });

  // Find or create "Tickets" category
  let category = interaction.guild.channels.cache.find(c => c.name.toLowerCase().includes('tickets') && c.type === ChannelType.GuildCategory);
  if (!category) {
    category = await interaction.guild.channels.create({
      name: 'Tickets',
      type: ChannelType.GuildCategory
    });
  }

  // Create ticket channel name
  const ticketNumber = interaction.guild.channels.cache.filter(c => c.parentId === category.id && c.name.startsWith('ticket-')).size + 1;
  const ticketChannel = await interaction.guild.channels.create({
    name: `ticket-${interaction.user.username}-${ticketNumber}`,
    type: ChannelType.GuildText,
    parent: category.id,
    permissionOverwrites: [
      {
        id: interaction.guild.id,
        deny: [PermissionFlagsBits.ViewChannel],
      },
      {
        id: interaction.user.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.AttachFiles,
          PermissionFlagsBits.EmbedLinks,
          PermissionFlagsBits.ReadMessageHistory
        ],
      },
    ],
  });

  // If there's a staff role, add it
  if (config.staffRoleId) {
    await ticketChannel.permissionOverwrites.create(config.staffRoleId, {
      ViewChannel: true,
      SendMessages: true,
      ReadMessageHistory: true
    });
  }

  // Create ticket embed
  const ticketEmbed = new EmbedBuilder()
    .setColor(Colors.PRIMARY)
    .setTitle('🎫 New Support Ticket')
    .setDescription(`Hello ${interaction.user}!\n\nOur staff team will assist you shortly. Please describe your issue below!`)
    .addFields(
      { name: 'Ticket Creator', value: `${interaction.user}`, inline: true },
      { name: 'Created At', value: `<t:${Math.floor(Date.now() / 1000)}:f>`, inline: true }
    )
    .setFooter({ text: 'Limaris Studios Support' });

  // Add close button
  const closeButton = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('close_ticket')
        .setLabel('Close Ticket')
        .setEmoji('🔒')
        .setStyle(ButtonStyle.Danger)
    );

  // Send message in ticket channel
  await ticketChannel.send({ 
    content: `${interaction.user}`,
    embeds: [ticketEmbed], 
    components: [closeButton] 
  });

  await interaction.editReply({ 
    embeds: [successEmbed(interaction, 'Ticket Created!', `Your ticket has been created: ${ticketChannel}`)] 
  });
}

// Handle ticket closure confirmation
async function handleTicketClosure(interaction) {
  const confirmEmbed = new EmbedBuilder()
    .setColor(Colors.WARNING)
    .setTitle('🔒 Confirm Ticket Closure')
    .setDescription('Are you sure you want to close this ticket? This action cannot be undone!');

  const confirmButtons = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('confirm_close')
        .setLabel('Yes, Close Ticket')
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId('cancel_close')
        .setLabel('Cancel')
        .setStyle(ButtonStyle.Secondary)
    );

  await interaction.reply({ embeds: [confirmEmbed], components: [confirmButtons], ephemeral: true });
}

// Confirm and close ticket
async function confirmCloseTicket(interaction) {
  await interaction.deferUpdate();
  
  const closedEmbed = new EmbedBuilder()
    .setColor(Colors.ERROR)
    .setTitle('🎫 Ticket Closed')
    .setDescription('This ticket has been closed. The channel will be deleted in 10 seconds.');

  await interaction.channel.send({ embeds: [closedEmbed] });
  
  // Delete the channel after 10 seconds
  setTimeout(async () => {
    try {
      await interaction.channel.delete('Ticket closed');
    } catch (error) {
      console.error('Failed to delete ticket channel:', error);
    }
  }, 10000);
}

// Cancel ticket closure
async function cancelCloseTicket(interaction) {
  await interaction.deferUpdate();
  
  const canceledEmbed = new EmbedBuilder()
    .setColor(Colors.SUCCESS)
    .setTitle('✅ Closure Canceled')
    .setDescription('Ticket closure has been canceled.');

  await interaction.followUp({ embeds: [canceledEmbed], ephemeral: true });
}
