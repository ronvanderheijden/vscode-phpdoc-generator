"use strict";

const matcher = require('./matcher').Matcher;

class PropertyDoc {
    static getName(matches) {
        return matches[3].replace(/\$/g, '');
    }

    static getType(matches) {
        if (matches[4] != null) {
            return matcher.getTypeFromString(matches[4]);
        }
        return matches[2];
    }
};
exports.PropertyDoc = PropertyDoc;
