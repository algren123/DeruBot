// @ts-nocheck
import { Client, CommandInteraction, EmbedBuilder } from 'discord.js';
import { Command } from 'app/command';
import { shuffle } from '../helpers/shuffle';

export const Teams: Command = {
  name: 'teams',
  description: 'Splits the voice chat into even random teams',
  type: 1,
  options: [
    // {
    //   name: 'size',
    //   description: 'Size of teams',
    //   type: 4,
    //   required: true,
    // },
    {
      name: 'channel',
      description: 'Channel to generate teams from',
      type: 7,
      required: true,
    },
    {
      name: 'game',
      description: 'Game to play',
      type: 3,
    },
    {
      name: 'exclude',
      description: 'User to exclude from team generation',
      type: 6,
    },
  ],
  run: async (client: Client, interaction: CommandInteraction) => {
    // const teamSize = interaction.options.getInteger('size');
    const channel = interaction.options.getChannel('channel');
    const game = interaction.options.getString('game');
    const excludedUser = interaction.options.getMember('exclude');

    const users = [];
    for (const [memberId, member] of channel.members) {
      users.push(`<@${memberId}>`);
    }

    const playersNumber = excludedUser ? users?.length + 1 : users?.length;

    if (channel.type !== 'voice') {
      interaction.followUp({
        content: 'Select a voice based channel',
      });
    }

    if (playersNumber % 2 !== 0) {
      interaction.followUp({
        content: 'Not an even number of users present',
      });
    }

    const players = shuffle(users);

    const teamA = [];
    const teamB = [];

    for (let i = 0; i < players?.length; i++) {
      if ((i + 2) % 2 === 0) {
        teamA.push(players[i]);
      } else {
        teamB.push(players[i]);
      }
    }

    const embed = new EmbedBuilder()
      .setTitle(`${game} Teams`)
      .setColor('Random')
      .setFields(
        {
          name: 'Team A',
          value: teamA.join('\n'),
          inline: true,
        },
        {
          name: 'Team B',
          value: teamB?.join('\n'),
          inline: true,
        }
      );

    await interaction.followUp({ embeds: [embed] });
  },
};
