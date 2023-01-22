import {BaseColumnMapper} from "./base-column-mapper.js";
import {NestedColumnEntity} from "../../../database/model/nested-column-entity.js";
import {ColumnTypes} from "../../../database/model/enums/column-type-enum.js";
import {JsonSchemaTypes} from "../enums/json-schema-types.js";
import {ColumnMapper} from "./index.js";


export class SetColumnMapper extends BaseColumnMapper {

    /**
     * @param nextMapper {BaseColumnMapper | undefined}
     * */
    constructor(nextMapper) {
        super(nextMapper);
    }


    mapColumn(column) {
        this._assertColumnValid(column);
        if (column instanceof NestedColumnEntity && column.columnType === ColumnTypes.SET) {
            if (column.children.length !== 1) {
                throw new Error(`Invalid column: set column must have exactly 1 child, got: ${JSON.stringify(column)}`)
            }
            const child = column.children[0];
            const childJsonSchema = ColumnMapper.mapColumn(child);
            const jsonSchema = {
                type: JsonSchemaTypes.ARRAY,
                uniqueItems: true,
                items: childJsonSchema,
            };
            if (column.name) {
                return {
                    [column.name]: jsonSchema
                }
            }
            return jsonSchema;
        }
        return this._next(column);
    }

}
