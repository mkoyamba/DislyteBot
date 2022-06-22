import fs from 'fs'
//import data from "./data.json" assert {type: "json"};

var member_file = "./data/membres/";
var data_file = "./data/";

function callback () {
	console.log("ERROR");
}

export class getPlayer {
	constructor (pseudo) {
		this.pseudo = pseudo;
	}

	get Players () {
		return this.setPlayers();
	}
	
	setPlayers () {
		var json = JSON.parse(fs.readFileSync('data/data.json').toString());
		return (json);
	}

	get Infos () {
		return this.setInfos();
	}

	setInfos () {
		if (!this.pseudo)
			return (undefined)
		var json = JSON.parse(fs.readFileSync(member_file + this.pseudo + '.json').toString());
		return (json.utilisateur);
	}

	get Stats () {
		return this.setStats();
	}

	setStats () {
		if (!this.pseudo)
			return (undefined)
		var json = JSON.parse(fs.readFileSync(member_file + this.pseudo + '.json').toString());
		return (json.stats);
	}
}

export class setPlayer {
	constructor (pseudo, infos, tour, td1, td2, to1, to2, club) {
		this.pseudo = pseudo;
		this.infos = infos;
		this.tour = tour;
		this.td1 = td1;
		this.td2 = td2;
		this.to1 = to1;
		this.to2 = to2;
		this.club = club;
	}

	get newPlayer () {
		return (this.NewPlayer());
	}

	NewPlayer () {
		let clubName = "";
		if (this.club === "BR")
			clubName = "BoisRythme";
		else
			clubName = "JungleRythme";
		let result = {
			"utilisateur": {
				"nom in game": this.pseudo,
				"club": clubName,
				"nickname": "",
				"ID discord": "",
				"roles": ""
			},
			"stats": {
				"tour": {
					"Tour spatiale": "0",
					"Tour temporelle": "0"
				},
				"teamdef1": {
					"p1": {
						"name": "",
						"speed": ""
					},
					"p2": {
						"name": "",
						"speed": ""
					},
					"p3": {
						"name": "",
						"speed": ""
					}
				},
				"teamdef2": {
					"p1": {
						"name": "",
						"speed": ""
					},
					"p2": {
						"name": "",
						"speed": ""
					},
					"p3": {
						"name": "",
						"speed": ""
					}
				},
				"teamoff1": {
					"p1": {
						"name": "",
						"speed": ""
					},
					"p2": {
						"name": "",
						"speed": ""
					},
					"p3": {
						"name": "",
						"speed": ""
					}
				},
				"teamoff2": {
					"p1": {
						"name": "",
						"speed": ""
					},
					"p2": {
						"name": "",
						"speed": ""
					},
					"p3": {
						"name": "",
						"speed": ""
					}
				}
			}
		};

		var datasheet = JSON.parse(fs.readFileSync('data/data.json').toString());
		let last = "";
		if (this.club === "BR") {
			for (let i in datasheet.BoisRythme) {
				last = i;
				if (i === "31" || !datasheet.BoisRythme[i][0])
					break ;
			}
			if (last === "31") {
				return (0);
			}
			datasheet.BoisRythme[last] = this.pseudo;
		}
		else if (this.club === "JR") {
			for (let i in datasheet.JungleRythme) {
				last = i;
				if (i === "31" || !datasheet.JungleRythme[i][0])
					break ;
			}
			if (last === "31") {
				return (0);
			}
			datasheet.JungleRythme[last] = this.pseudo;
		}
		let newdata = JSON.stringify(datasheet, null, 2);
		fs.writeFile('data/data.json', newdata, 'utf8', callback);

		let path = member_file + this.pseudo + ".json";
		let jsonstr = JSON.stringify(result, null, 2);
		fs.writeFile(path, jsonstr, 'utf8', callback);
		return (1);
	}

	get Infos () {
		return (this.setInfos())
	}

	setInfos () {
		var result = JSON.parse(fs.readFileSync(member_file + this.pseudo + '.json').toString());
		result.utilisateur = this.infos;
		let path = member_file + this.pseudo + ".json";
		let jsonstr = JSON.stringify(result, null, 2);
		fs.writeFile(path, jsonstr, 'utf8', callback);
	}

	get Tour () {
		return (this.setTour())
	}

	setTour () {
		var result = JSON.parse(fs.readFileSync(member_file + this.pseudo + '.json').toString());
		result.stats.tour = this.tour;
		let path = member_file + this.pseudo + ".json";
		let jsonstr = JSON.stringify(result, null, 2);
		fs.writeFile(path, jsonstr, 'utf8', callback);
	}

	get Def1 () {
		return (this.setDef1())
	}

	setDef1 () {
		console.log(this.td1);
		var result = JSON.parse(fs.readFileSync(member_file + this.pseudo + '.json').toString());
		result.stats.teamdef1 = this.td1;
		let path = member_file + this.pseudo + ".json";
		let jsonstr = JSON.stringify(result, null, 2);
		fs.writeFile(path, jsonstr, 'utf8', callback);
	}

	get Def2 () {
		return (this.setDef2())
	}

	setDef2 () {
		console.log(this.td2);
		var result = JSON.parse(fs.readFileSync(member_file + this.pseudo + '.json').toString());
		result.stats.teamdef2 = this.td2;
		let path = member_file + this.pseudo + ".json";
		let jsonstr = JSON.stringify(result, null, 2);
		fs.writeFile(path, jsonstr, 'utf8', callback);
	}

	get Off1 () {
		return (this.setOff1())
	}

	setOff1 () {
		console.log(this.to1);
		var result = JSON.parse(fs.readFileSync(member_file + this.pseudo + '.json').toString());
		result.stats.teamoff1 = this.to1;
		let path = member_file + this.pseudo + ".json";
		let jsonstr = JSON.stringify(result, null, 2);
		fs.writeFile(path, jsonstr, 'utf8', callback);
	}

	get Off2 () {
		return (this.setOff2())
	}

	setOff2 () {
		console.log(this.to2);
		var result = JSON.parse(fs.readFileSync(member_file + this.pseudo + '.json').toString());
		result.stats.teamoff2 = this.to2;
		let path = member_file + this.pseudo + ".json";
		let jsonstr = JSON.stringify(result, null, 2);
		fs.writeFile(path, jsonstr, 'utf8', callback);
	}
}

export function is_in_data(pseudo) {
	var datasheet = JSON.parse(fs.readFileSync('data/data.json').toString());
	let compar = "";
	for (let i in datasheet.BoisRythme) {
		compar = datasheet.BoisRythme[i];
		if (i === "31" || !datasheet.BoisRythme[i][0])
			return (0);
		else if (datasheet.BoisRythme[i] === pseudo)
			break ;
	}
	if (compar[0])
		return (1);
	for (let i in datasheet.JungleRythme) {
		compar = datasheet.JungleRythme[i];
		if (i === "31" || !datasheet.JungleRythme[i][0])
			return (0);
		else if (datasheet.JungleRythme[i] === pseudo)
			break ;
	}
	if (compar[0])
		return (1);
	return (0)
}