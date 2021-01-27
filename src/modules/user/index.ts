import {Model} from 'mongoose'

import {UserInterface} from '@models/user'
import {Module} from '@modules/module/index'
import {
	BadInputFormatException,
	InvalidAccessCredentialsException
} from '@exceptions/index'
import Notify from '@src/utils/Notify'
import {getTemplate} from '@src/utils/resolve-template'
/**
 * User module constructor type
 * @type UserModuleProps
 * @category Module
 */
export type UserModuleProps = {
	model: Model<UserInterface>
}

interface TokenPayloadInterface {
	user: string
	account: string
}

interface ProfileReturn {
	user: UserInterface
}

/**
 * User module: handle all user interaction with database and business logic
 * @category Modules
 */
class User extends Module {
	private model: Model<UserInterface>

	/**
	 * @constructor
	 * @param {UserModuleProps} props
	 */
	constructor(props: UserModuleProps) {
		super()
		this.model = props.model
	}

	/**
	 * fetch a single member info
	 * @param {string} member the user id of the member
	 * @param {UserInterface} account the decoded account of the user
	 * @param {object} update the data to update the member with
	 * @throws MongooseError.ValidationError
	 * @throws MongoError
	 * @return {Promise<UserInterface>}
	 */
	public async updateMe(
		account: UserInterface,
		update: object
	): Promise<UserInterface> {
		try {
			// @ts-ignore
			let sponsor = update.sponsor
			// @ts-ignore
			delete update.sponsor
			
			// @ts-ignore
			await this.model.findOneAndUpdate(
				{
					_id: account._id
				},
				{$set: update}
			)
			return await this.account(account._id.toString())
		} catch (error) {
			throw new BadInputFormatException('could not find this member')
		}
	}

	

	/**
	 * update a logged in user's password
	 * @param {string} oldPassword old password of the user
	 * @param {UserInterface} account the decoded account of the user
	 * @param {string} newPassword new password to replace the old one.
	 * @throws MongooseError.ValidationError
	 * @throws MongoError
	 * @return {Promise<UserInterface>}
	 */
	public async updatePassword(
		account: UserInterface,
		oldPassword: string,
		newPassword: string
	): Promise<void> {
		let info = await this.model.findOne({
			_id: account._id
		})
		if (!info) {
			throw new BadInputFormatException('could not find this member')
		}
		let correctPassword = await info.comparePWD(oldPassword)
		if (!correctPassword) {
			throw new InvalidAccessCredentialsException('old password does not match')
		}
		info.password = newPassword
		await info.save()
	}

	/**
	 * fetch a user profile info
	 * @param {UserInterface} account the decoded account of the user
	 * @throws MongooseError.ValidationError
	 * @throws MongoError
	 * @return {Promise<UserInterface>}
	 */
	public async profile(account: UserInterface): Promise<ProfileReturn> {
		try {
			let info = await this.model
				.findOne({
					_id: account._id
				})
				.populate('sponsor')
			if (!info) {
				throw new Error()
			}
			return Promise.resolve({user: info})
		} catch (error) {
			throw new BadInputFormatException('could not find this user')
		}
	}

	public async account(account: string): Promise<UserInterface> {
		try {
			let info = await this.model
				.findOne({
					_id: account
				})
				.populate('sponsor')
			if (!info) {
				throw new Error()
			}
			return Promise.resolve(info)
		} catch (error) {
			throw new BadInputFormatException('could not find this user')
		}
	}
}

export default User
