import { Command } from './command';
import { Ban } from './commands/ban';
import { Kick } from './commands/kick';
import { Ping } from './commands/ping';

export const Commands: Command[] = [Ping, Ban, Kick];
