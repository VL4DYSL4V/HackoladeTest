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
     * @param data {DatabaseModel}
     * @throws Error if typeof data === 'function'
     * @return data if data is primitive;
     *      data with '$schema' property if plain Object;
     *      if data was an array, returns subarray of plain objects with '$schema' property;
     */
    #buildOutObject(data) {
        const validationSchemaUrl = `https://json-schema.org/draft-0${this.#jsonSchemaDraftVersion}/schema#`;
        let out = data;
        if (typeof data === 'function') {
            throw new Error('Cannot serialize function');
        }
        if (typeof data === 'object') {
            out = {
                "$schema": validationSchemaUrl,
                ...data
            }
        }
        return out;
    }

    /**
     * @param data {Object}
     */
    async export(data) {
        try {
            const out = this.#buildOutObject(data);
            const content = JSON.stringify(out, null, 2);
            fs.writeFileSync(this.#outFileName, content);
        } catch (err) {
            throw new Error(`Error writing json to file: ${err.message}`);
        }
    }


}
