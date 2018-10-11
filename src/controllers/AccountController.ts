import { Request, Response } from 'restify';
import {
  IDriver,
  IPersonalDetails,
  insert,
  updatePersonalDetails,
  findById,
  findByEmail,
  updateCompanyDetails,
  updateVehicleDetails,
  ICompanyDetails,
  IVehicleDetails,
} from '../cassandra/drivers';
import { v4 as uuid} from 'uuid';
import * as bcrypt from 'bcrypt';
import { IRequestWithAuthentication, generateSignedToken } from '../lib/auth';
import sendEmail from '../lib/email';

const saltRounds = 10;
const passwordResetSourceEmail = 'test@dav.network';
const passwordResetSubject = 'Mooving password reset';
const appAddress = process.env.appAddress || 'localhost:3000';

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

interface ILoginDetails {
  email: string;
  password: string;
}

export default class AccountController {

  constructor() {
    this.insertDriver = this.insertDriver.bind(this);
    this.getCurrentlyLoggedIn = this.getCurrentlyLoggedIn.bind(this);
    this.authenticateDriver = this.authenticateDriver.bind(this);
    this.sendPasswordResetEmail = this.sendPasswordResetEmail.bind(this);
    this.updatePersonalDetails = this.updatePersonalDetails.bind(this);
    this.updateCompanyDetails = this.updateCompanyDetails.bind(this);
    this.updateVehicleDetails = this.updateVehicleDetails.bind(this);
  }

  private getDriver(driverDetails: IDriverDetails): IDriver {
    const driver: IDriver = {
      id: uuid(),
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

  public async authenticateDriver(request: Request, response: Response) {
    const loginDetails: ILoginDetails = request.body;
    const driver: IDriver = await findByEmail(loginDetails.email);
    if (!!driver) {
      const passwordCorrect = await bcrypt.compare(loginDetails.password, driver.password);
      if (passwordCorrect) {
        const token = generateSignedToken(driver);
        response.send(200, {token});
        return;
      }
    }
    response.send(200, {userAuthenticated: false});
  }

  public async insertDriver(request: Request, response: Response) {
    // todo: check if email/phone exists on db
    const driverDetails: IDriverDetails = request.body;
    try {
      await new Promise((resolve, reject) => bcrypt.hash(driverDetails.password, saltRounds, (err, hash) => {
        if (err) {
          reject(err);
        } else {
          driverDetails.password = hash;
          resolve();
        }
      }));
      const driver = this.getDriver(driverDetails);
      driver.createdFrom = request.connection.remoteAddress;

      // save driver
      insert(driver);
      const token = generateSignedToken(driver);
      response.send(200, {
        message: `Registered driver details`,
        token,
      });
    } catch (err) {
      response.send(500, {
        message: `Failed to register driver details`,
      });
    }
  }

  public async updatePersonalDetails(request: IRequestWithAuthentication, response: Response) {
    const personalDetails: IPersonalDetails = request.body;
    if (request.user) {
      try {
        await updatePersonalDetails(personalDetails);
        response.send(200, {
          message: `Updated driver details`,
        });
      } catch (err) {
        response.send(500, {
          message: `Failed to update driver details`,
        });
      }
    } else {
      response.send(401, 'User id is not set');
    }
  }

  public async updateCompanyDetails(request: IRequestWithAuthentication, response: Response) {
    const personalDetails: ICompanyDetails = request.body;
    if (request.user) {
      try {
        await updateCompanyDetails(personalDetails);
        response.send(200, {
          message: `Updated driver details`,
        });
      } catch (err) {
        response.send(500, {
          message: `Failed to update driver details`,
        });
      }
    } else {
      response.send(401, 'User id is not set');
    }
  }

  public async updateVehicleDetails(request: IRequestWithAuthentication, response: Response) {
    const personalDetails: IVehicleDetails = request.body;
    if (request.user) {
      try {
        await updateVehicleDetails(personalDetails);
        response.send(200, {
          message: `Updated driver details`,
        });
      } catch (err) {
        response.send(500, {
          message: `Failed to update driver details`,
        });
      }
    } else {
      response.send(401, 'User id is not set');
    }
  }

  public async getCurrentlyLoggedIn(request: IRequestWithAuthentication, response: Response) {
    const user = request.user;
    if (user && user.id) {
      const driver = await findById(request.user.id);
      response.send(200, {
        account: driver,
      });
    } else {
      response.send(401, 'User id is not set');
    }
  }

  public async sendPasswordResetEmail(request: Request, response: Response) {
    const driver: IDriver = await findByEmail(request.query.email);
    if (!!driver) {
      const token = generateSignedToken(driver);
      const passwordResetUrl = encodeURI(`http://${appAddress}/password-reset?token=${token}`);
      const htmlContent = `link for <b>password</b> reset: ${passwordResetUrl}`;
      try {
        sendEmail(passwordResetSourceEmail, driver.email, passwordResetSubject, htmlContent);
        response.send(200);
      } catch (error) {
        response.send(200);
      }

    } else {
      response.send(200);
    }
  }
}
