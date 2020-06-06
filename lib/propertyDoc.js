"use strict";

const matcher = require('./matcher');
const typeParser = require('./typeParser');

class PropertyDoc {
    constructor(matches) {        
        this.matches = matches;
        this.name = matches[3];
        this.types = [];

        if (matches[2] != null) {
            this.types = typeParser.getTypesFromVariableType(matches[2].trim());
        }
        
        if (matches[4] != null) {
            /** @var {string|null} */
            const typeByValue = matcher.getTypeFromString(matches[4]);

            if (typeByValue === 'null') {
                this.types.push('null');
            } else if (typeByValue && ! this.types.length) {
                this.types = [typeByValue];
            }
        }
    }

    /**
     * Returns a name of the property.
     * 
     * @return {string}
     */
    getName() {
        return this.name;
    }

    /**
     * Returns an array with types of th property.
     * 
     * @return {string[]}
     */
    getTypes() {
        return this.types;
    }
};

module.exports = PropertyDoc;
