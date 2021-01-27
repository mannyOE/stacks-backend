import {Request, Response, Router as expressRouter} from 'express'
import AppConfig from '@configs/app'
import UserRouter from '@routes/user'
import AuthRouter from '@routes/auth'
import Uploader from '@controllers/Uploader'
let uploader = new Uploader()
const router: expressRouter = expressRouter()

router.get('/', (req: Request, res: Response): void => {
	res.send(`You've reached api routes of ${AppConfig.appName}`)
})

router.use('/user', UserRouter)
router.use('/auth', AuthRouter)

router.post('/upload', uploader.fileUpload())

export default router
