import {DatabaseSchemaProvider} from "../database-schema-provider.js";


export class CassandraService extends DatabaseSchemaProvider {

    /**
     * @typedef {import(cassandra).Client} CassandraClient
     */

    /**
     * @field #client {import(cassandra).Client}
     */
    #client;

    /**
     * @param cassandraClient {import(cassandra).Client}
     */
    constructor(cassandraClient) {
        super();
        this.#client = cassandraClient;
    }

    async getSchema() {
        const query = 'SELECT * FROM system_schema.tables WHERE keyspace_name = ?';

        const res = await this.#client.execute(query, [ 'hotel' ], { prepare: true });
        console.log(res);

        return {
            field: 'id',
            type: 'string',
        }
    }

    async shutdown() {
        await this.#client.shutdown();
    }

}
