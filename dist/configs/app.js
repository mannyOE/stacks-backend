"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * General app configuration
 * @category Configurations
 */
class App {
}
/**
 * Name of the app
 * @param {string} appName
 */
App.appName = 'Staxave customer interface APIs';
/**
 * The port to run the application
 * @param {number} port
 */
App.port = parseInt(process.env.PORT || '3980');
/**
 * The environment of the current running context
 * @param {string} env
 */
App.env = process.env.NODE_ENV || 'development';
/**
 * Maximum size of the client upload
 * @param {string} clientBodyLimit
 */
App.clientBodyLimit = '50mb';
exports.default = App;
//# sourceMappingURL=app.js.map