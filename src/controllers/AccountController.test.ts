import { Request, Response } from 'restify';
import { IDriver } from '../cassandra/drivers';

describe('AccountController class', () => {
  describe('authenticateDriver method', () => {

    beforeEach(() => {
      jest.resetAllMocks();
      jest.resetModules();
    });

    it('should send valid token when get valid params', async () => {
      const email = 'test@dav.network';
      const password = 'funindav1234';
      const hashedPassword = '$2b$10$K6BIhI1E6tBtsiWvBlh/zuN.C.2yT5Cu/GCOJHs9419Bm1PefvPyu';
      const cassandra = require('../cassandra/drivers');
      cassandra.findByEmail = jest.fn((emailParam: string) => driver);
      const authMock = {
        generateSignedToken: jest.fn((driverParam: IDriver) => token),
      };
      jest.doMock('../lib/auth', () => authMock);
      const accountController = (await import('./AccountController')).default;
      const token = 'token';
      const driver: IDriver = {id: 'id', password: hashedPassword};
      const requestMock = jest.fn<Request>(() => ({
        body: { email, password },
      }));
      const requestMockInstance = new requestMock();
      const responseMock = jest.fn<Response>(() => ({
        send: jest.fn(() => ''),
      }));
      const responseMockInstance = new responseMock();
      const accountControllerInstance = new accountController();

      await accountControllerInstance.authenticateDriver(requestMockInstance, responseMockInstance);

      expect(cassandra.findByEmail).toHaveBeenCalledWith(email);
      expect(authMock.generateSignedToken).toHaveBeenCalledWith(driver);
      expect(responseMockInstance.send).toBeCalledWith(200, {token});
    });
  });
});
