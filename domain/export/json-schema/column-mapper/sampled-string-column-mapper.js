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
     * @param sample {string}
     * @return Object
     * */
    #parseJsonStringIntoJsonSchemaObject(sample) {
        const asObject = JSON.parse(sample);
        const asJsonSchemaObject = {
            type: JsonSchemaTypes.OBJECT,
            properties: [],
        };
        for (let key of Object.keys(asObject)) {
            const value = asObject[key];
            if (typeof value === 'number' || typeof value === 'bigint') {
                const column = new SimpleColumnEntity(key, ColumnTypes.DECIMAL, true);
                const asProperty = ColumnMapper.mapColumn(column);
                asJsonSchemaObject.properties.push(asProperty);
            }
        }
        // {
        //      id: 1,
        //      name: "string",
        //      friends: ['alice', 'bob'],
        //      bestFriend: {
        //          id: 3,
        //          name: 'John'
        //      }
        // }
        return {};
    }

    /**
     * @param samples {Array<string>}
     * @return Object
     * */
    #crossReferenceAndParseJsonSamples(samples) {
        const sample = samples[0];
        return this.#parseJsonStringIntoJsonSchemaObject(sample);
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
        const properties = this.#crossReferenceAndParseJsonSamples(column.sampleValues);
        return {
            [column.name]: {
                type: JsonSchemaTypes.OBJECT,
                properties,
            }
        }
    }

    mapColumn(column) {
        this._assertColumnValid(column);
        if (!(column instanceof SampledColumnEntity)) {
            return this._next(column);
        }
        const areAllStrings = column.sampleValues.every(v => typeof v === 'string');
        if (!areAllStrings) {
            return this._next(column);
        }
        return this.#parseIntoJsonSchema(column);
    }
}
