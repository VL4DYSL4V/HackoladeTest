export class SampleProvider {

    /**
     * @param columnName {string}
     * @param tableName {string}
     * @return {Promise<Array<any>> | never}
     * */
    async getSamplesForTable(columnName, tableName){
        throw new Error(`Sample provider ${this.constructor.name} is not implemented`);
    }

}
