"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify_1 = require("restify");
const corsMiddleware = require("restify-cors-middleware");
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
        const cors = corsMiddleware({
            origins: ['*'],
            allowHeaders: ['Content-Type'],
            exposeHeaders: ['Content-Type'],
        });
        this.server.pre(cors.preflight);
        this.server.use(cors.actual);
        this.server.use(restify_1.plugins.queryParser());
        this.server.use(restify_1.plugins.bodyParser());
        this.server.get('/', statsController.getInfo);
        this.server.get('/health', statsController.getInfo);
        this.server.post('/sms', registrationController.sendSMS);
        this.server.get('/verify-code', registrationController.verifyCode);
        this.server.post('/driver-details', registrationController.insertDriverDetails);
    }
}
exports.default = Api;
