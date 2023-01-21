import {BaseColumnMapper} from "./base-column-mapper.js";
import {SimpleColumnEntity} from "../../../database/model/simple-column-entity.js";
import {ColumnTypes} from "../../../database/model/enums/column-type-enum.js";
import {JsonSchemaTypes} from "../enums/json-schema-types.js";
import {NumberConstraint} from "../../../common/enums/number-constraint.js";

// https://json-schema.org/understanding-json-schema/reference/numeric.html?highlight=integer

//     BIG_INTEGER: 'BIG_INTEGER',
//     DECIMAL: 'DECIMAL',
//     DOUBLE: 'DOUBLE',
//     FLOAT: 'FLOAT',
//     TIMESTAMP_WITH_TIMEZONE: 'TIMESTAMP_WITH_TIMEZONE',
//     TIMESTAMP_WITHOUT_TIMEZONE: 'TIMESTAMP_WITHOUT_TIMEZONE',
//     TIME: 'TIME',
//     DATE: 'DATE',
//     // Array of unsigned numbers (bytes)
//     BLOB: 'BLOB',
const SimpleModelTypeToJsonSchemaType = Object.freeze({
    [ColumnTypes.UUID]: () => ({
        type: JsonSchemaTypes.STRING,
        pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    }),
    [ColumnTypes.BOOLEAN]: () => ({
        type: JsonSchemaTypes.BOOLEAN
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
    [ColumnTypes.FLOAT]: () => ({

    }),
    [ColumnTypes.INTEGER]: (type) => {
    },
    [ColumnTypes.INTEGER]: (type) => {
    },
    [ColumnTypes.INTEGER]: (type) => {
    },
    [ColumnTypes.INTEGER]: (type) => {
    },
    [ColumnTypes.INTEGER]: (type) => {
    },
    [ColumnTypes.INTEGER]: (type) => {
    },
    [ColumnTypes.INTEGER]: (type) => {
    },
    [ColumnTypes.INTEGER]: (type) => {
    },
    [ColumnTypes.INTEGER]: (type) => {
    },
    [ColumnTypes.INTEGER]: (type) => {
    },
});

export class SimpleColumnMapper extends BaseColumnMapper {

    /**
     * @param nextMapper {BaseColumnMapper | undefined}
     * */
    constructor(nextMapper) {
        super(nextMapper);
    }


    async mapColumn(column) {
        this._assertColumnValid(column);
        if (column instanceof SimpleColumnEntity) {
            const jsonSchemaTypeSupplier = SimpleModelTypeToJsonSchemaType[column.columnType];
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
