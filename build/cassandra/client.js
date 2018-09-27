"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cassandra_driver_1 = require("cassandra-driver");
exports.keyspace = process.env.CASSANDRA_KEYSPACE || 'davnn';
const options = {
    contactPoints: (process.env.CASSANDRA_ENDPOINTS || 'localhost').split(','),
    keyspace: exports.keyspace,
    pooling: {
        coreConnectionsPerHost: {
            [cassandra_driver_1.types.distance.local]: 2,
            [cassandra_driver_1.types.distance.remote]: 1,
        },
    },
};
function getClient() {
    return new cassandra_driver_1.Client(options);
}
exports.getClient = getClient;
