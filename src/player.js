// Public imports
import fs from 'fs-extra'
import DiscordJS from 'discord.js'

// Private imports
import { objTempC } from './../templates/object_templates.js'
import { msgTempC } from './../templates/message_templates.js'
import { toolsC } from './tools.js'

/*		=================		*/
/*		|	  CLASS		|		*/
/*		=================		*/

// Class pour gérer les joueurs
export class playerC {
	constructor (message, client, servID, servName) {
		this.message = message;
		this.client = client;
		this.servID = servID;
		this.path = "servers/" + servName + "/";
		this.elist = ["donar", "jinyuyao", "tiye", "lewis", "tangxuan",
				"raven", "narmer", "liling", "triki", "hyde", "biondina",
				"gabrielle", "sally", "ollie", "unas", "lucas", "clara",
				"cecilia", "sienna", "tevor", "ahmed", "asnath", "catherine",
				"linxiao", "anesidora", "taylor", "bonnie", "nicole", "laura"]
	}

	async exec () {
		let parsed = this.parsing();
		if (!parsed)
			return ;
	}

	//parsing des infos
	parsing () {
		let msg = this.message.content;
		let tools = new toolsC;

		//liste des commandes
		const possibilities = ["add", "remove", "pseudo", "info set",
						"info get", "stat get", "stat set", "esper add",
						"esper remove"];

		//protections
		let splited = msg.split(' ');
		if (splited.length < 3)
			return this.error(1);
		let cmd = "";
		if (splited[1] === "add" || splited[1] === "remove" || splited[1] === "pseudo")
			cmd = splited[1];
		else
			cmd = splited[1] + " " + splited[2];
		if (!tools.isCommand(cmd, possibilities))
			return this.error(1);
		let parts = [];
		for (let i in splited) {
			if (i === 1 && cmd.length === 1)
				parts.push(splited[i]);
			if (i > 2) {
				parts.push(splited[i]);
			}
		}
		let parsed = {
			"command": cmd,
			"args": parts
		};
		console.log(parsed)
		return (parsed);
	}

	new () {
		
	}

	setInfos () {
		
	}

	setPseudo () {

	}

	error (x) {
		if (x === 1) {
			this.message.channel.send("**Ce n'est pas une commande valide : *help**");
		}
		else if (x === 2) {
			this.message.channel.send("**Tu n'es pas autorisé à faire cette commande!**");
		}
		else if (x === 3) {
			this.message.channel.send("**Arguments invalides.**");
		}
		else if (x === 4) {
			this.message.channel.send("**Il faut mentionner le rôle!**");
		}
		else if (x === 5) {
			this.message.channel.send("**Nombre de clubs maximum atteind!**");
		}
		else if (x === 6) {
			this.message.channel.send("**Club inexistant!**");
		}
		else if (x === 7) {
			this.message.channel.send("**Le nom est trop long.**");
		}
		else if (x === 8) {
			this.message.channel.send("**Ce club n'existe pas.**");
		}
		else if (x === 9) {
			this.message.channel.send("**Ce club existe déjà.**");
		}
	}
}