import {Router as expressRouter} from 'express'
import {userCtrl} from '@controllers/index'
import Auth from '@src/middlewares/auth'
import {Validator} from '@controllers/user'
const val = new Validator()
const auth = new Auth()

/**
 * user routes
 * @category Routers
 */
const router: expressRouter = expressRouter()

router.get('/me', auth.verify(), userCtrl.fetchMe())

router.put('/update/', auth.verify(), userCtrl.updateMe())
router.put('/update-sponsor', auth.verify(), userCtrl.updateMe())

router.put(
	'/update-password',
	auth.verify(),
	Validator.changePassword(),
	val.validate(),
	userCtrl.updatePassword()
)

router.put('/update-firebase-token', auth.verify(), userCtrl.updateMe())

export default router
