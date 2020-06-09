"use strict";

class MethodDoc {
    constructor(name, args = [], returnTypes = [], indent = '') {
        this.name = name;
        this.args = args;
        this.returnTypes = returnTypes;
        this.indent = indent;
    }

    /**
     * Returns a function name.
     *
     * @return {string}
     */
    getName() {
        return this.name;
    }

    /**
     * Checks whether the method is __construct.
     *
     * @return {boolean}
     */
    isConstructor() {
        return this.name === '__construct';
    }

    /**
     * Checks whether the function has parameters.
     *
     * @return {boolean}
     */
    hasParameters() {
        return this.args.length !== 0;
    }

    /**
     * Returns an array with objects of parameters of the function.
     *
     * @return {object[]}
     */
    getParameters() {
        return this.args;
    }

    /**
     * Checks whether the function has return types.
     *
     * @return {boolean}
     */
    hasReturnTypes() {
        return this.returnTypes.length !== 0;
    }

    /**
     * Returns an array with types for '@return'.
     *
     * @param  {boolean} [returnVoid=false]
     * @return {string[]}
     */
    getReturnTypes(returnVoid = false) {
        if (returnVoid && ! this.hasReturnTypes()) {
            return ['void'];
        }

        return this.returnTypes;
    }

    /**
     * Returns an indent from the start of line.
     *
     * @return {string}
     */
    getIndent() {
        return this.indent;
    }
}

module.exports = MethodDoc;
