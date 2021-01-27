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
exports.Validator = void 0;
const ctrl_1 = require("@controllers/ctrl");
const validation_1 = require("./validation");
exports.Validator = validation_1.default;
/**
 * Authentication controller
 * @category Controllers
 */
class AuthCtrl extends ctrl_1.default {
    /**
     * @constructor
     */
    constructor(module) {
        super();
        this.module = module;
    }
    /**
     * request handler for login
     * @return {RequestHandler}
     */
    login() {
        return (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { mobile, email, password } = req.body;
                let acct;
                acct = yield this.module.login({ email, password });
                this.ok(res, 'Logged in successfully', acct);
            }
            catch (error) {
                this.handleError(error, req, res);
            }
        });
    }
    /**
     * request handler for workspace creating
     * @return {RequestHandler}
     */
    register() {
        return (req, res) => __awaiter(this, void 0, void 0, function* () {
            // create company account
            try {
                const { email, password, full_name, mobile } = req.body;
                const acct = yield this.module.create({
                    email,
                    password,
                    full_name,
                    mobile
                });
                this.ok(res, acct);
            }
            catch (error) {
                this.handleError(error, req, res);
            }
        });
    }
    /**
     * request handler for verifying email account after signup
     * @return {RequestHandler}
     */
    verifyAccount() {
        return (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { code } = req.body;
                const acct = yield this.module.verifyOTP(code);
                this.ok(res, 'Account confirmed successfully', acct);
            }
            catch (error) {
                this.handleError(error, req, res);
            }
        });
    }
    /**
     * request handler for handling forgot password for a particular namespace
     * @return {RequestHandler}
     */
    forgotPassword() {
        return (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const acct = yield this.module.forgotPassword({ email });
                this.ok(res, 'Password reset initiated', acct);
            }
            catch (error) {
                this.handleError(error, req, res);
            }
        });
    }
    /**
     * request handler for handling reset password for a particular namespace
     * @return {RequestHandler}
     */
    resetPassword() {
        return (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { code, password } = req.body;
                const acct = yield this.module.resetPassword({
                    code,
                    password
                });
                this.ok(res, 'Password reset completed', acct);
            }
            catch (error) {
                this.handleError(error, req, res);
            }
        });
    }
}
exports.default = AuthCtrl;
//# sourceMappingURL=index.js.map