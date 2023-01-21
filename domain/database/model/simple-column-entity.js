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
     * @param name {string}
     * @param columnType {string | Object}
     * */
    constructor(name, columnType) {
        this.name = name;
        this.columnType = columnType;
    }

}
