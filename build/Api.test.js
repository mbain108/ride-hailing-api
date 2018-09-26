"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const chaiHttp = require("chai-http");
const Api_1 = require("./Api");
chai.use(chaiHttp);
const expect = chai.expect;
describe('baseRoute', () => {
    let api;
    beforeAll(() => {
        api = new Api_1.default();
    });
    // TODO: You could create a container suite. Include all suites in it and use a single 'beforeEach' when it is duplicated.
    beforeEach(() => {
        jest.resetAllMocks();
        jest.resetModules();
    });
    it('should be json', () => {
        // TODO: Prefer using async/await syntax over return Promise
        return chai.request(api.server).get('/')
            .then(res => {
            expect(res.type).to.eql('application/json');
        });
    });
    it('should have a message prop', () => {
        return chai.request(api.server).get('/')
            .then(res => {
            expect(res.body.message).to.eql('Ride Hailing API');
        });
    });
});
