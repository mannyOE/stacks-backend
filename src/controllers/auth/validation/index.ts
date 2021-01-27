import {ValidationChain, validationResult, check} from 'express-validator'
import {RequestHandler, Request, Response, NextFunction} from 'express'
import Ctrl from '@controllers/ctrl'
import {BadInputFormatException} from '@exceptions/index'

/**
 * Middleware to handles validation for authentication controller
 * @category Controllers
 */
class AuthValidator extends Ctrl {
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
	static login(): ValidationChain[] {
		const rules = [
			check('email')
				.exists()
				.withMessage('Email must be provided')
				.isEmail()
				.withMessage('This must be a valid email address'),
			check('password')
				.exists()
				.withMessage('Password is required')
		]
		return rules
	}
	static register(): ValidationChain[] {
		const rules = [
			check('email')
				.exists()
				.withMessage('Email must be provided')
				.isEmail()
				.withMessage('This must be a valid email address'),
			check('full_name').exists().withMessage('The full name is required'),
			check('mobile')
				.exists()
				.withMessage('phone number must be provided')
				.isMobilePhone('any')
				.withMessage('This must be a valid phone number'),
			check('password')
				.exists()
				.withMessage('Password is required')
				.matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/)
				.withMessage(
					'Password must be minimum of 6 characters, one number, one lowercase and one uppercase'
				)
		]
		return rules
	}

	/**
	 * Method to verify
	 * @return {ValidationChain[]}
	 */
	static verifyAccount(): ValidationChain[] {
		return [
			check('code')
				.exists()
				.withMessage('Please provide the token sent to you via sms')
				.isLength({min: 6, max: 6})
				.withMessage('Verification code must be 6 digits')
		]
	}

	/**
	 * Method to verify
	 * @return {ValidationChain[]}
	 */
	static forgotPassword(): ValidationChain[] {
		return [
			check('email')
				.exists()
				.withMessage('Email address must be provided')
		]
	}

	/**
	 * Method to verify
	 * @return {ValidationChain[]}
	 */
	static resetPassword(): ValidationChain[] {
		return [
			check('password')
				.exists()
				.withMessage('Password is required')
				.isLength({min: 6})
				.withMessage('password must be minimu of 8 characters')
				.matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/)
				.withMessage(
					'Password must contain at least one number, one lowercase and one uppercase'
				),
			check('code')
				.exists()
				.withMessage('Please provide the token sent to you via sms')
				.isLength({min: 6, max: 6})
				.withMessage('Code must be 6 digits')
		]
	}
}

export default AuthValidator
// https://quiet-anchorage-17876.herokuapp.com/
// https://git.heroku.com/quiet-anchorage-17876.git