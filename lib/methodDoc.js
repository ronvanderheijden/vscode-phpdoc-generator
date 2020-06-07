"use strict";

const argumentParser = require('./argumentParser');
const typeParser = require('./typeParser');

class MethodDoc {
    constructor(matches) {
        // matches[1] contains spaces
        this.matches = matches;
        this.name = matches[2];
        this.rawArgs = matches[3] != null ? matches[3] : null;
        this.rawReturnTypes = matches[4] != null ? matches[4] : null;

        this.args = argumentParser.parseStringWithArgs(this.rawArgs);
        this.returnTypes = typeParser.getTypesFromVariableType(this.rawReturnTypes);

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
}

module.exports = MethodDoc;
