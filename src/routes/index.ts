import {Request, Response, Router as expressRouter} from 'express'
import AppConfig from '@configs/app'
import UserRouter from './users'
import AdminRouter from './admin'
import Uploader from '@controllers/Uploader'
let uploader = new Uploader()
const router: expressRouter = expressRouter()

router.get('/', (req: Request, res: Response): void => {
	res.send(`You've reached api routes of ${AppConfig.appName}`)
})

router.use('/users', UserRouter)
router.use('/admin', AdminRouter)

router.post('/upload', uploader.fileUpload())

export default router
