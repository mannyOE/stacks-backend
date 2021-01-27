import {RequestHandler, Request, Response, NextFunction} from 'express'
import Ctrl from '@controllers/ctrl'
import {mkdirSync, existsSync, unlinkSync} from 'fs-extra'
import {
	BadInputFormatException,
	InvalidAccessCredentialsException
} from '@exceptions/index'
import Uploader from '../utils/uploader'
import {isArray} from 'util'

/**
 * Middleware to handles token authentication
 * @category Controllers
 */
class UploaderClass extends Ctrl {
	fileUpload(): RequestHandler {
		return async (
			req: Request,
			res: Response,
			next: NextFunction
		): Promise<void> => {
			try {
				// @ts-ignore
				let files = req.files
				if (!files) {
					throw new BadInputFormatException('Add a file to upload')
				}
				files = files.file
				if (!files) {
					throw new BadInputFormatException(
						'The image must be provided with the key: `file`'
					)
				}
				let path = './temp'
				if (!existsSync(path)) {
					mkdirSync(path)
				}
				if (isArray(files)) {
					let images = []
					for (let file of files) {
						await file.mv(path + '/' + file.name)
						let uploader = new Uploader()
						let url = await uploader.upload(
							path + '/' + file.name,
							`files/`,
							{}
						)
						images.push(url)

						unlinkSync(path + '/' + file.name)
					}
					res.send({images, message: 'files uploaded'})
				} else {
					await files.mv(path + '/' + files.name)
					let uploader = new Uploader()
					let url = await uploader.upload(path + '/' + files.name, `files/`, {})
					unlinkSync(path + '/' + files.name)
					res.send({image: url, message: 'file uploaded'})
				}
			} catch (error) {
				this.handleError(error, req, res)
			}
		}
	}
}

export default UploaderClass
