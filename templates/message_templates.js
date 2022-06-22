// Private imports
import { toolsC } from './../src/tools.js'

export class msgTempC {
	constructor () {}

	clubMembers (datasheet) {
		let tools = new toolsC;
		let clubLen = tools.clubLen(datasheet);
		if (clubLen === 0)
			return (undefined);
		let msg = "```cs\n";
		msg += "#     ";
		for (let i = 1; i <= clubLen; i++) {
			let name = datasheet.club[i.toString()]["club name"];
			msg += "Membres ";
			msg += name;
			for (let j = 0; j < 15 - name.length; j++) {
				msg += ' ';
			}
		}
		msg += "\n---   ";
		for (let i = 1; i <= clubLen; i++) {
			msg += "--------------------   ";
		}
		msg += "\n";
		for (let i in datasheet.club["1"]["members"]) {
			msg += i;
			for (let j = 0; j < 6 - i.length; j++) {
				msg += " ";
			}
			for (let j = 1; j <= clubLen; j++) {
				let name = datasheet.club[j.toString()]["members"][i];
				msg += name;
				for (let k = 0; k < 23 - name.length; k++) {
					msg += " ";
				}
			}
			msg += '\n';
		}
		msg += "```"
		return (msg);
	}
}