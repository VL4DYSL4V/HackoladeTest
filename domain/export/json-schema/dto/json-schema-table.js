export class JsonSchemaTable {

    /**
     * @field id {string}
     * */
    id;

    /**
     * @field name {string}
     * */
    name;

    /**
     * @field type {'object'}
     * */
    type = 'object';

    properties = [];

    /**
     * @param name {string}
     * */
    constructor(name) {
        if (!name) {
            throw new Error('Json schema table must have a name');
        }
        this.name = String(name);
        this.id = `/${name}`;
    }

}
