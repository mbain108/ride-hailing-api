"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify_1 = require("restify");
const StatsController_1 = require("./controllers/StatsController");
class Api {
    constructor() {
        this.server = restify_1.createServer();
        this.config();
    }
    config() {
        const statsController = new StatsController_1.default();
        this.server.get('/', statsController.getInfo);
        this.server.get('/health', statsController.getInfo);
    }
}
exports.default = Api;
