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
export class holoC {
	constructor (message, client, servID, servName) {
		this.message = message;
		this.client = client;
		this.servID = servID;
		this.path = "servers/" + servID + ".json";
	}

	async exec () {
		let parsed = this.parsing();
		if (!parsed)
			return ;
		if (parsed.command === "channel")
			this.channel(parsed);
		else if (parsed.command === "start")
			this.start(parsed);
		else if (parsed.command === "stop")
			this.stop(parsed);
		return ;
	}

	//parsing des infos
	parsing () {
		let msg = this.message.content;
		let tools = new toolsC;

		//liste des commandes
		const possibilities = ["channel", "start", "stop"];

		//protections
		let splited = msg.split(' ');
		if (splited < 2)
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

	//defini le chan holocombat (admin)
	channel (parsed) {
		let tools = new toolsC;
		if (parsed["args"].length !== 2)
			return this.error (3)
		var datasheet = JSON.parse(fs.readFileSync(this.path).toString());
		let admin = datasheet.roles.admin.id;
		if (!this.message.member.roles.cache.has(admin.toString()))
			return this.error (2)
		if (!this.message.mentions.channels.first())
			return this.error(4);
		let tagChan = this.message.mentions.channels.first();
		let clubname = parsed["args"][0];
		if (clubname.length > 12)
			return this.error (7);
		if (!tools.isClub(datasheet, clubname))
			return this.error(8)
		for (let i in datasheet.club) {
			if (datasheet.club[i] !== "" && datasheet.club[i]["club name"] === clubname)
				datasheet.club[i]["holo channel"] = tagChan.id;
		}
		let newdata = JSON.stringify(datasheet, null, 2);
		fs.writeFile(this.path, newdata, 'utf8', undefined);
		return this.message.channel.send(`**Salon d'holocombat défini pour ${clubname}.**`);
	}

	//lance une session holo (admin)
	async start (parsed) {
		let tools = new toolsC;
		if (parsed["args"].length !== 0)
			return this.error (3)
		var datasheet = JSON.parse(fs.readFileSync(this.path).toString());
		let admin = datasheet.roles.admin.id;
		let clubName = "";
		for (let i in datasheet.club) {
			if (datasheet.club[i] !== "" && datasheet.club[i]["holo channel"] === this.message.channel.id) {
				clubName = datasheet.club[i]["club name"]
			}
		}
		if (clubName === "") {
			return this.error(9)
		}
		if (!this.message.member.roles.cache.has(admin.toString()))
			return this.error (2)
		await this.message.channel.bulkDelete(100, true);
		const embed = new DiscordJS.MessageEmbed()
			.setColor('#ff0000')
			.setTitle('Inscris ici tes points en holocombat!')
		this.message.channel.send({embeds: [embed]})

		const row11 = new DiscordJS.MessageActionRow()
			.addComponents(
				new DiscordJS.MessageButton()
					.setCustomId("button11000")
					.setLabel("1000")
					.setStyle("SUCCESS")
			)
			.addComponents(
				new DiscordJS.MessageButton()
					.setCustomId("button1750")
					.setLabel("750")
					.setStyle("SUCCESS")
			)
			.addComponents(
				new DiscordJS.MessageButton()
					.setCustomId("button1500")
					.setLabel("500")
					.setStyle("PRIMARY")
			);
		
			const row12 = new DiscordJS.MessageActionRow()
				.addComponents(
				new DiscordJS.MessageButton()
					.setCustomId("button1375")
					.setLabel("375")
					.setStyle("SECONDARY")
			)
			.addComponents(
				new DiscordJS.MessageButton()
					.setCustomId("button1250")
					.setLabel("250")
					.setStyle("SECONDARY")
			)
			.addComponents(
				new DiscordJS.MessageButton()
					.setCustomId("button1125")
					.setLabel("125")
					.setStyle("SECONDARY")
			);

		const embed1 = new DiscordJS.MessageEmbed()
			.setColor('#0099ff')
			.setTitle('1er Combat')
			.setDescription('Combien de points as-tu fait?');
		this.message.channel.send({ embeds: [embed1], components: [row11, row12]})

		const row21 = new DiscordJS.MessageActionRow()
			.addComponents(
				new DiscordJS.MessageButton()
					.setCustomId("button21000")
					.setLabel("1000")
					.setStyle("SUCCESS")
			)
			.addComponents(
				new DiscordJS.MessageButton()
					.setCustomId("button2750")
					.setLabel("750")
					.setStyle("SUCCESS")
			)
			.addComponents(
				new DiscordJS.MessageButton()
					.setCustomId("button2500")
					.setLabel("500")
					.setStyle("PRIMARY")
			);

		const row22 = new DiscordJS.MessageActionRow()
			.addComponents(
				new DiscordJS.MessageButton()
					.setCustomId("button2375")
					.setLabel("375")
					.setStyle("SECONDARY")
			)
			.addComponents(
				new DiscordJS.MessageButton()
					.setCustomId("button2250")
					.setLabel("250")
					.setStyle("SECONDARY")
			)
			.addComponents(
				new DiscordJS.MessageButton()
					.setCustomId("button2125")
					.setLabel("125")
					.setStyle("SECONDARY")
			);

		const embed2 = new DiscordJS.MessageEmbed()
			.setColor('#0099ff')
			.setTitle('2ème Combat')
			.setDescription('Combien de points as-tu fait?');

		this.message.channel.send({ embeds: [embed2], components: [row21, row22]})

		const row31 = new DiscordJS.MessageActionRow()
			.addComponents(
				new DiscordJS.MessageButton()
					.setCustomId("button31000")
					.setLabel("1000")
					.setStyle("SUCCESS")
			)
			.addComponents(
				new DiscordJS.MessageButton()
					.setCustomId("button3750")
					.setLabel("750")
					.setStyle("SUCCESS")
			)
			.addComponents(
				new DiscordJS.MessageButton()
					.setCustomId("button3500")
					.setLabel("500")
					.setStyle("PRIMARY")
			);

		const row32 = new DiscordJS.MessageActionRow()
			.addComponents(
				new DiscordJS.MessageButton()
					.setCustomId("button3375")
					.setLabel("375")
					.setStyle("SECONDARY")
			)
			.addComponents(
				new DiscordJS.MessageButton()
					.setCustomId("button3250")
					.setLabel("250")
					.setStyle("SECONDARY")
			)
			.addComponents(
				new DiscordJS.MessageButton()
					.setCustomId("button3125")
					.setLabel("125")
					.setStyle("SECONDARY")
			);

		const embed3 = new DiscordJS.MessageEmbed()
			.setColor('#0099ff')
			.setTitle('3ème Combat')
			.setDescription('Combien de points as-tu fait?');

		this.message.channel.send({ embeds: [embed3], components: [row31, row32]})
	}

	//arrete une session holo (admin)
	stop (parsed) {
		let tools = new toolsC;
		if (parsed["args"].length !== 2)
			return this.error (3)
		var datasheet = JSON.parse(fs.readFileSync(this.path).toString());
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
		fs.writeFile(this.path, newdata, 'utf8', undefined);
		return this.message.channel.send(`**Role ${tagRole} assigné pour ${clubname}.**`);
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
			this.message.channel.send("**Mauvais salon.**");
		}
		return (undefined)
	}
}