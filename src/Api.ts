import { createServer, Server } from 'restify';
import StatsController from './controllers/StatsController';

export default class Api {

  public server: Server;
  constructor() {
    this.server = createServer();
    this.config();
  }

  private config(): void {

    const statsController = new StatsController();

    this.server.get('/', statsController.getInfo);
    this.server.get('/health', statsController.getInfo);
  }
}
