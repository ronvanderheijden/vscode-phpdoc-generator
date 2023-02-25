"use strict";

const config = require('./config');
const FormatTypeConverter = require('./formatTypeConverter');

class DocBlockGenerator {
    /**
     * Generates a description for a class.
     *
     * @param  {ClassDoc} doc
     * @return {string}
     */
    static generateClassDocBlock(doc) {
        let author = config.get('author');
        let docBlock = '/**\r\n';
        docBlock += ` * [Description ${doc.getName()}]\r\n`;
        if (author !== '') {
            docBlock += ` *\r\n * @author ${author}\r\n`;
        }
        docBlock += ` */\r\n`;

        return docBlock;
    }

    static generateConstantDocBlock(doc) {
        /** @var {string} indent */
        const indent = doc.getIndent();
        /** @var {string|null} type */
        let type = doc.getType();


        if (type && !config.get('shortType')) {
            const converter = new FormatTypeConverter(config.get('comparisonOfShortTypes'));
            type = converter.convertType([type]);
        }

        if (!type) {
            type = config.get('varUndefinedType');
        }

        let docBlock = indent + '/**\r\n';

        if (config.get('insertDescription')) {
            docBlock += indent + ` * ${doc.getName()}\r\n`;
            docBlock += indent + ` *\r\n`;
        }

        docBlock += indent + ` * @var ${type}\r\n`;
        docBlock += indent + ` */\r\n`;

        return docBlock;
    }

    /**
     * Generates a description for a property.
     *
     * @param  {PropertyDoc} doc
     * @return {string}
     */
    static generatePropertyDocBlock(doc) {
        /** @var {string} indent */
        const indent = doc.getIndent();
        /** @var {string[]} types */
        let types = doc.getTypes();

        if (!config.get('shortType')) {
            const converter = new FormatTypeConverter(config.get('comparisonOfShortTypes'));
            types = converter.convertTypes(types);
        }

        if (!types.length) {
            types = [config.get('varUndefinedType')];
        }

        let docBlock = indent + '/**\r\n';

        if (config.get('insertDescription')) {
            docBlock += indent + ` * [Description for ${doc.getName()}]\r\n`;
            docBlock += indent + ` *\r\n`;
        }

        docBlock += indent + ` * @var ${types.join('|')}\r\n`;
        docBlock += indent + ` */\r\n`;

        return docBlock;
    }

    /**
     * Generates a description for a method or a function.
     *
     * @param  {MethodDoc} doc
     * @return {string}
     */
    static generateMethodDocBlock(doc) {
        /** @var {boolean} shortType */
        const shortType = config.get('shortType');
        /** @var {boolean} indentAfterParameters */
        const indentAfterParameters = config.get('insertIndentAfterParameters');
        /** @var {boolean} alignParametersName */
        const alignParametersName = config.get('alignParametersName');
        /** @var {boolean|string} constructorWithType */
        const constructorWithType = config.get('constructorWithType');
        /** @var {string} indent */
        const indent = doc.getIndent();

        let docBlock = indent + '/**\r\n';
        let space    = ' ';

        if (config.get('insertDescription')) {
            docBlock += indent + ` * [Description for ${doc.getName()}]\r\n`;
            docBlock += indent + ` *\r\n`;
        }

        if (doc.hasParameters()) {
            const converter = !shortType
                ? new FormatTypeConverter(config.get('comparisonOfShortTypes'))
                : null
            ;

            /** @var {object[]} parameters */
            const parameters = doc.getParameters();

            /** @var {string[]} types */
            let types;
            let maxLen = 0;

            for (let parameter of parameters) {
                types = !shortType
                    ? converter.convertTypes(parameter.types)
                    : parameter.types
                ;
                parameter.strTypes = types.join('|');
                maxLen = (parameter.strTypes.length > maxLen) ? parameter.strTypes.length : maxLen;
            }

            let strSpaces = '';

            for (let parameter of parameters) {
                strSpaces = (alignParametersName) ? space.repeat(maxLen - parameter.strTypes.length) : '';
                docBlock += indent + ` * @param ${parameter.strTypes} ${strSpaces}${parameter.name}\r\n`;
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
            docBlock += indent + ` *\r\n`;
        }

        if (typesOfMethod.length) {
            docBlock += indent + ` * @return ${typesOfMethod.join('|')}\r\n`;
        }

        let alreadyAdded      = false;
        let maxLengthOtherTag = 0;
        let strSpacesOther    = '';

        if (config.get('authorTag')) {
            maxLengthOtherTag = "author".length
        }
        if (config.get('copyrightCompanyName')) {
            maxLengthOtherTag = "copyright".length
        }

        if (config.get('displayCreationDate')) {
            let currentTime = new Date().toLocaleString();
            let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
            docBlock = DocBlockGenerator.addEmtyLineComment(docBlock, indent);
            alreadyAdded = true;
            docBlock += indent + ` * Created at: ${currentTime} (${timeZone})\r\n`;
        }

        if (config.get('authorTag')) {
            docBlock = (!alreadyAdded) ? DocBlockGenerator.addEmtyLineComment(docBlock, indent) : docBlock;
            alreadyAdded = true;
            strSpacesOther = space.repeat(maxLengthOtherTag - "author".length);
            docBlock += indent + ` * @author ${strSpacesOther}${config.get('authorTag')}\r\n`;
        }

        if (config.get('authorSeeUrl')) {
            docBlock = (!alreadyAdded) ? DocBlockGenerator.addEmtyLineComment(docBlock, indent) : docBlock;
            alreadyAdded = true;
            strSpacesOther = space.repeat(maxLengthOtherTag - "see".length);
            docBlock += indent + ` * @see ${strSpacesOther}{@link ${config.get('authorSeeUrl')}}\r\n`;
        }

        if (config.get('companySeeUrl')) {
            docBlock = (!alreadyAdded) ? DocBlockGenerator.addEmtyLineComment(docBlock, indent) : docBlock;
            alreadyAdded = true;
            strSpacesOther = space.repeat(maxLengthOtherTag - "see".length);
            docBlock += indent + ` * @see ${strSpacesOther}{@link ${config.get('companySeeUrl')}}\r\n`;
        }

        if (config.get('copyrightCompanyName')) {
            docBlock = (!alreadyAdded) ? DocBlockGenerator.addEmtyLineComment(docBlock, indent) : docBlock;
            alreadyAdded = true;
            strSpacesOther = space.repeat(maxLengthOtherTag - "copyright".length);
            docBlock += indent + ` * @copyright ${strSpacesOther}${config.get('copyrightCompanyName')}\r\n`;
        }

        docBlock += indent + ` */\r\n`;

        return docBlock;
    }

    static addEmtyLineComment(docBlock, indent) {
        const newEmptyLineComment = indent + ` *\r\n`;
        return docBlock += newEmptyLineComment;
    }
}

module.exports = DocBlockGenerator;
