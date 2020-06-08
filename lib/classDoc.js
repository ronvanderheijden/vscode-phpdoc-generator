"use strict";

/**
 * Handles classes, interfaces and traits. Returns a description for them.
 */
class ClassDoc {
    constructor(name) {
        this.name = name;
    }

    /**
     * Returns a class name or an interfaces name or an trait name.
     *
     * @return {string}
     */
    getName() {
        return this.name;
    }
};

module.exports = ClassDoc;
