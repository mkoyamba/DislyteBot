// Public imports
import fs from 'fs-extra'
import { google } from 'googleapis'

// Private imports
import { objTempC } from './../templates/object_templates.js'

export class googleC {
	constructor (servID) {
		// Service account
		this.servID = servID;
		this.path = "servers/" + servID + ".json";
	}

	async isInDrive (filename) {
		const KEYFILEPATH = 'keyfile.json';
		const SCOPES = ['https://www.googleapis.com/auth/drive'];
		const auth = new google.auth.GoogleAuth({
			keyFile: KEYFILEPATH,
			scopes: SCOPES
		});
		const driveService = google.drive({version: 'v3', auth});

		const list = await driveService.files.list({
			'q': "'1w66DVUF_p8A7R8_uU8pELrOr4ur7AvUI' in parents"
		});
		const files = list.data.files;
		for (let i in files) {
			if (files[i].name === filename)
				return files[i].id;
		}
		return 0;
	}

/*	async isInSheet (filename) {
		const KEYFILEPATH = 'keyfile.json';
		const SCOPES = ['https://www.googleapis.com/auth/drive'];
		const auth = new google.auth.GoogleAuth({
			keyFile: KEYFILEPATH,
			scopes: SCOPES
		});
		const driveService = google.drive({version: 'v3', auth});
	
		const list = await driveService.files.list({
			'q': `'1sW1fx8575MBpZqrxtBFEzvzzMvpjiBva' in parents`
		});
		const files = list.data.files;
		for (let i in files) {
			if (files[i].name === filename)
				return files[i].id;
		}
		return 0;
	}*/

	async update () {
		let id = await this.isInDrive(`${this.servID}.json`);

		const KEYFILEPATH = 'keyfile.json';
		const SCOPES = ['https://www.googleapis.com/auth/drive'];
		const auth = new google.auth.GoogleAuth({
			keyFile: KEYFILEPATH,
			scopes: SCOPES
		});
		const driveService = google.drive({version: 'v3', auth});

		if (id === 0) {
			let fileMetaData = {
				'name': `${this.servID}.json`,
				'parents': [`1w66DVUF_p8A7R8_uU8pELrOr4ur7AvUI`]
			}
	
			let media = {
				mimeType: 'application/json',
				body: fs.createReadStream(`servers/${this.servID}.json`)
			}
	
			await driveService.files.create({
				resource: fileMetaData,
				media: media,
			})
		}
		else {
			let fileMetaData = {
				'name': `${this.servID}.json`,
			}
	
			let media = {
				mimeType: 'application/json',
				body: fs.createReadStream(`servers/${this.servID}.json`)
			}
	
			await driveService.files.update({
				fileId: id,
				resource: fileMetaData,
				media: media,
			})
		}
	}

	async updateList () {
		let id = await this.isInDrive(`server_list.json`);

		const KEYFILEPATH = 'keyfile.json';
		const SCOPES = ['https://www.googleapis.com/auth/drive'];
		const auth = new google.auth.GoogleAuth({
			keyFile: KEYFILEPATH,
			scopes: SCOPES
		});
		const driveService = google.drive({version: 'v3', auth});

		let fileMetaData = {
			'name': `server_list.json`,
		}

		let media = {
			mimeType: 'application/json',
			body: fs.createReadStream(`server_list.json`)
		}

		await driveService.files.update({
			fileId: id,
			resource: fileMetaData,
			media: media,
		})
	}

