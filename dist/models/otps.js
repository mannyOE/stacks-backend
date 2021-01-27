"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const OTPSchema = new mongoose_1.Schema({
    email: {
        type: String
    },
    code: {
        type: String
    },
    expires: {
        type: Date
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Users'
    }
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    versionKey: false,
    collection: 'otps'
});
function factory(conn) {
    return conn.model('OTPs', OTPSchema);
}
exports.default = factory;
//# sourceMappingURL=otps.js.map