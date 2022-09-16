import { Client, EmbedBuilder } from 'discord.js';
import { Commands } from '../commands';
import { retrieveUpdates } from '../services/scraper';

export default (client: Client): void => {
  const initSchedule = () => {
    setInterval(checkForUpdates, 14400000);
  };

  const checkForUpdates = () => {
    retrieveUpdates().then((newPosts) => {
      if (newPosts?.length) {
        newPosts.map(async (post) => {
          const embed = new EmbedBuilder()
            .setTitle(post?.patchTitle as string)
            .setURL(post?.patchLink as string)
            .setImage(post?.patchImage as string)
            .setDescription(post?.patchDescription as string);

          const channel = client.channels.cache.find(
            // @ts-ignore
            (channel) => channel.name === 'patch-notes'
          );
          // @ts-ignore
          await channel?.send({ embeds: [embed] });
        });
      }
    });
  };

  client.on('ready', async () => {
    if (!client.user || !client.application) {
      return;
    }

    await client.application.commands.set(Commands);

    console.log(`${client.user.username} is online.`);
    console.log(`Currently in ${client.guilds.cache.size} servers!`);
    console.log('---------------------');

    initSchedule();
  });

  client.on('guildMemberAdd', (member) => {});
};
