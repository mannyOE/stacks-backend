import {Request, Response, Router as expressRouter} from 'express'
import AuthRouter from '@routes/admin/auth'
const router: expressRouter = expressRouter()

router.use('/auth', AuthRouter)

export default router
