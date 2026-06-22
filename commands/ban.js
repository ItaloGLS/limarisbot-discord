
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bane um membro do servidor')
    .addUserOption(option =>
      option.setName('membro')
        .setDescription('Membro a ser banido')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('motivo')
        .setDescription('Motivo do banimento'))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    const member = interaction.options.getMember('membro');
    const reason = interaction.options.getString('motivo') || 'Não especificado';

    if (!member) {
      return interaction.reply({ content: 'Membro não encontrado!', ephemeral: true });
    }

    if (member.id === interaction.user.id) {
      return interaction.reply({ content: 'Você não pode banir a si mesmo!', ephemeral: true });
    }

    if (member.roles.highest.position >= interaction.member.roles.highest.position) {
      return interaction.reply({ content: 'Você não tem permissão para banir este membro!', ephemeral: true });
    }

    await member.ban({ reason });
    const embed = new EmbedBuilder()
      .setColor('#EF4444')
      .setTitle('Membro Banido')
      .addFields(
        { name: 'Membro', value: `${member.user.tag}`, inline: true },
        { name: 'Moderador', value: `${interaction.user.tag}`, inline: true },
        { name: 'Motivo', value: reason }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
