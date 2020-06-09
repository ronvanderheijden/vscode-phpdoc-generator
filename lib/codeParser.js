"use strict";

const vscode = require('vscode');
const regex = require('./regex');
const argumentParser = require('./argumentParser');
const typeParser = require('./typeParser');
const matcher = require('./matcher');
const classDoc = require('./classDoc');
const propertyDoc = require('./propertyDoc');
const methodDoc = require('./methodDoc');
const docBlockGenerator = require('./docBlockGenerator');

class CodeParser {
    constructor(activeTextEditor) {
        this.textEditor = activeTextEditor;
    }

    parse(editBuilder) {
        const selection = this.textEditor.selection;
        const posStart = new vscode.Position(selection.start.line, 0);
        const posEnd = new vscode.Position(selection.start.line + 1, 0);
        const lineContent = this.textEditor.document.getText(new vscode.Range(posStart, posEnd));

        // TODO Должен только парсить!
        // Подготавливать данные для обработки и генерации описания.
        // В отдельном классе или методах должна происходить
        // передача экземпляров, если есть данные и вставка данных в код.

        const instanceOfClassDoc = this.defineClass(lineContent);
        if (instanceOfClassDoc) {
            editBuilder.insert(posStart, docBlockGenerator.generateClassDocBlock(instanceOfClassDoc));
        }

        const instanceOfPropertyDoc = this.defineProperty(lineContent);
        if (instanceOfPropertyDoc) {
            editBuilder.insert(posStart, docBlockGenerator.generatePropertyDocBlock(instanceOfPropertyDoc));
        }

        const instanceOfMethodDoc = this.defineMethod(lineContent);
        if (instanceOfMethodDoc) {
            editBuilder.insert(posStart, docBlockGenerator.generateMethodDocBlock(instanceOfMethodDoc));
        }
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
            ? new classDoc(classDescription.name)
            : null
        ;
    }

    /**
     * Finds a description of a class or an interface or a trait.
     * Parses the found entity and returns an object with its description.
     *
     * @param  {string} content A content that includes a declaration of the class.
     * @return {object|null}   An object with the description or null.
     * @return {object.name}   A name of the class.
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
            ? new propertyDoc(propertyDescription.name, propertyDescription.types, propertyDescription.indent)
            : null
        ;
    }

    /**
     * Finds a description of a property.
     * Parses the found property and returns an object with its description.
     *
     * @param  {string} content A content that includes a declaration of the property.
     * @return {object|null}   An object with the description or null.
     * @return {object.indent} An indent from the start of line.
     * @return {object.name}   A name of the property.
     * @return {object.types} An array with types.
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
        console.log('de', methodDescription);

        return methodDescription
            ? new methodDoc(
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
     * @return {object.indent} An indent from the start of line.
     * @return {object.name}   A name of the method.
     * @return {object.args}   An array with names of arguments and their types.
     * @return {object.returnTypes} An array with return types.
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
}

module.exports = CodeParser;
