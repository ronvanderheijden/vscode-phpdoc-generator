"use strict";

const matcher = require('./matcher').Matcher;

class MethodDoc {
    static getName(matches) {
        return matches[2];
    }

    static hasParameters(matches) {
        return matches[3] != null;
    }

    static getParameters(matches) {
        let parameters = new Array;
        if (this.hasParameters(matches)) {
            var typedParameters = matches[3].replace(/&/g, '').split(",");

            for (let typedParameter of typedParameters) {
                let typedParameterParts = typedParameter.replace(/\s+/g, ' ').trim().split(" ");
                
                /** @var {string[]} types */
                let types = [];

                /** @var {string} variableName */
                let variableName;
                
                if (typedParameterParts.length === 2) {
                    // Example: string $value, ?array $value
                    variableName = typedParameterParts[1];
                    types = this.getTypesFromVariableType(typedParameterParts[0]);
                } else if (typedParameterParts.length === 3) {
                    // Examples: $value = 'value', $value = null, $value = []
                    variableName = typedParameterParts[0];
                    types = [matcher.getTypeFromString(typedParameterParts[2])];
                } else if (typedParameterParts.length === 4) {
                    // Examples: array $values = [] or array $values = null
                    variableName = typedParameterParts[1];
                    types = this.getTypesFromVariableType(typedParameterParts[0]);

                    if (types.length === 1 && typedParameterParts[3] === 'null') {
                        types.push('null');
                    }
                } else {
                    // Example: $value
                    variableName = typedParameterParts[0];
                    types = ['mixed'];
                }

                parameters.push({
                    'types': types,
                    'name': variableName,
                });
            }
        }

        return parameters;
    }

    /**
     * Returns an array with types for '@return'.
     * 
     * @param {string[]} matches 
     * @param {string[]}
     */
    static getTypesForReturn(matches) {        
        if (matches[4] == null) {
            return ['void'];
        }

        return matches[4].charAt(0) === '?'
            ? [matches[4].substring(1), 'null']
            : [matches[4]]
        ;
    }

    /**
     * Returns an array with types from the variable type.
     * 
     * @param  {string} value Contains one type or two types
     * @return {string[]}
     */
    static getTypesFromVariableType(value)
    {
        return value.charAt(0) === '?'
            ? [value.substring(1), 'null']
            : [value]
        ;
    }
};
exports.MethodDoc = MethodDoc;
