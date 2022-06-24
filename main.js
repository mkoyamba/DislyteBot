// Mandatory imports

import DiscordJS, { Guild, Intents } from 'discord.js'
import dotenv from 'dotenv'

// Own imports
import { pars } from './src/parsing.js'

dotenv.config();

//infos du serveur
const client = new DiscordJS.Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MEMBERS,
	]
});

//démarrage du bot
client.on('ready', () => {
	console.log("DislyteBot démarre!");
});

//déconnexion du bot
client.on("disconnected", () => {
	console.log("DislyteBot ne fonctionne plus!");
	process.exit(1);
});

//récupération du message
client.on('message', message => {
	pars(message, client, message.guild.id, message.guild.name);
})

client.login(process.env.TOKEN)