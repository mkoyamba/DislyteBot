// Public imports
import fs from 'fs-extra'

// Private imports
import { servC } from './serv.js'
import { playerC } from './player.js'
import { clubC } from './club.js'
import { helpC } from './help.js'
import { esperC } from './esper.js'
import { objTempC } from './../templates/object_templates.js'

/*		================		*/
/*		|	  MAIN	   |		*/
/*		================		*/

export async function pars (message, client, servID, servName) {
	let msg = message.content;

	//check serveur
	var datasheet = JSON.parse(fs.readFileSync('server_list.json').toString());
	let state = 0;
	let last = "";
	for (let i in datasheet) {
		last = i;
		if (datasheet[i]["id"] === servID)
			state = 1;
	}

	//nouveau serveur
	if (state === 0) {
		let temp = new objTempC;
		let properties = temp.servP;
		if (!fs.existsSync("servers/" + servName))
			fs.mkdir("servers/" + servName);
		else
			return ;
		let newdata = JSON.stringify(properties, null, 2);
		fs.writeFile("servers/" + servName + "/server_properties.json", newdata, 'utf8', undefined);
		let newLast = parseInt(last) + 1;
		datasheet[newLast.toString()] = {
			"name": servName,
			"id": servID,
			"state": "free"
		}
		newdata = JSON.stringify(datasheet, null, 2);
		fs.writeFile('server_list.json', newdata, 'utf8', undefined);
		return message.channel.send("**Données du serveur créées, merci d'utiliser DislyteBot!**");
	}

	//protection
	if (!msg.startsWith("*"))
		return ;
	
	//lance la commande *help
	else if (msg.startsWith("*help")) {
		let help = new helpC(message, client, servID, servName);
		return help.exec();
	}

	//lance la commande *server
	else if (msg.startsWith("*server")) {
		let server = new servC(message, client, servID, servName);
		return server.exec();
	}

	else if (msg.startsWith("*club")) {
		let club = new clubC(message, client, servID, servName);
		return club.exec();
	}

	else if (msg.startsWith("*player")) {
		let player = new playerC(message, client, servID, servName);
		return player.exec();
	}

	else if (msg.startsWith("*esper")) {
		let esper = new esperC(message, client, servID, servName);
		return esper.exec();
	}

	else {return}
}