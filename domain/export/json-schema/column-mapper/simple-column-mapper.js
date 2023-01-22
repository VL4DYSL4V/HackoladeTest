import {BaseColumnMapper} from "./base-column-mapper.js";
import {SimpleColumnEntity} from "../../../database/model/simple-column-entity.js";
import {ColumnTypes} from "../../../database/model/enums/column-type-enum.js";
import {JsonSchemaTypes} from "../enums/json-schema-types.js";
import {NumberConstraint} from "../../../common/enums/number-constraint.js";
import {Regex} from "../../../common/enums/regex.js";

// https://json-schema.org/understanding-json-schema/reference/numeric.html?highlight=integer
// https://json-schema.org/understanding-json-schema/reference/conditionals.html?highlight=conditional
// https://cassandra.apache.org/doc/latest/cassandra/cql/types.html#dates
// https://www.npmjs.com/package/jsonschema
// https://regexpattern.com/iso-8601-dates-times/
// https://docs.datastax.com/en/developer/nodejs-driver/4.6/features/datatypes/
const SimpleModelTypeToJsonSchemaTypeSupplier = Object.freeze({
    [ColumnTypes.UUID]: () => ({
        type: JsonSchemaTypes.STRING,
        pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    }),
    [ColumnTypes.BOOLEAN]: () => ({
        type: JsonSchemaTypes.BOOLEAN
    }),
    [ColumnTypes.BIG_INTEGER]: () => ({
        type: JsonSchemaTypes.INTEGER,
    }),
    [ColumnTypes.LONG]: () => ({
        type: JsonSchemaTypes.INTEGER,
        minimum: NumberConstraint.MIN_LONG,
        maximum: NumberConstraint.MAX_LONG,
    }),
    [ColumnTypes.INTEGER]: () => ({
        type: JsonSchemaTypes.INTEGER,
        minimum: NumberConstraint.MIN_INTEGER,
        maximum: NumberConstraint.MAX_INTEGER,
    }),
    [ColumnTypes.SHORT]: () => ({
        type: JsonSchemaTypes.INTEGER,
        minimum: NumberConstraint.MIN_SHORT,
        maximum: NumberConstraint.MAX_SHORT,
    }),
    [ColumnTypes.BYTE]: () => ({
        type: JsonSchemaTypes.INTEGER,
        minimum: NumberConstraint.MIN_BYTE,
        maximum: NumberConstraint.MAX_BYTE,
    }),
    [ColumnTypes.UNSIGNED_INT]: () => ({
        type: JsonSchemaTypes.INTEGER,
        minimum: NumberConstraint.MIN_UNSIGNED_INTEGER,
        maximum: NumberConstraint.MAX_UNSIGNED_INTEGER,
    }),
    [ColumnTypes.DECIMAL]: () => ({
        type: JsonSchemaTypes.NUMBER,
    }),
    [ColumnTypes.DOUBLE]: () => ({
        type: JsonSchemaTypes.NUMBER,
        minimum: NumberConstraint.MIN_DOUBLE,
        maximum: NumberConstraint.MAX_DOUBLE,
    }),
    [ColumnTypes.FLOAT]: () => ({
        type: JsonSchemaTypes.NUMBER,
        minimum: NumberConstraint.MIN_FLOAT,
        maximum: NumberConstraint.MAX_FLOAT,
    }),
    [ColumnTypes.BLOB]: () => ({
        type: JsonSchemaTypes.ARRAY,
        items: {
            type: JsonSchemaTypes.INTEGER,
            minimum: NumberConstraint.MIN_BYTE,
            maximum: NumberConstraint.MAX_BYTE,
        }
    }),
    [ColumnTypes.INET]: () => ({
        type: JsonSchemaTypes.STRING,
        pattern: Regex.IP_ADDRESS,
    }),
    [ColumnTypes.TIMESTAMP_WITH_TIMEZONE]: () => ({
        type: JsonSchemaTypes.STRING,
        pattern: Regex.ISO_8601_TIMESTAMP_WITH_TIMEZONE,
    }),
    [ColumnTypes.TIMESTAMP_WITHOUT_TIMEZONE]: () => ({
        type: JsonSchemaTypes.STRING,
        pattern: Regex.ISO_8601_TIMESTAMP_WITHOUT_TIMEZONE,
    }),
    [ColumnTypes.DATE]: () => ({
        type: JsonSchemaTypes.STRING,
        pattern: Regex.ISO_8601_DATE,
    }),
    [ColumnTypes.TIME]: () => ({
        type: JsonSchemaTypes.STRING,
        pattern: Regex.ISO_8601_TIME,
    }),
    [ColumnTypes.CASSANDRA_DURATION]: () => ({
        type: JsonSchemaTypes.STRING,
        pattern: Regex.ISO_8601_DURATION,
    }),
});

export class SimpleColumnMapper extends BaseColumnMapper {

    /**
     * @param nextMapper {BaseColumnMapper | undefined}
     * */
    constructor(nextMapper) {
        super(nextMapper);
    }


    mapColumn(column) {
        this._assertColumnValid(column);
        if (
            column instanceof SimpleColumnEntity
            || new Set(Object.keys(SimpleModelTypeToJsonSchemaTypeSupplier)).has(column.columnType)
        ) {
            const jsonSchemaTypeSupplier = SimpleModelTypeToJsonSchemaTypeSupplier[column.columnType];
            if (!jsonSchemaTypeSupplier) {
                throw new Error(`Column type ${column.columnType} is not supported for JSON schema mapping`)
            }
            const typeConfig = jsonSchemaTypeSupplier();
            return {
                [column.name]: {
                    ...typeConfig,
                }
            }
        }
        return this._next(column);
    }

}
