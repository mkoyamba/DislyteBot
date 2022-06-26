// Private imports
import { toolsC } from './../src/tools.js'

export class msgTempC {
	constructor () {}

	clubList (datasheet) {
		let tools = new toolsC;
		let clubLen = tools.clubLen(datasheet);
		if (clubLen === 0)
			return (undefined);
		let msg = "```cs\n";
		msg += "#              ";
		for (let i = 1; i <= clubLen; i++) {
			let name = datasheet.club[i.toString()]["club name"];
			msg += "Infos ";
			msg += name;
			for (let j = 0; j < 16 - name.length; j++) {
				msg += ' ';
			}
		}
		msg += "\n------------   ";
		for (let i = 1; i <= clubLen; i++) {
			msg += "-------------------   ";
		}
		msg += "\n";
		msg += "NOM            ";
		for (let i = 1; i <= clubLen; i++) {
			let name = datasheet.club[i.toString()]["club name"];
			msg += name;
			for (let j = 0; j < 22 - name.length; j++) {
				msg += ' ';
			}
		}
		msg += "\n";
		msg += "NOM DU ROLE    ";
		for (let i = 1; i <= clubLen; i++) {
			let name = datasheet.club[i.toString()]["role name"];
			if (name.length > 19)
				return "**Nom du rôle trop long!**";
			msg += name;
			for (let j = 0; j < 22 - name.length; j++) {
				msg += ' ';
			}
		}
		msg += "\n";
		msg += "MEMBRES        ";
		for (let i = 1; i <= clubLen; i++) {
			let num = tools.memberLen(datasheet, i.toString());
			msg += num.toString();
			msg += "/30"
			for (let j = 0; j < 19 - num.toString().length; j++) {
				msg += ' ';
			}
		}
		msg += "\n```";
		return (msg);
	}

	clubMembers (datasheet) {
		let tools = new toolsC;
		let clubLen = tools.clubLen(datasheet);
		if (clubLen === 0)
			return (undefined);
		let result = [];
		for (let i = 1; i <= clubLen; i++) {
			let msg = "```cs\n";
			msg += "#     ";
			let name = datasheet.club[i.toString()]["club name"];
			msg += "Membres ";
			msg += name + "\n";
			msg += "---   --------------------   ---   --------------------\n";
			for (let j = 1; j <= 15; j++) {
				let index = j.toString();
				let indexOpp = j + 15;
				let indexOppStr = indexOpp.toString();
				msg += index;
				for (let k = 0; k < 6 - index.length; k++) {
					msg += " ";
				}
				let name = "";
				if (datasheet.club[i.toString()]["members"][index] !== "") {
					name = datasheet.club[i.toString()]["members"][index]["name"];
				}
				else {
					name = datasheet.club[i.toString()]["members"][index];
				}
				msg += name;
				for (let i = 0; i < 23 - name.length; i++)
					msg += " ";
				msg += indexOppStr;
				for (let k = 0; k < 6 - indexOppStr.length; k++) {
					msg += " ";
				}
				name = "";
				if (datasheet.club[i.toString()]["members"][indexOppStr] !== "") {
					name = datasheet.club[i.toString()]["members"][indexOppStr]["name"];
				}
				else {
					name = datasheet.club[i.toString()]["members"][indexOppStr];
				}
				msg += name;
				msg += "\n";
			}
			msg += '```';
			result.push(msg);
		}
		return (result);
	}

	playerInfos (datasheet, pseudo) {
		let clubIndex = "";
		let memberIndex = "";
		for (let i in datasheet.club) {
			if (datasheet.club[i] !== "") {
				for (let j in datasheet.club[i].members) {
					if (datasheet.club[i].members[j] !== "" &&
						datasheet.club[i].members[j].name === pseudo) {
							clubIndex = i;
							memberIndex = j;
						}
				}
			}
		}
		let msg = "```cs\n";
		msg += `#         Infos de ${pseudo}\n`;
		msg += `-------   -----------------------------\n`;
		msg += `PSEUDO    ${datasheet.club[clubIndex].members[memberIndex].name}\n`;
		msg += `DISCORD   ${datasheet.club[clubIndex].members[memberIndex].discord}\n`;
		msg += `SURNOM    ${datasheet.club[clubIndex].members[memberIndex].nickname}\n`;
		msg += `CLUB      ${datasheet.club[clubIndex].members[memberIndex].club}\n`;
		msg += "```"
		return (msg);
	}

