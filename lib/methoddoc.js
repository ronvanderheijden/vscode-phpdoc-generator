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

                let type = 'mixed';
                if (typedParameterParts.length == 2) {
                    type = typedParameterParts[0];
                } else if (typedParameterParts.length == 3) {
                    type = matcher.getTypeFromString(typedParameterParts[2]);
                } else if (typedParameterParts.length == 4) {
                    type = typedParameterParts[0];
                }
                type = (type == 'int')
                    ? 'integer'
                    : type;

                let name = typedParameterParts[0];
                if (typedParameterParts.length == 2) {
                    name = typedParameterParts[1];
                } else if (typedParameterParts.length == 3) {
                    name = typedParameterParts[0];
                } else if (typedParameterParts.length == 4) {
                    name = typedParameterParts[1];
                }

                parameters.push({
                    "type": type,
                    "name": name,
                });
            }

            return parameters;
        }
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
};
exports.MethodDoc = MethodDoc;
