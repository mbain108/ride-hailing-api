import { Request, Response } from 'restify';
import * as Drivers from '../cassandra/drivers';

export default class RegistrationController {

  public sendSMS(request: Request, response: Response) {
    response.send(200, {
      message: `Ride Hailing api sent sms to ${request.query.phoneNumber}`,
    });
  }

  public verifyCode(request: Request, response: Response) {
    const code = request.query.code;
    response.send(200, {
      verified: true,
    }, { contentType: 'application/json' });
  }

  public async foo() {
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
