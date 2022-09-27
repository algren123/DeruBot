// @ts-nocheck
import {
  ApplicationCommandOptionType,
  Client,
  CommandInteraction,
} from 'discord.js';
import { Command } from 'app/command';
import { makeTeams } from '../services/teams';
import { getDefaultEmbed, getDefaultRow } from '../consts/templates';

export const Teams: Command = {
  name: 'teams',
  description: 'Splits the voice chat into even random teams',
  type: 1,
  options: [
    {
      name: 'channel',
      description: 'Channel to generate teams from',
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
    {
      name: 'game',
      description: 'Game to play',
      type: ApplicationCommandOptionType.String,
    },
  ],
  run: async (client: Client, interaction: CommandInteraction) => {
    const channel = interaction.options.getChannel('channel');
    const game = interaction.options.getString('game');
    const excludedUser = interaction.options.getMember('exclude');

    const users = [];
    for (const [memberId, member] of channel.members) {
      if (memberId !== excludedUser?.user.id) {
        users.push(`<@${memberId}>`);
      }
    }

    if (channel.type !== 2) {
      return interaction.followUp({
        content: 'Select a voice based channel',
      });
    }

    if (users.length % 2 !== 0) {
      return interaction.followUp({
        content: 'Not an even number of users present',
      });
    }

    global.currentTeams = makeTeams(users);

    const startRow = getDefaultRow();
    const collector = interaction.channel.createMessageComponentCollector({
      time: 10000,
    });

    collector.on('collect', async (i) => {
      if (i.customId === 'confirm') {
        startRow.components[0].setDisabled(true);
        startRow.components[1].setDisabled(true);
        await interaction.editReply({ components: [] });
      }
      if (i.customId === 'shuffle') {
        startRow.components[0].setDisabled(true);
        startRow.components[1].setDisabled(true);
        await interaction.editReply({ components: [startRow] });
      }
    });

    collector.on('end', async (i) => {
      startRow.components[0].setDisabled(false);
      startRow.components[1].setDisabled(false);
    });

    await interaction.followUp({
      embeds: [getDefaultEmbed(global.currentTeams, game)],
      components: [getDefaultRow()],
    });
  },
};
