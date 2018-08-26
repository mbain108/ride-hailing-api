"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StatsController {
    getInfo(request, response) {
        response.send(200, {
            message: 'Ride Hailing API',
        });
    }
}
exports.default = StatsController;
