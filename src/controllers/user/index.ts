import {Request, Response, RequestHandler} from 'express'

import Validator from './validator'
import UserProfile from '@modules/users/user'
import Index from '@controllers/ctrl'
import {InvalidAccessCredentialsException} from '@src/exceptions'
import Permits from '@src/utils/Permits'
const permits = new Permits()
/**
 * User controller
 * @category Controllers
 */
class UserCtrl extends Index {
	/**
	 * @param {User} module Instance of Person module
	 */
	private module: UserProfile

	/**
	 * @constructor
	 * @param {User} module instance of user module
	 */
	constructor(module: UserProfile) {
		super()
		this.module = module
	}

	/**
	 * Updates record of a user
	 * @return {RequestHandler}
	 */
	updateMe(): RequestHandler {
		return async (req: Request, res: Response): Promise<void> => {
			try {
				// Todo: implement handler
				const update = req.body
				// @ts-ignore
				const account = req.account
				let profile = await this.module.updateMe(account, update)
				this.ok(res, 'Account updated', profile)
			} catch (error) {
				this.handleError(error, req, res)
			}
		}
	}

	

	/**
	 * Updates password of a user
	 * @return {RequestHandler}
	 */
	updatePassword(): RequestHandler {
		return async (req: Request, res: Response): Promise<void> => {
			try {
				// Todo: implement handler
				const {newPassword, oldPassword} = req.body
				// @ts-ignore
				const account = req.account
				await this.module.updatePassword(account, oldPassword, newPassword)
				this.ok(res, 'password updated')
			} catch (error) {
				this.handleError(error, req, res)
			}
		}
	}

	/**
	 * Updates record of a user
	 * @return {RequestHandler}
	 */
	fetchMe(): RequestHandler {
		return async (req: Request, res: Response): Promise<void> => {
			try {
				// @ts-ignore
				const account = req.account
				let profile = await this.module.profile(account)
				this.ok(res, 'Account fetched', profile)
			} catch (error) {
				this.handleError(error, req, res)
			}
		}
    }
    apply(): RequestHandler {
		return async (req: Request, res: Response): Promise<void> => {
			try {
				// @ts-ignore
                const account = req.account
                let data = req.body
				let profile = await this.module.apply(account, data)
				this.ok(res, 'Application received', profile)
			} catch (error) {
				this.handleError(error, req, res)
			}
		}
	}
}
export {Validator}
export default UserCtrl
