/**
 * An interface for all exporters
 * */
export class Exporter {

    /**
     * @param data {DatabaseModel}
     * @return {Promise<void>}
     */
    async export (data) {
        throw new Error('Export is not supported');
    }

}
