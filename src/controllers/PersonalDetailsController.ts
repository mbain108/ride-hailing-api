import { Request, Response } from 'restify';
import * as Drivers from '../cassandra/drivers';
import { IRequestWithAuthentication } from '../lib/auth';

export default class PersonalDetailsController {

  public async update(request: IRequestWithAuthentication, response: Response) {
    const personalDetails: Drivers.IPersonalDetails = request.body;
    if (request.user) {
      Drivers.update(personalDetails);
      response.send(200, {
        message: `Got driver details`,
      });
    } else {
      response.send(401, 'User id is not set');
    }
  }
}