	async getDrive () {
		const KEYFILEPATH = 'keyfile.json';
		const SCOPES = ['https://www.googleapis.com/auth/drive'];
		const auth = new google.auth.GoogleAuth({
			keyFile: KEYFILEPATH,
			scopes: SCOPES
		});
		const driveService = google.drive({version: 'v3', auth});

		const list = await driveService.files.list({
			'q': "'1w66DVUF_p8A7R8_uU8pELrOr4ur7AvUI' in parents"
		});
		const files = list.data.files;
		for (let i in files) {
			let File = await driveService.files.get({
				fileId: files[i].id
			});
			let pathf = "";
			if (File.data.name !== "server_list.json")
				pathf = "servers/";
			let check = await driveService.files.get(
			{fileId: files[i].id, alt: "media"},
			{responseType: "arraybuffer"},
			)
			let buf = Buffer.from(check.data);
			fs.writeFile(pathf + File.data.name, buf, 'utf8', undefined);
		}
	}

/*	async setSheet () {
		const KEYFILEPATH = 'keyfile.json';
		const SCOPES = ['https://www.googleapis.com/auth/drive'];
		const auth = new google.auth.GoogleAuth({
			keyFile: KEYFILEPATH,
			scopes: SCOPES
		});
		const driveService = google.drive({version: 'v3', auth});
		const sheetService = google.sheets({version: 'v4', auth});

		let SpreadsheetId = await isInSheet(`${this.servID}`);

		if (SpreadsheetId === 0) {
			let resource = {
				properties: {
					title: this.servID
				}
			}

			await sheetService.spreadsheets.create({
				resource,
				fields: 'spreadsheetId'
			});
			while (SpreadsheetId === 0) {
				SpreadsheetId = await isInDrive(`${this.servID}`, 'root')
			}
			const driveMove = {
				fileId: SpreadsheetId,
				addParents: '1sW1fx8575MBpZqrxtBFEzvzzMvpjiBva',
				removeParents: 'root'
			}
			await driveService.files.update(driveMove);
			const request = {
				spreadsheetId: SpreadsheetId,
				ranges: [],
				auth,
			};
			let toDelSheetID = await (await sheetService.spreadsheets.get(request)).data.sheets[0].properties.sheetId;
			await sheetService.spreadsheets.batchUpdate({
				spreadsheetId: SpreadsheetId,
				auth,
				resource: {
					requests: [
						{
							"addSheet": {
								"properties": {
									"title": "Progression",
									"gridProperties": {
										"rowCount": 300,
										"columnCount": 26
									},
									"tabColor": {
										"red": 0.3,
										"green": 1.0,
										"blue": 0.4
									}
								}
							}
						},{
							"addSheet": {
								"properties": {
									"title": "Datas",
									"gridProperties": {
										"rowCount": 500,
										"columnCount": 150
									},
									"tabColor": {
										"red": 1.0,
										"green": 0.3,
										"blue": 0.4
									}
								}
							}
						},{
							"deleteSheet": {
								"sheetId": toDelSheetID
							}
						}
					]
				}
			})
		}
	}

	async setDatasHolo () {
		const KEYFILEPATH = 'keyfile.json';
		const SCOPES = ['https://www.googleapis.com/auth/drive'];
		const auth = new google.auth.GoogleAuth({
			keyFile: KEYFILEPATH,
			scopes: SCOPES
		});
		const driveService = google.drive({version: 'v3', auth});
		const sheetService = google.sheets({version: 'v4', auth});

		let SpreadsheetId = await isInSheet(`${this.servID}`);

		var datasheet = JSON.parse(fs.readFileSync(this.path).toString());
		let dataID = [];
		let dataPoints = [];
		for (let i in datasheet.club) {
			for (let j in datasheet.club[i].members) {
				let count = 0;
				if (datasheet.club[i].members[i].holo1 !== "") {
					count += parseInt(datasheet.club[i].members[j].holo1.split(" ")[0]);
					count += parseInt(datasheet.club[i].members[j].holo1.split(" ")[1]);
					count += parseInt(datasheet.club[i].members[j].holo1.split(" ")[2]);
				}
				if (datasheet.club[i].members[i].holo2 !== "") {
					count += parseInt(datasheet.club[i].members[j].holo2.split(" ")[0]);
					count += parseInt(datasheet.club[i].members[j].holo2.split(" ")[1]);
					count += parseInt(datasheet.club[i].members[j].holo2.split(" ")[2]);
				}
				if (datasheet.club[i].members[i].holo3 !== "") {
					count += parseInt(datasheet.club[i].members[j].holo3.split(" ")[0]);
					count += parseInt(datasheet.club[i].members[j].holo3.split(" ")[1]);
					count += parseInt(datasheet.club[i].members[j].holo3.split(" ")[2]);
				}
				dataID.push(datasheet.club[i].members[j].id);
				dataPoints.push(count);
			}
		}


		await sheetService.spreadsheets.values.append({
			auth,
			spreadsheetId: SpreadsheetId,
			range: "Datas!A:Z",
			valueInputOption: "USER_ENTERED",
			resource: {
				values: [dataID, dataPoints]
			}
		})
	}*/
}
