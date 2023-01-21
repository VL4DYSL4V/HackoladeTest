import {ColumnTypes} from "../model/enums/column-type-enum.js";

const SimpleCassandraTypeToModelColumnType = Object.freeze({
    'bigint': ColumnTypes.BIG_INTEGER,
    'boolean': ColumnTypes.BOOLEAN,
    'counter': ColumnTypes.LONG,
    'date': ColumnTypes.DATE,
    'decimal': ColumnTypes.DECIMAL,
    'double': ColumnTypes.DOUBLE,
    'float': ColumnTypes.FLOAT,
    'int': ColumnTypes.INTEGER,
    'smallint': ColumnTypes.SHORT,
    'time': ColumnTypes.TIME,
    'timestamp': ColumnTypes.TIMESTAMP_WITH_TIMEZONE,
    'timeuuid': ColumnTypes.UUID,
    'tinyint': ColumnTypes.BYTE,
    'uuid': ColumnTypes.UUID,
    'varint': ColumnTypes.UNSIGNED_INT,
    'blob': ColumnTypes.BLOB,
})

const ComplexCassandraTypeToModelColumnType = Object.freeze({
    // // Array of stuff
    // 'array': ,
    // 'map': ,
    // 'set': ,
    // 'tuple': ,
    // 'frozen': ,
    // // Require samples, can be ipv4 or ipv6
    // 'inet': ,
    // // Require samples, can be parsed into other formats
    // 'text': ,
    // 'varchar': ,
    // 'ascii': ColumnTypes.TEXT,
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
