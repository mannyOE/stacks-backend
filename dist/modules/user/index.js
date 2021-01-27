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
const index_1 = require("@modules/module/index");
const index_2 = require("@exceptions/index");
/**
 * User module: handle all user interaction with database and business logic
 * @category Modules
 */
class User extends index_1.Module {
    /**
     * @constructor
     * @param {UserModuleProps} props
     */
    constructor(props) {
        super();
        this.model = props.model;
    }
    /**
     * fetch a single member info
     * @param {string} member the user id of the member
     * @param {UserInterface} account the decoded account of the user
     * @param {object} update the data to update the member with
     * @throws MongooseError.ValidationError
     * @throws MongoError
     * @return {Promise<UserInterface>}
     */
    updateMe(account, update) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // @ts-ignore
                let sponsor = update.sponsor;
                // @ts-ignore
                delete update.sponsor;
                // @ts-ignore
                yield this.model.findOneAndUpdate({
                    _id: account._id
                }, { $set: update });
                return yield this.account(account._id.toString());
            }
            catch (error) {
                throw new index_2.BadInputFormatException('could not find this member');
            }
        });
    }
    /**
     * update a logged in user's password
     * @param {string} oldPassword old password of the user
     * @param {UserInterface} account the decoded account of the user
     * @param {string} newPassword new password to replace the old one.
     * @throws MongooseError.ValidationError
     * @throws MongoError
     * @return {Promise<UserInterface>}
     */
    updatePassword(account, oldPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            let info = yield this.model.findOne({
                _id: account._id
            });
            if (!info) {
                throw new index_2.BadInputFormatException('could not find this member');
            }
            let correctPassword = yield info.comparePWD(oldPassword);
            if (!correctPassword) {
                throw new index_2.InvalidAccessCredentialsException('old password does not match');
            }
            info.password = newPassword;
            yield info.save();
        });
    }
    /**
     * fetch a user profile info
     * @param {UserInterface} account the decoded account of the user
     * @throws MongooseError.ValidationError
     * @throws MongoError
     * @return {Promise<UserInterface>}
     */
    profile(account) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let info = yield this.model
                    .findOne({
                    _id: account._id
                })
                    .populate('sponsor');
                if (!info) {
                    throw new Error();
                }
                return Promise.resolve({ user: info });
            }
            catch (error) {
                throw new index_2.BadInputFormatException('could not find this user');
            }
        });
    }
    account(account) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let info = yield this.model
                    .findOne({
                    _id: account
                })
                    .populate('sponsor');
                if (!info) {
                    throw new Error();
                }
                return Promise.resolve(info);
            }
            catch (error) {
                throw new index_2.BadInputFormatException('could not find this user');
            }
        });
    }
}
exports.default = User;
//# sourceMappingURL=index.js.map