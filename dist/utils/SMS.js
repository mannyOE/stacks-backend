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
const twilio = require('twilio');
class SMS {
    constructor() {
        this.sid = process.env.TWILIO_ACCOUNT_SID;
        this.token = process.env.TWILIO_AUTH_TOKEN;
        this.sendNumber = process.env.TWILIO_PHONE_NUMBER;
    }
    send(recipient, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const num = [];
            if (Array.isArray(recipient)) {
                for (let number of recipient) {
                    if (number[0] === '0') {
                        number = `+234${number.substr(1)}`;
                    }
                    num.push(number);
                }
            }
            else {
                if (recipient[0] === '0') {
                    recipient = `+234${recipient.substr(1)}`;
                }
                num.push(recipient);
            }
            try {
                const client = new twilio(this.sid, this.token);
                var response = yield client.messages.create({
                    body: message,
                    to: num,
                    from: this.sendNumber // From a valid Twilio number
                });
                console.log(response.sid);
                return response;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = SMS;
//# sourceMappingURL=SMS.js.map