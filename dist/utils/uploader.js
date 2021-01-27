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
const cloud = require('cloudinary');
const cloudinary = cloud.v2;
class Uploader {
    constructor() { }
    upload(stream, path, override = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                cloudinary.config({
                    cloud_name: process.env.CLOUDINARY_NAME,
                    api_key: process.env.CLOUDINARY_API_KEY,
                    api_secret: process.env.CLOUDINARY_API_SECRET
                });
                let result = yield cloudinary.uploader.upload(stream, Object.assign({ folder: path }, override), () => { });
                return result.secure_url;
            }
            catch (err) {
                console.log(err);
                throw new Error(err);
            }
        });
    }
    destroy(file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                cloudinary.config({
                    cloud_name: process.env.CLOUDINARY_NAME,
                    api_key: process.env.CLOUDINARY_API_KEY,
                    api_secret: process.env.CLOUDINARY_API_SECRET
                });
                return yield cloudinary.uploader.destroy(file);
            }
            catch (err) {
                throw new Error(err);
            }
        });
    }
}
exports.default = Uploader;
//# sourceMappingURL=uploader.js.map