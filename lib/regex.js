"use strict";

module.exports = Object.freeze({
    CLASS_REGEX: /(class|interface)\s+(\w+)\s?/,
    PROPERTY_REGEX: /(\s+)?(?:public|protected|private)\s+(?:static\s+)?((?:\\?\w+)+\s+)?(\$\w+)(?:\s*=\s*([^;]+))?;/,
    METHOD_REGEX: /(\s+)?(?:abstract\s+)?(?:public|private|protected)?\s+(?:static\s+)?function\s+(\w+)\s*\((.+)?\)(?:\s*:\s*(\??\w+))?/,
});
