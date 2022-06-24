// Public imports
import fs from 'fs-extra'

// Private imports
import { toolsC } from './tools.js'

/*		=================		*/
/*		|	  CLASS		|		*/
/*		=================		*/

// Class pour gérer le serveur (admin)
export class servC {
	constructor (message, client, servID, servName) {
		this.message = message;
		this.client = client;
		this.servID = servID;
		this.path = "servers/" + servName + "/";
	}

	//execute la commande voulue
	async exec () {
		let parsed = this.parsing();
		if (!parsed)
			return ;
		if (parsed.command === "set admin")
			this.setAdmin(parsed);
		else if (parsed.command === "set backup")
			this.setBackup(parsed);
		return ;
	}

	//parsing des infos
	parsing () {
		let msg = this.message.content;
		let tools = new toolsC;

		//liste des commandes
		const possibilities = ["set admin", "set backup"];

		//protections
		if (!msg.startsWith("*server set "))
			return this.error(1);
		let splited = msg.split(' ');
		if (splited < 4)
			return this.error(1);
		let cmd = splited[1] + ' ' + splited[2]
		if (!tools.isCommand(cmd, possibilities))
			return this.error(1);
		let parts = [];
		for (let i in splited) {
			if (i > 2) {
				parts.push(splited[i]);
			}
		}
		let parsed = {
			"command": cmd,
			"args": parts
		};
		return (parsed);
	}

	//link le role admin (propriétaire)
	setAdmin (parsed) {
		if (this.message.member.guild.ownerID !== this.message.member.user.id)
			return this.error(2);
		if (parsed["args"].length !== 1)
			return this.error(1);
		if (!this.message.mentions.roles.first())
			return this.error(3);
		let tagRole = this.message.mentions.roles.first().id;
		let nameRole = this.message.mentions.roles.first().name;
		
		//ecriture dans les properties
		var datasheet = JSON.parse(fs.readFileSync(this.path + 'server_properties.json').toString());
		datasheet.roles.admin.id = tagRole;
		datasheet.roles.admin.name = nameRole;
		console.log(datasheet);
		let newdata = JSON.stringify(datasheet, null, 2);
		fs.writeFile(this.path + 'server_properties.json', newdata, 'utf8', undefined);
	}

	//crée un backup (admin)
	setBackup () {

	}

	//erreur de commande
	error (x) {
		if (x === 1) {
			this.message.channel.send("**Ce n'est pas une commande valide : *help**");
		}
		else if (x === 2) {
			this.message.channel.send("**Tu n'es pas autorisé à faire cette commande!**");
		}
		else if (x === 3) {
			this.message.channel.send("**Il faut mentionner le rôle!**");
		}
	}
}