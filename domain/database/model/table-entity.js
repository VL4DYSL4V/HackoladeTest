export class TableEntity {

    /**
     * @field name {string}
     * */
    name;

    /**
     * @field columns {Array<SimpleColumnEntity | SampledColumnEntity | NestedColumnEntity>}
     * */
    columns = [];

    /**
     * @param name {string}
     * */
    constructor(name) {
        this.name = name;
    }


}
