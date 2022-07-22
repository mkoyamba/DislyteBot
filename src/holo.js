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
		this.message.delete();
		return this.message.channel.send(`**Salon d'holocombat défini pour ${clubname}.**`);
	}

	//lance une session holo (admin)
	async start (parsed) {
		let tools = new toolsC;
		if (parsed["args"].length !== 2)
			return this.error (3);
		for (let i in parsed["args"][0]) {
			if (parsed["args"][0][i] < '0' || parsed["args"][0][i] > '9')
				return this.error (3);
		}
		for (let i in parsed["args"][1]) {
			if (parsed["args"][1][i] < '0' || parsed["args"][1][i] > '9')
				return this.error (3);
		}
		if (parseInt(parsed["args"][0]) < 10 || parseInt(parsed["args"][0]) > 25 ||
			parseInt(parsed["args"][1]) < 1400 || parseInt(parsed["args"][1]) > 35000)
			return this.error (3);
		var datasheet = JSON.parse(fs.readFileSync(this.path).toString());
		let admin = datasheet.roles.admin.id;
		let clubName = "";
		let clubID = "";
		for (let i in datasheet.club) {
			if (datasheet.club[i] !== "" && datasheet.club[i]["holo channel"] === this.message.channel.id) {
				clubName = datasheet.club[i]["club name"];
				clubID = i;
			}
		}
		if (clubName === "") {
			return this.error(9)
		}
		if (!this.message.member.roles.cache.has(admin.toString()))
			return this.error (2)
		datasheet.club[clubID]["holo status"] = `${parsed["args"][0]} ${parsed["args"][1]}`
		this.message.channel.bulkDelete(100, true).catch();

		const status = new DiscordJS.MessageEmbed()
			.setColor('#ff0000')
			.setTitle("Status de l'holocombat")
		this.message.channel.send({embeds: [status]}).then(msg => {
			msg.react("🔄");
		})

		const embed = new DiscordJS.MessageEmbed()
			.setColor('#ff0000')
			.setTitle('Inscris ici tes points en holocombat!')
		this.message.channel.send({embeds: [embed]})

		const row11 = new DiscordJS.MessageActionRow()
			.addComponents(
				new DiscordJS.MessageButton()
					.setCustomId("holo11000")
					.setLabel("1000")
					.setStyle("SUCCESS")
			)
			.addComponents(
				new DiscordJS.MessageButton()
					.setCustomId("holo1750")
					.setLabel("750")
					.setStyle("SUCCESS")
			)
			.addComponents(
				new DiscordJS.MessageButton()
					.setCustomId("holo1500")
					.setLabel("500")
					.setStyle("PRIMARY")
			);
		
			const row12 = new DiscordJS.MessageActionRow()
				.addComponents(
				new DiscordJS.MessageButton()
					.setCustomId("holo1375")
					.setLabel("375")
					.setStyle("SECONDARY")
			)
			.addComponents(
				new DiscordJS.MessageButton()
					.setCustomId("holo1250")
					.setLabel("250")
					.setStyle("SECONDARY")
			)
			.addComponents(
				new DiscordJS.MessageButton()
					.setCustomId("holo1125")
					.setLabel("125")
					.setStyle("SECONDARY")
			)
			.addComponents(
				new DiscordJS.MessageButton()
					.setCustomId("holo10")
					.setLabel("X")
					.setStyle("DANGER")
			);

		const embed1 = new DiscordJS.MessageEmbed()
			.setColor('#0099ff')
			.setTitle('1er Combat')
			.setDescription('Combien de points as-tu fait?');
		this.message.channel.send({ embeds: [embed1], components: [row11, row12]})

		const row21 = new DiscordJS.MessageActionRow()
			.addComponents(
				new DiscordJS.MessageButton()
					.setCustomId("holo21000")
					.setLabel("1000")
					.setStyle("SUCCESS")
			)
			.addComponents(
				new DiscordJS.MessageButton()
					.setCustomId("holo2750")
					.setLabel("750")
					.setStyle("SUCCESS")
			)
			.addComponents(
				new DiscordJS.MessageButton()
					.setCustomId("holo2500")
					.setLabel("500")
					.setStyle("PRIMARY")
			);

		const row22 = new DiscordJS.MessageActionRow()
			.addComponents(
				new DiscordJS.MessageButton()
					.setCustomId("holo2375")
					.setLabel("375")
					.setStyle("SECONDARY")
			)
			.addComponents(
				new DiscordJS.MessageButton()
					.setCustomId("holo2250")
					.setLabel("250")
					.setStyle("SECONDARY")
			)
			.addComponents(
				new DiscordJS.MessageButton()
					.setCustomId("holo2125")
					.setLabel("125")
					.setStyle("SECONDARY")
			)
			.addComponents(
				new DiscordJS.MessageButton()
					.setCustomId("holo20")
					.setLabel("X")
					.setStyle("DANGER")
			);

		const embed2 = new DiscordJS.MessageEmbed()
			.setColor('#0099ff')
			.setTitle('2ème Combat')
			.setDescription('Combien de points as-tu fait?');

		this.message.channel.send({ embeds: [embed2], components: [row21, row22]})

		const row31 = new DiscordJS.MessageActionRow()
			.addComponents(
				new DiscordJS.MessageButton()
					.setCustomId("holo31000")
					.setLabel("1000")
					.setStyle("SUCCESS")
			)
			.addComponents(
				new DiscordJS.MessageButton()
					.setCustomId("holo3750")
					.setLabel("750")
					.setStyle("SUCCESS")
			)
			.addComponents(
				new DiscordJS.MessageButton()
					.setCustomId("holo3500")
					.setLabel("500")
					.setStyle("PRIMARY")
			);

		const row32 = new DiscordJS.MessageActionRow()
			.addComponents(
				new DiscordJS.MessageButton()
					.setCustomId("holo3375")
					.setLabel("375")
					.setStyle("SECONDARY")
			)
			.addComponents(
				new DiscordJS.MessageButton()
					.setCustomId("holo3250")
					.setLabel("250")
					.setStyle("SECONDARY")
			)
			.addComponents(
				new DiscordJS.MessageButton()
					.setCustomId("holo3125")
					.setLabel("125")
					.setStyle("SECONDARY")
			)
			.addComponents(
				new DiscordJS.MessageButton()
					.setCustomId("holo30")
					.setLabel("X")
					.setStyle("DANGER")
			);

		const embed3 = new DiscordJS.MessageEmbed()
			.setColor('#0099ff')
			.setTitle('3ème Combat')
			.setDescription('Combien de points as-tu fait?');

		this.message.channel.send({ embeds: [embed3], components: [row31, row32]});

		const embed4 = new DiscordJS.MessageEmbed()
			.setColor('#ff0000')
			.setTitle(`Holocombat du ${tools.timeStamp.split(" - ")[0]}`)

		for (let i in datasheet.club[clubID].members) {
			if (datasheet.club[clubID].members[i] != "") {
				datasheet.club[clubID].members[i].holo3 = datasheet.club[clubID].members[i].holo2;
				datasheet.club[clubID].members[i].holo2 = datasheet.club[clubID].members[i].holo1;
				datasheet.club[clubID].members[i].holo1 = "0 0 0";
			}
		}
		let newdata = JSON.stringify(datasheet, null, 2);
		fs.writeFile(this.path, newdata, 'utf8', undefined);
	}

	//arrete une session holo (admin)
	stop (parsed) {
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
		this.message.channel.bulkDelete(100, true).catch();
		this.message.channel.send("**Pas d'holocombat en cours.**")
	}

	async interaction (interaction, id) {
		let tools = new toolsC;
		var datasheet = JSON.parse(fs.readFileSync(`servers/${id}.json`).toString());
		let pos = tools.getPosID(datasheet, interaction.member.id);
		let clubID = "";
		for (let i in datasheet.club) {
			if (datasheet.club[i] !== "" && datasheet.club[i]["holo channel"] === interaction.channel.id) {
				clubID = i;
			}
		}
		if (clubID === "") {
			return this.error(9)
		}
		if (clubID !== pos[0])
			return ;
		let battle = parseInt(interaction.customId[4]) - 1;
		let trash = "holo" + interaction.customId[4]
		let points = interaction.customId.replace(trash, "");
		let current = datasheet.club[pos[0]].members[pos[1]].holo1
		if (current === "")
			current = "0 0 0";
		let splited = current.split(" ");
		splited[battle] = points;
		current = `${splited[0]} ${splited[1]} ${splited[2]}`;
		datasheet.club[pos[0]].members[pos[1]].holo1 = current;
		let newdata = JSON.stringify(datasheet, null, 2);
		fs.writeFile(`servers/${id}.json`, newdata, 'utf8', undefined);
	}

	async update (reaction, id, user) {
		let tools = new toolsC;
		var datasheet = JSON.parse(fs.readFileSync(`servers/${id}.json`).toString());
		let pos = tools.getPosID(datasheet, user.id);
		let clubID = "";
		for (let i in datasheet.club) {
			if (datasheet.club[i] !== "" && datasheet.club[i]["holo channel"] === reaction.message.channel.id) {
				clubID = i;
			}
		}
		if (clubID === "" || clubID !== pos[0]) return ;

		//infos
		let number =  datasheet.club[clubID]["holo status"].split(" ")[0];
		let maxPoints = datasheet.club[clubID]["holo status"].split(" ")[1];
		let points = 0;
		let state = "";
		let playerDone = 0;
		for (let i in datasheet.club[clubID].members) {
			if (datasheet.club[clubID].members[i] !== "" && datasheet.club[clubID].members[i].holo1 !== "") {
				let count = 0;
				count += parseInt(datasheet.club[clubID].members[i].holo1.split(" ")[0]);
				count += parseInt(datasheet.club[clubID].members[i].holo1.split(" ")[1]);
				count += parseInt(datasheet.club[clubID].members[i].holo1.split(" ")[2]);
				if (count > 0)
					playerDone++;
				points += count;
			}
		}
		let playerLeft = number - playerDone;
		if (points >= parseInt(maxPoints))
			state = "win";
		else if (playerLeft === 0)
			state = "lost";
		else
			state = "pending";
		if (playerLeft === 0)
			playerLeft++;
		let average = 125 * Math.round(((parseInt(maxPoints) - points) / playerLeft)/125);
		if ((playerLeft * average) + points < parseInt(maxPoints))
			average += 125;
		let scoreName1 = "";
		let scoreName2 = "";
		let scoreName3 = "";
		let weekName1 = "";
		let weekName2 = "";
		let weekName3 = "";
		let scorePoints1 = "0";
		let scorePoints2 = "0";
		let scorePoints3 = "0";
		let weekPoints1 = "0";
		let weekPoints2 = "0";
		let weekPoints3 = "0";
		let currName = "empty";
		let currPoints = 0;

		//COUNT OF SCORES

		//1st
		for (let i in datasheet.club[clubID].members) {
			if (datasheet.club[clubID].members[i]) {
				let count = 0;
				count += parseInt(datasheet.club[clubID].members[i].holo1.split(" ")[0]);
				count += parseInt(datasheet.club[clubID].members[i].holo1.split(" ")[1]);
				count += parseInt(datasheet.club[clubID].members[i].holo1.split(" ")[2]);
				if (count >= currPoints) {
					currName = datasheet.club[clubID].members[i].name;
					currPoints = count;
				}
			}
		}
		scoreName1 = currName;
		scorePoints1 = currPoints.toString();

		//2nd
		currName = "empty";
		currPoints = 0;
		for (let i in datasheet.club[clubID].members) {
			if (datasheet.club[clubID].members[i] &&
				datasheet.club[clubID].members[i].name !== scoreName1) {
				let count = 0;
				count += parseInt(datasheet.club[clubID].members[i].holo1.split(" ")[0]);
				count += parseInt(datasheet.club[clubID].members[i].holo1.split(" ")[1]);
				count += parseInt(datasheet.club[clubID].members[i].holo1.split(" ")[2]);
				if (count >= currPoints) {
					currName = datasheet.club[clubID].members[i].name;
					currPoints = count;
				}
			}
		}
		scoreName2 = currName;
		scorePoints2 = currPoints.toString();

		//3rd
		currName = "empty";
		currPoints = 0;
		for (let i in datasheet.club[clubID].members) {
			if (datasheet.club[clubID].members[i] &&
				datasheet.club[clubID].members[i].name !== scoreName1 &&
				datasheet.club[clubID].members[i].name !== scoreName2) {
				let count = 0;
				count += parseInt(datasheet.club[clubID].members[i].holo1.split(" ")[0]);
				count += parseInt(datasheet.club[clubID].members[i].holo1.split(" ")[1]);
				count += parseInt(datasheet.club[clubID].members[i].holo1.split(" ")[2]);
				if (count >= currPoints) {
					currName = datasheet.club[clubID].members[i].name;
					currPoints = count;
				}
			}
		}
		scoreName3 = currName;
		scorePoints3 = currPoints.toString();

		//COUNT OF WEEK

		//1st
		currName = "empty";
		currPoints = 0;
		for (let i in datasheet.club[clubID].members) {
			if (datasheet.club[clubID].members[i]) {
				let count = 0;
				count += parseInt(datasheet.club[clubID].members[i].holo1.split(" ")[0]);
				count += parseInt(datasheet.club[clubID].members[i].holo1.split(" ")[1]);
				count += parseInt(datasheet.club[clubID].members[i].holo1.split(" ")[2]);
				if (datasheet.club[clubID].members[i].holo2 !== "") {
					count += parseInt(datasheet.club[clubID].members[i].holo2.split(" ")[0]);
					count += parseInt(datasheet.club[clubID].members[i].holo2.split(" ")[1]);
					count += parseInt(datasheet.club[clubID].members[i].holo2.split(" ")[2]);
				}
				if (datasheet.club[clubID].members[i].holo3 !== "") {
					count += parseInt(datasheet.club[clubID].members[i].holo3.split(" ")[0]);
					count += parseInt(datasheet.club[clubID].members[i].holo3.split(" ")[1]);
					count += parseInt(datasheet.club[clubID].members[i].holo3.split(" ")[2]);
				}
				if (count >= currPoints) {
					currName = datasheet.club[clubID].members[i].name;
					currPoints = count;
				}
			}
		}
		weekName1 = currName;
		weekPoints1 = currPoints.toString();

		//2nd
		currName = "empty";
		currPoints = 0;
		for (let i in datasheet.club[clubID].members) {
			if (datasheet.club[clubID].members[i] &&
				datasheet.club[clubID].members[i].name !== weekName1) {
				let count = 0;
				count += parseInt(datasheet.club[clubID].members[i].holo1.split(" ")[0]);
				count += parseInt(datasheet.club[clubID].members[i].holo1.split(" ")[1]);
				count += parseInt(datasheet.club[clubID].members[i].holo1.split(" ")[2]);
				if (datasheet.club[clubID].members[i].holo2 !== "") {
					count += parseInt(datasheet.club[clubID].members[i].holo2.split(" ")[0]);
					count += parseInt(datasheet.club[clubID].members[i].holo2.split(" ")[1]);
					count += parseInt(datasheet.club[clubID].members[i].holo2.split(" ")[2]);
				}
				if (datasheet.club[clubID].members[i].holo3 !== "") {
					count += parseInt(datasheet.club[clubID].members[i].holo3.split(" ")[0]);
					count += parseInt(datasheet.club[clubID].members[i].holo3.split(" ")[1]);
					count += parseInt(datasheet.club[clubID].members[i].holo3.split(" ")[2]);
				}
				if (count >= currPoints) {
					currName = datasheet.club[clubID].members[i].name;
					currPoints = count;
				}
			}
		}
		weekName2 = currName;
		weekPoints2 = currPoints.toString();

		//3rd
		currName = "empty";
		currPoints = 0;
		for (let i in datasheet.club[clubID].members) {
			if (datasheet.club[clubID].members[i] &&
				datasheet.club[clubID].members[i].name !== weekName1 &&
				datasheet.club[clubID].members[i].name !== weekName2) {
				let count = 0;
				count += parseInt(datasheet.club[clubID].members[i].holo1.split(" ")[0]);
				count += parseInt(datasheet.club[clubID].members[i].holo1.split(" ")[1]);
				count += parseInt(datasheet.club[clubID].members[i].holo1.split(" ")[2]);
				if (datasheet.club[clubID].members[i].holo2 !== "") {
					count += parseInt(datasheet.club[clubID].members[i].holo2.split(" ")[0]);
					count += parseInt(datasheet.club[clubID].members[i].holo2.split(" ")[1]);
					count += parseInt(datasheet.club[clubID].members[i].holo2.split(" ")[2]);
				}
				if (datasheet.club[clubID].members[i].holo3 !== "") {
					count += parseInt(datasheet.club[clubID].members[i].holo3.split(" ")[0]);
					count += parseInt(datasheet.club[clubID].members[i].holo3.split(" ")[1]);
					count += parseInt(datasheet.club[clubID].members[i].holo3.split(" ")[2]);
				}
				if (count >= currPoints) {
					currName = datasheet.club[clubID].members[i].name;
					currPoints = count;
				}
			}
		}
		weekName3 = currName;
		weekPoints3 = currPoints.toString();

		let infos = {
			"state": state,
			"number": number,
			"points": points,
			"maxPoints": maxPoints,
			"playerLeft": playerLeft,
			"average": average,
			"scoreName1": scoreName1,
			"scorePoints1": scorePoints1,
			"scoreName2": scoreName2,
			"scorePoints2": scorePoints2,
			"scoreName3": scoreName3,
			"scorePoints3": scorePoints3,
			"weekName1": weekName1,
			"weekPoints1": weekPoints1,
			"weekName2": weekName2,
			"weekPoints2": weekPoints2,
			"weekName3": weekName3,
			"weekPoints3": weekPoints3
		};
		let desc = "";
		let temp = new msgTempC;
		switch (infos.state) {
			case "win":
				desc = temp.holoWin(infos);
			case "lost":
				desc = temp.holoLost(infos);
			case "pending":
				desc = temp.holoPending(infos);
		}
		const embed = new DiscordJS.MessageEmbed()
			.setColor('#ff0000')
			.setTitle("Status de l'holocombat")
			.setDescription(desc);
		reaction.message.edit({embeds: [embed]});
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
		if (this.message)
			this.message.delete();
		return (undefined)
	}
}