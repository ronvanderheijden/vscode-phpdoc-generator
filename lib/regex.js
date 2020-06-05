"use strict";

class Regex {
    static class() {
        return /class\s+(\w+)\s?/;
    }

    static property() {
        return /(\s+)?(?:public|protected|private)\s+(?:static\s+)?((?:\\?\w+)+\s+)?(\$\w+)(?:\s*=\s*([^;]+))?;/;
    }

    static method() {
        return /(\s+)?(?:abstract\s+)?(?:public|private|protected)?\s+(?:static\s+)?function\s+(\w+)\s*\((.+)?\)(?:\s*:\s*(\\?\w+))?/;
    }

    static startMethod() {
        return /\s+function\s+\w+/;
    }

    static multilineNameOfMethod() {
        return /\s*function\s+(\w+)\s+\(([\w\s$=:,'"?>\\[\].&|]]*)\)\s*\:?\s*(\??[\w|\\]*)/m;
        return /\s*function\s+(\w+)\s+\(([\w\s\$=:,\'\"\?\\\[\]\.\&|]*)\)\s*\:?\s*(\??[\w|\\]*)/m;
    }
};
exports.Regex = Regex;
