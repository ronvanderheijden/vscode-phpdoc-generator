"use strict";

class Indentation {
    static get(matches) {
        if (matches[1] != null) {
            return matches[1];
        }
        return '';
    }
};

module.exports = Indentation;
