"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ctrl_1 = require("@controllers/ctrl");
const jsonwebtoken_1 = require("jsonwebtoken");
const index_1 = require("@exceptions/index");
const index_2 = require("@modules/index");
const index_3 = require("@modules/auth/index");
/**
 * Middleware to handles token authentication
 * @category Controllers
 */
class AuthMiddleware extends ctrl_1.default {
    /**
     * @return {ValidationChain[]}
     */
    verify() {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                // @ts-ignore
                let token = req.headers['authorization'];
                if (!token || !token.includes('Bearer')) {
                    throw new index_1.InvalidAccessCredentialsException('Invalid bearer token provided');
                }
                token = token.split('Bearer ')[1];
                // @ts-ignore
                const decoded = jsonwebtoken_1.verify(token, index_3.tokenKey);
                const account = yield index_2.user.account(decoded.user);
                // @ts-ignore
                req.account = account;
                return next();
            }
            catch (error) {
                if (error.name === 'TokenExpiredError') {
                    throw new index_1.InvalidAccessCredentialsException('This token has expired.');
                }
                else if (error.name === 'JsonWebTokenError') {
                    throw new index_1.InvalidAccessCredentialsException('This token is invalid.');
                }
                this.handleError(error, req, res);
            }
        });
    }
}
exports.default = AuthMiddleware;
//# sourceMappingURL=auth.js.map