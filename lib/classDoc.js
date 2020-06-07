"use strict";

/**
 * Handles classes, interfaces and traits. Returns a description for them.
 */
class ClassDoc {
    constructor(matches) {
        this.matches = matches;
        this.name = matches[2];
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
