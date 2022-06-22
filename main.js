// Mandatory imports

import DiscordJS, { Guild, Intents } from 'discord.js'
import dotenv from 'dotenv'
import fs from 'fs-extra'

// Own imports
import { getPlayer, setPlayer, is_in_data } from './tab.js'

dotenv.config()

const client = new DiscordJS.Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MEMBERS,
	]
});

client.on('ready', () => {
	console.log("Welcomer démarre!");
});

client.on("disconnected", () => {
	console.log("Welcomer ne fonctionne plus!");
	process.exit(1);
});

client.on('message', message => {
	// CONSTANTES
	const backupT = new Date();
	const backupDir = "backup";

	// ROLES
	const BoisRythmeID = "984748556017618996";
	const JungleRythmeID = "984748929675583498";
	const AttenteID = "984749691927408643";
	const StaffID = "984748320796860436";

	let BoisRythme = message.guild.roles.cache.get("984748556017618996");
	let JungleRythme = message.guild.roles.cache.get("984748929675583498");
	let Attente = message.guild.roles.cache.get("984749691927408643");

	//MEMBER MENTIONNED
	let membre = message.mentions.members.first();
	let pseudoMention;
	if (membre) {
		pseudoMention = membre.nickname;
	}

	//AUTHOR
	let auteurU = message.author.username;
	let auteurD = message.author.discriminator;
	let pseudoAuteur = auteurU + "#" + auteurD;
	let tagAuteur = `${message.author}`;
	let nickAuteur = message.guild.members.cache.find(user => user.id === message.author.id).nickname;
	let gameAuteur;
	if (!nickAuteur)
			nickAuteur = message.author.username;
	if (!message.member.roles.cache.has(AttenteID)) {
		gameAuteur = nickAuteur.split('] ')[0].replace('[', '');
	}
	//CHANNELS
	let club = client.channels.cache.get("984757846992388126");
	let logs = client.channels.cache.get("984754291107590155");
	let bot = client.channels.cache.get("988525408020496424");

	/*
	===============================================================
							SET ROLE
	===============================================================
	*/

	if (message.content.startsWith("*set role BR")) {
		if (!message.member.roles.cache.has(StaffID)) {
			return message.channel.send(
				tagAuteur + " tu n'es pas autorisé à effectuer cette commande!"
			)
		}
		if (message.content.split(' ').length !== 5) {
			return message.channel.send("**Mauvaise utilisation : *set role BR [@tag] [pseudo in-game]**")
		}
		let ps = message.content.split(' ')[4];
		let newNick = "[" + ps + "] - " + membre.user.username;
		membre.setNickname(newNick);
		membre.roles.add(BoisRythme).catch(console.error);
		membre.roles.remove(Attente).catch(console.error);
		let tagMention = `${membre}`;
		return club.send("Bienvenue à " + tagMention + " qui vient de rejoindre BoisRythme!");
	}
	else if (message.content.startsWith("*set role JR")) {
		if (!message.member.roles.cache.has(StaffID)) {
			return message.channel.send(
				tagAuteur + " tu n'es pas autorisé à effectuer cette commande!"
			)
		}
		if (message.content.split(' ').length !== 5) {
			return message.channel.send("**Mauvaise utilisation : *set role JR [@tag] [pseudo in-game]**")
		}
		let ps = message.content.split(' ')[4];
		let newNick = "[" + ps + "] - " + membre.user.username;
		membre.setNickname(newNick);
		membre.roles.add(JungleRythme).catch(console.error);
		membre.roles.remove(Attente).catch(console.error);
		let tagMention = `${membre}`;
		return club.send("Bienvenue à " + tagMention + " qui vient de rejoindre JungleRythme!");
	}

	else if (message.content.startsWith("*set pseudo")) {
		if (message.member.roles.cache.has(AttenteID)) {
			return message.channel.send(
				tagAuteur + " tu n'es pas autorisé à effectuer cette commande!"
			)
		}
		if (message.content.split(' ').length !== 4) {
			return message.channel.send("**Mauvaise utilisation : *set pseudo [@tag] [pseudo in-game]**")
		}
		if (membre.user.id !== message.author.id && !message.member.roles.cache.has(StaffID))
			return message.channel.send(tagAuteur + " tu ne peux modifier que ton pseudo!");
		let ps = message.content.split(' ')[3];
		let newNick = "[" + ps + "] - " + membre.user.username;
		membre.setNickname(newNick);
	}
	
	/*
	===============================================================
							READ INFOS
	===============================================================
	*/

	else if (message.content.startsWith("*get members")) {
		if (message.member.roles.cache.has(AttenteID)) {
			return message.channel.send(
				tagAuteur + " tu n'es pas autorisé à effectuer cette commande!"
			)
		}
		let playerDisplay = new getPlayer("konwiz");
		let numberSpace = 0;
		let mes = "        **Voici la liste des membres :**\n\n```cs\n";
		mes += "#     Membres BoisRythme     Membres JungleRythme\n";
		mes += "---   --------------------   --------------------\n";
		for (let i in playerDisplay.Players["BoisRythme"]) {
			if (i === "31") {
				break ;
			}
			mes += i;
			numberSpace = 6 - i.length;
			mes += ' '.repeat(numberSpace);
			mes += playerDisplay.Players["BoisRythme"][i];
			numberSpace = 23 - playerDisplay.Players["BoisRythme"][i].length;
			mes += ' '.repeat(numberSpace);
			mes += playerDisplay.Players["JungleRythme"][i];
			mes += "\n";
		}
		mes += "```";
		message.channel.send(mes);
	}

	else if (message.content.startsWith("*get infos")) {
		if (message.member.roles.cache.has(AttenteID)) {
			return message.channel.send(tagAuteur + " tu n'es pas autorisé à effectuer cette commande!"
			)
		}
		if (message.content.split(" ").length != 3) {
			return message.channel.send("**Mauvaise utilisation : *get infos [pseudo in-game]**")
		}
		let parsing = message.content.split(" ");
		let ps = parsing[2];
		if (!is_in_data(ps))
			return message.channel.send("**Il n'y a pas de fiche à ce nom!**\nVeuilez faire : *set new [pseudo in-game]");
		let playerDisplay = new getPlayer(ps);
		let mes = "**Voici les infos de " + ps + " :**\n\n"
		for (let i in playerDisplay.Infos) {
			mes += "**	" + i + " :** " + playerDisplay.Infos[i] + "\n";
		}
		message.channel.send(mes);
	}

	else if (message.content.startsWith("*get stats")) {
		if (message.member.roles.cache.has(AttenteID)) {
			return message.channel.send(pseudoAuteur + " tu n'es pas autorisé à effectuer cette commande!")
		}
		if (message.content.split(" ").length != 3) {
			return message.channel.send("**Mauvaise utilisation : *get stats [pseudo in-game]**")
		}
		let parsing = message.content.split(" ");
		let ps = parsing[2];
		/*if (gameAuteur !== ps && !message.member.roles.cache.has(StaffID)) {
			return message.channel.send(tagAuteur + " tu ne peux visionner que ta fiche!")
		}*/
		if (!is_in_data(ps))
			return message.channel.send("**Il n'y a pas de fiche à ce nom!**\nVeuilez faire : *set new [pseudo in-game]");
		let playerDisplay = new getPlayer(ps);
		let stats = playerDisplay.Stats;

		let mes = "        **Voici les stats de " + ps + " :**\n\n```cs\n"

		let numberSpace = 0;
		// TOUR
		mes += "#                    TOUR\n";
		mes += "#\n";
		mes += "#       Tour               Niveau\n";
		mes += "        ----------------   ------\n";
		mes += "        Tour Spatiale      " + playerDisplay.Stats["tour"]["Tour spatiale"] + "\n";
		mes += "        Tour Temporelle    " + playerDisplay.Stats["tour"]["Tour temporelle"] + "\n";

		mes += "\n";

		// TEAMS DEFF
		mes += "#                    Teams DEF de " + ps + "\n";
		mes += "#\n";
		mes += "#       Esper 1 (leader)   Esper 2            Esper 3\n";
		mes += "-----   ----------------   ----------------   ----------------\n";

		// 1ere team def
		mes += "NOM     " + playerDisplay.Stats["teamdef1"]["p1"]["name"];
		numberSpace = 19 - playerDisplay.Stats["teamdef1"]["p1"]["name"].length;
		if (numberSpace < 3)
			return message.channel.send("**Personnage inexistant**");
		mes += ' '.repeat(numberSpace);
		mes += playerDisplay.Stats["teamdef1"]["p2"]["name"];
		numberSpace = 19 - playerDisplay.Stats["teamdef1"]["p2"]["name"].length;
		if (numberSpace < 3)
			return message.channel.send("**Personnage inexistant**");
		mes += ' '.repeat(numberSpace);
		mes += playerDisplay.Stats["teamdef1"]["p3"]["name"];
		numberSpace = 22 - playerDisplay.Stats["teamdef1"]["p3"]["name"].length;
		if (numberSpace < 3)
			return message.channel.send("**Personnage inexistant**");
		mes += ' '.repeat(numberSpace);
		mes += "# PREMIERE\n";

		mes += "SPEED   " + playerDisplay.Stats["teamdef1"]["p1"]["speed"];
		numberSpace = 19 - playerDisplay.Stats["teamdef1"]["p1"]["speed"].length;
		if (numberSpace < 3)
			return message.channel.send("**Personnage inexistant**");
		mes += ' '.repeat(numberSpace);
		mes += playerDisplay.Stats["teamdef1"]["p2"]["speed"];
		numberSpace = 19 - playerDisplay.Stats["teamdef1"]["p2"]["speed"].length;
		if (numberSpace < 3)
			return message.channel.send("**Personnage inexistant**");
		mes += ' '.repeat(numberSpace);
		mes += playerDisplay.Stats["teamdef1"]["p3"]["speed"];
		numberSpace = 22 - playerDisplay.Stats["teamdef1"]["p3"]["speed"].length;
		if (numberSpace < 3)
			return message.channel.send("**Personnage inexistant**");
		mes += ' '.repeat(numberSpace);
		mes += "#   TEAM\n\n";

		//2ème team def
		mes += "NOM     " + playerDisplay.Stats["teamdef2"]["p1"]["name"];
		numberSpace = 19 - playerDisplay.Stats["teamdef2"]["p1"]["name"].length;
		if (numberSpace < 3)
			return message.channel.send("**Personnage inexistant**");
		mes += ' '.repeat(numberSpace);
		mes += playerDisplay.Stats["teamdef2"]["p2"]["name"];
		numberSpace = 19 - playerDisplay.Stats["teamdef2"]["p2"]["name"].length;
		if (numberSpace < 3)
			return message.channel.send("**Personnage inexistant**");
		mes += ' '.repeat(numberSpace);
		mes += playerDisplay.Stats["teamdef2"]["p3"]["name"];
		numberSpace = 22 - playerDisplay.Stats["teamdef2"]["p3"]["name"].length;
		if (numberSpace < 3)
			return message.channel.send("**Personnage inexistant**");
		mes += ' '.repeat(numberSpace);
		mes += "# DEUXIEME\n";

		mes += "SPEED   " + playerDisplay.Stats["teamdef2"]["p1"]["speed"];
		numberSpace = 19 - playerDisplay.Stats["teamdef2"]["p1"]["speed"].length;
		if (numberSpace < 3)
			return message.channel.send("**Personnage inexistant**");
		mes += ' '.repeat(numberSpace);
		mes += playerDisplay.Stats["teamdef2"]["p2"]["speed"];
		numberSpace = 19 - playerDisplay.Stats["teamdef2"]["p2"]["speed"].length;
		if (numberSpace < 3)
			return message.channel.send("**Personnage inexistant**");
		mes += ' '.repeat(numberSpace);
		mes += playerDisplay.Stats["teamdef2"]["p3"]["speed"];
		numberSpace = 22 - playerDisplay.Stats["teamdef2"]["p3"]["speed"].length;
		if (numberSpace < 3)
			return message.channel.send("**Personnage inexistant**");
		mes += ' '.repeat(numberSpace);
		mes += "#   TEAM\n\n";

		// TEAMS OFF
		mes += "#                    Teams OFF de " + ps + "\n";
		mes += "#\n";
		mes += "#       Esper 1 (leader)   Esper 2            Esper 3\n";
		mes += "-----   ----------------   ----------------   ----------------\n";
		
		//1ère team off
		mes += "NOM     " + playerDisplay.Stats["teamoff1"]["p1"]["name"];
		numberSpace = 19 - playerDisplay.Stats["teamoff1"]["p1"]["name"].length;
		if (numberSpace < 3)
			return message.channel.send("**Personnage inexistant**");
		mes += ' '.repeat(numberSpace);
		mes += playerDisplay.Stats["teamoff1"]["p2"]["name"];
		numberSpace = 19 - playerDisplay.Stats["teamoff1"]["p2"]["name"].length;
		if (numberSpace < 3)
			return message.channel.send("**Personnage inexistant**");
		mes += ' '.repeat(numberSpace);
		mes += playerDisplay.Stats["teamoff1"]["p3"]["name"];
		numberSpace = 22 - playerDisplay.Stats["teamoff1"]["p3"]["name"].length;
		if (numberSpace < 3)
			return message.channel.send("**Personnage inexistant**");
		mes += ' '.repeat(numberSpace);
		mes += "# PREMIERE\n";

		mes += "SPEED   " + playerDisplay.Stats["teamoff1"]["p1"]["speed"];
		numberSpace = 19 - playerDisplay.Stats["teamoff1"]["p1"]["speed"].length;
		if (numberSpace < 3)
			return message.channel.send("**Personnage inexistant**");
		mes += ' '.repeat(numberSpace);
		mes += playerDisplay.Stats["teamoff1"]["p2"]["speed"];
		numberSpace = 19 - playerDisplay.Stats["teamoff1"]["p2"]["speed"].length;
		if (numberSpace < 3)
			return message.channel.send("**Personnage inexistant**");
		mes += ' '.repeat(numberSpace);
		mes += playerDisplay.Stats["teamoff1"]["p3"]["speed"];
		numberSpace = 22 - playerDisplay.Stats["teamoff1"]["p3"]["speed"].length;
		if (numberSpace < 3)
			return message.channel.send("**Personnage inexistant**");
		mes += ' '.repeat(numberSpace);
		mes += "#   TEAM\n\n";

		//2ème team off
		mes += "NOM     " + playerDisplay.Stats["teamoff2"]["p1"]["name"];
		numberSpace = 19 - playerDisplay.Stats["teamoff2"]["p1"]["name"].length;
		if (numberSpace < 3)
			return message.channel.send("**Personnage inexistant**");
		mes += ' '.repeat(numberSpace);
		mes += playerDisplay.Stats["teamoff2"]["p2"]["name"];
		numberSpace = 19 - playerDisplay.Stats["teamoff2"]["p2"]["name"].length;
		if (numberSpace < 3)
			return message.channel.send("**Personnage inexistant**");
		mes += ' '.repeat(numberSpace);
		mes += playerDisplay.Stats["teamoff2"]["p3"]["name"];
		numberSpace = 22 - playerDisplay.Stats["teamoff2"]["p3"]["name"].length;
		if (numberSpace < 3)
			return message.channel.send("**Personnage inexistant**");
		mes += ' '.repeat(numberSpace);
		mes += "# DEUXIEME\n";

		mes += "SPEED   " + playerDisplay.Stats["teamoff2"]["p1"]["speed"];
		numberSpace = 19 - playerDisplay.Stats["teamoff2"]["p1"]["speed"].length;
		if (numberSpace < 3)
			return message.channel.send("**Personnage inexistant**");
		mes += ' '.repeat(numberSpace);
		mes += playerDisplay.Stats["teamoff2"]["p2"]["speed"];
		numberSpace = 19 - playerDisplay.Stats["teamoff2"]["p2"]["speed"].length;
		if (numberSpace < 3)
			return message.channel.send("**Personnage inexistant**");
		mes += ' '.repeat(numberSpace);
		mes += playerDisplay.Stats["teamoff2"]["p3"]["speed"];
		numberSpace = 22 - playerDisplay.Stats["teamoff2"]["p3"]["speed"].length;
		if (numberSpace < 3)
			return message.channel.send("**Personnage inexistant**");
		mes += ' '.repeat(numberSpace);
		mes += "#   TEAM\n";
		
		//close
		mes += "```";
		return message.channel.send(mes);
	}

	/*
	===============================================================
							WRITE INFOS
	===============================================================
	*/

	else if (message.content.startsWith("*set new")) {
		if (!message.member.roles.cache.has(StaffID)) {
			return message.channel.send(
				pseudoAuteur + " tu n'es pas autorisé à effectuer cette commande!"
			)
		}
		if (message.content.split(' ').length !== 4) {
			return message.channel.send("**Mauvaise utilisation : *set new [pseudo in-game] [club]**")
		}
		let ps = message.content.split(' ')[2];
		let club = message.content.split(' ')[3];
		if (is_in_data(ps))
			return message.channel.send("**Cette fiche est déjà créée.**");
		if (club !== "JR" && club !== "BR") {
			return message.channel.send("**Mauvaise utilisation : [club] = JR ou BR**")
		}
		let playerCreate = new setPlayer(ps, undefined, undefined, undefined, undefined, undefined, undefined, club);
		let i = playerCreate.newPlayer;
		if (i) {
			message.channel.send("**Nouveau joueur créé!**");
		}
		else {
			message.channel.send("**Liste remplie!**");
		}
	}
	
	else if (message.content.startsWith("*set infos")) {
		if (message.member.roles.cache.has(AttenteID)) {
			return message.channel.send(
				pseudoAuteur + " tu n'es pas autorisé à effectuer cette commande!"
			)
		}
		if (message.content.split(' ').length !== 3 || !pseudoMention)
			return message.channel.send("**Mauvaise utilisation : *set infos @tag**");
		let ps = pseudoMention.split(']')[0];
		let nickn = pseudoMention.split('] - ')[1];
		ps = ps.replace('[', '');
		let disID = membre.user.username + "#" + membre.user.discriminator;
		if (!is_in_data(ps))
			return message.channel.send("**Il n'y a pas de fiche à ce nom!**\nVeuilez faire : *set new [pseudo in-game]")
		let roles = "";
		for (let i in membre._roles) {
			roles += message.guild.roles.cache.get(membre._roles[i]).name;
			roles += ", ";
		}
		roles = roles.slice(0, roles.length - 2);
		var result = {
			"nom in game": ps,
			"nickname": nickn,
			"ID discord": disID,
			"roles": roles
		};
		let playerInfos = new setPlayer(ps, result);
		playerInfos.Infos;
		message.channel.send("**Infos actualisées!**");
	}

	else if (message.content.startsWith("*set tour")) {
		if (message.member.roles.cache.has(AttenteID)) {
			return message.channel.send(
				pseudoAuteur + " tu n'es pas autorisé à effectuer cette commande!"
			)
		}
		if (message.content.split(' ').length !== 5)
			return message.channel.send("**Mauvaise utilisation : *set tour [pseudo in-game]**");
		let ps = message.content.split(' ')[2];
		let t1 = message.content.split(' ')[3];
		let t2 = message.content.split(' ')[4];
		if (!is_in_data(ps))
			return message.channel.send("**Il n'y a pas de fiche à ce nom!**\nVeuilez faire : *set new [pseudo in-game]")
		var tour = {
			"Tour spatiale": t1,
			"Tour temporelle": t2
		};
		let playerStats = new setPlayer(ps, undefined, tour);
		playerStats.Tour;
		message.channel.send("**Infos actualisées!**");
	}

	else if (message.content.startsWith("*set def1")) {
		if (message.member.roles.cache.has(AttenteID)) {
			return message.channel.send(
				pseudoAuteur + " tu n'es pas autorisé à effectuer cette commande!"
			)
		}
		if (message.content.split(' ').length !== 9)
			return message.channel.send("**Mauvaise utilisation : *set def1 [pseudo in-game] [Esper1 (lead)] [Speed] [Esper2] [Speed] [Esper3] [Speed]**");
		let ps = message.content.split(' ')[2];
		let p1 = message.content.split(' ')[3].replace('_', ' ');
		let s1 = message.content.split(' ')[4].replace('_', ' ');
		let p2 = message.content.split(' ')[5].replace('_', ' ');
		let s2 = message.content.split(' ')[6].replace('_', ' ');
		let p3 = message.content.split(' ')[7].replace('_', ' ');
		let s3 = message.content.split(' ')[8].replace('_', ' ');
		if (!is_in_data(ps))
			return message.channel.send("**Il n'y a pas de fiche à ce nom!**\nVeuilez faire : *set new [pseudo in-game]")
		if (gameAuteur !== ps && !message.member.roles.cache.has(StaffID))
			return message.channel.send(tagAuteur + " tu ne peux modifier que ta fiche!")
		var def1 = {
			"p1": {
				"name": p1,
				"speed": s1
			},
			"p2": {
				"name": p2,
				"speed": s2
			},
			"p3": {
				"name": p3,
				"speed": s3
			}
		};
		let playerStats = new setPlayer(ps, undefined, undefined, def1);
		playerStats.Def1;
		message.channel.send("**Infos actualisées!**");
	}

	else if (message.content.startsWith("*set def2")) {
		if (message.member.roles.cache.has(AttenteID)) {
			return message.channel.send(
				pseudoAuteur + " tu n'es pas autorisé à effectuer cette commande!"
			)
		}
		if (message.content.split(' ').length !== 9)
			return message.channel.send("**Mauvaise utilisation : *set def2 [pseudo in-game] [Esper1 (lead)] [Speed] [Esper2] [Speed] [Esper3] [Speed]**");
		let ps = message.content.split(' ')[2];
		let p1 = message.content.split(' ')[3].replace('_', ' ');
		let s1 = message.content.split(' ')[4].replace('_', ' ');
		let p2 = message.content.split(' ')[5].replace('_', ' ');
		let s2 = message.content.split(' ')[6].replace('_', ' ');
		let p3 = message.content.split(' ')[7].replace('_', ' ');
		let s3 = message.content.split(' ')[8].replace('_', ' ');
		if (!is_in_data(ps))
			return message.channel.send("**Il n'y a pas de fiche à ce nom!**\nVeuilez faire : *set new [pseudo in-game]")
		if (gameAuteur !== ps && !message.member.roles.cache.has(StaffID))
			return message.channel.send(tagAuteur + " tu ne peux modifier que ta fiche!")
		var def2 = {
			"p1": {
				"name": p1,
				"speed": s1
			},
			"p2": {
				"name": p2,
				"speed": s2
			},
			"p3": {
				"name": p3,
				"speed": s3
			}
		};
		let playerStats = new setPlayer(ps, undefined, undefined, undefined, def2);
		playerStats.Def2;
		message.channel.send("**Infos actualisées!**");
	}

	else if (message.content.startsWith("*set off1")) {
		if (message.member.roles.cache.has(AttenteID)) {
			return message.channel.send(
				pseudoAuteur + " tu n'es pas autorisé à effectuer cette commande!"
			)
		}
		if (message.content.split(' ').length !== 9)
			return message.channel.send("**Mauvaise utilisation : *set off1 [pseudo in-game] [Esper1 (lead)] [Speed] [Esper2] [Speed] [Esper3] [Speed]**");
		let ps = message.content.split(' ')[2];
		let p1 = message.content.split(' ')[3].replace('_', ' ');
		let s1 = message.content.split(' ')[4].replace('_', ' ');
		let p2 = message.content.split(' ')[5].replace('_', ' ');
		let s2 = message.content.split(' ')[6].replace('_', ' ');
		let p3 = message.content.split(' ')[7].replace('_', ' ');
		let s3 = message.content.split(' ')[8].replace('_', ' ');
		if (!is_in_data(ps))
			return message.channel.send("**Il n'y a pas de fiche à ce nom!**\nVeuilez faire : *set new [pseudo in-game]")
		if (gameAuteur !== ps && !message.member.roles.cache.has(StaffID))
			return message.channel.send(tagAuteur + " tu ne peux modifier que ta fiche!")
			var off1 = {
			"p1": {
				"name": p1,
				"speed": s1
			},
			"p2": {
				"name": p2,
				"speed": s2
			},
			"p3": {
				"name": p3,
				"speed": s3
			}
		};
		let playerStats = new setPlayer(ps, undefined, undefined, undefined, undefined, off1);
		playerStats.Off1;
		message.channel.send("**Infos actualisées!**");
	}

	else if (message.content.startsWith("*set off2")) {
		if (message.member.roles.cache.has(AttenteID)) {
			return message.channel.send(
				pseudoAuteur + " tu n'es pas autorisé à effectuer cette commande!"
			)
		}
		if (message.content.split(' ').length !== 9)
			return message.channel.send("**Mauvaise utilisation : *set off2 [pseudo in-game] [Esper1 (lead)] [Speed] [Esper2] [Speed] [Esper3] [Speed]**");
		let ps = message.content.split(' ')[2];
		let p1 = message.content.split(' ')[3].replace('_', ' ');
		let s1 = message.content.split(' ')[4].replace('_', ' ');
		let p2 = message.content.split(' ')[5].replace('_', ' ');
		let s2 = message.content.split(' ')[6].replace('_', ' ');
		let p3 = message.content.split(' ')[7].replace('_', ' ');
		let s3 = message.content.split(' ')[8].replace('_', ' ');
		if (!is_in_data(ps))
			return message.channel.send("**Il n'y a pas de fiche à ce nom!**\nVeuilez faire : *set new [pseudo in-game]")
		if (gameAuteur !== ps && !message.member.roles.cache.has(StaffID))
			return message.channel.send(tagAuteur + " tu ne peux modifier que ta fiche!")
		var off2 = {
			"p1": {
				"name": p1,
				"speed": s1
			},
			"p2": {
				"name": p2,
				"speed": s2
			},
			"p3": {
				"name": p3,
				"speed": s3
			}
		};
		let playerStats = new setPlayer(ps, undefined, undefined, undefined, undefined, undefined, off2);
		playerStats.Off2;
		message.channel.send("**Infos actualisées!**");
	}

	else if (message.content.startsWith("*help")) {
		if (message.member.roles.cache.has(AttenteID)) {
			return message.channel.send(
				pseudoAuteur + " tu n'es pas autorisé à effectuer cette commande!"
			)
		}
		let mes = "**Commandes du bot :**\n\n";
		mes += "	- ** *help** : Liste de toutes les commandes\n";
		mes += "	- ** *set pseudo @tag [pseudo in-game]** : Crée ton pseudo à la norme : [pseudo in-game] - pseudo que vous voulez. (uniquement pour soi)\n";
		mes += "	- ** *backup** : Crée un backup des infos. (admin)\n\n";
		mes += "**Roles**\n\n";
		mes += "	- ** *set role BR [@tag] [pseudo in-game]** : Donne le rôle BoisRythme à @tag. (admin)\n";
		mes += "	- ** *set role JR [@tag] [pseudo in-game]** : Donne le rôle JungleRythme à @tag. (admin)\n\n";
		mes += "**Afficher les infos**\n\n";
		mes += "	- ** *get members** : Donne la liste des fiches membres.\n";
		mes += "	- ** *get infos [pseudo in-game]** : Donne la fiche d'information de [pseudo in-game].\n";
		mes += "	- ** *get stats [pseudo in-game]** : Donne les stats de [pseudo in-game]. (uniquement pour soi)\n\n";
		mes += "**Modifier les infos**\n\n";
		mes += "	- ** *set new [pseudo in-game] [club]** : Crée une nouvelle fiche membre pour [pseudo in-game]. (admin)\n";
		mes += "	- ** *set infos [@tag]** : Actualise la fiche d'information de @tag.\n";
		mes += "	- ** *set tour [pseudo in-game] [Etage de la tour 1] [Etage de la tour 2]** : Met les stats des tours pour [pseudo in-game]. (uniquement pour soi)\n\n";
		mes += "	- ** *set def1 [pseudo in-game] [Esper1 (lead)] [Speed] [Esper2] [Speed] [Esper3] [Speed]** : Met les stats de la team DEF 1 pour [pseudo in-game]. (uniquement pour soi)\n";
		mes += "	- ** *set def2 [pseudo in-game] [Esper1 (lead)] [Speed] [Esper2] [Speed] [Esper3] [Speed]** : Met les stats de la team DEF 2 pour [pseudo in-game]. (uniquement pour soi)\n";
		mes += "	- ** *set off1 [pseudo in-game] [Esper1 (lead)] [Speed] [Esper2] [Speed] [Esper3] [Speed]** : Met les stats de la team OFF 1 pour [pseudo in-game]. (uniquement pour soi)\n";
		mes += "	- ** *set off2 [pseudo in-game] [Esper1 (lead)] [Speed] [Esper2] [Speed] [Esper3] [Speed]** : Met les stats de la team OFF 2 pour [pseudo in-game]. (uniquement pour soi)\n\n";
		mes += "** [@tag]** : Mention de la personne.\n";
		mes += "** [pseudo in-game]** : Le pseudo de dislyte.\n";
		mes += "** [club]** : JR ou BR.\n";
		mes += "paypal.me/konwiz";
		message.channel.send(mes);
	}

	else if (message.content.startsWith("*backup")) {
		if (!message.member.roles.cache.has(StaffID)) {
			return message.channel.send(
				pseudoAuteur + " tu n'es pas autorisé à effectuer cette commande!"
			)
		}
		let day = backupT.getDate();
		let month = backupT.getMonth();
		let year = backupT.getFullYear();
		let hour = backupT.getHours();
		let minute = backupT.getMinutes();
		let second = backupT.getSeconds();
		let backupTime = `${day}\\${month}\\${year} - ${hour}:${minute}:${second}`;
		fs.mkdir(`${backupDir}/${backupTime}`, function (err) {
			if (err){
				console.log('An error occured while creating the folder.')
				return console.error(err)
			Défdgdf
		fs.copy("data", `${backupDir}/${backupTime}`, function (err) {
			if (err){
				console.log('An error occured while copying the folder.')
				return console.error(err)
			}
		});
	}
})

client.login(process.env.TOKEN)