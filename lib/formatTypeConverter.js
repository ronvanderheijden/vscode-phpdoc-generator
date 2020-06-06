"use strict";

/**
 * Converts short type names to long type names.
 */
class FormatTypeConverter {
    /**
     * An object with short type names in the form of keys 
     * and long type names in the form of values.
     * 
     * @param {object} [types={}] types 
     */
    constructor(types = {}) {
        this.types = types;
    }

    /**
     * Converts the given short type name to a long type name from the list of types.
     * 
     * @param {string} typeName 
     */
    convertType(typeName) {
        return this.types.hasOwnProperty(typeName) ? this.types[typeName] : typeName;
    }

    /**
     * Converts an array with types.
     * 
     * @param {string[]} types 
     */
    convertTypes(types) {        
        return types.map(this.convertType, this);
    }
}

module.exports = FormatTypeConverter;
