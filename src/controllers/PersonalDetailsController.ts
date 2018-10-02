import { Request, Response } from 'restify';
import * as Drivers from '../cassandra/drivers';

export default class PersonalDetailsController {

  public update(request: Request, response: Response) {
    response.send(200, {
      message: `Ride Hailing api`,
    });
  }
}
