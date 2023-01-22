import {ColumnTypes} from "../model/enums/column-type-enum.js";
import {NestedColumnEntity} from "../model/nested-column-entity.js";
import {CassandraRegex} from "./enums/CassandraRegex.js";

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

const NestedCassandraTypeToModelColumnType = Object.freeze({
    // Require samples, can be parsed into other formats
    'list': ColumnTypes.ARRAY,
    'map': ColumnTypes.MAP,
    'set': ColumnTypes.SET,
    'tuple': ColumnTypes.TUPLE,
    'frozen': ColumnTypes.FROZEN,
})

export const SimpleColumnTypes = Object.freeze(new Set(Object.keys(SimpleCassandraTypeToModelColumnType)));

export const SampledColumnTypes = Object.freeze(new Set(Object.keys(SampledCassandraTypeToModelColumnType)));

export const NestedColumnTypes = Object.freeze(Object.keys(NestedCassandraTypeToModelColumnType));

const NestedTypeBrackets = Object.freeze({
    START: '<',
    END: '>',
});

const InnerNestedTypeDelimiter = ',';

const simpleTypeRegex = new RegExp(CassandraRegex.SIMPLE_TYPE_REGEX);

const nestedTypeRegex = new RegExp(CassandraRegex.NESTED_TYPE_REGEX);

export class CassandraToModelMapper {

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

    /**
     * @param cassandraType {string}
     * @return {{
     *     isSimple: boolean,
     *     type: string,
     *     nested: string
     * }}
     * */
    static #extractTypeInfo(cassandraType) {
        if (simpleTypeRegex.test(cassandraType)) {
            return {
                type: cassandraType,
                isSimple: true,
                nested: ''
            }
        }
        const type = NestedColumnTypes.find(t => cassandraType.startsWith(t));
        if (!type) {
            throw new Error(`Cannot parse Cassandra type: ${cassandraType}`);
        }
        const indexOfStartDelimiter = cassandraType.indexOf(NestedTypeBrackets.START);
        const indexOfEndDelimiter = cassandraType.lastIndexOf(NestedTypeBrackets.END);
        if (indexOfStartDelimiter === -1 || indexOfEndDelimiter === -1) {
            throw new Error(`Invalid nested type: ${cassandraType}`);
        }
        const nested = cassandraType.substring(indexOfStartDelimiter + 1, indexOfEndDelimiter);
        return {
            isSimple: false,
            type,
            nested
        }
    }

    /**
     * @param nested {string}
     * @return Array<string>
     * */
    static #extractSubtypes(nested) {
        const subtypes = [];
        let openBracketCounter = 0;
        let lastIndexOfSubtype = 0;
        for (let i = 0; i < nested.length; i++) {
            const char = nested.charAt(i);
            if (char === NestedTypeBrackets.START) {
                openBracketCounter++;
            } else if (char === NestedTypeBrackets.END && openBracketCounter > 1) {
                openBracketCounter--;
            } else if (char === InnerNestedTypeDelimiter && openBracketCounter === 0) {
                const subtype = nested.substring(lastIndexOfSubtype, i);
                subtypes.push(subtype);
                // Because char[i] = ','
                lastIndexOfSubtype = i + 1;
            } else if (char === NestedTypeBrackets.END && openBracketCounter === 1) {
                openBracketCounter--;
                const subtype = nested.substring(lastIndexOfSubtype, i + 1);
                subtypes.push(subtype);
                if (i < nested.length - 1) {
                    const nextChar = nested.charAt(i + 1);
                    if (nextChar === InnerNestedTypeDelimiter) {
                        // Because char[i:i+1] = '>,'
                        lastIndexOfSubtype = i + 2;
                        // Because next char is ',' and openBracketCounter will be 0. The condition above
                        // will be true, and we don't want to get a comma in subtypes.
                        i++;
                    } else {
                        // Because char[i] = '>'
                        lastIndexOfSubtype = i + 1;
                    }
                } else {
                    lastIndexOfSubtype = nested.length;
                }
            }
        }
        if (lastIndexOfSubtype < nested.length) {
            const lastSubtype = nested.substring(lastIndexOfSubtype);
            if (lastSubtype) {
                subtypes.push(lastSubtype);
            }
        }
        return subtypes;
    }

    /**
     * @param cassandraType {string}
     * @param root {NestedColumnEntity | undefined}
     * @param rootName {string | undefined}
     * @return NestedColumnEntity
     * */
    static #parseNestedType(cassandraType, root, rootName) {
        const typeInfo = CassandraToModelMapper.#extractTypeInfo(cassandraType);
        if (!root) {
            const newRoot = new NestedColumnEntity(rootName, typeInfo.type, true);
            CassandraToModelMapper.#parseNestedType(typeInfo.nested, newRoot, undefined);
            return newRoot;
        }
        if (typeInfo.isSimple) {
            const newType = new NestedColumnEntity(undefined, typeInfo.type, true);
            root.children.push(newType);
        } else {
            const newRoot = new NestedColumnEntity(undefined, typeInfo.type, true);
            root.children.push(newRoot);
            const subtypes = CassandraToModelMapper.#extractSubtypes(typeInfo.nested);
            subtypes.forEach(s => CassandraToModelMapper.#parseNestedType(s, newRoot, undefined));
        }
        return root;
    }

    /**
     * @param cassandraType {string}
     * @param columnName {string}
     * @return NestedColumnEntity
     * */
    static getNestedColumns(cassandraType, columnName) {
        return CassandraToModelMapper.#parseNestedType(cassandraType, undefined, columnName);
    }

}
