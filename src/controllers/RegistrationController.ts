import { Request, Response} from 'restify';

export default class RegistrationController {

  public sendSMS(request: Request, response: Response) {
    response.send(200, {
      message: `Ride Hailing api sent sms to ${request.query.phoneNumber}`,
    });
  }
}
