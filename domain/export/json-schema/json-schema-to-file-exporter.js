import {Exporter} from "../exporter.js";
import * as fs from "fs";

export class JsonSchemaToFileExporter extends Exporter{

    /**
     * @field #jsonSchemaDraftVersion {number}
     */
    #jsonSchemaDraftVersion;

    /**
     * @field #outFileName {string}
     */
    #outFileName;

    /**
     * @param jsonSchemaDraftVersion {number}
     * @param outFileName {string}
     */
    constructor(jsonSchemaDraftVersion, outFileName) {
        super();
        if (Number(jsonSchemaDraftVersion) < 0 || Number(jsonSchemaDraftVersion) > 7) {
            throw new Error(`Json schema draft version must be [1, 7]`)
        }
        if (!outFileName) {
            throw new Error('Out file name is required');
        }
        this.#jsonSchemaDraftVersion = Number(jsonSchemaDraftVersion);
        this.#outFileName = String(outFileName);
    }

    /**
     * @return string
     */
    #getValidationSchemaUrl(){
        return `https://json-schema.org/draft-0${this.#jsonSchemaDraftVersion}/schema#`;
    }

    /**
     * @param customTypes {Array<CustomTypeEntity>}
     * @return Array<Promise<Object>>
     * */
    #startTransformingCustomTypesToJsonSchema(customTypes) {
        return customTypes.map(c => Promise.resolve(c));
    }

    /**
     * @param tables {Array<TableEntity>}
     * @return Array<Promise<Object>>
     * */
    #startTransformingTablesToJsonSchema(tables) {
        return tables.map(t => Promise.resolve(t));
    }

    /**
     * @param data {DatabaseModel}
     * @throws Error if typeof data === 'function'
     * @return Promise<Array<Object>>
     */
    async #buildOutObject(data) {
        if (typeof data !== 'object' || Array.isArray(data)) {
            throw new Error('Can only serialize plain JS objects');
        }
        const customTypesAsJsonSchemaPromises = this.#startTransformingCustomTypesToJsonSchema(
            data.customTypes);
        const tablesAsJsonSchemaPromises = this.#startTransformingTablesToJsonSchema(
            data.tables);

        return await Promise.all([
            ...customTypesAsJsonSchemaPromises,
            ...tablesAsJsonSchemaPromises,
        ]);
    }

    /**
     * @param data {DatabaseModel}
     */
    async export(data) {
        try {
            const out = await this.#buildOutObject(data);
            const content = JSON.stringify(out, null, 2);
            fs.writeFileSync(this.#outFileName, content);
        } catch (err) {
            throw new Error(`Error writing json to file: ${err.message}`);
        }
    }


}
