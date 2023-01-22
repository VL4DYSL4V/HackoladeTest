import {BaseColumnMapper} from "./base-column-mapper.js";
import {ColumnTypes} from "../../../database/model/enums/column-type-enum.js";
import {JsonSchemaUtils} from "../util/json-schema-utils.js";


export class CustomTypeColumnMapper extends BaseColumnMapper {

    /**
     * @param nextMapper {BaseColumnMapper | undefined}
     * */
    constructor(nextMapper) {
        super(nextMapper);
    }


    mapColumn(column) {
        this._assertColumnValid(column);
        const columnTypes = new Set(Object.values(ColumnTypes));
        if (columnTypes.has(column.columnType)) {
            return this._next(column);
        }
        const jsonSchema = {
            '$ref': JsonSchemaUtils.getCustomTypeRelativeURI(column.columnType),
        };
        if (column.name) {
            return {
                [column.name]: jsonSchema
            }
        }
        return jsonSchema;
    }

}
