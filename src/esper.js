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
export class esperC {
	constructor (message, client, servID, servName) {
		this.message = message;
		this.client = client;
		this.servID = servID;
		this.path = "servers/" + servName + "/";


		this.elist = ["donar", "jinyuyao", "tiye", "lewis", "tangxuan",
				"raven", "narmer", "liling", "triki", "hyde", "biondina",
				"gabrielle", "sally", "ollie", "unas", "lucas", "clara",
				"cecilia", "sienna", "tevor", "ahmed", "asnath", "djoser",
				"mona", "jiangman", "celine", "kara", "eira", "falken",
				"luyi", "fabrice", "arcana", "sander", "alexa", "hengyue",
				"luoyan", "chloe", "catherine", "pritzker", "jacob", "rensi",
				"linxiao", "longmian", "lynn", "anesidora", "bonnie", "dhalia",
				"taylor", "xiechuyi", "xieyuzhi", "nicole", "laura", "meredith",
				"kaylee", "stewart"];
		this.elist_dps = ["lewis", "tangxuan",
				"narmer", "liling", "hyde", "biondina", "ollie", "tevor",
				"mona", "kara", "luyi", "sander",
				"chloe", "linxiao", "lynn",
				"bonnie", "taylor", "xiechuyi", "stewart"];
		this.elist_sup = ["jinyuyao", "gabrielle", "sally", "unas",
				"clara", "cecilia", "ahmed", "asnath",
				"fabrice", "alexa", "hengyue", "luoyan", "catherine",
				"dhalia", "nicole", "laura", "meredith"];
		this.elist_tank = ["donar", "djoser", "falken", "rensi"];
		this.elist_neutra = ["tiye", "raven", "triki", "lucas", "sienna",
				"jiangman", "celine", "eira", "arcana", "pritzker", "jacob", 
				"longmian", "anesidora", "xieyuzhi", "kaylee"]
	}

	async exec () {
		let parsed = this.parsing();
		if (!parsed)
			return ;
		if (parsed.command === "")
			this.add(parsed);
		else if (parsed.command === "remove")
			this.remove(parsed);
		else if (parsed.command === "admin")
			this.admin(parsed);
		else if (parsed.command === "list")
			this.list(parsed);
		return ;
	}

	//parsing des infos
	parsing () {
		let msg = this.message.content;
		let tools = new toolsC;

		//liste des commandes
		const possibilities = ["admin", "remove", "list", ""];

		//protections
		let splited = msg.split(' ');
		if (splited.length < 2)
			return this.error(1);
		let index = 0;
		let cmd = "";
		if (splited[1] === "remove" || splited[1] === "admin" || splited[1] === "list") {
			index = 1;
			cmd = splited[1];
		}
		if (!tools.isCommand(cmd, possibilities))
			return this.error(1);
		let parts = [];
		for (let i in splited) {
			if (parseInt(i) === 1 && index === 0)
				parts.push(splited[i]);
			else if (i > 1) {
				parts.push(splited[i]);
			}
		}
		let parsed = {
			"command": cmd,
			"args": parts
		};
		return (parsed);
	}

	add (parsed) {
		if (parsed.args.length !== 3)
			return this.error(1)
		let tools = new toolsC;
		let esper = parsed.args[0].toLowerCase();
		let level = parsed.args[1];
		let speed = parsed.args[2];
		if (!tools.isInList(this.elist, esper))
			return this.error(5)
		var datasheet = JSON.parse(fs.readFileSync(this.path + 'server_properties.json').toString());
		if (!tools.isID(datasheet, this.message.author.id))
			return this.error(4)
		let pos = tools.getPosID(datasheet, this.message.author.id);
		let pseudo = datasheet.club[pos[0]].members[pos[1]].name;
		if (tools.isInBox(datasheet, pseudo, esper)) {
			for (let i in datasheet.club[pos[0]].members[pos[1]].box) {
				if (datasheet.club[pos[0]].members[pos[1]].box[i] !== "" &&
					datasheet.club[pos[0]].members[pos[1]].box[i].name === esper) {
						datasheet.club[pos[0]].members[pos[1]].box[i].level = level;
						datasheet.club[pos[0]].members[pos[1]].box[i].speed = speed;
				}
			}
			this.message.channel.send("**Esper modifié!**")
		}
		else {
			for (let i in datasheet.club[pos[0]].members[pos[1]].box) {
				if (datasheet.club[pos[0]].members[pos[1]].box[i] === "") {
					let temp = new objTempC;
					let eTemp = temp.esperT;
					eTemp.name = esper;
					eTemp.level = level;
					eTemp.speed = speed;
					let next = (parseInt(i) + 1).toString();
					datasheet.club[pos[0]].members[pos[1]].box[i] = eTemp;
					datasheet.club[pos[0]].members[pos[1]].box[next] = "";
				}
			}
			this.message.channel.send("**Esper ajouté!**")
		}
		datasheet.club[pos[0]].members[pos[1]].stats.update = tools.timeStamp;
		let newdata = JSON.stringify(datasheet, null, 2);
		fs.writeFile(this.path + 'server_properties.json', newdata, 'utf8', undefined);
		return ;
	}

