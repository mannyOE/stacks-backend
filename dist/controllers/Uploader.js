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
const ctrl_1 = require("@controllers/ctrl");
const fs_extra_1 = require("fs-extra");
const index_1 = require("@exceptions/index");
const uploader_1 = require("../utils/uploader");
const util_1 = require("util");
/**
 * Middleware to handles token authentication
 * @category Controllers
 */
class UploaderClass extends ctrl_1.default {
    fileUpload() {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                // @ts-ignore
                let files = req.files;
                if (!files) {
                    throw new index_1.BadInputFormatException('Add a file to upload');
                }
                files = files.file;
                if (!files) {
                    throw new index_1.BadInputFormatException('The image must be provided with the key: `file`');
                }
                let path = './temp';
                if (!fs_extra_1.existsSync(path)) {
                    fs_extra_1.mkdirSync(path);
                }
                if (util_1.isArray(files)) {
                    let images = [];
                    for (let file of files) {
                        yield file.mv(path + '/' + file.name);
                        let uploader = new uploader_1.default();
                        let url = yield uploader.upload(path + '/' + file.name, `files/`, {});
                        images.push(url);
                        fs_extra_1.unlinkSync(path + '/' + file.name);
                    }
                    res.send({ images, message: 'files uploaded' });
                }
                else {
                    yield files.mv(path + '/' + files.name);
                    let uploader = new uploader_1.default();
                    let url = yield uploader.upload(path + '/' + files.name, `files/`, {});
                    fs_extra_1.unlinkSync(path + '/' + files.name);
                    res.send({ image: url, message: 'file uploaded' });
                }
            }
            catch (error) {
                this.handleError(error, req, res);
            }
        });
    }
}
exports.default = UploaderClass;
//# sourceMappingURL=Uploader.js.map