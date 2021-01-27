"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Module = void 0;
const mongoose_1 = require("mongoose");
const mongodb_1 = require("mongodb");
const index_1 = require("@exceptions/index");
/**
 * Base model class
 * @category Modules
 */
class Module {
    /**
     * Handle generic error in modules
     * @param {Error} error
     */
    handleException(error) {
        if (error instanceof mongoose_1.Error.ValidationError) {
            throw new index_1.DatabaseValidationException(error.message, '', error);
        }
        else if (error instanceof mongodb_1.MongoError) {
            throw new index_1.DatabaseException(error.errmsg, error);
        }
        else if (error instanceof mongoose_1.Error.DocumentNotFoundError) {
            throw new index_1.ResourceNotFoundException();
        }
        else {
            throw error;
        }
    }
}
exports.Module = Module;
//# sourceMappingURL=index.js.map