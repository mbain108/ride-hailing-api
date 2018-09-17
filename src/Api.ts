import { createServer, Server, plugins } from 'restify';
import StatsController from './controllers/StatsController';
import RegistrationController from './controllers/RegistrationController';

export default class Api {

  public server: Server;
  constructor() {
    this.server = createServer();
    this.config();
  }

  private config(): void {

    const statsController = new StatsController();
    const registrationController = new RegistrationController();

    this.server.use(
      (req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        return next();
      },
    );
    this.server.use(plugins.queryParser());
    this.server.get('/', statsController.getInfo);
    this.server.get('/health', statsController.getInfo);
    this.server.post('/sms', registrationController.sendSMS);
  }
}
