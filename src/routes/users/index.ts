import {Request, Response, Router as expressRouter} from 'express'
import AppConfig from '@configs/app'
import UserRouter from './user'
import AuthRouter from './auth'
const router: expressRouter = expressRouter()

router.use('/user', UserRouter)
router.use('/auth', AuthRouter)

export default router
