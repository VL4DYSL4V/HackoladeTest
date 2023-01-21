import {ExportFormat} from "./format-enum.js";
import {JsonFileExporter} from "./json/json-file-exporter.js";
import {Exporter} from "./exporter.js";
import {ExportConfig} from "../../config.js";

export class ExporterFactory {

    /**
     * @param format {string}
     * @return {Promise<Exporter>}
     */
    static async getExporter(format) {
        switch (format) {
            case ExportFormat.JSON:
                return new JsonFileExporter(4, ExportConfig.outFilename);
        }

        throw new Error(`Format ${format} is not supported, valid values are: ${
            Object.values(ExportFormat).join(', ')}`);
    }

}
