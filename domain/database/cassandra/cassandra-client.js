import cassandra from 'cassandra-driver';
import {DatabaseConfig} from "../../../config.js";

export class CassandraClient {

    /**
     * @return {Promise<cassandra.Client>}
     */

    static async getNewInstance() {
        const authProvider = new cassandra.auth.PlainTextAuthProvider(DatabaseConfig.user, DatabaseConfig.password);

        const cassandraClient = new cassandra.Client({
            authProvider,
            contactPoints: [`${DatabaseConfig.host}:${DatabaseConfig.port}`],
            localDataCenter: DatabaseConfig.dataCenter,
            keyspace: DatabaseConfig.keyspace,
        });

        try {
            await cassandraClient.connect();
            return cassandraClient;
        } catch (e) {
            console.log(`Could not connect to the database. Please check if connection parameters are valid`);
            await cassandraClient.shutdown();
            throw e;
        }
    }

}
