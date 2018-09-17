"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RegistrationController {
    sendSMS(request, response) {
        response.send(200, {
            message: `Ride Hailing api sent sms to ${request.query.phoneNumber}`,
        });
    }
}
exports.default = RegistrationController;
