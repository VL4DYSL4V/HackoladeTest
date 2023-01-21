import {DatabaseSchemaProvider} from "../database-schema-provider.js";
import {TableEntity} from "../model/table-entity.js";
import {DatabaseConfig} from "../../../config.js";
import {CassandraTypeToModelTypeMapper, SimpleColumnTypes} from "./cassandra-type-to-model-type-mapper.js";
import {SimpleColumnEntity} from "../model/simple-column-entity.js";

// https://cswr.github.io/JsonSchema/spec/grammar/

// DESCRIBE KEYSPACES;
// DESCRIBE KEYSPACE system_schema;
// DESCRIBE KEYSPACE hotel;
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

    /**
     * @return {Promise<Array<TableEntity>>}
     * */
    async #getTables() {
        const keyspaceInfoQuery = 'SELECT * FROM system_schema.tables WHERE keyspace_name = ?';

        const ksRes = await this.#client.execute(keyspaceInfoQuery, [ DatabaseConfig.keyspace ], { prepare: true });

        return ksRes.rows
            .map(r => new TableEntity(String(r.table_name)));
    }

    /**
     * @param table {TableEntity}
     * @return {Promise<void>}
     * */
    async #enrichTableWithData(table) {
        const tableInfoQuery = 'SELECT * FROM system_schema.columns WHERE keyspace_name = ? AND table_name = ?;'

        const tableRes = await this.#client.execute(tableInfoQuery, [ DatabaseConfig.keyspace, table.tableName ], { prepare: true });
        return tableRes.rows.forEach(r => {
            if (SimpleColumnTypes.has(r.type)) {
                const modelType = CassandraTypeToModelTypeMapper.getModelTypeFromSimpleCassandraType(r.type);
                const columnDto = new SimpleColumnEntity(r.column_name, modelType);
                table.columns.push(columnDto);
            } else {
                console.warn('Not implemented: ', r.type)
            }
        });
    }

    async getSchema() {
        const tables = await this.#getTables();
        const tableProcessingPromises = tables.map(t => this.#enrichTableWithData(t))
        await Promise.all(tableProcessingPromises);

        console.log(JSON.stringify(tables, null, 2));
        //
        // const getTypesQuery = 'SELECT * FROM system_schema.types WHERE keyspace_name = ?';
        // const typesRes = await this.#client.execute(getTypesQuery, [ DatabaseConfig.keyspace ], { prepare: true });
        //
        // console.dir(typesRes.rows[0]);

        return {
            tables,
        }
    }

    async shutdown() {
        await this.#client.shutdown();
    }

}
