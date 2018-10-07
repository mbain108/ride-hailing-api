import { Request, Response } from 'restify';
import * as bcrypt from 'bcrypt';
import * as Drivers from '../cassandra/drivers';
import { IDriver } from '../cassandra/drivers';
import { v4 } from 'uuid';
import * as passport from 'passport';

const TWILIO_INVALID_VERIFICATION_CODE = '60022';
const TWILIO_API_KEY = process.env.TWILIO_API_KEY;

const saltRounds = 10;

interface IDriverDetails {
  phoneNumber: string;
  profilePhotoId: string;
  licensePhotoId: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  companyName: string;
  vatNumber: string;
  address: string;
  city: string;
  make: string;
  model: string;
  year: string;
  licensePlate: string;
  vehicleColor: string;
}

export default class RegistrationController {

  private _authy: any;

  constructor() {
    this._authy = require('authy')(TWILIO_API_KEY);
  }

  private createDriver(driverDetails: IDriverDetails): IDriver {
    const driver: IDriver = {
      id: v4(),
      email: driverDetails.email,
      emailConfirmed: false,
      password: driverDetails.password,
      phoneNumber: driverDetails.phoneNumber,
      phoneConfirmed: true,
      firstName: driverDetails.firstName,
      lastName: driverDetails.lastName,
      // shouldn't be company city
      city: driverDetails.city,
      companyName: driverDetails.companyName,
      vatNumber: driverDetails.vatNumber,
      companyAddress: driverDetails.address,
      companyCity: driverDetails.city,
      vehicleMake: driverDetails.make,
      vehicleModel: driverDetails.model,
      vehicleYear: parseInt(driverDetails.year, 10),
      vehiclePlateNumber: driverDetails.licensePlate,
      vehicleColor: driverDetails.vehicleColor,
      profileImageUrl: driverDetails.profilePhotoId,
      licenseImageUrl: driverDetails.licensePhotoId,
      vehicleImageUrl: null,
      davId: null,
      privateKey: null,
    };
    return driver;
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
          if (err.error_code === TWILIO_INVALID_VERIFICATION_CODE) {
            response.send(200, {
              verified: false,
            }, { contentType: 'application/json' });
          } else {
            response.send(500, err);
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

  public async insertDriverDetails(request: Request, response: Response) {
    const driverDetails: IDriverDetails = request.body;
    await new Promise((resolve, reject) => bcrypt.hash(driverDetails.password, saltRounds, (err, hash) => {
      if (err) {
        reject(err);
      } else {
        driverDetails.password = hash;
        resolve();
      }
    }));
    const driver = this.createDriver(driverDetails);
    driver.id = v4();
    driver.createdFrom = request.connection.remoteAddress;
    passport.authenticate('local.signup', (err, driverVerified, meta) => {
      if (err) {
        // tslint:disable-next-line:no-console
        console.log(err);
        response.send(500, {
          message: meta.message,
        });
      } else {
        Drivers.insert(driver);
        response.send(200, {
          message: `Got driver details`,
        });
      }
    });
  }
}
