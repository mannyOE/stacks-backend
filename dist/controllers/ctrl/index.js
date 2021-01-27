"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("@exceptions/index");
/**
 * Base controller which would be inherited by other controllers.
 * @category Controllers
 */
class Ctrl {
    constructor() {
        this.HTTP_OK = 200;
        this.HTTP_CREATED = 201;
        this.HTTP_BAD_REQUEST = 400;
        this.HTTP_RESOURCE_NOT_FOUND = 404;
        this.HTTP_INTERNAL_SERVER_ERROR = 500;
        this.HTTP_UNAUTHENTICATED = 401;
        this.HTTP_UNAUTHORIZED = 403;
    }
    /**
     * handle successful response
     * @param {Response} res
     * @param {string} message
     * @param {Object|string} data
     */
    ok(res, message, data) {
        let load = {
            code: this.HTTP_OK,
            success: true,
            message: message,
            data
        };
        res.status(this.HTTP_OK).json(load);
    }
    /**
     * @param {Exception} error
     * @param {Request} req
     * @param {Response} res
     */
    handleError(error, req, res) {
        // set locals, only providing error in development
        res.locals.message = error.message;
        res.locals.error = req.app.get('env') === 'development' ? error : {};
        if (error instanceof index_1.InvalidAccessCredentialsException) {
            let load = {
                code: error.code,
                success: false,
                message: error.message
            };
            res.status(this.HTTP_UNAUTHORIZED).json(load);
        }
        else if (error instanceof index_1.BadInputFormatException) {
            let load = {
                code: error.code,
                success: false,
                message: error.message
            };
            res.status(this.HTTP_BAD_REQUEST).json(load);
        }
        else if (error instanceof index_1.NetworkException) {
            let load = {
                code: error.code,
                success: false,
                message: error.message
            };
            res.status(this.HTTP_INTERNAL_SERVER_ERROR).json(load);
        }
        else if (error instanceof index_1.ResourceNotFoundException) {
            let load = {
                code: error.code,
                success: false,
                message: error.message
            };
            res.status(this.HTTP_RESOURCE_NOT_FOUND).json(load);
        }
        else if (error instanceof index_1.DuplicateException) {
            let load = {
                code: error.code,
                success: false,
                message: error.message
            };
            res.status(this.HTTP_BAD_REQUEST).json(load);
        }
        else if (error instanceof index_1.DatabaseException) {
            let load = {
                code: error.code,
                success: false,
                message: 'A database error has occurred'
            };
            res.status(this.HTTP_INTERNAL_SERVER_ERROR).json(load);
        }
        else if (error instanceof index_1.DatabaseValidationException) {
            let load = {
                code: error.code,
                success: false,
                message: 'There was an error with your request'
            };
            res.status(this.HTTP_BAD_REQUEST).json(load);
        }
        else {
            res.status(500);
        }
    }
    /**
     * Handler non existent routes
     * @param {Request} req
     * @param {Response} res
     */
    handleNotFound(req, res) {
        res.status(404).send('Resource not found.');
    }
    /**
     * Standardize response format
     * @param {ResponseInterface} resp
     * @return {ResponseInterface}
     */
    format(resp) {
        return resp;
    }
}
exports.default = Ctrl;
//# sourceMappingURL=index.js.map