import {DatabaseModelProvider} from "./database-model-provider.js";
import {DBMS} from "./dbms-enum.js";
import {CassandraDatabaseModelProvider} from "./cassandra/cassandra-database-model-provider.js";
import {CassandraClient} from "./cassandra/cassandra-client.js";
import {CassandraFirstRowSampleProvider} from "./cassandra/samplle-provider/cassandra-first-row-sample-provider.js";

export class DatabaseSchemaProviderFactory {

    /**
     * @param dbms {string}
     * @return {Promise<DatabaseModelProvider>}
     */
    static async getSchemaProvider(dbms) {
        switch (dbms) {
            case DBMS.CASSANDRA:
                const cassandraClient = await CassandraClient.getNewInstance();
                const cassandraSampleProvider = new CassandraFirstRowSampleProvider(cassandraClient);
                return new CassandraDatabaseModelProvider(cassandraClient, cassandraSampleProvider);
        }
        throw new Error(`DBMS ${dbms} not supported`);
    }

}
