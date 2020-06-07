"use strict";

const matcher = require('./matcher');
const typeParser = require('./typeParser');

class ArgumentParser {
    /**
     * Parses a string of the argument and returns its name and types.
     *
     * @param {string} stringArgument An argument of the function in the form of a string.
     * @return {object} An object with the argument name and thier types: object.name, object.types.
     */
    static parseArgument(stringArgument) {
        /** @var {string[]} parts Contains parts of arguments. Example: [?<type>], <name>, =, [<value>]*/
        const parts = stringArgument.replace(/\s+/g, ' ').trim().split(' ');

        /** @var {string[]} types */
        let types = [];

        /** @var {string} variableName */
        let variableName;

        switch (parts.length) {
            case 2:
                // Example: string $value, ?array $value
                variableName = parts[1];
                types = typeParser.getTypesFromVariableType(parts[0]);
                break;

            case 3:
                // Examples: $value = 'value', $value = null, $value = []
                variableName = parts[0];
                types = [matcher.getTypeFromString(parts[2])];
                break;

            case 4:
                // Examples: array $values = [] or array $values = null
                variableName = parts[1];
                types = typeParser.getTypesFromVariableType(parts[0]);

                if (types.length === 1 && parts[3] === 'null') {
                    types.push('null');
                }
                break;

            default:
                // Example: $value
                variableName = parts[0];
                types = ['mixed'];
                break;
        }

        return {
            types: types,
            name: variableName
        };
    }

    /**
     * Parses an array with strings of arguments.
     * Returns an array with names of arguments and their types.
     *
     * @param  {string[]} array
     * @return {object[]}
     */
    static parseArgs(array) {
        return array.map(this.parseArgument, this);
    }

    /**
     * Parses the string with arguments of the function
     * and returns an array with names of the function and their types.
     *
     * @param {string|null} string
     */
    static parseStringWithArgs(string) {
        if (string === null || ! string.trim()) {
            return [];
        }

        /** @var {string[]} args */
        const args = this.splitArgs(string);

        return this.parseArgs(args);
    }

    /**
     * Splites the string with arguments and returns an array with string arguments.
     *
     * @param  {string} stringArgs
     * @return {string[]}
     */
    static splitArgs(stringArgs) {
        return stringArgs.replace(/&/g, '').split(',');
    }
}

module.exports = ArgumentParser;
