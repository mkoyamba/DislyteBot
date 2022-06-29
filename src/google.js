// Public imports
import fs from 'fs-extra'
import { google } from 'googleapis'

// Private imports
import { objTempC } from './../templates/object_templates.js'

export class googleC {
	constructor (servID) {
		// Service account
		this.servID = servID;
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
}
