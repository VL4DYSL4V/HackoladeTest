import {BaseColumnMapper} from "./base-column-mapper.js";
import {SimpleColumnEntity} from "../../../database/model/simple-column-entity.js";
import {NestedColumnEntity} from "../../../database/model/nested-column-entity.js";
import {ColumnTypes} from "../../../database/model/enums/column-type-enum.js";
import {JsonSchemaTypes} from "../enums/json-schema-types.js";
import {ColumnMapper} from "./index.js";


export class ArrayColumnMapper extends BaseColumnMapper {

    /**
     * @param nextMapper {BaseColumnMapper | undefined}
     * */
    constructor(nextMapper) {
        super(nextMapper);
    }


    mapColumn(column) {
        this._assertColumnValid(column);
        if (column instanceof NestedColumnEntity && column.columnType === ColumnTypes.ARRAY) {
            if (column.children.length !== 1) {
                throw new Error(`Invalid column: array column must have exactly 1 child, got: ${JSON.stringify(column)}`)
            }
            const child = column.children[0];
            const childJsonSchema = ColumnMapper.mapColumn(child);
            return {
                [column.name]: {
                    type: JsonSchemaTypes.ARRAY,
                    items: {
                        ...childJsonSchema
                    }
                }
            }
        }
        return this._next(column);
    }

}
