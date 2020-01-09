"use strict";

class Regex {
    static class() {
        return /class\s+(\w+)\s?/;
    }

    static property() {
        return /(\s+)?(?:public|protected|private)\s+(?:static\s+)?((?:\\?\w+)+\s+)?(\$\w+)(?:\s*=\s*([^;]+))?;/;
    }

    static method() {
        return /(\s+)?(?:abstract\s+)?(?:public|private|protected)?\s+(?:static\s+)?function\s+(\w+)\s*\(([^)]+)?\)(?::\s+(\\?\w+))?/;
    }
};
exports.Regex = Regex;
