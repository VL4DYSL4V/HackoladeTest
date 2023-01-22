export class BaseColumnMapper {

    /**
     * @field nextMapper {BaseColumnMapper}
     * */
    _nextMapper;

    /**
     * @param nextMapper {BaseColumnMapper | undefined}
     * */
    constructor(nextMapper) {
        this._nextMapper = nextMapper;
    }

    /**
     * @param column {SimpleColumnEntity}
     * @return {void | never}
     * */
    _assertColumnValid(column) {
        if (!column) {
            throw new Error('Passed null column to JSON schema column mapper')
        }
        if (typeof column !== 'object' && !Array.isArray(column)) {
            throw new Error(`Any column passed JSON schema column mapper must be a plain JS object, got: ${JSON.stringify(column)}`);
        }
    }

    /**
     * @param column {SimpleColumnEntity | SampledColumnEntity}
     * @return Object
     * */
    mapColumn(column){
        return this._next(column);
    }

    /**
     * @param column {SimpleColumnEntity | SampledColumnEntity}
     * @return {Object | never}
     * */
    _next(column){
        if (!this._nextMapper) {
            this._assertColumnValid(column);
            throw new Error(`Mapping of ${column.constructor.name} is not supported`);
        }
        return this._nextMapper.mapColumn(column);
    }

}
