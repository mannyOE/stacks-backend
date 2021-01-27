"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = require("@controllers/index");
const auth_1 = require("@controllers/auth");
const val = new auth_1.Validator();
/**
 * auth routes
 * @category Routers
 */
const router = express_1.Router();
// registration
router.post('/signup', auth_1.Validator.register(), val.validate(), index_1.authCtrl.register());
router.post('/verify-account', auth_1.Validator.verifyAccount(), val.validate(), index_1.authCtrl.verifyAccount());
// password recovery
router.post('/forgot-password', auth_1.Validator.forgotPassword(), val.validate(), index_1.authCtrl.forgotPassword());
router.post('/reset-password', auth_1.Validator.resetPassword(), val.validate(), index_1.authCtrl.resetPassword());
router.post('/login', auth_1.Validator.login(), val.validate(), index_1.authCtrl.login());
exports.default = router;
//# sourceMappingURL=auth.js.map