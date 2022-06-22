// Mandatory imports

import DiscordJS, { Guild, Intents } from 'discord.js'
import dotenv from 'dotenv'

// Own imports
import { pars } from './src/parsing.js'

dotenv.config()

const client = new DiscordJS.Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MEMBERS,
	]
});

client.on('ready', () => {
	console.log("DislyteBot démarre!");
});

client.on("disconnected", () => {
	console.log("DislyteBot ne fonctionne plus!");
	process.exit(1);
});

client.on('message', message => {
	pars(message, client);
})

client.login(process.env.TOKEN)