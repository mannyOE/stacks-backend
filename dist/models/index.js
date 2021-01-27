"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTP = exports.User = exports.conn = void 0;
const mongoose_1 = require("mongoose");
const mongo_1 = require("@configs/mongo");
const user_1 = require("./user");
const otps_1 = require("./otps");
/**
 * @param {Connection} conn The mongoose connection instance for mongodb
 * @category Models
 */
exports.conn = mongoose_1.createConnection(mongo_1.default.uri, mongo_1.default.options);
/**
 * @param {Model<UserInterface>} instance of User model
 * @category Models
 */
exports.User = user_1.default(exports.conn);
exports.OTP = otps_1.default(exports.conn);
exports.conn.once('open', () => console.log('db connection open'));
//# sourceMappingURL=index.js.map