// @ts-nocheck
import { Command } from 'app/command';
import { Client, CommandInteraction, EmbedBuilder } from 'discord.js';

export const Ban: Command = {
  name: 'ban',
  description: 'Bans a user',
  type: 1,
  options: [
    {
      name: 'target',
      description: 'User to ban',
      type: 6,
      required: true,
    },
    {
      name: 'reason',
      description: 'Reason for ban',
      type: 3,
    },
  ],
  run: async (client: Client, interaction: CommandInteraction) => {
    const user = interaction.member;
    const bannedMember = interaction.options.getMember('target');

    if (!user?.permissions.has('BAN_MEMBERS'))
      return interaction.followUp({
        content: 'You do not have permissions to ban someone.',
        ephemeral: true,
      });

    if (!bannedMember)
      return interaction.followUp({
        content: 'The user is not in the server anymore',
        ephemeral: true,
      });

    if (!bannedMember.kickable)
      return interaction.followUp({
        content: 'User too stronk',
        ephemeral: true,
      });

    const reason = interaction.options.getString('reason')
      ? interaction.options.getString('reason')
      : 'for no reason.';

    const dmEmbed = new EmbedBuilder().setDescription(
      `:white_check_mark: You have been banned from **${interaction.guild.name}** | ${reason}`
    );

    const embed = new EmbedBuilder().setDescription(
      `:white_check_mark: ${user} has banned ${bannedMember} for ${reason}`
    );

    await bannedMember.send({ embeds: [dmEmbed] }).catch((err) => {
      console.log('I cannot send DMs to this user!');
    });

    await interaction.followUp({ embeds: [embed] });
    await bannedMember.ban();
  },
};
