import { Request, Response } from 'restify';
import { IDriver } from '../cassandra/drivers';
import { v4 as uuid} from 'uuid';
import { IRequestWithAuthentication } from '../lib/auth';

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

    it('should send userAuthenticated false when get invalid password', async () => {
      const email = 'test@dav.network';
      const password = 'notfunindav1234';
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
      expect(authMock.generateSignedToken).toHaveBeenCalledTimes(0);
      expect(responseMockInstance.send).toBeCalledWith(200, {userAuthenticated: false});
    });

    it('should send userAuthenticated false when get invalid email', async () => {
      const email = 'invalid@dav.network';
      const password = 'funindav1234';
      const hashedPassword = '$2b$10$K6BIhI1E6tBtsiWvBlh/zuN.C.2yT5Cu/GCOJHs9419Bm1PefvPyu';
      const cassandra = require('../cassandra/drivers');
      cassandra.findByEmail = jest.fn((emailParam: string) => null);
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
      expect(authMock.generateSignedToken).toHaveBeenCalledTimes(0);
      expect(responseMockInstance.send).toBeCalledWith(200, {userAuthenticated: false});
    });
  });

  describe('driverdetails methods', () => {
    const user = {
      id: uuid(),
    };

    beforeEach(() => {
      jest.resetAllMocks();
      jest.resetModules();
    });

    it('should return account for logged in user', async () => {
      const cassandra = require('../cassandra/drivers');
      cassandra.findById = jest.fn((id: string) => driver);
      const accountController = (await import('./AccountController')).default;
      const driver: IDriver = {id: 'id', firstName: 'asdasd'};
      const requestMock = jest.fn<IRequestWithAuthentication>(() => ({
        body: { },
        user,
      }));
      const requestMockInstance = new requestMock();
      const responseMock = jest.fn<Response>(() => ({
        send: jest.fn(() => ''),
      }));
      const responseMockInstance = new responseMock();
      const accountControllerInstance = new accountController();

      await accountControllerInstance.getCurrentlyLoggedIn(requestMockInstance, responseMockInstance);

      expect(cassandra.findById).toHaveBeenCalledWith(user.id);
      expect(responseMockInstance.send).toBeCalledWith(200, { account: driver });
    });

    it('should return account for logged in user', async () => {
      const accountController = (await import('./AccountController')).default;
      const requestMock = jest.fn<IRequestWithAuthentication>(() => ({
        body: { },
      }));
      const requestMockInstance = new requestMock();
      const responseMock = jest.fn<Response>(() => ({
        send: jest.fn(() => ''),
      }));
      const responseMockInstance = new responseMock();
      const accountControllerInstance = new accountController();

      await accountControllerInstance.getCurrentlyLoggedIn(requestMockInstance, responseMockInstance);
      expect(responseMockInstance.send).toBeCalledWith(401, 'User id is not set');
    });

  });
});
