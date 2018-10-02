import { createServer, Server, plugins } from 'restify';
import corsMiddleware = require('restify-cors-middleware');
import StatsController from './controllers/StatsController';
import RegistrationController from './controllers/RegistrationController';
import PersonalDetailsController from './controllers/PersonalDetailsController';

export default class Api {

  public server: Server;
  constructor() {
    this.server = createServer();
    this.config();
  }

  private config(): void {

    const statsController = new StatsController();
    const registrationController = new RegistrationController();
    const personalDetailsController = new PersonalDetailsController();

    const cors = corsMiddleware({
      origins: ['*'],
      allowHeaders: ['Content-Type'],
      exposeHeaders: ['Content-Type'],
    });

    this.server.pre(cors.preflight);
    this.server.use(cors.actual);

    this.server.use(plugins.queryParser());
    this.server.use(plugins.bodyParser());
    this.server.get('/', statsController.getInfo);
    this.server.get('/health', statsController.getInfo);
    this.server.post('/sms', registrationController.sendSMS);
    this.server.get('/verify-code', registrationController.verifyCode);
    this.server.put('/update-personal-details', personalDetailsController.update);
    this.server.post('/driver-details', registrationController.insertDriverDetails);
  }
}
