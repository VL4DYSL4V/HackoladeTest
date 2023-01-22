import {SampleProvider} from "../../sample-provider.js";
import {CassandraRegex} from "../enums/CassandraRegex.js";

export class CassandraFirstRowSampleProvider extends SampleProvider {

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

    /***
     @param tableName {string}
     */
    #assertTableNameIsSafe(tableName) {
        const re = new RegExp(CassandraRegex.SAFE_KEYSPACE_AND_TABLE_NAME, "g");
        if (!tableName || !re.test(tableName)) {
            throw new Error(`Invalid or unsafe Cassandra table name: ${tableName}`);
        }
    }

    /***
     @param columnName {string}
     */
    #assertColumnNameIsSafe(columnName) {
        const re = new RegExp(CassandraRegex.SAFE_COLUMN_NAME, "g");
        if (!columnName || !re.test(columnName)) {
            throw new Error(`Invalid or unsafe Cassandra column name: ${columnName}`);
        }
    }

    /**
     * WARNING: Is prone to SQL Injection if table name or column
     * name validation is omitted. Cassandra does not allow using keyspace
     * names in prepared statements
     *
     * @param columnName {string}
     * @param tableName {string}
     * @return {Promise<Array<any>> | never}
     * */
    async getSamplesForTable(columnName, tableName) {
        this.#assertTableNameIsSafe(tableName);
        this.#assertColumnNameIsSafe(columnName);

        const query = `SELECT ${columnName}
                       FROM ${tableName} LIMIT 1;`;
        const result = await this.#client.execute(query);
        return result.rows.map(row => row[columnName]);
    }

}
