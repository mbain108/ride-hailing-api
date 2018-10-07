import RegistrationController from './RegistrationController';
import { Request, Response } from 'restify';

describe ('RegistrationController class', () => {
    beforeAll(() => {
        process.env.TWILIO_API_KEY = 'apiKey';
    });

    beforeEach(() => {
      jest.resetAllMocks();
      jest.resetModules();
    });

    describe('sendSMS method', () => {
        it('should get 200 response when valid params are sent', () => {
            jest.doMock('authy', () => () => authyMock);
            const authyMock = {
                phones: () => authyPhonesMock,
            };
            const authyPhonesMock = {
                verification_start: jest.fn((phone: string, country: string, configObject: any, cb: (err: any, res: any) => void) =>
                cb(null, null)),
            };

            const phoneNumber = '+972546486055';
            const countryCode = '972';
            // tslint:disable-next-line:variable-name
            const RequestMock = jest.fn<Request>(() => ({
                query: {phoneNumber, countryCode},
              }));
            const requestMock = new RequestMock();
            // tslint:disable-next-line:variable-name
            const ResponseMock = jest.fn<Response>(() => ({
                send: jest.fn(() => ''),
            }));
            const responseMock = new ResponseMock();

            const registrationController = new RegistrationController();
            registrationController.sendSMS(requestMock, responseMock);

            expect(authyPhonesMock.verification_start).toBeCalledWith(phoneNumber, countryCode, expect.anything(), expect.anything());
            expect(responseMock.send).toBeCalledWith(200, expect.anything());
        });

        it('should get 500 response due to authy error', () => {
            jest.doMock('authy', () => () => authyMock);
            const authyMock = {
                phones: () => authyPhonesMock,
            };
            const authyPhonesMock = {
                verification_start: jest.fn((phone: string, country: string, configObject: any, cb: (err: any, res: any) => void) =>
                cb('error', null)),
            };

            const phoneNumber = '+972546486055';
            const countryCode = '972';
            // tslint:disable-next-line:variable-name
            const RequestMock = jest.fn<Request>(() => ({
                query: {phoneNumber, countryCode},
              }));
            const requestMock = new RequestMock();
            // tslint:disable-next-line:variable-name
            const ResponseMock = jest.fn<Response>(() => ({
                send: jest.fn(() => ''),
            }));
            const responseMock = new ResponseMock();

            const registrationController = new RegistrationController();
            registrationController.sendSMS(requestMock, responseMock);

            expect(authyPhonesMock.verification_start).toBeCalledWith(phoneNumber, countryCode, expect.anything(), expect.anything());
            expect(responseMock.send).toHaveBeenCalledWith(500, expect.anything());
        });
    });

    describe('verifyCode method', () => {
      it('should get 200 response with verified true when valid params are sent', () => {
          jest.doMock('authy', () => () => authyMock);
          const authyMock = {
              phones: () => authyPhonesMock,
          };
          const authyPhonesMock = {
              verification_check: jest.fn((phone: string, country: string, verification: string, cb: (err: any, res: any) => void) =>
              cb(null, null)),
          };

          const phoneNumber = '+972546486055';
          const countryCode = '972';
          const verificationCode = '1397';
          // tslint:disable-next-line:variable-name
          const RequestMock = jest.fn<Request>(() => ({
              query: {phoneNumber, countryCode, verificationCode},
            }));
          const requestMock = new RequestMock();
          // tslint:disable-next-line:variable-name
          const ResponseMock = jest.fn<Response>(() => ({
              send: jest.fn((status: number, body: any) => ''),
          }));
          const responseMock = new ResponseMock();

          const registrationController = new RegistrationController();
          registrationController.verifyCode(requestMock, responseMock);

          expect(authyPhonesMock.verification_check).toBeCalledWith(phoneNumber, countryCode, verificationCode, expect.anything());
          expect(responseMock.send).toHaveBeenCalledWith(200, {verified: true}, expect.anything());
      });

      it('should get 200 response with verified false when wrong verification is sent', () => {
        jest.doMock('authy', () => () => authyMock);
        const authyMock = {
            phones: () => authyPhonesMock,
        };
        const authyPhonesMock = {
            verification_check: jest.fn((phone: string, country: string, verification: string, cb: (err: any, res: any) => void) =>
            cb({error_code: '60022'}, null)),
        };

        const phoneNumber = '+972546486055';
        const countryCode = '972';
        const verificationCode = '1397';
        // tslint:disable-next-line:variable-name
        const RequestMock = jest.fn<Request>(() => ({
            query: {phoneNumber, countryCode, verificationCode},
          }));
        const requestMock = new RequestMock();
        // tslint:disable-next-line:variable-name
        const ResponseMock = jest.fn<Response>(() => ({
            send: jest.fn((status: number, body: any) => ''),
        }));
        const responseMock = new ResponseMock();

        const registrationController = new RegistrationController();
        registrationController.verifyCode(requestMock, responseMock);

        expect(authyPhonesMock.verification_check).toBeCalledWith(phoneNumber, countryCode, verificationCode, expect.anything());
        expect(responseMock.send).toHaveBeenCalledWith(200, {verified: false}, expect.anything());
    });

      it('should get 500 response due to authy error', () => {
          jest.doMock('authy', () => () => authyMock);
          const authyMock = {
              phones: () => authyPhonesMock,
          };
          const authyPhonesMock = {
              verification_start: jest.fn((phone: string, country: string, configObject: any, cb: (err: any, res: any) => void) =>
              cb('error', null)),
          };

          const phoneNumber = '+972546486055';
          const countryCode = '972';
          // tslint:disable-next-line:variable-name
          const RequestMock = jest.fn<Request>(() => ({
              query: {phoneNumber, countryCode},
            }));
          const requestMock = new RequestMock();
          // tslint:disable-next-line:variable-name
          const ResponseMock = jest.fn<Response>(() => ({
              send: jest.fn(() => ''),
          }));
          const responseMock = new ResponseMock();

          const registrationController = new RegistrationController();
          registrationController.sendSMS(requestMock, responseMock);

          expect(authyPhonesMock.verification_start).toBeCalledWith(phoneNumber, countryCode, expect.anything(), expect.anything());
          expect(responseMock.send).toHaveBeenCalledWith(500, expect.anything());
      });
  });
});
