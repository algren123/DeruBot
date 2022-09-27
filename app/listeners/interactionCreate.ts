// @ts-nocheck
import {
  CommandInteraction,
  Client,
  Interaction,
  ButtonInteraction,
  ChannelType,
} from 'discord.js';
import { getDefaultRow, getDefaultEmbed, getEndRow } from '../consts/templates';
import { shuffleTeams } from '../services/teams';
import { Commands } from '../commands';

export default (client: Client): void => {
  client.on('interactionCreate', async (interaction: Interaction) => {
    if (interaction.isCommand() || interaction.isContextMenuCommand()) {
      await handleSlashCommand(client, interaction);
    } else if (interaction.isButton()) {
      switch (interaction.customId) {
        case 'confirm':
          handleConfirmButton(client, interaction);
          break;
        case 'shuffle':
          handleShuffleButton(client, interaction);
          break;
        case 'end':
          handleEndButton(client, interaction);
          break;
        default:
          await interaction.deferReply();
          await interaction.followUp({ content: 'Button not found' });
          break;
      }
    }
  });
};

const handleSlashCommand = async (
  client: Client,
  interaction: CommandInteraction
): Promise<void> => {
  const slashCommand = Commands.find((c) => c.name === interaction.commandName);
  if (!slashCommand) {
    interaction.followUp({ content: 'An error has occured.' });
    return;
  }

  await interaction.deferReply();
  slashCommand.run(client, interaction);
};

const handleConfirmButton = async (
  client: Client,
  interaction: Interaction
): Promise<void> => {
  const channelA = await interaction.guild.channels.create({
    name: 'Team A',
    type: ChannelType.GuildVoice,
  });
  const channelB = await interaction.guild.channels.create({
    name: 'Team B',
    type: ChannelType.GuildVoice,
  });

  const endRow = getEndRow();

  const members = interaction.channel.members;
  const teamAIds = global.currentTeams.get('a');
  const teamBIds = global.currentTeams.get('b');
  const teamA = members.filter((member) => teamAIds.includes(member.id));
  const teamB = members.filter((member) => teamBIds.includes(member.id));

  for (const [memberId, member] of teamA) {
    member.voice.setChannel(channelA);
  }
  for (const [memberId, member] of teamB) {
    member.voice.setChannel(channelB);
  }

  await interaction.deferReply();
  await interaction.followUp({
    embeds: [getDefaultEmbed(global.currentTeams)],
    components: [endRow],
  });
};

const handleShuffleButton = async (
  client: Client,
  interaction: ButtonInteraction
): Promise<void> => {
  global.currentTeams = shuffleTeams(global.currentTeams);

  const startRow = getDefaultRow();
  const defaultRow = getDefaultRow();
  const collector = interaction.channel.createMessageComponentCollector({
    time: 10000,
  });

  collector.on('collect', async (i) => {
    if (i.customId === 'confirm') {
      startRow.components[0].setDisabled(true);
      startRow.components[1].setDisabled(true);
      interaction.editReply({ components: [] });
    }
    if (i.customId === 'shuffle') {
      startRow.components[0].setDisabled(true);
      startRow.components[1].setDisabled(true);
      interaction.editReply({ components: [startRow] });
    }
  });

  collector.on('end', async (i) => {
    startRow.components[0].setDisabled(false);
    startRow.components[1].setDisabled(false);
  });

  await interaction.deferReply();
  await interaction.followUp({
    embeds: [getDefaultEmbed(global.currentTeams)],
    components: [defaultRow],
  });
};

const handleEndButton = async (
  client: Client,
  interaction: Interaction
): Promise<void> => {
  const returnChannel = interaction.guild?.channels.cache.find(
    (channel) => channel.type === ChannelType.GuildVoice
  );
  const teamAChannel = interaction.guild?.channels.cache.find(
    (channel) => channel.name === 'Team A'
  );
  const teamBChannel = interaction.guild?.channels.cache.find(
    (channel) => channel.name === 'Team B'
  );

  for (const [memberId, member] of teamAChannel.members) {
    await member.voice.setChannel(returnChannel);
  }
  for (const [memberId, member] of teamBChannel.members) {
    await member.voice.setChannel(returnChannel);
  }

  teamAChannel.delete();
  teamBChannel.delete();

  await interaction.deferReply();
  await interaction.followUp({ content: 'Session Ended' });
};
