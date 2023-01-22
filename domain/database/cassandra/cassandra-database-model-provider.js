import {DatabaseModelProvider} from "../database-model-provider.js";
import {TableEntity} from "../model/table-entity.js";
import {DatabaseConfig} from "../../../config.js";
import {
    CassandraToModelMapper, NestedColumnTypes,
    SampledColumnTypes,
    SimpleColumnTypes
} from "./cassandra-to-model-mapper.js";
import {SimpleColumnEntity} from "../model/simple-column-entity.js";
import {CustomTypeEntity} from "../model/custom-type-entity.js";
import {SampledColumnEntity} from "../model/sampled-column-entity.js";
import {SampleProvider} from "../sample-provider.js";

export class CassandraDatabaseModelProvider extends DatabaseModelProvider {

    /**
     * @typedef {import(cassandra).Client} CassandraClient
     */

    /**
     * @field #client {import(cassandra).Client}
     */
    #client;

    /**
     * @field #sampleProvider {SampleProvider}
     */
    #sampleProvider;

    /**
     * @param cassandraClient {import(cassandra).Client}
     * @param sampleProvider {SampleProvider}
     */
    constructor(cassandraClient, sampleProvider) {
        super();
        this.#client = cassandraClient;
        this.#sampleProvider = sampleProvider;
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
     * @param columnOwner {{ columns: Array<SimpleColumnEntity | SampledColumnEntity | NestedColumnEntity> }}
     * @param name {string}
     * @param cassandraType {string}
     * */
    static #addColumn(columnOwner, name, cassandraType) {
        if (SimpleColumnTypes.has(cassandraType)) {
            const modelType = CassandraToModelMapper.getModelTypeFromSimpleCassandraType(cassandraType);
            const columnDto = new SimpleColumnEntity(name, modelType, true);
            columnOwner.columns.push(columnDto);
        } else if (SampledColumnTypes.has(cassandraType)){
            const modelType = CassandraToModelMapper.getModelTypeFromSampledCassandraType(cassandraType);
            const columnDto = new SampledColumnEntity(name, modelType, true);
            columnOwner.columns.push(columnDto);
        } else if (NestedColumnTypes.some(nt => cassandraType.startsWith(nt))) {
            const columnDto = CassandraToModelMapper.getNestedColumns(cassandraType, name);
            columnOwner.columns.push(columnDto);
        } else {
            throw new Error(`Cassandra type not implemented: ${cassandraType}`);
        }
    }

    /**
     * @param table {TableEntity}
     * @return {Promise<void>}
     * */
    async #enrichTableColumnsWithSamples(table) {
        const enrichmentPromises = table.columns
            .filter(c => c instanceof SampledColumnEntity)
            .map(sce => {
                return this.#sampleProvider.getSamplesForTable(sce.name, table.name)
                    .then(res => sce.sampleValues = res);
            });
        await Promise.all(enrichmentPromises);
    }

    /**
     * @param table {TableEntity}
     * @return {Promise<void>}
     * */
    async #enrichTableWithColumns(table) {
        const tableInfoQuery = 'SELECT * FROM system_schema.columns WHERE keyspace_name = ? AND table_name = ?;'

        const tableRes = await this.#client.execute(tableInfoQuery, [ DatabaseConfig.keyspace, table.name ], { prepare: true });
        tableRes.rows.forEach(r => {
            CassandraDatabaseModelProvider.#addColumn(table, r.column_name, r.type);
        });

        return this.#enrichTableColumnsWithSamples(table);
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
     * @return {Promise<DatabaseModel>}
     * */
    async getDatabaseModel() {
        const tables = await this.#getTables();
        const tableProcessingPromises = tables.map(t => this.#enrichTableWithColumns(t));

        const customTypes = await this.#getCustomTypes();

        await Promise.all(tableProcessingPromises);

        return {
            tables,
            customTypes,
        };
    }

    async shutdown() {
        await this.#client.shutdown();
    }

}
