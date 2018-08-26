"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Api_1 = require("./Api");
const api = new Api_1.default();
const PORT = process.env.PORT || 3005;
// Create server
api.server.listen(PORT, () => {
    // tslint:disable-next-line:no-console
    console.log(`Web server started. Listening on port ${PORT}`);
});
