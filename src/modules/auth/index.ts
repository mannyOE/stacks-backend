import {Model} from 'mongoose'
import {getTemplate} from '../../utils/resolve-template'
import {UserInterface} from '@models/user'
import {Module, QueryInterface} from '@modules/module/index'
import {verify, sign} from 'jsonwebtoken'
import {
	DuplicateException,
	BadInputFormatException,
	InvalidAccessCredentialsException
} from '@exceptions/index'
import Notify from '@src/utils/Notify'
import {OTPInterface} from '@src/models/otps'
export const tokenKey = '1Z2E3E4D5A6S7-8P9A0SSWORD'
export const PASSWORD = '@11Poster'
const moment =  require('moment')

/**
 * User module constructor type
 * @type UserModuleProps
 * @category Module
 */
export type UserModuleProps = {
	model: Model<UserInterface>
	otps: Model<OTPInterface>
}

export type companyResponse = {
	company: string
	account: string
}

interface TokenInterface {
	expires: number
	token: string
}
export interface TokenPayloadInterface {
	user: string
}

export type Template = {
	name?: string
	url?: string
	email?: string
	password?: string
	project?: string
	amount?: number
}

interface LoginReturn {
	user: UserInterface
	accessToken: TokenInterface
}

export type NewUser = Pick<
	UserInterface,
	'full_name' | 'email' | 'password' | 'mobile'
>

/**
 * Definition of input required to create a new user
 * @type LoginInput
 */
type LoginInput = {
	password: string
	email: string
}
/**
 * Definition of input required to initiate reset password
 * @type ForgotPasswordInput
 */
export interface ForgotPasswordInput {
	email?: string
}
/**
 * Definition of input required to complete reset password
 * @type ResetPasswordInput
 */
export interface ResetPasswordInput {
	password: string
	code: string
}

/**
 * Definition of input required to verify account
 * @type ResetPasswordInput
 */
export interface VerifyInput {
	code: string
}

/**
 * User module: handle all user interaction with database and business logic
 * @category Modules
 */
class Auth extends Module {
	private model: Model<UserInterface>
	private otps: Model<OTPInterface>

	/**
	 * @constructor
	 * @param {UserModuleProps} props
	 */
	constructor(props: UserModuleProps) {
		super()
		this.model = props.model
		this.otps = props.otps
	}

	private async generateCode(len = 10): Promise<string> {
		var pwdChars = '0123456789'
		var randPassword = Array(len)
			.fill(pwdChars)
			.map(function (x) {
				return x[Math.floor(Math.random() * x.length)]
			})
			.join('')
		return Promise.resolve(randPassword)
	}

	public async createOTP(email: string, user: string, name: string): Promise<string> {
		// Todo: implement create project
		const otp = await this.generateCode(6)
		
		let exist: OTPInterface | null = await this.otps.findOne({email})
        if (!exist) {
            let expires = new moment().add(1, 'd')
			// otp does not exist for this phone
			exist = await new this.otps({
				email,
				code: otp,
                user,
                expires
			}).save()
        } else {
            let expires = new moment().add(1, 'd')
            exist.expires = expires
            await exist.save()
        }
        
		let content = await getTemplate('verify', {
            email,
            name,
            code: exist.code
        })
        await new Notify().sendMail({
            content,
            email,
            subject: 'Verify your Staxave account'
        })
		return Promise.resolve('OTP sent to ' + email)
	}

	public async verifyOTP(code: string): Promise<LoginReturn> {
		// Todo: implement create project
		const exist: OTPInterface | null = await this.otps.findOne({code})
		if (!exist) {
			throw new InvalidAccessCredentialsException('Provided OTP is invalid')
		} else {
			let info = await this.model.findById(exist.user)
			if (!info) {
				throw new BadInputFormatException('Can not find account')
			}
			info.verified = true
			await info.save()
			let expiresIn = 1000 * 60 * 60 * 24
			let payload = {
				user: info._id.toString()
			}
			let updateToken = sign(payload, tokenKey, {expiresIn})
            await exist.remove()
            let content = await getTemplate('welcome', {
                email: info.email,
                name: info.full_name,
            })
            await new Notify().sendMail({
                content,
                email: info.email,
                subject: 'Verify your Staxave account'
            })
			return Promise.resolve({
				accessToken: {
					token: updateToken,
					expires: expiresIn
				},
				user: info as UserInterface
			})
		}
	}

