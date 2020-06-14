"use strict";

/**
 * Handles constants. Returns a description for them.
 */
class ConstantDoc {
    /**
     * Initializes an instance with a description of the constant.
     *
     * @param {string} name
     * @param {string|null} type
     * @param {string} [indent=''] indent
     */
    constructor(name, type = null, indent = '') {
        this.name = name;
        this.type = type;
        this.indent = indent;
    }

    /**
     * Returns a name of the constant.
     *
     * @return {string}
     */
    getName() {
        return this.name;
    }

    /**
     * Returns a type of the constant.
     *
     * @return {string|null}
     */
    getType() {
        return this.type;
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

module.exports = ConstantDoc;
