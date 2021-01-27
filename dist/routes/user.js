"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = require("@controllers/index");
const auth_1 = require("@src/middlewares/auth");
const user_1 = require("@controllers/user");
const val = new user_1.Validator();
const auth = new auth_1.default();
/**
 * user routes
 * @category Routers
 */
const router = express_1.Router();
router.get('/me', auth.verify(), index_1.userCtrl.fetchMe());
router.put('/update/', auth.verify(), index_1.userCtrl.updateMe());
router.put('/update-sponsor', auth.verify(), index_1.userCtrl.updateMe());
router.put('/update-password', auth.verify(), user_1.Validator.changePassword(), val.validate(), index_1.userCtrl.updatePassword());
router.put('/update-firebase-token', auth.verify(), index_1.userCtrl.updateMe());
exports.default = router;
//# sourceMappingURL=user.js.map