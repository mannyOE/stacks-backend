import {Module} from '@src/modules/module'
import {connect, Email} from 'node-mailjet'
import {initializeApp, credential, database, messaging} from 'firebase-admin'
import {join} from 'path'
import {post} from 'request-promise'

const serviceAccount = require(join(
	__dirname,
	'../../power-invest-firebase.json'
))

const firebaseApp = initializeApp(
	{
		credential: credential.cert(serviceAccount),
		databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
	},
	'databaseApp'
)

export interface MessageOptions {
	data?: messaging.DataMessagePayload
	notification: messaging.Notification
	to: string
}

export interface SubscriptionOPtion {
	token: string
	topic: string
}

export interface WebPush {
	destination: string
	subject: string
	content: string
	data?: messaging.DataMessagePayload
	icon?: string
	user?: string
}

export interface SendMailOption {
	email: string
	subject: string
	content: string
	replyTo?: string
	name?: string
}

interface NotificationPersistOption {
	user_id: number
	message: string
}

/**
 * Handle all business logic that could happen in Index controller
 *
 * @category Modules
 */
class NotificationModule extends Module {
	private privateKey?: string
	private publicKey?: string
	private senderName?: string
	private senderEmail?: string
	private mailJet?: any
	private serverKey?: string
	private firebase?: any
	constructor() {
		super()
		this.privateKey = process.env.MAIL_JET_SECRET_KEY
		this.publicKey = process.env.MAIL_JET_PUBLIC_KEY
		this.senderName = process.env.EMAIL_SENDER
		this.senderEmail = process.env.EMAIL_ID
		this.mailJet = connect(this.publicKey || '', this.privateKey || '')
		this.serverKey = process.env.FCM_SERVER_KEY

		this.firebase = messaging
	}

	/**
	 * Send a mail notification to a specific email address
	 *
	 * @param {Object|SendMailOption} mail
	 *
	 * @throws {InvalidMailAddressException}
	 *
	 * @return {Promise<Object>}
	 */
	async sendMail(mail: SendMailOption): Promise<Record<string, unknown>> {
		try {
			const message: Email.SendParamsMessage = {
				From: {
					Name: this.senderName,
					Email: this.senderEmail || 'service-noreply@power-invest.com'
				},
				Subject: mail.subject,
				HTMLPart: mail.content,
				To: [
					{
						Email: mail.email
					}
				]
			}
			if (mail.replyTo) {
				message['ReplyTo'] = {
					Email: mail.replyTo
				}
			}
			if (mail.name) {
				message.To[0]['Name'] = mail.name
			}
			const response = await this.mailJet
				.post('send', {version: 'v3.1'})
				.request({
					Messages: [message]
				})
			console.log(response.body)
			return {success: true, data: response.body}
		} catch (error) {
			return {success: false, error}
		}
	}

	/**
	 * Send a push notification to a user's token
	 *
	 * @param {Object|WebPush} payload
	 *
	 * @return {Promise<Object>}
	 */
	async push(payload: WebPush): Promise<Record<string, unknown>> {
		// Send a message to devices subscribed to the provided topic.
		try {
			const message: MessageOptions = {
				notification: {
					title: payload.subject,
					body: payload.content
				},
				to: payload.destination
			}
			if (payload.data) {
				message.data = payload.data
			}
			const response = await post({
				uri: 'https://fcm.googleapis.com/fcm/send',
				body: message,
				json: true,
				headers: {
					'Content-Type': 'application/json',
					Authorization: `key=${this.serverKey}`
				}
			})
			await this.saveMessageToFirebase(payload)
			return {success: true, data: response}
		} catch (error) {
			return {success: false, error}
		}
	}

	/**
	 * Subscribe a user to a topic-- for use in team notification
	 *
	 * @param {SubscriptionOPtion} payload
	 *
	 * @throws {InvalidMailAddressException}
	 *
	 * @return {Promise<Object>}
	 */
	async subscribeToTopic(
		payload: SubscriptionOPtion
	): Promise<Record<string, unknown>> {
		try {
			const response = await this.firebase().subscribeToTopic(
				[payload.token],
				payload.topic
			)
			return {success: true, data: response}
		} catch (error) {
			return {success: false, error}
		}
	}

	/**
	 * unsubscribe a user from a topic-- for use in team notification
	 *
	 * @param {SubscriptionOPtion} payload
	 *
	 * @throws {InvalidMailAddressException}
	 *
	 * @return {Promise<Object>}
	 */
	async unSubscribeFromTopic(
		payload: SubscriptionOPtion
	): Promise<Record<string, unknown>> {
		try {
			const response = await this.firebase().unsubscribeFromTopic(
				[payload.token],
				payload.topic
			)
			return {success: true, data: response}
		} catch (error) {
			return {success: false, error}
		}
	}

	public async saveMessageToFirebase(payload: WebPush) {
		if (payload.user) {
			const dbRef = database(firebaseApp).ref(payload.user)
			const time = Date.now()
			dbRef
				.child('notifications')
				.push({
					subject: payload.subject,
					message: payload.content,
					time
				})
				.catch((error: Error) => console.log(error))

			dbRef
				.child('newNotifications')
				.transaction((counter: number) => (counter || 0) + 1)
				.catch((error: Error) => console.log(error))
		}
	}
}

export default NotificationModule
