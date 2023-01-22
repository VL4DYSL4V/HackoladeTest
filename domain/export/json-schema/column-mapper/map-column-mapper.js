import {BaseColumnMapper} from "./base-column-mapper.js";
import {NestedColumnEntity} from "../../../database/model/nested-column-entity.js";
import {ColumnTypes} from "../../../database/model/enums/column-type-enum.js";
import {JsonSchemaTypes} from "../enums/json-schema-types.js";

// Separate class - I suspect that the resulting JSON Schema could be enriched
export class MapColumnMapper extends BaseColumnMapper {

    /**
     * @param nextMapper {BaseColumnMapper | undefined}
     * */
    constructor(nextMapper) {
        super(nextMapper);
    }


    mapColumn(column) {
        this._assertColumnValid(column);
        if (column instanceof NestedColumnEntity && column.columnType === ColumnTypes.MAP) {
            const jsonSchema = {
                type: JsonSchemaTypes.OBJECT,
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
