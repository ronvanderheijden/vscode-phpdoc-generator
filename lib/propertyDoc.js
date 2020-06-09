"use strict";

class PropertyDoc {
    constructor(name, types = [], indent = '') {
        this.name = name;
        this.types = types;
        this.indent = indent;
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

    /**
     * Returns an indent from the start of line.
     *
     * @return {string}
     */
    getIndent() {
        return this.indent;
    }
};

module.exports = PropertyDoc;
