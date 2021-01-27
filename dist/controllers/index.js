"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authCtrl = exports.userCtrl = exports.ctrl = void 0;
const modules_1 = require("../modules");
const ctrl_1 = require("./ctrl");
const user_1 = require("./user");
const auth_1 = require("./auth");
exports.ctrl = new ctrl_1.default();
exports.userCtrl = new user_1.default(modules_1.user);
exports.authCtrl = new auth_1.default(modules_1.authentication);
//# sourceMappingURL=index.js.map