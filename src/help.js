// Public imports
import fs from 'fs-extra'
import DiscordJS from 'discord.js'

// Private imports


/*		=================		*/
/*		|	  CLASS		|		*/
/*		=================		*/

// Class d'aide
export class helpC {
	constructor (message, client, servID, servName) {
		this.message = message;
		this.client = client;
		this.servID = servID;
		this.path = "servers/" + servName + "/";
	}

	async exec () {
		
	}

	//parsing des infos
	parsing () {
		
	}

	error (x) {
		
	}
}