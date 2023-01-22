import {BaseColumnMapper} from "./base-column-mapper.js";
import {SampledColumnEntity} from "../../../database/model/sampled-column-entity.js";
import {ColumnTypes} from "../../../database/model/enums/column-type-enum.js";
import {JsonSchemaTypes} from "../enums/json-schema-types.js";
import {SimpleColumnEntity} from "../../../database/model/simple-column-entity.js";
import {ColumnMapper} from "./index.js";


const StringModelTypeToJsonSchemaTypeSupplier = Object.freeze({
    [ColumnTypes.TEXT]: () => ({
        type: JsonSchemaTypes.STRING,
    })
});

export class SampledStringColumnMapper extends BaseColumnMapper {

    /**
     * @param nextMapper {BaseColumnMapper | undefined}
     * */
    constructor(nextMapper) {
        super(nextMapper);
    }

    /**
     * @param samples {Array<string>}
     * @return boolean
     * */
    static #areAllJSONObjects(samples) {
        try {
            return samples.map(s => JSON.parse(s))
                .every(parsed => typeof parsed === 'object');
        } catch (ignored) {
            return false;
        }
    }

    /**
     * @param name {string} - only matters if parsing a regular string as part of object.
     *  Can be ignored if supplied value is a JSON
     * @param value {string}
     * @return Object
     * */
    #recursivelyParseString(name, value) {
        if (!SampledStringColumnMapper.#areAllJSONObjects([value])) {
            const supplier = StringModelTypeToJsonSchemaTypeSupplier[ColumnTypes.TEXT];
            if (!supplier) {
                throw new Error(`${ColumnTypes.TEXT} supplier is missing`);
            }
            const typeConfig = supplier();
            return {
                [name]: {
                    ...typeConfig,
                }
            }
        }
        const asObject = JSON.parse(value);
        return this.#recursivelyParseObject(asObject);
    }

    /**
     * @param obj {Object}
     * @return Object
     * */
    #recursivelyParseObject(obj) {
        const asJsonSchemaObject = {
            type: JsonSchemaTypes.OBJECT,
            properties: {},
        };
        for (let key of Object.keys(obj)) {
            const value = obj[key];
            if (typeof value === 'undefined') {
                throw new Error('Undefined value in parsed string');
            }
            if (typeof value === 'function') {
                throw new Error('Functions are not supported during JSON serialization');
            }
            if (typeof value === 'symbol') {
                throw new Error('JS Symbols are not supported during JSON serialization');
            }
            if (typeof value === 'number' || typeof value === 'bigint') {
                const column = new SimpleColumnEntity(key, ColumnTypes.DECIMAL, true);
                asJsonSchemaObject.properties = {
                    ...asJsonSchemaObject.properties,
                    ...ColumnMapper.mapColumn(column),
                };
            }
            if (typeof value === 'boolean') {
                const column = new SimpleColumnEntity(key, ColumnTypes.BOOLEAN, true);
                asJsonSchemaObject.properties = {
                    ...asJsonSchemaObject.properties,
                    ...ColumnMapper.mapColumn(column),
                };
            }
            if (typeof value === 'object') {
                if (!Array.isArray(value)) {
                    asJsonSchemaObject.properties[key] = this.#recursivelyParseObject(value);
                } else {
                    throw new Error(`Arrays are not supported for recursive JSON schema parsing yet`);
                }
            }
            if (typeof value === 'string') {
                asJsonSchemaObject.properties = {
                    ...asJsonSchemaObject.properties,
                    ...this.#recursivelyParseString(key, value),
                };
            }
        }
        return asJsonSchemaObject;
    }

    /**
     * @param samples {Array<string>}
     * @return {Object} - JsonSchemaObject
     * */
    #crossReferenceAndParseJsonSamples(samples) {
        const sample = samples[0];
        return this.#recursivelyParseString('', sample);
    }

    /**
     * @param column {SampledColumnEntity}
     * @return Object
     * */
    #parseIntoJsonSchema(column) {
        if (!column?.sampleValues?.length || !SampledStringColumnMapper.#areAllJSONObjects(column.sampleValues)) {
            const supplier = StringModelTypeToJsonSchemaTypeSupplier[column.columnType];
            if (!supplier) {
                throw new Error(`Mapping of column type ${column.columnType} is not supported`);
            }
            const typeConfig = supplier();
            return {
                [column.name]: {
                    ...typeConfig,
                }
            }
        }
        if (column?.sampleValues?.length > 1) {
            throw new Error(`Cross-referencing multiple string samples is not supported`);
        }
        const schemaObject = this.#crossReferenceAndParseJsonSamples(column.sampleValues);
        return {
            [column.name]: schemaObject
        }
    }

    mapColumn(column) {
        this._assertColumnValid(column);
        if (!(column instanceof SampledColumnEntity
            || new Set(Object.keys(StringModelTypeToJsonSchemaTypeSupplier)).has(column.columnType))
        ) {
            return this._next(column);
        }
        const areAllStrings = column.sampleValues.every(v => typeof v === 'string');
        if (!areAllStrings) {
            return this._next(column);
        }
        return this.#parseIntoJsonSchema(column);
    }
}
