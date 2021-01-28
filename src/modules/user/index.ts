import {Model} from 'mongoose'

import {UserInterface} from '@models/user'
import {Module} from '@modules/module/index'
import {
	BadInputFormatException,
	InvalidAccessCredentialsException
} from '@exceptions/index'
import Notify from '@src/utils/Notify'
import {getTemplate} from '@src/utils/resolve-template'
import { ProviderInterface } from '@src/models/providers'
/**
 * User module constructor type
 * @type UserModuleProps
 * @category Module
 */
export type UserModuleProps = {
    model: Model<UserInterface>
    providers: Model<ProviderInterface>
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
    private providers: Model<ProviderInterface>

	/**
	 * @constructor
	 * @param {UserModuleProps} props
	 */
	constructor(props: UserModuleProps) {
		super()
        this.model = props.model
        this.providers = props.providers
	}

	
	public async updateMe(
		account: UserInterface,
		update: object
	): Promise<UserInterface> {
		try {
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
    
    public async apply(
		account: UserInterface,
		data: any
	): Promise<any> {
		try {
            let provider = new this.providers(data)
            await this.model.findByIdAndUpdate(account._id, { $set: { provider: provider._id } })
            await provider.save()
			return await this.account(account._id.toString())
		} catch (error) {
			throw new BadInputFormatException('could not find this member')
		}
	}

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

	public async profile(account: UserInterface): Promise<ProfileReturn> {
		try {
			let info = await this.model
				.findOne({
					_id: account._id
				})
				.populate('provider')
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
				.populate('provider')
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
