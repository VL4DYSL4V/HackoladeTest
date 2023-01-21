import {ExportFactory} from "./domain/export/export-factory.js";
import {DatabaseConfig, ExportConfig} from "./config.js";
import {DatabaseSchemaProviderFactory} from "./domain/database/database-schema-provider-factory.js";

const main = async () => {
    let dbSchemaProvider;
    try {
        dbSchemaProvider = await DatabaseSchemaProviderFactory.getSchemaProvider(DatabaseConfig.dbms);
        const data = await dbSchemaProvider.getSchema();

        const exporter = await ExportFactory.getExporter(ExportConfig.format);
        await exporter.export(data);
    } catch (e) {
        console.log('Unknown error happened: ', e);
    } finally {
        if (dbSchemaProvider) {
            await dbSchemaProvider.shutdown();
        }
    }
};

await main();
