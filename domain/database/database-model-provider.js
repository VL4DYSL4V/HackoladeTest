export class DatabaseModelProvider {

    /**
     * @return {Promise<DatabaseModel> | never}
     * */
    async getDatabaseModel() {
        throw new Error('Getting database model is not implemented');
    }

    /**
     * @return {Promise<void>}
     * */
    async shutdown() {

    }

}
