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

        value = this._normalize(value);

        return value.charAt(0) === '?'
            ? [value.substring(1), 'null']
            : [value]
        ;
    }

    /**
     * Returns normalized value with types without ':' and spaces.
     *
     * @param {string} value
     */
    static _normalize(value) {
        value = value.trim();

        if (value.charAt(0) === ':') {
            value = value.substring(1).trim();
        }

        return value;
    }
}

module.exports = TypeParser;
