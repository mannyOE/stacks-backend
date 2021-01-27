"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentication = exports.user = void 0;
const index_1 = require("@models/index");
const user_1 = require("@modules/user");
const auth_1 = require("@modules/auth");
/**
 * @category Modules
 * @param {user} Instance of User module
 */
exports.user = new user_1.default({
    model: index_1.User
});
exports.authentication = new auth_1.default({
    model: index_1.User,
    otps: index_1.OTP
});
//# sourceMappingURL=index.js.map