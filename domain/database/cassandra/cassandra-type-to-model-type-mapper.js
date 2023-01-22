import {ColumnTypes} from "../model/enums/column-type-enum.js";

// CHECK IF EVERYTHING IS CORRECT: https://cassandra.apache.org/doc/latest/cassandra/cql/types.html#native-types
const SimpleCassandraTypeToModelColumnType = Object.freeze({
    'bigint': ColumnTypes.LONG,
    'boolean': ColumnTypes.BOOLEAN,
    'counter': ColumnTypes.LONG,
    'date': ColumnTypes.DATE,
    'decimal': ColumnTypes.DECIMAL,
    'duration': ColumnTypes.CASSANDRA_DURATION,
    'double': ColumnTypes.DOUBLE,
    'float': ColumnTypes.FLOAT,
    'int': ColumnTypes.INTEGER,
    'smallint': ColumnTypes.SHORT,
    'time': ColumnTypes.TIME,
    'timestamp': ColumnTypes.TIMESTAMP_WITH_TIMEZONE,
    'timeuuid': ColumnTypes.UUID,
    'tinyint': ColumnTypes.BYTE,
    'uuid': ColumnTypes.UUID,
    'varint': ColumnTypes.BIG_INTEGER,
    'blob': ColumnTypes.BLOB,
    'inet': ColumnTypes.INET,
});

const SampledCassandraTypeToModelColumnType = Object.freeze({
    // Require samples, can be parsed into other formats
    'text': ColumnTypes.TEXT,
    'varchar': ColumnTypes.TEXT,
    'ascii': ColumnTypes.TEXT,
})

const ComplexCassandraTypeToModelColumnType = Object.freeze({
    // // Array of stuff
    // 'array': ,
    // 'map': ,
    // 'set': ,
    // 'tuple': ,
    // 'frozen': ,
})

export const SimpleColumnTypes = Object.freeze(new Set(Object.keys(SimpleCassandraTypeToModelColumnType)));

export const SampledColumnTypes = Object.freeze(new Set(Object.keys(SampledCassandraTypeToModelColumnType)));

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

    /**
     * @param cassandraType {string}
     * @return string
     * */
    static getModelTypeFromSampledCassandraType(cassandraType) {
        const out = SampledCassandraTypeToModelColumnType[cassandraType];
        if (!out) {
            throw new Error(`Unknown sampled cassandra column type: ${cassandraType}`);
        }
        return out;
    }

}
