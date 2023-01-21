import {Exporter} from "../exporter.js";
import * as fs from "fs";
import {JsonSchemaCustomType} from "./dto/json-schema-custom-type.js";
import {JsonSchemaTable} from "./dto/json-schema-table.js";

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
     * @return Promise<Array<JsonSchemaCustomType>>
     * */
    async #startTransformingCustomTypesToJsonSchema(customTypes) {
        return customTypes.map((c) => {
            const out = new JsonSchemaCustomType(c.name);
            out.properties = [];
            return out;
        });
    }

    /**
     * @param tables {Array<TableEntity>}
     * @return Promise<Array<JsonSchemaTable>>
     * */
    async #startTransformingTablesToJsonSchema(tables) {
        return tables.map((t) => {
            const out = new JsonSchemaTable(t.name);
            out.properties = [];
            return out;
        });
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
        const customTypesAsJsonSchemaPromise = this.#startTransformingCustomTypesToJsonSchema(
            data.customTypes);
        const tablesAsJsonSchemaPromise = this.#startTransformingTablesToJsonSchema(
            data.tables);

        return await Promise.all([
            customTypesAsJsonSchemaPromise,
            tablesAsJsonSchemaPromise,
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
