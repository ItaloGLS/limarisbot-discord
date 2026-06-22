
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Expulsa um membro do servidor')
    .addUserOption(option =>
      option.setName('membro')
        .setDescription('Membro a ser expulso')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('motivo')
        .setDescription('Motivo da expulsão'))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  async execute(interaction) {
    const member = interaction.options.getMember('membro');
    const reason = interaction.options.getString('motivo') || 'Não especificado';

    if (!member) {
      return interaction.reply({ content: 'Membro não encontrado!', ephemeral: true });
    }

    if (member.id === interaction.user.id) {
      return interaction.reply({ content: 'Você não pode expulsar a si mesmo!', ephemeral: true });
    }

    if (member.roles.highest.position >= interaction.member.roles.highest.position) {
      return interaction.reply({ content: 'Você não tem permissão para expulsar este membro!', ephemeral: true });
    }

    await member.kick(reason);
    const embed = new EmbedBuilder()
      .setColor('#F59E0B')
      .setTitle('Membro Expulso')
      .addFields(
        { name: 'Membro', value: `${member.user.tag}`, inline: true },
        { name: 'Moderador', value: `${interaction.user.tag}`, inline: true },
        { name: 'Motivo', value: reason }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
