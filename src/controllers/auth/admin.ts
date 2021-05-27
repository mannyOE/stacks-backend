import {Request, Response, RequestHandler} from 'express'
import Ctrl from '@controllers/ctrl'

import Validator from './validation'
import AdminAuthentication from '@modules/admins/auth'

/**
 * Authentication controller
 * @category Controllers
 */
class AuthCtrl extends Ctrl {
	private module: AdminAuthentication
	/**
	 * @constructor
	 */
	constructor(module: AdminAuthentication) {
		super()
		this.module = module
	}

	/**
	 * request handler for login
	 * @return {RequestHandler}
	 */
	login(): RequestHandler {
		return async (req: Request, res: Response): Promise<void> => {
			try {
				const {mobile, email, password} = req.body
				let acct
                acct = await this.module.login({email, password})
				this.ok(res, 'Logged in successfully', acct)
			} catch (error) {
				this.handleError(error, req, res)
			}
		}
	}

	/**
	 * request handler for workspace creating
	 * @return {RequestHandler}
	 */
	register(): RequestHandler {
		return async (req: Request, res: Response): Promise<void> => {
			// create company account
			try {
				const {email, password, full_name, mobile} = req.body
				const acct = await this.module.create({
					email,
					password,
					full_name,
					mobile
				})
				this.ok(res, acct)
			} catch (error) {
				this.handleError(error, req, res)
			}
		}
    }


	/**
	 * request handler for verifying email account after signup
	 * @return {RequestHandler}
	 */
	verifyAccount(): RequestHandler {
		return async (req: Request, res: Response): Promise<void> => {
			try {
				const {code} = req.body
				const acct = await this.module.verifyOTP(code)
				this.ok(res, 'Account confirmed successfully', acct)
			} catch (error) {
				this.handleError(error, req, res)
			}
		}
	}

	/**
	 * request handler for handling forgot password for a particular namespace
	 * @return {RequestHandler}
	 */
	forgotPassword(): RequestHandler {
		return async (req: Request, res: Response): Promise<void> => {
			try {
				const {email} = req.body
				const acct = await this.module.forgotPassword({email})
				this.ok(res, 'Password reset initiated', acct)
			} catch (error) {
				this.handleError(error, req, res)
			}
		}
	}

	/**
	 * request handler for handling reset password for a particular namespace
	 * @return {RequestHandler}
	 */
	resetPassword(): RequestHandler {
		return async (req: Request, res: Response): Promise<void> => {
			try {
				const {code, password} = req.body
				const acct = await this.module.resetPassword({
					code,
					password
				})
				this.ok(res, 'Password reset completed', acct)
			} catch (error) {
				this.handleError(error, req, res)
			}
		}
	}
}
export {Validator}

export default AuthCtrl
