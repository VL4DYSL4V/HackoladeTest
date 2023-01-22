export class NestedColumnEntity {

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
     * @field sampleValues {Array<any>}
     * */
    sampleValues = [];

    /**
     * @field children {Array<NestedColumnEntity>}
     * If empty - then it's a leaf
     * */
    children = [];

    /**
     * @param name {string}
     * @param columnType {string | Object}
     * @param nullable {boolean | undefined}
     * */
    constructor(name, columnType, nullable) {
        this.name = String(name);
        this.columnType = String(columnType);
        this.nullable = Boolean(nullable);
    }

}
