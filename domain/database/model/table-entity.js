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
// CQL data type 	JavaScript type
// ascii 	        String
//* bigint 	        Long
//* blob 	        Buffer
//* boolean 	        Boolean
//* counter 	        Long
//* date 	        LocalDate
//* decimal 	        BigDecimal
//* double 	        Number
//* float 	        Number
//* inet 	        InetAddress
//* int 	            Number
//  list 	        Array
//  map 	            Object / ECMAScript 6 Map
//  set 	            Array / ECMAScript 6 Set
//* smallint 	    Number
//  text 	        String
//* time 	        LocalTime
//* timestamp 	    Date
//* timeuuid 	    TimeUuid
//* tinyint 	        Number
//  tuple 	        Tuple
//* uuid 	        Uuid
//  varchar 	        String
//* varint 	        Integer
