import {Router as expressRouter} from 'express'
import {adminAuthCtrl as authCtrl} from '@controllers/index'
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
    authCtrl.register()
)
router.post(
	'/verify-account',
	Validator.verifyAccount(),
	val.validate(),
	authCtrl.verifyAccount()
)

// password recovery
router.post(
	'/forgot-password',
	Validator.forgotPassword(),
	val.validate(),
	authCtrl.forgotPassword()
)
router.post(
	'/reset-password',
	Validator.resetPassword(),
	val.validate(),
	authCtrl.resetPassword()
)


router.post('/login', Validator.login(), val.validate(), authCtrl.login())

export default router
