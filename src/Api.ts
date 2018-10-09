import { createServer, Server, plugins, Request, Response, Next, RequestHandler, RequestHandlerType } from 'restify';
import corsMiddleware = require('restify-cors-middleware');
import StatsController from './controllers/StatsController';
import RegistrationController from './controllers/RegistrationController';
import AccountController from './controllers/AccountController';
import { isAuthenticated, IRequestWithAuthentication, generateSignedToken } from './lib/auth';
import * as passport from 'passport';

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
      allowHeaders: ['Content-Type'],
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
    this.server.post('/sms', registrationController.sendSMS.bind(registrationController));
    this.server.get('/verify-code', registrationController.verifyCode.bind(registrationController));
    this.server.put('/update-personal-details', isAuthenticated, accountController.update);
    this.server.post('/driver-details', accountController.insertDriver.bind(accountController));
    this.server.get('/account', passport.authenticate('jwt', { session: false }), accountController.getCurrentlyLoggedIn.bind(accountController));
    this.server.post('/driver-sign-in', accountController.authenticateDriver.bind(accountController));
  }
}
