export const CassandraRegex = Object.freeze({
    SAFE_KEYSPACE_AND_TABLE_NAME: '^\\w+$',
    SAFE_COLUMN_NAME: '^\\w+$',
    SIMPLE_TYPE_REGEX: '^\\w+$',
    NESTED_TYPE_REGEX: '^(list|map|set|tuple|frozen)<([a-zA-Z0-9<>]+)\\s*(,\\s*([a-zA-Z0-9<>]+))?>$',
});
