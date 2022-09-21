import { Command } from 'app/command';
import { Client, CommandInteraction } from 'discord.js';

export const Ping: Command = {
  name: 'ping',
  description: 'Returns Pong',
  type: 1,
  run: async (client: Client, interaction: CommandInteraction) => {
    const content: string = 'Pong';

    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};
