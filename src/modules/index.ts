import {
	User as UserModel,
    OTP,
    Providers
} from '@models/index'
import User from '@modules/user'
import Auth from '@modules/auth'

/**
 * @category Modules
 * @param {user} Instance of User module
 */
export const user = new User({
    model: UserModel,
    providers: Providers
})

export const authentication = new Auth({
	model: UserModel,
	otps: OTP
})
