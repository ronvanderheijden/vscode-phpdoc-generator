"use strict";

const config = require('./config');
const indentation = require('./indentation');
const classDoc = require('./classDoc');
const methodDoc = require('./methodDoc');
const propertyDoc = require('./propertyDoc');
const formatTypeConverter = require('./formatTypeConverter');

class DocBlockGenerator {
    /**
     * Generates a description for a class.
     *
     * @param  {ClassDoc} doc
     * @return {string}
     */
    static generateClassDocBlock(doc) {
        let docBlock = '/**\r\n';
        docBlock += ` * [Description ${doc.getName()}]\r\n`;
        docBlock += ` */\r\n`;

        return docBlock;
    }

    /**
     * Generates a description for a property.
     *
     * @param  {propertyDoc} doc
     * @return {string}
     */
    static generatePropertyDocBlock(doc) {
        /** @var {string[]} types */
        let types = doc.getTypes();

        if (!config.get('shortType')) {
            const converter = new formatTypeConverter(config.get('comparisonOfShortTypes'));
            types = converter.convertTypes(type);
        }

        if (!types.length) {
            types = [config.get('varUndefinedType')];
        }

        let indent = indentation.get(matches);
        let docBlock = indent + '/**\r\n';

        if (config.get('useNamesInTop')) {
            docBlock += indent + ` * ${doc.getName()}\r\n`;
            docBlock += indent + ` *\r\n`;
        }

        docBlock += indent + ` * @var ${types.join('|')}\r\n`;
        docBlock += indent + ` */\r\n`;

        return docBlock;
    }

    /**
     * Generates a description for a method or a function.
     *
     * @param  {string[]} matches
     * @return {string}
     */
    static generateMethodDocBlock(matches) {
        /** @var {boolean} shortType */
        const shortType = config.get('shortType');
        /** @var {boolean} indentAfterParameters */
        const indentAfterParameters = config.get('insertIndentAfterParameters');
        /** @var {boolean|string} constructorWithType */
        const constructorWithType = config.get('constructorWithType');
        const doc = new methodDoc(matches);

        let indent = indentation.get(matches);
        let docBlock = indent + '/**\r\n';

        if (config.get('useNamesInTop')) {
            docBlock += indent + ` * ${doc.getName()}\r\n`;
            docBlock += indent + ` *\r\n`;
        }

        if (doc.hasParameters()) {
            const converter = !shortType
                ? new formatTypeConverter(config.get('comparisonOfShortTypes'))
                : null
                ;

            /** @var {object[]} parameters */
            const parameters = doc.getParameters();

            /** @var {string[]} types */
            let types;

            for (let parameter of parameters) {
                types = !shortType
                    ? converter.convertTypes(parameter.types)
                    : parameter.types
                    ;

                docBlock += indent + ` * @param ${types.join('|')} ${parameter.name}\r\n`;
            }
        }

        /** @var {string[]} typesOfMethod */
        let typesOfMethod = [];

        /** @var {boolean} constructorWithDefinedType */
        const constructorWithDefinedType = doc.isConstructor() && constructorWithType === 'returnDefinedTypeOrUndefinedType';

        if (doc.getName() === '__construct' && constructorWithType === 'void') {
            typesOfMethod = ['void'];
        } else if ((doc.hasReturnTypes() && !doc.isConstructor()) || constructorWithDefinedType) {
            typesOfMethod = doc.getReturnTypes();
        } else if ((config.get('returnUndefinedType') !== 'none' && !doc.isConstructor()) || constructorWithDefinedType) {
            typesOfMethod = [config.get('returnUndefinedType')];
        }

        if (indentAfterParameters && doc.hasParameters() && typesOfMethod.length) {
            docBlock += indent + ` * \r\n`;
        }

        if (typesOfMethod.length) {
            docBlock += indent + ` * @return ${typesOfMethod.join('|')}\r\n`;
        }

        docBlock += indent + ` */\r\n`;

        return docBlock;
    }
}

module.exports = DocBlockGenerator;
