import { Client, GatewayIntentBits } from 'discord.js';
import ready from '../listeners/ready';
import interactionCreate from '../listeners/interactionCreate';

require('dotenv').config();

const token = process.env.TOKEN;

console.log('Bot is starting...');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

ready(client);
interactionCreate(client);

client.login(token);
