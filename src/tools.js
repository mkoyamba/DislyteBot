/*		=================		*/
/*		|	  CLASS		|		*/
/*		=================		*/

//Boite à outils
export class toolsC {
	constructor () {}

	//renvoi si la commande existe
	isCommand (cmd, possibilities) {
		for (let i in possibilities) {
			if (cmd === possibilities[i]) {
				return (1);
			}
		};
		return (0);
	}

	//calcul le nombre de clubs
	clubLen (datasheet) {
		let index = 0;
		for (let i in datasheet.club) {
			index = i;
			if (datasheet.club[i].length === 0)
				break ;
		}
		if (datasheet.club[index]["members"])
			return (parseInt(index))
		return (parseInt(index) - 1)
	}

	//club le nombre de joueurs dans un club
	memberLen (datasheet, index) {
		let number = 0;
		for (let i in datasheet.club[index]["members"]) {
			if (datasheet.club[index]["members"][i] !== "")
				number++;
		}
		return number;	
	}

	//renvoie si le club existe
	isClub (datasheet, clubname) {
		let n = 0;
		for (let i in datasheet.club) {
			n = i;
			if (datasheet.club[i]["club name"] && datasheet.club[i]["club name"] === clubname)
				break ;
		}
		if (datasheet.club[n]["club name"] && datasheet.club[n]["club name"] === clubname) {
			return (0);
		}
		return (1)
	}

	//renvoie si le joueur est membre d'un serveur
	isMember (message, datasheet) {
		let index = 0;
		for (let i in datasheet.club) {
			let role = datasheet.club[i]["role id"];
			if (message.member.roles.cache.has(role)) {
				index = 1;
				break ;
			}
		}
		return (index);
	}
}