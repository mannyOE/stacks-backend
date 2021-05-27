import {
	userProfile,
    userAuthentication,
    adminAuthentication
} from '../modules'
import Ctrl from './ctrl'
import UserCtrl from './user'
import AuthCtrl from './auth'
import AdminAuthCtrl from './auth/admin'

export const ctrl = new Ctrl()
export const userProfileCtrl = new UserCtrl(userProfile)
export const userAuthCtrl = new AuthCtrl(userAuthentication)
export const adminAuthCtrl = new AdminAuthCtrl(adminAuthentication)
