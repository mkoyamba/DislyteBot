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
		for (let i in datasheet.club) {
			if (datasheet.club[i]["club name"] && datasheet.club[i]["club name"] === clubname)
				return 1;
		}
		return 0
	}

	//renvoie si le joueur possède un des roles membres
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

	//renvoie si le joueur est membre du club
	isClubMember (datasheet, pseudo, club) {
		let index = 0;
		let clubIndex = "";
		for (let i in datasheet.club) {
			if (datasheet.club[i] !== "" && datasheet.club[i].name === club)
				clubIndex = i;
		}
		for (let i in datasheet.club[clubIndex]["members"]) {
			if (datasheet.club[clubIndex]["members"][i] !== "" &&
				datasheet.club[clubIndex]["members"][i].name === pseudo) {
				return 1
			}
		}
		return 0;
	}

	//renvoie si le joueur existe
	isPlayer (datasheet, pseudo, membre) {
		for (let i in datasheet.club) {
			if (datasheet.club[i] !== "") {
				for (let j in datasheet.club[i]["members"]) {
					if (datasheet.club[i]["members"][j] !== "") {
						if (datasheet.club[i]["members"][j].name === pseudo &&
						datasheet.club[i]["members"][j].id === membre.user.id) {
							return 1
						}
					}
				}
			}
		}
		return 0
	}

	//renvoie si l'ID est un ID de joueur
	isID (datasheet, id) {
		for (let i in datasheet.club) {
			if (datasheet.club[i] !== "") {
				for (let j in datasheet.club[i]["members"]) {
					if (datasheet.club[i]["members"][j] !== "") {
						if (datasheet.club[i]["members"][j].id === id) {
							return 1
						}
					}
				}
			}
		}
		return 0
	}

	//renvoie si le pseudo est le pseudo d'un joueur
	isName (datasheet, pseudo) {
		for (let i in datasheet.club) {
			if (datasheet.club[i] !== "") {
				for (let j in datasheet.club[i].members) {
					if (datasheet.club[i].members[j] !== "" &&
						datasheet.club[i].members[j].name === pseudo) {
							return 1;
						}
				}
			}
		}
		return 0;
	}

	//renvoie la pos (num de club et num de joueur) avec l'ID
	getPosID (datasheet, id) {
		let clubIndex = "";
		let memberIndex = "";
		for (let i in datasheet.club) {
			if (datasheet.club[i] !== "") {
				for (let j in datasheet.club[i].members) {
					if (datasheet.club[i].members[j] !== "" &&
						datasheet.club[i].members[j].id === id) {
							clubIndex = i;
							memberIndex = j;
						}
				}
			}
		}
		return ([clubIndex, memberIndex])
	}

	//renvoie la pos (num de club et num de joueur) avec le pseudo
	getPosName (datasheet, pseudo) {
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
		return ([clubIndex, memberIndex])
	}

	//check si un personnage est dans la box
	isInBox (datasheet, pseudo, esper) {
		let pos = this.getPosName(datasheet, pseudo);
		for (let i in datasheet.club[pos[0]].members[pos[1]].box) {
			if (datasheet.club[pos[0]].members[pos[1]].box[i] !== "" &&
				datasheet.club[pos[0]].members[pos[1]].box[i].name === esper)
				return 1;
		}
		return 0;
	}

	//check si le personnage est dans la liste
	isInList (list, esper) {
		for (let i in list) {
			if (list[i] === esper)
				return 1;
		}
		return 0;
	}

	esperPos (box, esper) {
		for (let i in box) {
			if (box[i] !== "" && box[i].name === esper)
				return i;
		}
	}

	get timeStamp () {
		return this.tStamp()
	}

	tStamp () {
		let allDate = new Date();
		let day = allDate.getDate();
		let month = (parseInt(allDate.getMonth()) + 1).toString();
		let year = allDate.getFullYear();
		let hour = allDate.getHours();
		let minute = allDate.getMinutes();
		if (minute.length === 1) {
			minute = "0" + minute;
		}
		return `${day}/${month}/${year} - ${hour}h${minute}`;
	}
}