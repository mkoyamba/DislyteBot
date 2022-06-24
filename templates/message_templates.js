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
}