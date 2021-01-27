import {ValidationChain, validationResult, check} from 'express-validator'
import {RequestHandler, Request, Response, NextFunction} from 'express'
import Ctrl from '@controllers/ctrl'
import {BadInputFormatException} from '@exceptions/index'

/**
 * Middleware to handles validation for authentication controller
 * @category Controllers
 */
class UserValidator extends Ctrl {
	/**
	 * @return {ValidationChain[]}
	 */
	validate(): RequestHandler {
		return async (
			req: Request,
			res: Response,
			next: NextFunction
		): Promise<void> => {
			const result = validationResult(req)
			const hasErrors = !result.isEmpty()
			const errors = result.array()
			if (hasErrors) {
				const error = new BadInputFormatException(
					errors.map((i) => i.msg).join(','),
					errors.map((e) => e.msg)
				)
				return this.handleError(error, req, res)
			}
			return next()
		}
	}

	/**
	 * Method to verify
	 * @return {ValidationChain[]}
	 */
	static verifyToken(): ValidationChain[] {
		return [
			check('token')
				.exists()
				.withMessage('Please provide the token sent to you via email')
				.isJWT()
				.withMessage('Token must be a valid JWT token')
		]
	}

	/**
	 * Method to change logged in user's password
	 * @return {ValidationChain[]}
	 */
	static changePassword(): ValidationChain[] {
		return [
			check('oldPassword')
				.exists()
				.withMessage('Provide your old password to move forward')
				.isLength({min: 8})
				.withMessage('password must be minimum of 8 characters')
				.matches(/^(?=.*[a-z]){1,}(?=.*[A-Z]){1,}(?=.*[0-9]){1,}.{8,}$/i)
				.withMessage(
					'Password must contain at least one number, one lowercase and one uppercase'
				),
			check('newPassword')
				.exists()
				.withMessage('Provide your new password to move forward')
				.isLength({min: 8})
				.withMessage('password must be minimum of 8 characters')
				.matches(/^(?=.*[a-z]){1,}(?=.*[A-Z]){1,}(?=.*[0-9]){1,}.{8,}$/i)
				.withMessage(
					'Password must contain at least one number, one lowercase and one uppercase'
				)
		]
	}

	/**
	 * Method to set password for social accounts
	 * @return {ValidationChain[]}
	 */
	static setPassword(): ValidationChain[] {
		return [
			check('password')
				.exists()
				.withMessage('Provide your old password to move forward')
				.isLength({min: 8})
				.withMessage('password must be minimum of 8 characters')
				.matches(/^(?=.*[a-z]){1,}(?=.*[A-Z]){1,}(?=.*[0-9]){1,}.{8,}$/i)
				.withMessage(
					'Password must contain at least one number, one lowercase and one uppercase'
				)
		]
	}
}

export default UserValidator
