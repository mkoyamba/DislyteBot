// Mandatory imports
import DiscordJS, { Guild, Intents } from 'discord.js'
import dotenv from 'dotenv'
import fs from 'fs-extra'

// Own imports
import { pars } from './src/parsing.js'
import { holoC } from './src/holo.js'
import { googleC } from './src/google.js'

dotenv.config();
fs.mkdir("servers").catch((error) => {
	console.log("Dossier déjà présent.")
});
let googleU = new googleC;
googleU.getDrive();

//infos du serveur
const client = new DiscordJS.Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS
	],
	partials: [
		'MESSAGE',
		'CHANNEL',
		'REACTION'
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
	if (message.content.startsWith("*")) {
		pars(message, client, message.guild.id, message.guild.name);
	}
})

//récupération de l'interaction
client.on('interactionCreate', async interaction => {
	if (interaction.isButton()) {
		if (interaction.customId.startsWith("holo")) {
			let google = new googleC(interaction.guild.id);
			const holo = new holoC;
			holo.interaction(interaction, interaction.guild.id)
			google.update();
			return interaction.deferUpdate();
		}
	}
})

client.on("messageReactionAdd", async (reaction, user) => {
	if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			return ;
		}
	}
	if (reaction.emoji.name !== "🔄")
		return;
	if (!reaction.message.embeds[0] || reaction.message.embeds[0].title !== "Status de l'holocombat")
		return ;
	const holo = new holoC;
	holo.update(reaction, reaction.message.guild.id, user);
})

client.on("messageReactionRemove", async (reaction, user) => {
	if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			return ;
		}
	}
	if (reaction.emoji.name !== "🔄")
		return;
	if (!reaction.message.embeds[0] || reaction.message.embeds[0].title !== "Status de l'holocombat")
		return ;
	const holo = new holoC;
	holo.update(reaction, reaction.message.guild.id, user);
})

client.login(process.env.TOKEN)