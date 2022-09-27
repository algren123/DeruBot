import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from 'discord.js';

export const getDefaultRow = () => {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('confirm')
      .setLabel('Confirm')
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId('shuffle')
      .setLabel('Shuffle')
      .setStyle(ButtonStyle.Danger)
  );
};

export const getEndRow = () => {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('end')
      .setLabel('End')
      .setStyle(ButtonStyle.Danger)
  );
};

export const getDefaultEmbed = (
  teams: Map<any, any>,
  title = 'Shuffled Teams'
) => {
  return new EmbedBuilder()
    .setTitle(title)
    .setColor('Random')
    .setFields(
      {
        name: 'Team A',
        value: teams.get('a').join('\n'),
        inline: true,
      },
      {
        name: 'Team B',
        value: teams.get('b').join('\n'),
        inline: true,
      }
    );
};
