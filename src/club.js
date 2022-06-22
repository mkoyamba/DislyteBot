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

// Class pour gérer les clubs
export class clubC {
	constructor (message, client) {
		this.message = message;
		this.client = client;
	}

	exec () {
		let parsed = this.parsing();
		if (!parsed)
			return ;
		if (parsed.command === "add")
			this.add(parsed);
		else if (parsed.command === "remove")
			this.remove(parsed);
		else if (parsed.command === "role")
			this.setRole(parsed);
			else if (parsed.command === "members")
			this.members(parsed);
		return ;
	}

	//parsing des infos
	parsing () {
		let msg = this.message.content;
		let tools = new toolsC;

		//liste des commandes
		const possibilities = ["add", "remove", "role", "list", "members"];

		//protections
		let splited = msg.split(' ');
		if (splited < 3)
			return this.error(1);
		let cmd = splited[1];
		if (!tools.isCommand(cmd, possibilities))
			return this.error(1);
		let parts = [];
		for (let i in splited) {
			if (i > 1) {
				parts.push(splited[i]);
			}
		}
		let parsed = {
			"command": cmd,
			"args": parts
		};
		return (parsed);
	}

	//ajout d'un club (admin)
	add (parsed) {
		let tools = new toolsC;
		if (parsed["args"].length !== 2)
			return this.error (3)
		var datasheet = JSON.parse(fs.readFileSync('properties/server_properties.json').toString());
		let admin = datasheet.roles.admin.id;
		if (!this.message.member.roles.cache.has(admin.toString()))
			return this.error (2)
		if (!this.message.mentions.roles.first())
			return this.error(4);
		let tagRole = this.message.mentions.roles.first();
		let clubname = parsed["args"][0];
		if (clubname.length > 12)
			return this.error (7);
		let objTemp = new objTempC;
		let clubTemp = objTemp.clubP;
		clubTemp["club name"] = clubname;
		clubTemp["role name"] = tagRole.name;
		clubTemp["role id"] = tagRole.id;
		let index = 0;
		for (let i in datasheet.club) {
			index = i;
			if (datasheet.club[i].length === 0)
				break ;
		}
		if (datasheet.club[index].length !== 0)
			return this.error(5);
		if (!tools.isClub(datasheet, clubname))
			return this.error (9);
		datasheet.club[index] = clubTemp;
		let newdata = JSON.stringify(datasheet, null, 2);
		fs.writeFile('properties/server_properties.json', newdata, 'utf8', undefined);
		return this.message.channel.send("**Club ajouté.**");
	}

	//supression d'un club (admin)
	remove (parsed) {
		let tools = new toolsC;
		if (parsed["args"].length !== 1)
			return this.error (3)
		var datasheet = JSON.parse(fs.readFileSync('properties/server_properties.json').toString());
		let admin = datasheet.roles.admin.id;
		if (!this.message.member.roles.cache.has(admin.toString()))
			return this.error (2)
		let clubname = parsed["args"][0];
		let index = 0;
		for (let i in datasheet.club) {
			index = i;
			if (datasheet.club[i]["club name"] && (datasheet.club[i]["club name"] === clubname))
				break ;
		}
		if (!datasheet.club[index]["club name"] || datasheet.club[index]["club name"] !== clubname)
			return this.error(6);
		console.log(index);
		for (let j in datasheet.club) {
			if (parseInt(j) > parseInt(index)) {
				let n = parseInt(j) - 1
				datasheet.club[n.toString()] = datasheet.club[j];
			}
		}
		datasheet.club["2"] = "";
		let newdata = JSON.stringify(datasheet, null, 2);
		fs.writeFile('properties/server_properties.json', newdata, 'utf8', undefined);
		return this.message.channel.send("**Club supprimé.**");
	}

	//link un club a un role (admin)
	setRole (parsed) {
		if (parsed["args"].length !== 2)
			return this.error (3)
		var datasheet = JSON.parse(fs.readFileSync('properties/server_properties.json').toString());
		let admin = datasheet.roles.admin.id;
		if (!this.message.member.roles.cache.has(admin.toString()))
			return this.error (2)
		if (!this.message.mentions.roles.first())
			return this.error(4);
		let tagRole = this.message.mentions.roles.first();
		let clubname = parsed["args"][0];
		if (clubname.length > 12)
			return this.error (7);
		let index = 0;
		for (let i in datasheet.club) {
			index = i;
			if (datasheet.club[i]["club name"] === clubname)
				break ;
		}
		if (datasheet.club[index]["club name"] !== clubname)
			return this.error(8);
		datasheet.club[index]["role name"] = tagRole.name;
		datasheet.club[index]["role id"] = tagRole.id;
		let newdata = JSON.stringify(datasheet, null, 2);
		fs.writeFile('properties/server_properties.json', newdata, 'utf8', undefined);
		return this.message.channel.send("**Role du club assigné.**");
	}

	//affiche la liste des membres
	members (parsed) {
		let tools = new toolsC;
		if (parsed["args"].length !== 0)
			return this.error (3)
		var datasheet = JSON.parse(fs.readFileSync('properties/server_properties.json').toString());
		if (!tools.isMember(this.message, datasheet))
			return this.error(2)
		let temp = new msgTempC;
		let msg = temp.clubMembers (datasheet);
		return this.message.channel.send(msg);
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
		return (undefined)
	}
}