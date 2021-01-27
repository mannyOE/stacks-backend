"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const app_1 = require("@configs/app");
const user_1 = require("@routes/user");
const auth_1 = require("@routes/auth");
const Uploader_1 = require("@controllers/Uploader");
let uploader = new Uploader_1.default();
const router = express_1.Router();
router.get('/', (req, res) => {
    res.send(`You've reached api routes of ${app_1.default.appName}`);
});
router.use('/user', user_1.default);
router.use('/auth', auth_1.default);
router.post('/upload', uploader.fileUpload());
exports.default = router;
//# sourceMappingURL=index.js.map