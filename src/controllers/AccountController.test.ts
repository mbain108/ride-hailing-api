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

  describe('sendPasswordResetEmail', () => {

    beforeEach(() => {
      jest.resetAllMocks();
      jest.resetModules();
    });

    it('should send password reset email successfully when params are valid', async () => {
      const cassandra = require('../cassandra/drivers');
      cassandra.findByEmail = jest.fn((emailParam: string) => driver);
      const authMock = {
        generateSignedToken: jest.fn((driverParam: IDriver) => token),
      };
      const emailMock = {
        sendEmail: jest.fn((from: string, to: string, subject: string, html: string) => 'succeeded'),
      };
      jest.doMock('../lib/auth', () => authMock);
      jest.doMock('../lib/email', () => emailMock);
      const accountController = (await import('./AccountController')).default;
      const token = 'token';
      const email = 'test@dav.network';
      const driver: IDriver = {id: 'id', email};
      const requestMock = jest.fn<Request>(() => ({
        body: { email },
      }));
      const requestMockInstance = new requestMock();
      const responseMock = jest.fn<Response>(() => ({
        send: jest.fn(() => ''),
      }));
      const responseMockInstance = new responseMock();
      const accountControllerInstance = new accountController();

      accountControllerInstance.sendPasswordResetEmail(requestMockInstance, responseMockInstance);
      const containsToken = (text: string) => text.indexOf(token) > -1;

      expect(cassandra.findByEmail).toHaveBeenCalledWith(email);
      expect(authMock.generateSignedToken).toHaveBeenCalledWith(driver);
      expect(emailMock.sendEmail).toHaveBeenCalledWith
      (expect.anything(), email, expect.anything(), expect((text: string) => containsToken(text)).toBeTruthy);
    });

    it('should not send password reset email when it does not exist in database' , async () => {
      const cassandra = require('../cassandra/drivers');
      cassandra.findByEmail = jest.fn((emailParam: string) => driver);
      const authMock = {
        generateSignedToken: jest.fn((driverParam: IDriver) => token),
      };
      const emailMock = {
        sendEmail: jest.fn((from: string, to: string, subject: string, html: string) => 'should not happen'),
      };
      jest.doMock('../lib/auth', () => authMock);
      jest.doMock('../lib/email', () => emailMock);
      const accountController = (await import('./AccountController')).default;
      const token = 'token';
      const email = 'test@dav.network';
      const driver: IDriver = {id: 'id', email};
      const requestMock = jest.fn<Request>(() => ({
        body: { email },
      }));
      const requestMockInstance = new requestMock();
      const responseMock = jest.fn<Response>(() => ({
        send: jest.fn(() => ''),
      }));
      const responseMockInstance = new responseMock();
      const accountControllerInstance = new accountController();

      accountControllerInstance.sendPasswordResetEmail(requestMockInstance, responseMockInstance);
      const containsToken = (text: string) => text.indexOf(token) > -1;

      expect(cassandra.findByEmail).toHaveBeenCalledWith(email);
      expect(authMock.generateSignedToken).toHaveBeenCalledTimes(0);
      expect(emailMock.sendEmail).toHaveBeenCalledTimes(0);
    });
  });
});
