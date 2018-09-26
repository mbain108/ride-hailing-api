import { Client, types } from 'cassandra-driver';

export const keyspace = process.env.CASSANDRA_KEYSPACE || 'davnn';

const options = {
  contactPoints: (process.env.CASSANDRA_ENDPOINTS || 'localhost').split(','),
  keyspace,
  pooling: {
    coreConnectionsPerHost: {
      [types.distance.local]: 2,
      [types.distance.remote]: 1,
    },
  },
};

export function getClient(): Client {
  return new Client(options);
}
