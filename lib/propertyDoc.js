"use strict";

class PropertyDoc {
    constructor(name, types = []) {
        this.name = name;
        this.types = types;
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
