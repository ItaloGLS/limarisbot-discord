
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('promover')
    .setDescription('Atribui um cargo a um membro')
    .addUserOption(option =>
      option.setName('membro')
        .setDescription('Membro que receberá o cargo')
        .setRequired(true))
    .addRoleOption(option =>
      option.setName('cargo')
        .setDescription('Cargo a ser atribuído')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
  async execute(interaction) {
    const member = interaction.options.getMember('membro');
    const role = interaction.options.getRole('cargo');

    if (!member) {
      return interaction.reply({ content: 'Membro não encontrado!', ephemeral: true });
    }

    if (role.position >= interaction.member.roles.highest.position) {
      return interaction.reply({ content: 'Você não tem permissão para atribuir este cargo!', ephemeral: true });
    }

    await member.roles.add(role);
    const embed = new EmbedBuilder()
      .setColor('#10B981')
      .setTitle('Cargo Atribuído')
      .addFields(
        { name: 'Membro', value: `${member.user.tag}`, inline: true },
        { name: 'Cargo', value: `${role.name}`, inline: true },
        { name: 'Moderador', value: `${interaction.user.tag}` }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
