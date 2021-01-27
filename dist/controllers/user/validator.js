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
const express_validator_1 = require("express-validator");
const ctrl_1 = require("@controllers/ctrl");
const index_1 = require("@exceptions/index");
/**
 * Middleware to handles validation for authentication controller
 * @category Controllers
 */
class UserValidator extends ctrl_1.default {
    /**
     * @return {ValidationChain[]}
     */
    validate() {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const result = express_validator_1.validationResult(req);
            const hasErrors = !result.isEmpty();
            const errors = result.array();
            if (hasErrors) {
                const error = new index_1.BadInputFormatException(errors.map((i) => i.msg).join(','), errors.map((e) => e.msg));
                return this.handleError(error, req, res);
            }
            return next();
        });
    }
    /**
     * Method to verify
     * @return {ValidationChain[]}
     */
    static verifyToken() {
        return [
            express_validator_1.check('token')
                .exists()
                .withMessage('Please provide the token sent to you via email')
                .isJWT()
                .withMessage('Token must be a valid JWT token')
        ];
    }
    /**
     * Method to change logged in user's password
     * @return {ValidationChain[]}
     */
    static changePassword() {
        return [
            express_validator_1.check('oldPassword')
                .exists()
                .withMessage('Provide your old password to move forward')
                .isLength({ min: 8 })
                .withMessage('password must be minimum of 8 characters')
                .matches(/^(?=.*[a-z]){1,}(?=.*[A-Z]){1,}(?=.*[0-9]){1,}.{8,}$/i)
                .withMessage('Password must contain at least one number, one lowercase and one uppercase'),
            express_validator_1.check('newPassword')
                .exists()
                .withMessage('Provide your new password to move forward')
                .isLength({ min: 8 })
                .withMessage('password must be minimum of 8 characters')
                .matches(/^(?=.*[a-z]){1,}(?=.*[A-Z]){1,}(?=.*[0-9]){1,}.{8,}$/i)
                .withMessage('Password must contain at least one number, one lowercase and one uppercase')
        ];
    }
    /**
     * Method to set password for social accounts
     * @return {ValidationChain[]}
     */
    static setPassword() {
        return [
            express_validator_1.check('password')
                .exists()
                .withMessage('Provide your old password to move forward')
                .isLength({ min: 8 })
                .withMessage('password must be minimum of 8 characters')
                .matches(/^(?=.*[a-z]){1,}(?=.*[A-Z]){1,}(?=.*[0-9]){1,}.{8,}$/i)
                .withMessage('Password must contain at least one number, one lowercase and one uppercase')
        ];
    }
}
exports.default = UserValidator;
//# sourceMappingURL=validator.js.map