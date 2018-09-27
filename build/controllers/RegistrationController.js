"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RegistrationController {
    sendSMS(request, response) {
        response.send(200, {
            message: `Ride Hailing api sent sms to ${request.query.phoneNumber}`,
        });
    }
    verifyCode(request, response) {
        const code = request.query.code;
        response.send(200, {
            verified: true,
        }, { contentType: 'application/json' });
    }
    insertDriverDetails(request, response) {
        response.send(200, {
            message: `Got driver details`,
        });
    }
}
exports.default = RegistrationController;
