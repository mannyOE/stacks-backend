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
exports.UserSchema = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = require("bcrypt");
var mongoosePaginate = require('mongoose-paginate');
const salt = bcrypt_1.genSaltSync(10);
/**
 * Mongoose schema of a user
 * @category Models
 */
exports.UserSchema = new mongoose_1.Schema({
    full_name: {
        type: mongoose_1.Schema.Types.String,
        required: true
    },
    fcm_token: {
        type: String
    },
    email: {
        type: mongoose_1.Schema.Types.String,
        unique: true,
        required: true
    },
    mobile: {
        type: mongoose_1.Schema.Types.String,
    },
    avatar: {
        type: mongoose_1.Schema.Types.String
    },
    password: {
        type: mongoose_1.Schema.Types.String,
        required: true
    },
    blocked: {
        type: mongoose_1.Schema.Types.Boolean,
        default: false
    },
    verified: {
        type: mongoose_1.Schema.Types.Boolean,
        default: false
    },
}, {
    collection: 'users',
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});
exports.UserSchema.methods.comparePWD = function (value) {
    return __awaiter(this, void 0, void 0, function* () {
        // Todo: implement password comparison
        let isCorrect = yield bcrypt_1.compare(value, this.password);
        return Promise.resolve(isCorrect);
    });
};
exports.UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Todo: convert plain password to hashed password
        if (this.isModified('password')) {
            this.password = yield bcrypt_1.hash(this.password, salt);
        }
        next();
    });
});
exports.UserSchema.pre('update', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Todo: convert plain password to hashed password if password is part of update
        if (this.isModified('password')) {
            this.password = yield bcrypt_1.hash(this.password, salt);
        }
        next();
    });
});
exports.UserSchema.plugin(mongoosePaginate);
/**
 * Factory to generate User Model
 * @param {Connection} conn
 * @return {Model<UserInterface>}
 * @category Models
 */
function userFactory(conn) {
    return conn.model('Users', exports.UserSchema);
}
exports.default = userFactory;
//# sourceMappingURL=user.js.map