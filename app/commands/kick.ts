// @ts-nocheck
import { Command } from 'app/command';
import { Client, CommandInteraction, EmbedBuilder } from 'discord.js';

export const Kick: Command = {
  name: 'kick',
  description: 'Kicks a user',
  type: 1,
  options: [
    {
      name: 'target',
      description: 'User to kick',
      type: 6,
      required: true,
    },
    {
      name: 'reason',
      description: 'Reason for kick',
      type: 3,
    },
  ],
  run: async (client: Client, interaction: CommandInteraction) => {
    const user = interaction.member;
    const kickedMember = interaction.options.getMember('target');

    if (!user?.permissions.has('KICK_MEMBERS'))
      return interaction.followUp({
        content: 'You do not have permissions to kick someone.',
        ephemeral: true,
      });

    if (!kickedMember)
      return interaction.followUp({
        content: 'The user is not in the server anymore',
        ephemeral: true,
      });

    if (!kickedMember.kickable)
      return interaction.followUp({
        content: 'User too stronk',
        ephemeral: true,
      });

    const reason = interaction.options.getString('reason')
      ? interaction.options.getString('reason')
      : 'for no reason.';

    const dmEmbed = new EmbedBuilder().setDescription(
      `:white_check_mark: You have been kicked from **${interaction.guild.name}** | ${reason}`
    );

    const embed = new EmbedBuilder().setDescription(
      `:white_check_mark: ${user} has kicked ${kickedMember} for ${reason}`
    );

    await kickedMember.send({ embeds: [dmEmbed] }).catch((err) => {
      console.log('I cannot send DMs to this user!');
    });

    await interaction
      .followUp({ embeds: [embed] })
      .catch((err) => console.log(err));

    await kickedMember.kick();
  },
};
