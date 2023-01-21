import {BaseColumnMapper} from "./base-column-mapper.js";
import {SimpleColumnEntity} from "../../../database/model/simple-column-entity.js";
import {ColumnTypes} from "../../../database/model/enums/column-type-enum.js";
import {JsonSchemaTypes} from "../enums/json-schema-types.js";
import {NumberConstraint} from "../../../common/enums/number-constraint.js";

// https://json-schema.org/understanding-json-schema/reference/numeric.html?highlight=integer

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
    [ColumnTypes.TIMESTAMP_WITH_TIMEZONE]: (type) => {
    },
    [ColumnTypes.TIMESTAMP_WITHOUT_TIMEZONE]: (type) => {
    },
    [ColumnTypes.DATE]: (type) => {
    },
    [ColumnTypes.TIME]: (type) => {
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
