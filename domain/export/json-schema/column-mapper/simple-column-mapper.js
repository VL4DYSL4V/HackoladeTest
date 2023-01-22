import {BaseColumnMapper} from "./base-column-mapper.js";
import {SimpleColumnEntity} from "../../../database/model/simple-column-entity.js";
import {ColumnTypes} from "../../../database/model/enums/column-type-enum.js";
import {JsonSchemaTypes} from "../enums/json-schema-types.js";
import {NumberConstraint} from "../../../common/enums/number-constraint.js";

// https://json-schema.org/understanding-json-schema/reference/numeric.html?highlight=integer

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
        // Regex to validate both IPv4 and IPv6
        pattern: "(?:^(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}$)|(?:^(?:(?:[a-fA-F\\d]{1,4}:){7}(?:[a-fA-F\\d]{1,4}|:)|(?:[a-fA-F\\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|:[a-fA-F\\d]{1,4}|:)|(?:[a-fA-F\\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,2}|:)|(?:[a-fA-F\\d]{1,4}:){4}(?:(?::[a-fA-F\\d]{1,4}){0,1}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,3}|:)|(?:[a-fA-F\\d]{1,4}:){3}(?:(?::[a-fA-F\\d]{1,4}){0,2}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,4}|:)|(?:[a-fA-F\\d]{1,4}:){2}(?:(?::[a-fA-F\\d]{1,4}){0,3}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,5}|:)|(?:[a-fA-F\\d]{1,4}:){1}(?:(?::[a-fA-F\\d]{1,4}){0,4}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,6}|:)|(?::(?:(?::[a-fA-F\\d]{1,4}){0,5}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,7}|:)))(?:%[0-9a-zA-Z]{1,})?$)"
    }),
    [ColumnTypes.TIMESTAMP_WITH_TIMEZONE]: () => ({
        type: JsonSchemaTypes.STRING,
        pattern: "^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(\\.[0-9]+)?(Z|[+-](?:2[0-3]|[01][0-9]):[0-5][0-9])?$"
    }),
    [ColumnTypes.TIMESTAMP_WITHOUT_TIMEZONE]: () => ({
        type: JsonSchemaTypes.STRING,
        pattern: "^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(\\.[0-9]+)?$"
    }),
    [ColumnTypes.DATE]: () => ({
        type: JsonSchemaTypes.STRING,
        pattern: "^([0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])$"
    }),
    [ColumnTypes.TIME]: () => ({
        type: JsonSchemaTypes.STRING,
        pattern: "^(2[0-3]|[01][0-9]):?([0-5][0-9]):?([0-5][0-9])$",
    }),
    // TODO: ADD PATTERN:
    //  ISO 8601 format: P[n]Y[n]M[n]DT[n]H[n]M[n]S or P[n]W
    [ColumnTypes.CASSANDRA_DURATION]: (type) => ({
        type: JsonSchemaTypes.STRING,

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
        if (column instanceof SimpleColumnEntity) {
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
