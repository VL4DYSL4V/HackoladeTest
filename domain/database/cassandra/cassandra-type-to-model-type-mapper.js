import {ColumnTypes} from "../model/enums/column-types-enum.js";

const SimpleCassandraTypeToModelColumnType = Object.freeze({
    'ascii': ColumnTypes.TEXT,
    'bigint': ColumnTypes.BIG_INTEGER,
    'boolean': ColumnTypes.BOOLEAN,
    'counter': ColumnTypes.LONG,
    'date': ColumnTypes.DATE,
    'decimal': ColumnTypes.DECIMAL,
    'double': ColumnTypes.DOUBLE,
    'float': ColumnTypes.FLOAT,
    'inet': ColumnTypes.INET,
    'int': ColumnTypes.INTEGER,
    'smallint': ColumnTypes.SHORT,
    'time': ColumnTypes.TIME,
    'timestamp': ColumnTypes.TIMESTAMP_WITH_TIMEZONE,
    'timeuuid': ColumnTypes.UUID,
    'tinyint': ColumnTypes.BYTE,
    'uuid': ColumnTypes.UUID,
    'varint': ColumnTypes.UNSIGNED_INT,
})

export const SimpleColumnTypes = Object.freeze(new Set(Object.keys(SimpleCassandraTypeToModelColumnType)));

export class CassandraTypeToModelTypeMapper {

    /**
     * @param cassandraType {string}
     * @return string
     * */
    static getModelTypeFromSimpleCassandraType(cassandraType) {
        const out = SimpleCassandraTypeToModelColumnType[cassandraType];
        if (!out) {
            throw new Error(`Unknown simple cassandra column type: ${cassandraType}`);
        }
        return out;
    }

}