	adminAdd (parsed) {
		if (parsed.args.length !== 4)
			return this.error(3)
		let tools = new toolsC;
		let pseudo = parsed.args[0];
		let esper = parsed.args[1].toLowerCase();
		let level = parsed.args[2];
		let speed = parsed.args[3];
		if (!tools.isInList(this.elist, esper))
			return this.error(5)
		var datasheet = JSON.parse(fs.readFileSync(this.path + 'server_properties.json').toString());
		if (!tools.isName(datasheet, pseudo))
			return this.error(4)
		let pos = tools.getPosName(datasheet, pseudo);
		if (tools.isInBox(datasheet, pseudo, esper)) {
			for (let i in datasheet.club[pos[0]].members[pos[1]].box) {
				if (datasheet.club[pos[0]].members[pos[1]].box[i] !== "" &&
					datasheet.club[pos[0]].members[pos[1]].box[i].name === esper) {
						datasheet.club[pos[0]].members[pos[1]].box[i].level = level;
						datasheet.club[pos[0]].members[pos[1]].box[i].speed = speed;
				}
			}
			this.message.channel.send("**Esper modifié!**")
		}
		else {
			for (let i in datasheet.club[pos[0]].members[pos[1]].box) {
				if (datasheet.club[pos[0]].members[pos[1]].box[i] === "") {
					let temp = new objTempC;
					let eTemp = temp.esperT;
					eTemp.name = esper;
					eTemp.level = level;
					eTemp.speed = speed;
					let next = (parseInt(i) + 1).toString();
					datasheet.club[pos[0]].members[pos[1]].box[i] = eTemp;
					datasheet.club[pos[0]].members[pos[1]].box[next] = "";
				}
			}
			this.message.channel.send("**Esper ajouté!**")
		}
		datasheet.club[pos[0]].members[pos[1]].stats.update = tools.timeStamp;
		let newdata = JSON.stringify(datasheet, null, 2);
		fs.writeFile(this.path + 'server_properties.json', newdata, 'utf8', undefined);
		return ;
	}

	remove (parsed) {
		if (parsed.args.length !== 1)
			return this.error(1)
		let tools = new toolsC;
		let esper = parsed.args[0].toLowerCase();
		if (!tools.isInList(this.elist, esper))
			return this.error(5)
		var datasheet = JSON.parse(fs.readFileSync(this.path + 'server_properties.json').toString());
		if (!tools.isID(datasheet, this.message.author.id))
			return this.error(4)
		let pos = tools.getPosID(datasheet, this.message.author.id);
		let pseudo = datasheet.club[pos[0]].members[pos[1]].name;
		if (tools.isInBox(datasheet, pseudo, esper)) {
			for (let i in datasheet.club[pos[0]].members[pos[1]].box) {
				let stop = 0;
				if (datasheet.club[pos[0]].members[pos[1]].box[i] &&
					datasheet.club[pos[0]].members[pos[1]].box[i] !== "" &&
					datasheet.club[pos[0]].members[pos[1]].box[i].name === esper) {
						for (let j in datasheet.club[pos[0]].members[pos[1]].box) {
							let next = (parseInt(j) + 1).toString()
							if (parseInt(j) >= parseInt(i) && datasheet.club[pos[0]].members[pos[1]].box[j] !== "") {
								datasheet.club[pos[0]].members[pos[1]].box[j] = datasheet.club[pos[0]].members[pos[1]].box[next];
							}
							else if (parseInt(j) >= parseInt(i) && datasheet.club[pos[0]].members[pos[1]].box[j] === "") {
								delete datasheet.club[pos[0]].members[pos[1]].box[j];
								stop = 1;
								break;
							}
						}
					if (stop) {break}
				}
				if (stop) {break}
			}
			this.message.channel.send("**Esper retiré!**")
		}
		else
			this.error(6)
		datasheet.club[pos[0]].members[pos[1]].stats.update = tools.timeStamp;
		let newdata = JSON.stringify(datasheet, null, 2);
		fs.writeFile(this.path + 'server_properties.json', newdata, 'utf8', undefined);
		return ;
	}

