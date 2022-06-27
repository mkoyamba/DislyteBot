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

	async update () {
		const KEYFILEPATH = '../keyfile.json';
		const SCOPES = ['https://www.googleapis.com/auth/drive'];
		const auth = new google.auth.GoogleAuth({
			keyFile: KEYFILEPATH,
			scopes: SCOPES
		});
		const driveService = google.drive({version: 'v3', auth});









		//write
		let fileMetaData = {
			'name': `${this.servID}.json`,
			'parent': [`1w66DVUF_p8A7R8_uU8pELrOr4ur7AvUI`]
		}

		let media = {
			mimeType: 'application/json',
			body: fs.createReadStream(`../servers/${this.servID}.json`)
		}

		let response = driveService.files.create({
			resource: fileMetaData,
			media: media,
			fields: 'id'
		})

		switch(response.status) {
			case 200:
				console.log(reponse.data.id)
		}
	}

	importFolder () {

	}

}