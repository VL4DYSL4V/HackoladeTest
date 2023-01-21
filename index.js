import {ExporterFactory} from "./domain/export/exporter-factory.js";
import {DatabaseConfig, ExportConfig} from "./config.js";
import {DatabaseSchemaProviderFactory} from "./domain/database/database-schema-provider-factory.js";

const main = async () => {
    let dbSchemaProvider;
    try {
        dbSchemaProvider = await DatabaseSchemaProviderFactory.getSchemaProvider(DatabaseConfig.dbms);
        const data = await dbSchemaProvider.getDatabaseModel();

        const exporter = await ExporterFactory.getExporter(ExportConfig.format);
        await exporter.export(data);
        console.log('Done!')
    } catch (e) {
        console.log('Unknown error happened: ', e);
    } finally {
        if (dbSchemaProvider) {
            await dbSchemaProvider.shutdown();
        }
    }
};

await main();
