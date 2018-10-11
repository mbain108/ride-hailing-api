import { Request, Response } from 'restify';
import * as Drivers from '../cassandra/drivers';
import * as passport from 'passport';

const TWILIO_INVALID_VERIFICATION_CODE = '60022';
const TWILIO_EXPIRED_VERIFICATION_CODE = '60023';
const TWILIO_API_KEY = process.env.TWILIO_API_KEY;

export default class RegistrationController {

  private _authy: any;

  constructor() {
    this._authy = require('authy')(TWILIO_API_KEY);
    this.sendSMS = this.sendSMS.bind(this);
    this.verifyCode = this.verifyCode.bind(this);
  }

  public sendSMS(request: Request, response: Response) {
    this._authy.phones().verification_start(request.query.phoneNumber, request.query.countryCode,
      { via: 'sms', locale: 'en', code_length: '4' }, (err: any, res: any) => {
      if (err) {
        response.send(500, err);
      } else {
        response.send(200, {
          message: `Ride Hailing api sent sms to ${request.query.phoneNumber}`,
        });
      }
    });
  }

  public verifyCode(request: Request, response: Response) {
    this._authy.phones().verification_check(request.query.phoneNumber, request.query.countryCode, request.query.verificationCode,
      (err: any, res: any) => {
        if (err) {
          switch (err.error_code) {
            case TWILIO_INVALID_VERIFICATION_CODE: {
              response.send(200, {
                verified: false,
              }, { contentType: 'application/json' });
            }
                                                   break;
            case TWILIO_EXPIRED_VERIFICATION_CODE: {
              response.send(200, {
                verified: false,
                expired: true,
              }, { contentType: 'application/json' });
            }
                                                   break;
            default: response.send(500, err);
          }
        } else {
          response.send(200, {
            verified: true,
          }, { contentType: 'application/json' });
        }
    });
  }

  public async function() {
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
