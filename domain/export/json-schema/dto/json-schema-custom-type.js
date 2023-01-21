export class JsonSchemaCustomType {

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

    properties = []

    /**
     * @param name {string}
     * */
    constructor(name) {
        if (!name) {
            throw new Error('Json schema custom type must have a name');
        }
        this.name = String(name);
        this.id = `/${name}`;
    }

}
