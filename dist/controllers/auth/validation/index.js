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
class AuthValidator extends ctrl_1.default {
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
    static login() {
        const rules = [
            express_validator_1.check('email')
                .exists()
                .withMessage('Email must be provided')
                .isEmail()
                .withMessage('This must be a valid email address'),
            express_validator_1.check('password')
                .exists()
                .withMessage('Password is required')
        ];
        return rules;
    }
    static register() {
        const rules = [
            express_validator_1.check('email')
                .exists()
                .withMessage('Email must be provided')
                .isEmail()
                .withMessage('This must be a valid email address'),
            express_validator_1.check('full_name').exists().withMessage('The full name is required'),
            express_validator_1.check('mobile')
                .exists()
                .withMessage('phone number must be provided')
                .isMobilePhone('any')
                .withMessage('This must be a valid phone number'),
            express_validator_1.check('password')
                .exists()
                .withMessage('Password is required')
                .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/)
                .withMessage('Password must be minimum of 6 characters, one number, one lowercase and one uppercase')
        ];
        return rules;
    }
    /**
     * Method to verify
     * @return {ValidationChain[]}
     */
    static verifyAccount() {
        return [
            express_validator_1.check('code')
                .exists()
                .withMessage('Please provide the token sent to you via sms')
                .isLength({ min: 6, max: 6 })
                .withMessage('Verification code must be 6 digits')
        ];
    }
    /**
     * Method to verify
     * @return {ValidationChain[]}
     */
    static forgotPassword() {
        return [
            express_validator_1.check('email')
                .exists()
                .withMessage('Email address must be provided')
        ];
    }
    /**
     * Method to verify
     * @return {ValidationChain[]}
     */
    static resetPassword() {
        return [
            express_validator_1.check('password')
                .exists()
                .withMessage('Password is required')
                .isLength({ min: 6 })
                .withMessage('password must be minimu of 8 characters')
                .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/)
                .withMessage('Password must contain at least one number, one lowercase and one uppercase'),
            express_validator_1.check('code')
                .exists()
                .withMessage('Please provide the token sent to you via sms')
                .isLength({ min: 6, max: 6 })
                .withMessage('Code must be 6 digits')
        ];
    }
}
exports.default = AuthValidator;
// https://quiet-anchorage-17876.herokuapp.com/
// https://git.heroku.com/quiet-anchorage-17876.git
// dff
//# sourceMappingURL=index.js.map