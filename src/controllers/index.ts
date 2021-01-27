import {
	user,
	authentication
} from '../modules'
import Ctrl from './ctrl'
import UserCtrl from './user'
import AuthCtrl from './auth'

export const ctrl = new Ctrl()
export const userCtrl = new UserCtrl(user)
export const authCtrl = new AuthCtrl(authentication)