	public async create(data: NewUser): Promise<string> {
		// check to ensure the company name is unique
		try {
			const userExists: UserInterface | null = await this.model.findOne({
				email: data.email
			})
			if (userExists) {
				throw new BadInputFormatException('This email already exists')
			}
			let account = new this.model({
				email: data.email,
				full_name: data.full_name,
				mobile: data.mobile,
				password: data.password
			})


			await account.save()
			await this.createOTP(account.email, account._id.toString(), account.full_name)
			account.password = data.password
			await account.save()
			return 'Account created. Verification code sent to your email address.'
		} catch (error) {
			throw new BadInputFormatException(error.message)
		}
	}

	/**
	 * Logs in to an account
	 * @param {LoginInput} data property of user needed to login
	 * @throws MongooseError.ValidationError
	 * @throws MongoError
	 * @return {Promise<UserInterface>}
	 */
	public async login(data: LoginInput): Promise<LoginReturn> {
		// check to ensure the company name is unique
		let accountExists: UserInterface | null
        accountExists = await this.model.findOne({
            email: data.email
        })
		if (!accountExists) {
			throw new InvalidAccessCredentialsException(
				'This account is does not exists'
			)
		}
		let correctPassword = await accountExists.comparePWD(data.password)
		if (!correctPassword) {
			throw new InvalidAccessCredentialsException('This password is invalid')
		}
		if (!accountExists.verified) {
			await this.createOTP(accountExists.email, accountExists._id.toString(), accountExists.full_name)
			throw new InvalidAccessCredentialsException(
				'Your account has not been confirmed. Please check your mail inbox'
			)
		}
		const payload: TokenPayloadInterface = {
			user: accountExists._id.toString()
		}
		const expiresIn = 1000 * 60 * 60 * 24
		const token = sign(payload, tokenKey, {expiresIn})
		return Promise.resolve({
			accessToken: {
				token,
				expires: expiresIn
			},
			user: accountExists
		})
	}

	/**
	 * Initiates password reset on an account
	 * @param {ForgotPasswordInput} data property of user needed to initiate password reset
	 * @throws MongooseError.ValidationError
	 * @throws MongoError
	 * @return {Promise<UserInterface>}
	 */
	public async forgotPassword(
		data: ForgotPasswordInput
	): Promise<Record<string, unknown>> {
		// check to ensure the company name is unique
		const accountExists: UserInterface | null = await this.model.findOne({
			email: data.email
		})
		if (!accountExists) {
			throw new InvalidAccessCredentialsException(
				'This account does not exists'
			)
		}
		// Todo: Send forgot password email
		await this.createOTP(accountExists.email, accountExists._id.toString(), accountExists.full_name)

		return Promise.resolve({mobile: accountExists.email})
	}

	/**
	 * Resets account password
	 * @param {ResetPasswordInput} data property of user needed to reset password
	 * @throws MongooseError.ValidationError
	 * @throws MongoError
	 * @return {Promise<UserInterface>}
	 */
	public async resetPassword(
		data: ResetPasswordInput
	): Promise<Record<string, unknown>> {
		try {
			const exist: OTPInterface | null = await this.otps.findOne({
				code: data.code
			})
			if (!exist) {
				throw new InvalidAccessCredentialsException('Provided OTP is invalid')
			}
			const accountExists: UserInterface | null = await this.model.findOne({
				_id: exist.user
			})
			if (!accountExists) {
				throw new InvalidAccessCredentialsException(
					'Could not find this account. Please try reseting your password again'
				)
			}
			accountExists.password = data.password
			await accountExists.save()
			await exist.remove()
			const payload: TokenPayloadInterface = {
                user: accountExists._id.toString()
            }
            const expiresIn = 1000 * 60 * 60 * 24
            const token = sign(payload, tokenKey, {expiresIn})
            return Promise.resolve({
                accessToken: {
                    token,
                    expires: expiresIn
                },
                user: accountExists
            })
		} catch (error) {
			throw error
		}
	}
}
export default Auth
