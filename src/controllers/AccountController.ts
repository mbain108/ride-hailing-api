import { Request, Response } from 'restify';
import { compare } from 'bcrypt';

import { findByEmail, IDriver } from '../cassandra/drivers';
import { generateSignedToken } from '../lib/auth';

interface ILoginDetails {
  email: string;
  password: string;
}

export default class AccountController {

  public async authenticateDriver(request: Request, response: Response) {
    const loginDetails: ILoginDetails = request.body;
    const driver: IDriver = await findByEmail(loginDetails.email);
    if (!!driver) {
      const passwordCorrect = await compare(loginDetails.password, driver.password, (error, same) => {
        if (error || !same) {
          return false;
        }
        return true;
      });
      if (passwordCorrect) {
        const token = generateSignedToken(driver);
        response.send(200, {token});
      }
    }
    response.send(200, {userAuthenticated: false});
  }
}
