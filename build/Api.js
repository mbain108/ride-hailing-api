"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify_1 = require("restify");
const StatsController_1 = require("./controllers/StatsController");
const RegistrationController_1 = require("./controllers/RegistrationController");
class Api {
    constructor() {
        this.server = restify_1.createServer();
        this.config();
    }
    config() {
        const statsController = new StatsController_1.default();
        const registrationController = new RegistrationController_1.default();
        this.server.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            return next();
        });
        this.server.use(restify_1.plugins.queryParser());
        this.server.get('/', statsController.getInfo);
        this.server.get('/health', statsController.getInfo);
        this.server.post('/sms', registrationController.sendSMS);
        this.server.get('/verify-code', registrationController.verifyCode);
    }
}
exports.default = Api;
