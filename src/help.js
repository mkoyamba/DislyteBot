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
		let msg = this.message.content;
		if (msg == "*help")
			return this.all();
		else if (msg == "*help server")
			return this.server();
		else if (msg == "*help club")
			return this.club();
		else if (msg == "*help player")
			return this.player();
		else if (msg == "*help esper")
			return this.esper();
		return ;
	}


	all () {
		let msg = "```cs\n";
		msg += "  Liste des commandes :\n\n\n";
		msg += "# SERVER                   CLUB                       PLAYER\n\n";
		msg += "  *server set admin        *club add [nom][role]      *player add [nom][tag]\n";
		msg += "  *server set welcome      *club remove [nom]         *player remove [nom]\n";
		msg += "                           *club list                 *player info [nom]\n";
		msg += "                           *club members [nom?]       *player stat set [args]\n";
		msg += "                                                      *player stat adminset [args]\n";
		msg += "                                                      *player stats\n";
		msg += "                                                      *player adminstats\n\n\n\n";
		msg += "# ESPER                                           HELP\n\n";
		msg += "  *esper [esper][niveau][speed]                   *help\n";
		msg += "  *esper remove [esper]                           *help server\n";
		msg += "  *esper list {en maintenance}                    *help club\n";
		msg += "  *esper admin [pseudo][esper][niv][speed]        *help player\n";
		msg += "  *esper admin remove [pseudo][esper]             *help esper\n\n\n";
		msg += "# DyslyteHelper by konwiz\n";
		msg += "```";
		let msgE = new DiscordJS.MessageEmbed();
		msgE.setDescription(msg);
		return this.message.channel.send(msgE)
	}

	server () {

	}

	club () {

	}

	player () {

	}

	esper () {

	}

	error (x) {
		if (x === 1) {
			this.message.channel.send("**Ce n'est pas une commande valide : *help**");
		}
	}
}