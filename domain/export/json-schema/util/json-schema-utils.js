export class JsonSchemaUtils {

    /**
     * @param typeName {string}
     * @return string
     * */
    static getCustomTypeRelativeURI(typeName) {
        return `/${typeName}`;
    }

}
