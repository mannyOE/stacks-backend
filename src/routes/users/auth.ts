import {Router as expressRouter} from 'express'
import {userAuthCtrl} from '@controllers/index'
import {Validator} from '@controllers/auth'
const val = new Validator()

/**
 * auth routes
 * @category Routers
 */
const router: expressRouter = expressRouter()

// registration
router.post(
	'/signup',
	Validator.register(),
	val.validate(),
	userAuthCtrl.register()
)
router.post(
	'/verify-account',
	Validator.verifyAccount(),
	val.validate(),
	userAuthCtrl.verifyAccount()
)

// password recovery
router.post(
	'/forgot-password',
	Validator.forgotPassword(),
	val.validate(),
	userAuthCtrl.forgotPassword()
)
router.post(
	'/reset-password',
	Validator.resetPassword(),
	val.validate(),
	userAuthCtrl.resetPassword()
)


router.post('/login', Validator.login(), val.validate(), userAuthCtrl.login())

export default router
