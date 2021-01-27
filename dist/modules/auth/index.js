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
exports.PASSWORD = exports.tokenKey = void 0;
const resolve_template_1 = require("../../utils/resolve-template");
const index_1 = require("@modules/module/index");
const jsonwebtoken_1 = require("jsonwebtoken");
const index_2 = require("@exceptions/index");
const Notify_1 = require("@src/utils/Notify");
exports.tokenKey = '1Z2E3E4D5A6S7-8P9A0SSWORD';
exports.PASSWORD = '@11Poster';
const moment = require('moment');
/**
 * User module: handle all user interaction with database and business logic
 * @category Modules
 */
class Auth extends index_1.Module {
    /**
     * @constructor
     * @param {UserModuleProps} props
     */
    constructor(props) {
        super();
        this.model = props.model;
        this.otps = props.otps;
    }
    generateCode(len = 10) {
        return __awaiter(this, void 0, void 0, function* () {
            var pwdChars = '0123456789';
            var randPassword = Array(len)
                .fill(pwdChars)
                .map(function (x) {
                return x[Math.floor(Math.random() * x.length)];
            })
                .join('');
            return Promise.resolve(randPassword);
        });
    }
    createOTP(email, user, name) {
        return __awaiter(this, void 0, void 0, function* () {
            // Todo: implement create project
            const otp = yield this.generateCode(6);
            let exist = yield this.otps.findOne({ email });
            if (!exist) {
                let expires = new moment().add(1, 'd');
                // otp does not exist for this phone
                exist = yield new this.otps({
                    email,
                    code: otp,
                    user,
                    expires
                }).save();
            }
            else {
                let expires = new moment().add(1, 'd');
                exist.expires = expires;
                yield exist.save();
            }
            let content = yield resolve_template_1.getTemplate('verify', {
                email,
                name,
                code: exist.code
            });
            yield new Notify_1.default().sendMail({
                content,
                email,
                subject: 'Verify your Staxave account'
            });
            return Promise.resolve('OTP sent to ' + email);
        });
    }
    verifyOTP(code) {
        return __awaiter(this, void 0, void 0, function* () {
            // Todo: implement create project
            const exist = yield this.otps.findOne({ code });
            if (!exist) {
                throw new index_2.InvalidAccessCredentialsException('Provided OTP is invalid');
            }
            else {
                let info = yield this.model.findById(exist.user);
                if (!info) {
                    throw new index_2.BadInputFormatException('Can not find account');
                }
                info.verified = true;
                yield info.save();
                let expiresIn = 1000 * 60 * 60 * 24;
                let payload = {
                    user: info._id.toString()
                };
                let updateToken = jsonwebtoken_1.sign(payload, exports.tokenKey, { expiresIn });
                yield exist.remove();
                let content = yield resolve_template_1.getTemplate('welcome', {
                    email: info.email,
                    name: info.full_name,
                });
                yield new Notify_1.default().sendMail({
                    content,
                    email: info.email,
                    subject: 'Verify your Staxave account'
                });
                return Promise.resolve({
                    accessToken: {
                        token: updateToken,
                        expires: expiresIn
                    },
                    user: info
                });
            }
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // check to ensure the company name is unique
            try {
                const userExists = yield this.model.findOne({
                    email: data.email
                });
                if (userExists) {
                    throw new index_2.BadInputFormatException('This email already exists');
                }
                let account = new this.model({
                    email: data.email,
                    full_name: data.full_name,
                    mobile: data.mobile,
                    password: data.password
                });
                yield account.save();
                yield this.createOTP(account.email, account._id.toString(), account.full_name);
                account.password = data.password;
                yield account.save();
                return 'Account created. Verification code sent to your email address.';
            }
            catch (error) {
                throw new index_2.BadInputFormatException(error.message);
            }
        });
    }
    /**
     * Logs in to an account
     * @param {LoginInput} data property of user needed to login
     * @throws MongooseError.ValidationError
     * @throws MongoError
     * @return {Promise<UserInterface>}
     */
    login(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // check to ensure the company name is unique
            let accountExists;
            accountExists = yield this.model.findOne({
                email: data.email
            });
            if (!accountExists) {
                throw new index_2.InvalidAccessCredentialsException('This account is does not exists');
            }
            let correctPassword = yield accountExists.comparePWD(data.password);
            if (!correctPassword) {
                throw new index_2.InvalidAccessCredentialsException('This password is invalid');
            }
            if (!accountExists.verified) {
                yield this.createOTP(accountExists.email, accountExists._id.toString(), accountExists.full_name);
                throw new index_2.InvalidAccessCredentialsException('Your account has not been confirmed. Please check your mail inbox');
            }
            const payload = {
                user: accountExists._id.toString()
            };
            const expiresIn = 1000 * 60 * 60 * 24;
            const token = jsonwebtoken_1.sign(payload, exports.tokenKey, { expiresIn });
            return Promise.resolve({
                accessToken: {
                    token,
                    expires: expiresIn
                },
                user: accountExists
            });
        });
    }
    /**
     * Initiates password reset on an account
     * @param {ForgotPasswordInput} data property of user needed to initiate password reset
     * @throws MongooseError.ValidationError
     * @throws MongoError
     * @return {Promise<UserInterface>}
     */
    forgotPassword(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // check to ensure the company name is unique
            const accountExists = yield this.model.findOne({
                email: data.email
            });
            if (!accountExists) {
                throw new index_2.InvalidAccessCredentialsException('This account does not exists');
            }
            // Todo: Send forgot password email
            yield this.createOTP(accountExists.email, accountExists._id.toString(), accountExists.full_name);
            return Promise.resolve({ mobile: accountExists.email });
        });
    }
    /**
     * Resets account password
     * @param {ResetPasswordInput} data property of user needed to reset password
     * @throws MongooseError.ValidationError
     * @throws MongoError
     * @return {Promise<UserInterface>}
     */
    resetPassword(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const exist = yield this.otps.findOne({
                    code: data.code
                });
                if (!exist) {
                    throw new index_2.InvalidAccessCredentialsException('Provided OTP is invalid');
                }
                const accountExists = yield this.model.findOne({
                    _id: exist.user
                });
                if (!accountExists) {
                    throw new index_2.InvalidAccessCredentialsException('Could not find this account. Please try reseting your password again');
                }
                accountExists.password = data.password;
                yield accountExists.save();
                yield exist.remove();
                const payload = {
                    user: accountExists._id.toString()
                };
                const expiresIn = 1000 * 60 * 60 * 24;
                const token = jsonwebtoken_1.sign(payload, exports.tokenKey, { expiresIn });
                return Promise.resolve({
                    accessToken: {
                        token,
                        expires: expiresIn
                    },
                    user: accountExists
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = Auth;
//# sourceMappingURL=index.js.map