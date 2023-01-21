import {DatabaseModelProvider} from "../database-model-provider.js";
import {TableEntity} from "../model/table-entity.js";
import {DatabaseConfig} from "../../../config.js";
import {CassandraTypeToModelTypeMapper, SimpleColumnTypes} from "./cassandra-type-to-model-type-mapper.js";
import {SimpleColumnEntity} from "../model/simple-column-entity.js";
import {CustomTypeEntity} from "../model/custom-type-entity.js";

// https://cswr.github.io/JsonSchema/spec/grammar/

// DESCRIBE KEYSPACES;
// DESCRIBE KEYSPACE system_schema;
// DESCRIBE KEYSPACE hotel;
export class CassandraDatabaseModelProvider extends DatabaseModelProvider {

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
     * @param columnOwner {{ columns: Array<SimpleColumnEntity> }}
     * @param name {string}
     * @param cassandraType {string}
     * */
    static #addColumn(columnOwner, name, cassandraType) {
        if (SimpleColumnTypes.has(cassandraType)) {
            const modelType = CassandraTypeToModelTypeMapper.getModelTypeFromSimpleCassandraType(cassandraType);
            const columnDto = new SimpleColumnEntity(name, modelType, true);
            columnOwner.columns.push(columnDto);
        } else {
            console.warn('Not implemented: ', cassandraType)
        }
    }

    /**
     * @param table {TableEntity}
     * @return {Promise<void>}
     * */
    async #enrichTableWithColumns(table) {
        const tableInfoQuery = 'SELECT * FROM system_schema.columns WHERE keyspace_name = ? AND table_name = ?;'

        const tableRes = await this.#client.execute(tableInfoQuery, [ DatabaseConfig.keyspace, table.name ], { prepare: true });
        return tableRes.rows.forEach(r => {
            CassandraDatabaseModelProvider.#addColumn(table, r.column_name, r.type);
        });
    }

    /**
     * @return {Promise<Array<CustomTypeEntity>>}
     * */
    async #getCustomTypes() {
        const getTypesQuery = 'SELECT * FROM system_schema.types WHERE keyspace_name = ?';
        const typesRes = await this.#client.execute(getTypesQuery, [ DatabaseConfig.keyspace ], { prepare: true });

        return typesRes.rows
            .map(r => {
                const customType = new CustomTypeEntity(r.type_name);
                const columnAmount = Math.min(Number(r.field_names?.length), Number(r.field_types?.length));
                for (let i = 0; i < columnAmount; i++) {
                    const columnName = r.field_names[i];
                    const columnType = r.field_types[i];
                    CassandraDatabaseModelProvider.#addColumn(customType, columnName, columnType);
                }
                return customType;
            });
    }

    /**
     * @param customType {CustomTypeEntity}
     * @return {Promise<void>}
     * */
    async #addSamplesToCustomTypes(customType) {

    }

    /**
     * @return {Promise<DatabaseModel>}
     * */
    async getDatabaseModel() {
        const tables = await this.#getTables();
        const tableProcessingPromises = tables.map(t => this.#enrichTableWithColumns(t));

        const customTypes = await this.#getCustomTypes();
        const customTypesProcessingPromises = customTypes.map(ct => this.#addSamplesToCustomTypes(ct));

        await Promise.all([
            ...tableProcessingPromises,
            ...customTypesProcessingPromises,
        ]);

        return {
            tables,
            customTypes,
        };
    }

    async shutdown() {
        await this.#client.shutdown();
    }

}
