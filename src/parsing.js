// Public imports
import fs from 'fs-extra'
import DiscordJS, { Guild, Intents, Message } from 'discord.js'

// Private imports
import { servC } from './serv.js'
import { playerC } from './player.js'
import { clubC } from './club.js'
import { helpC } from './help.js'

/*		================		*/
/*		|	  MAIN	   |		*/
/*		================		*/

export function pars (message, client) {
	let msg = message.content;

	//protection
	if (!msg.startsWith("*"))
		return ;
	
	//lance la commande *help
	else if (msg.startsWith("*help")) {
		let help = new helpC(message, client);
		help.exec();
	}

	//lance la commande *server
	else if (msg.startsWith("*server")) {
		let server = new servC(message, client);
		server.exec();
	}

	else if (msg.startsWith("*club")) {
		let club = new clubC(message, client);
		club.exec();
	}

	else if (msg.startsWith("*player")) {
		let player = new playerC(message, client);
		player.exec();
	}

	else {return}
}

/*		=================		*/
/*		|	  CLASS		|		*/
/*		=================		*/

class parse {
	constructor (msg, client) {
		this.msg = msg;
		this.client = client;
	}

	//parsing des infos
	getCommande () {
		
	}

	getArgs () {

	}

	//erreur de commande
	error (x) {

	}
}