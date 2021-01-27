import {RequestHandler, Request, Response, NextFunction} from 'express'
import Ctrl from '@controllers/ctrl'
import {verify, sign} from 'jsonwebtoken'
import {
	BadInputFormatException,
	InvalidAccessCredentialsException
} from '@exceptions/index'
import {user} from '@modules/index'
import {TokenPayloadInterface} from '@src/modules/auth'
import {tokenKey} from '@modules/auth/index'
import {UserInterface} from '@src/models/user'

/**
 * Middleware to handles token authentication
 * @category Controllers
 */
class AuthMiddleware extends Ctrl {
	/**
	 * @return {ValidationChain[]}
	 */
	verify(): RequestHandler {
		return async (
			req: Request,
			res: Response,
			next: NextFunction
		): Promise<void> => {
			try {
				// @ts-ignore
				let token: string = req.headers['authorization']
				if (!token || !token.includes('Bearer')) {
					throw new InvalidAccessCredentialsException(
						'Invalid bearer token provided'
					)
				}
				token = token.split('Bearer ')[1]
				// @ts-ignore
				const decoded: TokenPayloadInterface = verify(token, tokenKey)
				const account: UserInterface = await user.account(decoded.user)
				// @ts-ignore
				req.account = account
				return next()
			} catch (error) {
				if (error.name === 'TokenExpiredError') {
					throw new InvalidAccessCredentialsException('This token has expired.')
				} else if (error.name === 'JsonWebTokenError') {
					throw new InvalidAccessCredentialsException('This token is invalid.')
				}
				this.handleError(error, req, res)
			}
		}
	}
}

export default AuthMiddleware
