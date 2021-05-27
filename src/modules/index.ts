import {
	User as UserModel,
    OTP,
    ADMIN,
    Providers
} from '@models/index'
import { UserProfile, UserAuth } from '@modules/users'
import {AdminAuth} from '@modules/admins'

/**
 * @category Modules
 * @param {user} Instance of User module
 */
export const userProfile = new UserProfile({
    model: UserModel,
    providers: Providers
})

export const userAuthentication = new UserAuth({
	model: UserModel,
    otps: OTP
})

export const adminAuthentication = new AdminAuth({
	model: ADMIN,
    otps: OTP
})
