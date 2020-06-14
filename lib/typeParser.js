"use strict";

class TypeParser {
    /**
     * Returns an array with types from the variable type.
     *
     * @param  {string|null} value Contains one type or two types
     * @return {string[]}
     */
    static getTypesFromVariableType(value) {
        if (value === null) {
            return [];
        }

        return value.charAt(0) === '?'
            ? [value.substring(1), 'null']
            : [value]
        ;
    }
}

module.exports = TypeParser;
