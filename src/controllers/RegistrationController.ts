import { Request, Response} from 'restify';

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
    }, {contentType: 'application/json'});
  }

  public insertDriverDetails(request: Request, response: Response) {
    response.send(200, {
      message: `Got driver details`,
    });
  }
}
