export class CustomTypeEntity {

    /**
     * @field name {string}
     * */
    name;

    /**
     * @field columns {Array<SimpleColumnDto>}
     * */
    columns = [];

    /**
     * @param name {string}
     * */
    constructor(name) {
        this.name = String(name);
    }

}