	playerStats (datasheet, pseudo, elist, elist_dps, elist_sup, elist_tank, elist_neutra) {
		let tools = new toolsC;
		let pos = tools.getPosName(datasheet, pseudo);
		let msg = "```cs\n"
		msg += `#         Stats de ${pseudo}\n\n`;

		//stats du joueur
		let level = datasheet.club[pos[0]].members[pos[1]].stats.level;
		let tour1 = datasheet.club[pos[0]].members[pos[1]].stats.tour1;
		let tour2 = datasheet.club[pos[0]].members[pos[1]].stats.tour2;
		let kronos = datasheet.club[pos[0]].members[pos[1]].stats.kronos;
		let apep = datasheet.club[pos[0]].members[pos[1]].stats.apep;
		let fafnir = datasheet.club[pos[0]].members[pos[1]].stats.fafnir;
		msg += `          Niveau ${level}`;
		for (let i = 0; i < 13 - level.length; i++) {
			msg += " ";
		}
		msg += `Tour Spatiale : ${tour1}`;
		for (let i = 0; i < 14 - tour1.length; i++) {
			msg += " ";
		}
		msg += `Tour Temporelle : ${tour2}\n`;
		msg += `          Kronos ${kronos}`;
		for (let i = 0; i < 13 - kronos.length; i++) {
			msg += " ";
		}
		msg += `Apep : ${apep}`;
		for (let i = 0; i < 23 - apep.length; i++) {
			msg += " ";
		}
		msg += `Fafnir : ${fafnir}\n\n`;

		//Espers
		let eNeut = [];
		let eSupp = [];
		let eDps = [];
		let eTank = [];
		for (let i in elist) {
			if (tools.isInBox(datasheet, pseudo, elist[i])){
				if (tools.isInList(elist_dps, elist[i]))
					eDps.push(elist[i]);
				else if (tools.isInList(elist_neutra, elist[i]))
					eNeut.push(elist[i]);
				else if (tools.isInList(elist_sup, elist[i]))
					eSupp.push(elist[i]);
				else if (tools.isInList(elist_tank, elist[i]))
					eTank.push(elist[i]);
			}
		}
		let len = 0;
		for (let i = 0; i < 100; i++) {
			if (eTank[i] || eDps[i] || eSupp[i] || eNeut[i])
			len++;
		}
		let timeStamp = datasheet.club[pos[0]].members[pos[1]].stats.update.split(" - ");
		// CONDITION A RAJOUTER BOX VIDE
		let box = datasheet.club[pos[0]].members[pos[1]].box
		msg += "#         Neutralisateurs            Supports                   Dps                        Tanks\n\n";
		for (let i = 1; i < len + 1; i++) {
			let esperPos = "";
			let name = "";
			let level = "";
			let speed = "";
			//neutra
			if (eNeut[i - 1]) {
				esperPos = tools.esperPos(box, eNeut[i - 1]);
				name = eNeut[i - 1];
				level = datasheet.club[pos[0]].members[pos[1]].box[esperPos].level;
				speed = datasheet.club[pos[0]].members[pos[1]].box[esperPos].speed;
			}
			msg += `          ${name} `
			let spaces = 10 - name.length;
			for (let j = 0; j < spaces; j++) {
				msg += " ";
			}
			msg += `${level} `
			spaces = 5 - level.length;
			for (let j = 0; j < spaces; j++) {
				msg += " ";
			}
			msg += `${speed} `
			spaces = 9 - speed.length;
			for (let j = 0; j < spaces; j++) {
				msg += " ";
			}
			//supp
			name = "";
			level = "";
			speed = "";
			if (eSupp[i - 1]) {
				esperPos = tools.esperPos(box, eSupp[i - 1]);
				name = eSupp[i - 1];
				level = datasheet.club[pos[0]].members[pos[1]].box[esperPos].level;
				speed = datasheet.club[pos[0]].members[pos[1]].box[esperPos].speed;
			}
			msg += `${name} `
			spaces = 10 - name.length;
			for (let j = 0; j < spaces; j++) {
				msg += " ";
			}
			msg += `${level} `
			spaces = 5 - level.length;
			for (let j = 0; j < spaces; j++) {
				msg += " ";
			}
			msg += `${speed} `
			spaces = 9 - speed.length;
			for (let j = 0; j < spaces; j++) {
				msg += " ";
			}
			//dps
			name = "";
			level = "";
			speed = "";
			if (eDps[i - 1]) {
				esperPos = tools.esperPos(box, eDps[i - 1]);
				name = eDps[i - 1];
				level = datasheet.club[pos[0]].members[pos[1]].box[esperPos].level;
				speed = datasheet.club[pos[0]].members[pos[1]].box[esperPos].speed;
			}
			msg += `${name} `
			spaces = 10 - name.length;
			for (let j = 0; j < spaces; j++) {
				msg += " ";
			}
			msg += `${level} `
			spaces = 5 - level.length;
			for (let j = 0; j < spaces; j++) {
				msg += " ";
			}
			msg += `${speed} `
			spaces = 9 - speed.length;
			for (let j = 0; j < spaces; j++) {
				msg += " ";
			}
			//tank
			name = "";
			level = "";
			speed = "";
			if (eTank[i - 1]) {
				esperPos = tools.esperPos(box, eTank[i - 1]);
				name = eTank[i - 1];
				level = datasheet.club[pos[0]].members[pos[1]].box[esperPos].level;
				speed = datasheet.club[pos[0]].members[pos[1]].box[esperPos].speed;
			}
			msg += `${name} `
			spaces = 10 - name.length;
			for (let j = 0; j < spaces; j++) {
				msg += " ";
			}
			msg += `${level} `
			spaces = 5 - level.length;
			for (let j = 0; j < spaces; j++) {
				msg += " ";
			}
			msg += `${speed}\n`
		}
		msg += `\n#         modifié le ${timeStamp[0]} à ${timeStamp[1]}\n`;
		msg += "```";
		return msg;
	}
}