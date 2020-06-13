"use strict";

const vscode = require('vscode');
const regex = require('./regex');
const argumentParser = require('./argumentParser');
const typeParser = require('./typeParser');
const matcher = require('./matcher');
const ClassDoc = require('./classDoc');
const PropertyDoc = require('./propertyDoc');
const MethodDoc = require('./methodDoc');

const CLASS_TYPE = 'class';
const METHOD_TYPE = 'method';
const PROPERTY_TYPE = 'property';

class CodeParser {
    constructor(activeTextEditor) {
        this._resetDescriptionOfParsedBlock();
        this.textEditor = activeTextEditor;
    }

    /**
     * Parses the current line or block of the text editor.
     *
     * @return {boolean}
     */
    parse() {
        const selection = this.textEditor.selection;
        const posStart = new vscode.Position(selection.start.line, 0);
        const posEnd = new vscode.Position(selection.start.line + 1, 0);
        const lineContent = this.textEditor.document.getText(new vscode.Range(posStart, posEnd));

        const instanceOfClassDoc = this.defineClass(lineContent);
        if (instanceOfClassDoc) {
            this.type = CLASS_TYPE;
            this.instanceOfDocEntity = instanceOfClassDoc;
            this.startPosition = posStart;

            return true;
        }

        const instanceOfPropertyDoc = this.defineProperty(lineContent);
        if (instanceOfPropertyDoc) {
            this.type = PROPERTY_TYPE;
            this.instanceOfDocEntity = instanceOfPropertyDoc;
            this.startPosition = posStart;

            return true;
        }

        const instanceOfMethodDoc = this.defineMethod(lineContent);
        if (instanceOfMethodDoc) {
            this.type = METHOD_TYPE;
            this.instanceOfDocEntity = instanceOfMethodDoc;
            this.startPosition = posStart;

            return true;
        }

        this._resetDescriptionOfParsedBlock();

        return false;
    }

    /**
     * Returns a type of the last parsed block.
     *
     * @return {string|null}
     */
    getDocType() {
        return this.type;
    }

    /**
     * Returns an instance with a description of the last parsed block.
     *
     * @return {ClassDoc|PropertyDoc|MethodDoc|null}
     */
    getInstanceOfDocEntity() {
        return this.instanceOfDocEntity;
    }

    /**
     * Returns an instance of a start position of the last parsed block.
     *
     * @return {vscode.Position|null}
     */
    getStartPosition() {
        return this.startPosition;
    }

    /**
     * Defines ClassDoc with a description of the class and returns an instance.
     *
     * @param  {string} content A content that includes a declaration of the class.
     * @return {ClassDoc|null}
     */
    defineClass(content) {
        let classDescription = this.findClass(content);

        return classDescription
            ? new ClassDoc(classDescription.name)
            : null
        ;
    }

    /**
     * Finds a description of a class or an interface or a trait.
     * Parses the found entity and returns an object with its description.
     *
     * @param  {string} content A content that includes a declaration of the class.
     * @return {object|null}   An object with the description or null.
     */
    findClass(content) {
        const matches = content.match(regex.CLASS_REGEX);

        return matches
            ?  { name: matches[2] }
            : null
        ;
    }

    /**
     * Defines PropertyDoc with a description of the property and returns an instance.
     *
     * @param  {string} content A content that includes a declaration of the property.
     * @return {PropertyDoc|null}
     */
    defineProperty(content) {
        const propertyDescription = this.findProperty(content);

        return propertyDescription
            ? new PropertyDoc(propertyDescription.name, propertyDescription.types, propertyDescription.indent)
            : null
        ;
    }

    /**
     * Finds a description of a property.
     * Parses the found property and returns an object with its description.
     *
     * @param  {string} content A content that includes a declaration of the property.
     * @return {object|null}   An object with the description or null.
     */
    findProperty(content) {
        const matches = content.match(regex.PROPERTY_REGEX);

        if (matches == null) {
            return null;
        }

        let description = {};

        description.indent = matches[1] != null ? matches[1] : '';
        description.name = matches[3];
        description.types = [];

        if (matches[2] != null) {
            description.types = typeParser.getTypesFromVariableType(matches[2].trim());
        }

        if (matches[4] != null) {
            /** @var {string|null} */
            const typeByValue = matcher.getTypeFromString(matches[4]);

            if (typeByValue === 'null') {
                description.types.push('null');
            } else if (typeByValue && ! description.length) {
                description.types = [typeByValue];
            }
        }

        return description;
    }

    /**
     * Defines MethodDoc with a description of the method and returns an instance.
     *
     * @param  {string} content A content that includes a declaration of the method.
     * @return {MethodDoc|null}
     */
    defineMethod (content) {
        const methodDescription = this.findMethod(content);

        return methodDescription
            ? new MethodDoc(
                methodDescription.name,
                methodDescription.args,
                methodDescription.returnTypes,
                methodDescription.indent
            )
            : null
        ;
    }

    /**
     * Finds a description of a method or a function.
     * Parses the found method and returns an object with its description.
     *
     * @param  {string} content A content that includes a declaration of the method.
     * @return {object|null}   An object with the description or null.
     */
    findMethod(content) {
        const matches = content.match(regex.METHOD_REGEX);

        if (matches == null) {
            return null;
        }

        const rawArgs = matches[3] != null ? matches[3] : null;
        const rawReturnTypes = matches[4] != null ? matches[4] : null;

        return {
            indent: matches[1] != null ? matches[1] : '',
            name: matches[2],
            args: argumentParser.parseStringWithArgs(rawArgs),
            returnTypes: typeParser.getTypesFromVariableType(rawReturnTypes)
        };
    }

    /**
     * Resets a description of the parsed block.
     */
    _resetDescriptionOfParsedBlock() {
        this.type = null;
        this.instanceOfDocEntity = null;
        this.startPosition = null;
    }
}

module.exports = {
    CodeParser: CodeParser,
    CLASS_TYPE: CLASS_TYPE,
    PROPERTY_TYPE: PROPERTY_TYPE,
    METHOD_TYPE: METHOD_TYPE
}
