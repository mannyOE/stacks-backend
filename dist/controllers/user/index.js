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
const validator_1 = require("./validator");
exports.Validator = validator_1.default;
const ctrl_1 = require("@controllers/ctrl");
const Permits_1 = require("@src/utils/Permits");
const permits = new Permits_1.default();
/**
 * User controller
 * @category Controllers
 */
class UserCtrl extends ctrl_1.default {
    /**
     * @constructor
     * @param {User} module instance of user module
     */
    constructor(module) {
        super();
        this.module = module;
    }
    /**
     * Updates record of a user
     * @return {RequestHandler}
     */
    updateMe() {
        return (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Todo: implement handler
                const update = req.body;
                // @ts-ignore
                const account = req.account;
                let profile = yield this.module.updateMe(account, update);
                this.ok(res, 'Account updated', profile);
            }
            catch (error) {
                this.handleError(error, req, res);
            }
        });
    }
    /**
     * Updates password of a user
     * @return {RequestHandler}
     */
    updatePassword() {
        return (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Todo: implement handler
                const { newPassword, oldPassword } = req.body;
                // @ts-ignore
                const account = req.account;
                yield this.module.updatePassword(account, oldPassword, newPassword);
                this.ok(res, 'password updated');
            }
            catch (error) {
                this.handleError(error, req, res);
            }
        });
    }
    /**
     * Updates record of a user
     * @return {RequestHandler}
     */
    fetchMe() {
        return (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // @ts-ignore
                const account = req.account;
                let profile = yield this.module.profile(account);
                this.ok(res, 'Account fetched', profile);
            }
            catch (error) {
                this.handleError(error, req, res);
            }
        });
    }
}
exports.default = UserCtrl;
//# sourceMappingURL=index.js.map