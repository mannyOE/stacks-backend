import {Router as expressRouter} from 'express'
import {userProfileCtrl} from '@controllers/index'
import Auth from '@src/middlewares/auth'
import {Validator} from '@controllers/user'
const val = new Validator()
const auth = new Auth()

/**
 * user routes
 * @category Routers
 */
const router: expressRouter = expressRouter()

router.get('/me', auth.verify(), userProfileCtrl.fetchMe())

router.put('/update/', auth.verify(), userProfileCtrl.updateMe())
router.post('/apply', auth.verify(), userProfileCtrl.apply())
router.put('/update-sponsor', auth.verify(), userProfileCtrl.updateMe())

router.put(
	'/update-password',
	auth.verify(),
	Validator.changePassword(),
	val.validate(),
	userProfileCtrl.updatePassword()
)

router.put('/update-firebase-token', auth.verify(), userProfileCtrl.updateMe())

export default router
