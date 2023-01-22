import {SimpleColumnEntity} from "./simple-column-entity.js";

export class SampledColumnEntity extends SimpleColumnEntity {


    /**
     * @field sampleValues {Array<any>}
     * */
    sampleValues = [];

    /**
     * @param name {string}
     * @param columnType {string | Object}
     * @param nullable {boolean | undefined}
     * */
    constructor(name, columnType, nullable) {
        super(name, columnType, nullable);
    }

}
