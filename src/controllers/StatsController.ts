import { Request, Response} from 'restify';

export default class StatsController {

  public getInfo(request: Request, response: Response) {
    response.send(200, {
      message: 'Ride Hailing API',
    });
  }
}
