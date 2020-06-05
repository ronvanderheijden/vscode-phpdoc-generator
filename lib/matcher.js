"use strict";

class Matcher {
    static isBoolean(typeString) {
        return typeString.match(/^(true|false)/);
    }

    static isInteger(typeString) {
        return typeString.match(/^([^\D]+)/);
    }

    static isFloat(typeString) {
        return typeString.match(/^([^\D]+)(\.)([^\D]+)$/);
    }

    static isString(typeString) {
        return typeString.match(/^(\"|\')(.*)(\"|\')$/);
    }

    static isArray(typeString) {
        return typeString.match(/\[[^\]]*\]|array\([^)]*\)/);
    }

    static isNull(typeString) {
        return typeString.match(/^(null|NULL)/);
    }

    static getTypeFromString(typeString) {
        if (this.isBoolean(typeString)) {
            return 'boolean';
        }
        if (this.isInteger(typeString)) {
            return 'integer';
        }
        if (this.isFloat(typeString)) {
            return 'float';
        }
        if (this.isString(typeString)) {
            return 'string';
        }
        if (this.isArray(typeString)) {
            return 'array';
        }
        if (this.isNull(typeString)) {
            return 'null';
        }
        return "undefined"
    }
};

module.exports = Matcher;
