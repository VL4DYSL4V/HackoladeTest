export const DatabaseConfig = Object.freeze({
    // *************************
    // *    Common config   *
    // *************************
    host: "localhost",
    port: 9042,
    user: "cassandra",
    password: "cassandra",
    dbms: 'cassandra',
    // *************************
    // *    Cassandra config   *
    // *************************
    dataCenter: "datacenter1",
    keyspace: "hotel",
});

export const ExportConfig = Object.freeze({
    // *************************
    // *    Common config   *
    // *************************
    // Allowed values: json_schema
    format: 'json_schema',
    // *************************
    // *  Output file config   *
    // *************************
    outFilename: './result.json',
});
