import {DatabaseSchemaProvider} from "./database-schema-provider.js";
import {DBMS} from "./dbms-enum.js";
import {CassandraService} from "./cassandra/cassandra-service.js";
import {CassandraClient} from "./cassandra/cassandra-client.js";

export class DatabaseSchemaProviderFactory {

    /**
     * @param dbms {string}
     * @return {Promise<DatabaseSchemaProvider>}
     */
    static async getSchemaProvider(dbms) {
        switch (dbms) {
            case DBMS.CASSANDRA:
                const cassandraClient = await CassandraClient.getNewInstance();
                return new CassandraService(cassandraClient);
        }
        throw new Error(`DBMS ${dbms} not supported`);
    }

}
