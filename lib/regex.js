"use strict";

module.exports = Object.freeze({
    CLASS_REGEX: /(class|interface|trait)\s+(\w+)\s?/,
    CONSTANT_REGEX: /(\s+)?(?:(?:public|protected|private)\s+)?const\s+(\w+)\s*=\s*([\p{Alpha}\p{M}\p{Nd}\p{Pc}\p{Join_C}\s$=:.,%*--+'"?><\\[\]]+)?/u,
    PROPERTY_REGEX: /(\s+)?(?:public|protected|private)\s+(?:static\s+)?((?:\??[\w\\]+)\s+)?(\$\w+)(?:\s*=\s*([^;]+))?;/,
    METHOD_REGEX: /(\s+)?(?:(?:(abstract|public|private|protected|static))\s+)*function\s+(\w+)\s*\((.+)?\)(?:\s*:\s*(\??[\w\\]+))?/,
    START_METHOD_REGEX: /(\s+)?function\s+\w+/,
    MULTILINE_METHOD_NAME_REGEX: /(\s+)?(?:(?:abstract|public|private|protected|static)\s+)*function\s+(\w+)\s*\(([\w\s$=:,'"?>\\[\].&|]*)\)\s*(?::\s*(\??[\w|\\]*))?\s*/m
});