	adminRemove (parsed) {
		if (parsed.args.length !== 2)
			return this.error(1)
		let tools = new toolsC;
		let pseudo = parsed.args[0];
		let esper = parsed.args[1].toLowerCase();
		if (!tools.isInList(this.elist, esper))
			return this.error(5)
		var datasheet = JSON.parse(fs.readFileSync(this.path + 'server_properties.json').toString());
		if (!tools.isName(datasheet, pseudo)) {
			return this.error(4)
		}
		let pos = tools.getPosName(datasheet, pseudo);
		if (tools.isInBox(datasheet, pseudo, esper)) {
			for (let i in datasheet.club[pos[0]].members[pos[1]].box) {
				let stop = 0;
				if (datasheet.club[pos[0]].members[pos[1]].box[i] &&
					datasheet.club[pos[0]].members[pos[1]].box[i] !== "" &&
					datasheet.club[pos[0]].members[pos[1]].box[i].name === esper) {
						for (let j in datasheet.club[pos[0]].members[pos[1]].box) {
							let next = (parseInt(j) + 1).toString()
							if (parseInt(j) >= parseInt(i) && datasheet.club[pos[0]].members[pos[1]].box[j] !== "") {
								datasheet.club[pos[0]].members[pos[1]].box[j] = datasheet.club[pos[0]].members[pos[1]].box[next];
							}
							else if (parseInt(j) >= parseInt(i) && datasheet.club[pos[0]].members[pos[1]].box[j] === "") {
								delete datasheet.club[pos[0]].members[pos[1]].box[j];
								stop = 1;
								break;
							}
						}
					if (stop) {break}
				}
				if (stop) {break}
			}
			this.message.channel.send("**Esper retiré!**")
		}
		else
			this.error(6)
		datasheet.club[pos[0]].members[pos[1]].stats.update = tools.timeStamp;
		let newdata = JSON.stringify(datasheet, null, 2);
		fs.writeFile(this.path + 'server_properties.json', newdata, 'utf8', undefined);
		return ;
	}

	admin (parsed) {
		let tools = new toolsC;
		if (parsed.args.length !== 4 && parsed.args.length !== 3)
			return this.error(3)
		var datasheet = JSON.parse(fs.readFileSync(this.path + 'server_properties.json').toString());
		if (!this.message.member.roles.cache.has(datasheet.roles.admin.id)) {
			return this.error(2)
		}
		if (parsed.args[0] === "remove")
			parsed.command += ` ${parsed.args[0]}`
		let newArgs = [];
		for (let i in parsed.args) {
			if (parseInt(i) !== 0) {
				newArgs.push(parsed.args[i])
			}
		}
		if (parsed.args[0] === "remove")
			parsed.args = newArgs;
		if (parsed.command === "admin remove")
			this.adminRemove(parsed)
		else
			this.adminAdd(parsed)
	}

	list (parsed) {
		console.log(parsed)
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
			this.message.channel.send("**Ce joueur n'existe pas.**");
		}
		else if (x === 5) {
			this.message.channel.send("**Cet esper n'existe pas.**");
		}
		else if (x === 6) {
			this.message.channel.send("**Esper non inscrit.**");
		}
	}
}