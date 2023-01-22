export class SimpleColumnEntity {

    /**
     * @field name string
     * */
    name;

    /**
     * @field type string
     * */
    columnType;

    /**
     * @field nullable boolean
     * */
    nullable;

    /**
     * @param name {string}
     * @param columnType {string | Object}
     * @param nullable {boolean | undefined}
     * */
    constructor(name, columnType, nullable) {
        this.name = name ? String(name) : undefined;
        this.columnType = String(columnType);
        this.nullable = Boolean(nullable);
    }

}
