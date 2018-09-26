"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Drivers = require("../cassandra/drivers");
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
    async foo() {
        const drivers = await Drivers.list();
        await Promise.all(drivers.map(driver1 => {
            // tslint:disable-next-line:no-console
            console.log(driver1.email);
        }));
        const driver = await Drivers.findById('123');
        driver.email = '';
        await Drivers.update(driver);
    }
}
exports.default = RegistrationController;
