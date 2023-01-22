import {ExportFormat} from "./format-enum.js";
import {JsonSchemaToFileExporter} from "./json-schema/json-schema-to-file-exporter.js";
import {Exporter} from "./exporter.js";
import {ExportConfig} from "../../config.js";

export class ExporterFactory {

    /**
     * @param format {string}
     * @return {Promise<Exporter>}
     */
    static async getExporter(format) {
        switch (format) {
            case ExportFormat.JSON_SCHEMA:
                return new JsonSchemaToFileExporter(ExportConfig.jsonSchemaDraftVersion, ExportConfig.outFilename);
        }

        throw new Error(`Format ${format} is not supported, valid values are: ${
            Object.values(ExportFormat).join(', ')}`);
    }

}
