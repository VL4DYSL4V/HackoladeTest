export class JsonSchemaTable {

    /**
     * @field $schema {string}
     * */
    $schema;

    /**
     * @field id {string}
     * */
    id;

    /**
     * @field title {string}
     * */
    title;

    /**
     * @field type {'object'}
     * */
    type = 'object';

    /**
     * @field type {Array<Object>}
     * */
    properties = [];

    /**
     * @param schema {string}
     * @param name {string}
     * */
    constructor(schema, name) {
        if (!name) {
            throw new Error('JSON schema table must have a name');
        }
        if (!schema) {
            throw new Error('Specify JSON schema draft URL');
        }
        this.$schema = String(schema);
        this.title = String(name);
        this.id = `/${name}`;
    }

}
