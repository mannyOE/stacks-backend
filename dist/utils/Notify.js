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
const module_1 = require("@src/modules/module");
const node_mailjet_1 = require("node-mailjet");
const firebase_admin_1 = require("firebase-admin");
const path_1 = require("path");
const request_promise_1 = require("request-promise");
const serviceAccount = require(path_1.join(__dirname, '../../power-invest-firebase.json'));
const firebaseApp = firebase_admin_1.initializeApp({
    credential: firebase_admin_1.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
}, 'databaseApp');
/**
 * Handle all business logic that could happen in Index controller
 *
 * @category Modules
 */
class NotificationModule extends module_1.Module {
    constructor() {
        super();
        this.privateKey = process.env.MAIL_JET_SECRET_KEY;
        this.publicKey = process.env.MAIL_JET_PUBLIC_KEY;
        this.senderName = process.env.EMAIL_SENDER;
        this.senderEmail = process.env.EMAIL_ID;
        this.mailJet = node_mailjet_1.connect(this.publicKey || '', this.privateKey || '');
        this.serverKey = process.env.FCM_SERVER_KEY;
        this.firebase = firebase_admin_1.messaging;
    }
    /**
     * Send a mail notification to a specific email address
     *
     * @param {Object|SendMailOption} mail
     *
     * @throws {InvalidMailAddressException}
     *
     * @return {Promise<Object>}
     */
    sendMail(mail) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const message = {
                    From: {
                        Name: this.senderName,
                        Email: this.senderEmail || 'service-noreply@power-invest.com'
                    },
                    Subject: mail.subject,
                    HTMLPart: mail.content,
                    To: [
                        {
                            Email: mail.email
                        }
                    ]
                };
                if (mail.replyTo) {
                    message['ReplyTo'] = {
                        Email: mail.replyTo
                    };
                }
                if (mail.name) {
                    message.To[0]['Name'] = mail.name;
                }
                const response = yield this.mailJet
                    .post('send', { version: 'v3.1' })
                    .request({
                    Messages: [message]
                });
                console.log(response.body);
                return { success: true, data: response.body };
            }
            catch (error) {
                return { success: false, error };
            }
        });
    }
    /**
     * Send a push notification to a user's token
     *
     * @param {Object|WebPush} payload
     *
     * @return {Promise<Object>}
     */
    push(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            // Send a message to devices subscribed to the provided topic.
            try {
                const message = {
                    notification: {
                        title: payload.subject,
                        body: payload.content
                    },
                    to: payload.destination
                };
                if (payload.data) {
                    message.data = payload.data;
                }
                const response = yield request_promise_1.post({
                    uri: 'https://fcm.googleapis.com/fcm/send',
                    body: message,
                    json: true,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `key=${this.serverKey}`
                    }
                });
                yield this.saveMessageToFirebase(payload);
                return { success: true, data: response };
            }
            catch (error) {
                return { success: false, error };
            }
        });
    }
    /**
     * Subscribe a user to a topic-- for use in team notification
     *
     * @param {SubscriptionOPtion} payload
     *
     * @throws {InvalidMailAddressException}
     *
     * @return {Promise<Object>}
     */
    subscribeToTopic(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.firebase().subscribeToTopic([payload.token], payload.topic);
                return { success: true, data: response };
            }
            catch (error) {
                return { success: false, error };
            }
        });
    }
    /**
     * unsubscribe a user from a topic-- for use in team notification
     *
     * @param {SubscriptionOPtion} payload
     *
     * @throws {InvalidMailAddressException}
     *
     * @return {Promise<Object>}
     */
    unSubscribeFromTopic(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.firebase().unsubscribeFromTopic([payload.token], payload.topic);
                return { success: true, data: response };
            }
            catch (error) {
                return { success: false, error };
            }
        });
    }
    saveMessageToFirebase(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            if (payload.user) {
                const dbRef = firebase_admin_1.database(firebaseApp).ref(payload.user);
                const time = Date.now();
                dbRef
                    .child('notifications')
                    .push({
                    subject: payload.subject,
                    message: payload.content,
                    time
                })
                    .catch((error) => console.log(error));
                dbRef
                    .child('newNotifications')
                    .transaction((counter) => (counter || 0) + 1)
                    .catch((error) => console.log(error));
            }
        });
    }
}
exports.default = NotificationModule;
//# sourceMappingURL=Notify.js.map