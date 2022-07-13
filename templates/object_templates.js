export class objTempC {
	constructor () {}

	get servP () {
		return this.serverProperties();
	}

	serverProperties () {
		let result = {
			"roles": {
				"admin": {
				"id": "",
				"name": ""
				}
			},
			"channels": {
				"welcome": ""
			},
			"club": {
				"1": "",
				"2": "",
				"3": "",
				"4": "",
				"5": ""
			}
		}
		return result;
	}

	membersCoords (membre, pseudo) {
		let nameDiscord = membre.user.username + "#" + membre.user.discriminator;
		let nickname = "";
		if (membre.nickname !== null)
			nickname = membre.nickname;
		let id = membre.user.id;
		let result = {
			"name": pseudo,
			"discord": nameDiscord,
			"nickname": nickname,
			"id": id,
			"club": "",
			"holo1": "",
			"holo2": "",
			"holo3": "",
			"stats": {
				"level": "",
				"tour1": "",
				"tour2": "",
				"kronos": "",
				"apep": "",
				"fafnir": "",
				"update": ""
			},
			"box": {
				"1": ""
			}
		}
		return result
	}

	get clubP () {
		return this.clubProperties();
	}
	clubProperties () {
		let result = {
			"club name": "",
			"holo channel": "",
			"role name": "",
			"role id": "",
			"members": {
				"1": "",
				"2": "",
				"3": "",
				"4": "",
				"5": "",
				"6": "",
				"7": "",
				"8": "",
				"9": "",
				"10": "",
				"11": "",
				"12": "",
				"13": "",
				"14": "",
				"15": "",
				"16": "",
				"17": "",
				"18": "",
				"19": "",
				"20": "",
				"21": "",
				"22": "",
				"23": "",
				"24": "",
				"25": "",
				"26": "",
				"27": "",
				"28": "",
				"29": "",
				"30": ""
			}
		}
		return (result);
	}

	get clubE () {
		return this.clubEnnemy();
	}
	clubEnnemy () {
		let result = {
			"club name": "",
			"club level": "",
			"club holo points": "",
			"members": {
				"1": "",
				"2": "",
				"3": "",
				"4": "",
				"5": "",
				"6": "",
				"7": "",
				"8": "",
				"9": "",
				"10": "",
				"11": "",
				"12": "",
				"13": "",
				"14": "",
				"15": "",
				"16": "",
				"17": "",
				"18": "",
				"19": "",
				"20": "",
				"21": "",
				"22": "",
				"23": "",
				"24": "",
				"25": "",
				"26": "",
				"27": "",
				"28": "",
				"29": "",
				"30": ""
			}
		}
		return (result);
	}

	get esperT () {
		return this.esperTemplate();
	}

	esperTemplate () {
		let result = {
			"name": "",
			"level": "",
			"speed": ""
		}
		return (result);
	}
}