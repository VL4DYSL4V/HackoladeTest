import {BaseColumnMapper} from "./base-column-mapper.js";
import {NestedColumnEntity} from "../../../database/model/nested-column-entity.js";
import {ColumnTypes} from "../../../database/model/enums/column-type-enum.js";
import {JsonSchemaTypes} from "../enums/json-schema-types.js";
import {ColumnMapper} from "./index.js";


export class TupleColumnMapper extends BaseColumnMapper {

    /**
     * @param nextMapper {BaseColumnMapper | undefined}
     * */
    constructor(nextMapper) {
        super(nextMapper);
    }


    mapColumn(column) {
        this._assertColumnValid(column);
        if (column instanceof NestedColumnEntity && column.columnType === ColumnTypes.TUPLE) {
            const childrenSchemas = column.children.map(c => ColumnMapper.mapColumn(c));
            const jsonSchema = {
                type: JsonSchemaTypes.ARRAY,
                prefixItems: childrenSchemas,
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
