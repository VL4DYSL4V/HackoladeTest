import {JsonSchemaTypes} from "../enums/json-schema-types.js";
import {JsonSchemaUtils} from "../util/json-schema-utils.js";

export class JsonSchemaCustomType {

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
    type = JsonSchemaTypes.OBJECT;

    /**
     * @field type {Array<Object>}
     * */
    properties = []

    /**
     * @param schema {string}
     * @param name {string}
     * */
    constructor(schema, name) {
        if (!name) {
            throw new Error('JSON schema custom type must have a name');
        }
        if (!schema) {
            throw new Error('Specify JSON schema draft URL');
        }
        this.$schema = String(schema);
        this.title = String(name);
        this.id = JsonSchemaUtils.getCustomTypeRelativeURI(name);
    }

}
