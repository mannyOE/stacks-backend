const twilio = require('twilio')

class SMS {
	private sid?: string
	private token?: string
	private sendNumber?: string
	constructor() {
		this.sid = process.env.TWILIO_ACCOUNT_SID
		this.token = process.env.TWILIO_AUTH_TOKEN
		this.sendNumber = process.env.TWILIO_PHONE_NUMBER
	}
	public async send(recipient: string | string[], message: string) {
		const num = []
		if (Array.isArray(recipient)) {
			for (let number of recipient) {
				if (number[0] === '0') {
					number = `+234${number.substr(1)}`
				}
				num.push(number)
			}
		} else {
			if (recipient[0] === '0') {
				recipient = `+234${recipient.substr(1)}`
			}
			num.push(recipient)
		}
		try {
			const client = new twilio(this.sid, this.token)
			var response = await client.messages.create({
				body: message,
				to: num, // Text this number
				from: this.sendNumber // From a valid Twilio number
			})
			console.log(response.sid)
			return response
		} catch (error) {
			console.log(error)
		}
	}
}

export default SMS
