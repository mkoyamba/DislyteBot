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
		this.path = "servers/" + servID + ".json";

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
		if (parsed.command === "add")
			this.add(parsed);
		else if (parsed.command === "remove")
			this.remove(parsed);
		else if (parsed.command === "info")
			this.getInfos(parsed);
		else if (parsed.command === "stat set")
			this.setStat(parsed);
		else if (parsed.command === "stat adminset")
			this.adminSetStat(parsed);
		else if (parsed.command === "stats")
			this.getStat(parsed);
		else if (parsed.command === "adminstats")
			this.adminGetStat(parsed);
		return ;
	}

	//parsing des infos
	parsing () {
		let msg = this.message.content;
		let tools = new toolsC;

		//liste des commandes
		const possibilities = ["add", "remove", "info", "stat set", "stats",
							"esper add", "esper remove", "stat adminset",
							"adminstats"];

		//protections
		let splited = msg.split(' ');
		if (splited.length < 2)
			return this.error(1);
		let lenCmd = 2;
		let cmd = "";
		if (splited[1] === "add" || splited[1] === "remove" || splited[1] === "info" ||
			splited[1] === "stats" || splited[1] === "adminstats") {
			cmd = splited[1];
			lenCmd = 1;
		}
		else
			cmd = splited[1] + " " + splited[2];
		if (!tools.isCommand(cmd, possibilities))
			return this.error(1);
		let parts = [];
		for (let i in splited) {
			if (parseInt(i) === lenCmd + 1)
				parts.push(splited[i]);
			else if (i > 2) {
				parts.push(splited[i]);
			}
		}
		let parsed = {
			"command": cmd,
			"args": parts
		};
		return (parsed);
	}

	//ajout d'un joueur
	add (parsed) {
		let tools = new toolsC;
		let objTemp = new objTempC;
		if (parsed.args.length !== 3)
			return this.error (3)
		if (parsed.args[0].length > 20)
			return this.error (7)
		var datasheet = JSON.parse(fs.readFileSync(this.path).toString());
		let admin = datasheet.roles.admin.id;
		if (!this.message.member.roles.cache.has(admin.toString()))
			return this.error (2)
		if (!this.message.mentions.members.first())
		return this.error(4);
		let club = parsed.args[1];
		if (!tools.isClub(datasheet, club))
			return this.error(6)
			
		//création du player
		let tagPlayer = this.message.mentions.members.first();
		if (!tagPlayer)
			return this.error(4)
		if (tools.isPlayer(datasheet, parsed.args[0], tagPlayer)) {
			return this.error(9)
		}
		let result = objTemp.membersCoords(tagPlayer, parsed.args[0]);
		result.club = club;

		//recherche de l'emplacement du player
		let clubIndex = "";
		for (let i in datasheet.club) {
			if (datasheet.club[i]["club name"] === club) {
				clubIndex = i;
				break ;
			}
		}
		let memberIndex = "";
		for (let i in datasheet.club[clubIndex]["members"]) {
			if (datasheet.club[clubIndex]["members"][i] === "") {
				memberIndex = i;
				break ;
			}
			else if (i === "30") {
				memberIndex = "0";
				break ;
			}
		}
		if (memberIndex === "0") {
			return this.error(5)
		}

		//mise à jour du pseudo
		let nickname = "";
		if (result.nickname !== "" && result.nickname.split("] - ").length === 2)
			nickname = result.nickname.split("] - ")[1];
		else if (result.nickname !== "")
			nickname = result.nickname;
		else
			nickname = result.discord.split("#")[0];
		result.nickname = "[" + result.name + "] - " + nickname
		tagPlayer.setNickname(result.nickname).catch((error) => {
			this.message.channel.send(`**Droits manquants pour actualiser le pseudo de ${tagPlayer}.**`)
		});
		datasheet.club[clubIndex]["members"][memberIndex] = result;
		let chanID = datasheet.channels.welcome;
		let chan =  this.client.channels.cache.get(chanID);
		if (chanID !== "")
		chan.send(`**Bienvenue à ${tagPlayer} qui rejoint ${club}!**`)
		let newdata = JSON.stringify(datasheet, null, 2);
		fs.writeFile(this.path, newdata, 'utf8', undefined);
		this.message.channel.send(`**Membre ajouté.**`)
		return ;
	}

	//suppression d'un joueur
	remove (parsed) {
		let tools = new toolsC;
		if (parsed.args.length !== 1)
			return this.error (3)
		var datasheet = JSON.parse(fs.readFileSync(this.path).toString());
		let admin = datasheet.roles.admin.id;
		if (!this.message.member.roles.cache.has(admin.toString()))
			return this.error (2)

		//recherche de l'emplacement du player
		let clubIndex = "";
		let memberIndex = "";
		for (let i in datasheet.club) {
			if (datasheet.club[i] !== "") {
				for (let j in datasheet.club[i].members) {
					if (datasheet.club[i].members[j] !== "" &&
						datasheet.club[i].members[j].name === parsed.args[0]) {
							clubIndex = i;
							memberIndex = j;
						}
				}
			}
		}
		if (clubIndex === "")
			return this.error(10)
		
		let memberInt = parseInt(memberIndex)
		for (let i = memberInt; i < 30; i++) {
			datasheet.club[clubIndex].members[i.toString()] = datasheet.club[clubIndex].members[(i + 1).toString()]
		}
		datasheet.club[clubIndex].members["30"] = "";
		let newdata = JSON.stringify(datasheet, null, 2);
		fs.writeFile(this.path, newdata, 'utf8', undefined);
		this.message.channel.send(`**Membre supprimé.**`)
		return ;
	}

	//display les infos d'un joueur
	getInfos (parsed) {
		let tools = new toolsC;
		if (parsed.args.length !== 1)
			return this.error (3)
		var datasheet = JSON.parse(fs.readFileSync(this.path).toString());
		if (!tools.isMember(this.message, datasheet))
			return this.error (2)
		if (!tools.isName(datasheet, parsed.args[0]))
			return this.error(10)
		let temp = new msgTempC;
		let msg = temp.playerInfos(datasheet, parsed.args[0]);
		this.message.channel.send(msg);
		return ;
	}

	//modifie les stats d'un joueur
	setStat (parsed) {
		let tools = new toolsC;
		if (parsed.args.length !== 2 && parsed.args.length !== 6)
			return this.error(3)
		var datasheet = JSON.parse(fs.readFileSync(this.path).toString());
		if (!tools.isMember(this.message, datasheet))
			return this.error(2)
		if (!tools.isID(datasheet, this.message.author.id))
			return this.error(10)
		if (parsed.args.length === 2 && parsed.args[0] !== "level" &&
			parsed.args[0] !== "tour1" && parsed.args[0] !== "tour2" &&
			parsed.args[0] !== "kronos" && parsed.args[0] !== "apep" &&
			parsed.args[0] !== "fafnir") {
			return this.error (3)
		}
		if (parsed.args.length === 6 && (parsed.args[0].length > 2 ||
			parsed.args[1].length > 3 || parsed.args[2].length > 2 ||
			parsed.args[3].length > 2 || parsed.args[4].length > 2 ||
			parsed.args[5].length > 2))
			return this.error(3)

		//récupération de l'emplacement du joueur
		let pos = tools.getPosID(datasheet, this.message.author.id)

		//stat spécifique
		if (parsed.args.length === 2) {
			datasheet.club[pos[0]].members[pos[1]].stats[parsed.args[0]] = parsed.args[1];
		}

		//toutes stats
		else if (parsed.args.length === 6) {
			datasheet.club[pos[0]].members[pos[1]].stats["level"] = parsed.args[0];
			datasheet.club[pos[0]].members[pos[1]].stats["tour1"] = parsed.args[1];
			datasheet.club[pos[0]].members[pos[1]].stats["tour2"] = parsed.args[2];
			datasheet.club[pos[0]].members[pos[1]].stats["kronos"] = parsed.args[3];
			datasheet.club[pos[0]].members[pos[1]].stats["apep"] = parsed.args[4];
			datasheet.club[pos[0]].members[pos[1]].stats["fafnir"] = parsed.args[5];
		}
		let date = tools.timeStamp;
		datasheet.club[pos[0]].members[pos[1]].stats["update"] = date;
		let newdata = JSON.stringify(datasheet, null, 2);
		fs.writeFile(this.path, newdata, 'utf8', undefined);
		this.message.channel.send("**Informations modifiées!**");
		return ;
	}

	adminSetStat (parsed) {
		let tools = new toolsC;
		if (parsed.args.length !== 3 && parsed.args.length !== 7)
			return this.error(3)
		var datasheet = JSON.parse(fs.readFileSync(this.path).toString());
		if (!this.message.member.roles.cache.has(datasheet.roles.admin.id))
			return this.error(2)
		if (!tools.isName(datasheet, parsed.args[0]))
			return this.error(10)
		if (parsed.args.length === 3 && parsed.args[1] !== "level" &&
			parsed.args[1] !== "tour1" && parsed.args[1] !== "tour2" &&
			parsed.args[1] !== "kronos" && parsed.args[1] !== "apep" &&
			parsed.args[1] !== "fafnir") {
			return this.error (3)
		}
		if (parsed.args.length === 7 && (parsed.args[1].length > 2 ||
			parsed.args[2].length > 3 || parsed.args[3].length > 2 ||
			parsed.args[4].length > 2 || parsed.args[5].length > 2 ||
			parsed.args[6].length > 2))
			return this.error(3)

		//récupération de l'emplacement du joueur
		let pos = tools.getPosName(datasheet, parsed.args[0])

		//stat spécifique
		if (parsed.args.length === 3) {
			datasheet.club[pos[0]].members[pos[1]].stats[parsed.args[1]] = parsed.args[2];
		}

		//toutes stats
		else if (parsed.args.length === 7) {
			datasheet.club[pos[0]].members[pos[1]].stats["level"] = parsed.args[1];
			datasheet.club[pos[0]].members[pos[1]].stats["tour1"] = parsed.args[2];
			datasheet.club[pos[0]].members[pos[1]].stats["tour2"] = parsed.args[3];
			datasheet.club[pos[0]].members[pos[1]].stats["kronos"] = parsed.args[4];
			datasheet.club[pos[0]].members[pos[1]].stats["apep"] = parsed.args[5];
			datasheet.club[pos[0]].members[pos[1]].stats["fafnir"] = parsed.args[6];
		}
		let date = tools.timeStamp
		datasheet.club[pos[0]].members[pos[1]].stats["update"] = date;
		let newdata = JSON.stringify(datasheet, null, 2);
		fs.writeFile(this.path, newdata, 'utf8', undefined);
		this.message.channel.send("**Informations modifiées!**");
		return ;
	}

	getStat (parsed) {
		let tools = new toolsC;
		if (parsed.args.length)
			return this.error(3)
		var datasheet = JSON.parse(fs.readFileSync(this.path).toString());
		if (!tools.isID(datasheet, this.message.author.id))
			return this.error(10)
		let pos = tools.getPosID(datasheet, this.message.author.id);
		let pseudo = datasheet.club[pos[0]].members[pos[1]].name;
		let msgT = new msgTempC;
		let msg = msgT.playerStats(datasheet, pseudo, this.elist, this.elist_dps, this.elist_sup, this.elist_tank, this.elist_neutra);
		this.message.channel.send(msg);
		return ;
	}

	adminGetStat (parsed) {
		let tools = new toolsC;
		var datasheet = JSON.parse(fs.readFileSync(this.path).toString());
		if (!this.message.member.roles.cache.has(datasheet.roles.admin.id))
			return this.error(2)
		if (parsed.args.length !== 1)
			return this.error(3)
		if (!tools.isName(datasheet, parsed.args[0]))
			return this.error(10)
		let pseudo = parsed.args[0];
		let msgT = new msgTempC;
		let msg = msgT.playerStats(datasheet, pseudo, this.elist, this.elist_dps, this.elist_sup, this.elist_tank, this.elist_neutra);
		this.message.channel.send(msg);
		return ;
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
			this.message.channel.send("**Il faut mentionner le joueur.**");
		}
		else if (x === 5) {
			this.message.channel.send("**Nombre de joueurs maximum atteind pour ce club!**");
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
			this.message.channel.send("**Ce joueur existe déjà.**");
		}
		else if (x === 10) {
			this.message.channel.send("**Ce joueur n'existe pas.**");
		}
	}
}