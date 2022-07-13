// Public imports
import fs from 'fs-extra'

// Private imports
import { servC } from './serv.js'
import { playerC } from './player.js'
import { clubC } from './club.js'
import { helpC } from './help.js'
import { esperC } from './esper.js'
import { objTempC } from './../templates/object_templates.js'
import { holoC } from './holo.js'
import { googleC } from './google.js'

/*		================		*/
/*		|	  MAIN	   |		*/
/*		================		*/

export async function pars (message, client, servID, servName) {
	let msg = message.content;
	let google = new googleC(servID);

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
		let newdata = JSON.stringify(properties, null, 2);
		fs.writeFile("servers/" + servID + ".json", newdata, 'utf8', undefined);
		let newLast = parseInt(last) + 1;
		datasheet[newLast.toString()] = {
			"name": servName,
			"id": servID,
			"state": "free"
		}
		newdata = JSON.stringify(datasheet, null, 2);
		fs.writeFile('server_list.json', newdata, 'utf8', undefined);
		google.update();
		google.updateList();
		return message.channel.send("**Données du serveur créées, merci d'utiliser DislyteHelper!**");
	}
	
	//lance la commande *help
	if (msg.startsWith("*help")) {
		let help = new helpC(message, client, servID, servName);
		help.exec();
		message.delete();
		return google.update();
	}

	//lance la commande *server
	else if (msg.startsWith("*server")) {
		let server = new servC(message, client, servID, servName);
		server.exec();
		message.delete();
		return google.update();
	}

	else if (msg.startsWith("*club")) {
		let club = new clubC(message, client, servID, servName);
		club.exec();
		message.delete();
		return google.update();
	}

	else if (msg.startsWith("*player")) {
		let player = new playerC(message, client, servID, servName);
		player.exec();
		message.delete();
		return google.update();
	}

	else if (msg.startsWith("*esper")) {
		let esper = new esperC(message, client, servID, servName);
		esper.exec();
		message.delete();
		return google.update();
	}

	else if (msg.startsWith("*holo")) {
		let holo = new holoC(message, client, servID, servName);
		holo.exec();
		return google.update();
	}

	else {return}
}