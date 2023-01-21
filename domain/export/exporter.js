/**
 * An interface for all exporters
 * */
export class Exporter {

    /**
     * @param data {Object}
     * @return {void}
     */
    async export (data) {
        throw new Error('Export is not supported');
    }

}
