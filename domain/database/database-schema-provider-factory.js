import {DatabaseModelProvider} from "./database-model-provider.js";
import {DBMS} from "./dbms-enum.js";
import {CassandraDatabaseModelProvider} from "./cassandra/cassandra-database-model-provider.js";
import {CassandraClient} from "./cassandra/cassandra-client.js";

export class DatabaseSchemaProviderFactory {

    /**
     * @param dbms {string}
     * @return {Promise<DatabaseModelProvider>}
     */
    static async getSchemaProvider(dbms) {
        switch (dbms) {
            case DBMS.CASSANDRA:
                const cassandraClient = await CassandraClient.getNewInstance();
                return new CassandraDatabaseModelProvider(cassandraClient);
        }
        throw new Error(`DBMS ${dbms} not supported`);
    }

}
