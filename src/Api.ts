import { createServer, Server, plugins, Request, Response, Next, RequestHandler, RequestHandlerType } from 'restify';
import corsMiddleware = require('restify-cors-middleware');
import StatsController from './controllers/StatsController';
import RegistrationController from './controllers/RegistrationController';
import * as passport from 'passport';
import AccountController from './controllers/AccountController';

export default class Api {

  public server: Server;
  constructor() {
    this.server = createServer();
    this.config();
  }

  private config(): void {

    const statsController = new StatsController();
    const registrationController = new RegistrationController();
    const accountController = new AccountController();

    const cors = corsMiddleware({
      origins: ['*'],
      allowHeaders: ['Content-Type', 'Authorization'],
      exposeHeaders: ['Content-Type'],
    });

    this.server.pre(cors.preflight);
    this.server.use(cors.actual);

    // const passportInit: RequestHandlerType = passport.initialize() as any;
    this.server.use(passport.initialize() as any);

    this.server.use(plugins.queryParser());
    this.server.use(plugins.bodyParser());
    this.server.get('/', statsController.getInfo);
    this.server.get('/health', statsController.getInfo);
    this.server.post('/sms', registrationController.sendSMS);
    this.server.get('/verify-code', registrationController.verifyCode);
    this.server.put(
      '/update-personal-details',
      passport.authenticate('jwt', { session: false }),
      accountController.updatePersonalDetails,
    );
    this.server.put(
      '/update-company-details',
      passport.authenticate('jwt', { session: false }),
      accountController.updateCompanyDetails,
    );
    this.server.put(
      '/update-vehicle-details',
      passport.authenticate('jwt', { session: false }),
      accountController.updateVehicleDetails,
    );
    this.server.post('/driver-details', accountController.insertDriver);
    this.server.get('/account', passport.authenticate('jwt', { session: false }), accountController.getCurrentlyLoggedIn);
    this.server.post('/driver-sign-in', accountController.authenticateDriver);
    this.server.post('/reset-password', accountController.sendPasswordResetEmail);
  }
}
