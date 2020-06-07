const vscode = require('vscode');
const config = require('./config');
const regex = require('./regex');
const indentation = require('./indentation');
const classDoc = require('./classDoc');
const methodDoc = require('./methodDoc');
const propertyDoc = require('./propertyDoc');
const formatTypeConverter = require('./formatTypeConverter');

function generateClassDocBlock(matches) {
    const doc = new classDoc(matches);

    let docBlock = '/**\r\n';
    docBlock += ` * [Description ${doc.getName()}]\r\n`;
    docBlock += ` */\r\n`;

    return docBlock;
}

function generatePropertyDocBlock(matches) {
    const doc = new propertyDoc(matches);

    /** @var {string[]} types */
    let types = doc.getTypes();

    if (! config.get('shortType')) {        
        const converter = new formatTypeConverter(config.get('comparisonOfShortTypes'));
        types = converter.convertTypes(type);
    }

    if (! types.length) {
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

function generateMethodDocBlock(matches) {  
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
        const converter = ! shortType
            ? new formatTypeConverter(config.get('comparisonOfShortTypes'))
            : null
        ;
        
        /** @var {object[]} parameters */
        const parameters = doc.getParameters();        

        /** @var {string[]} types */
        let types;

        for (let parameter of parameters) {
            types = ! shortType 
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
    } else if ((doc.hasReturnTypes() && ! doc.isConstructor()) || constructorWithDefinedType) {
        typesOfMethod = doc.getReturnTypes();
    } else if ((config.get('returnUndefinedType') !== 'none' && ! doc.isConstructor()) || constructorWithDefinedType) {
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

/**
 * @param {vscode.ExtensionContext} context
 */
exports.activate = (context) => {
    let disposable = vscode.commands.registerCommand('phpdoc-generator.generatePHPDoc', () => {
        vscode.window.activeTextEditor.edit((editBuilder) => {    
            const activeTextEditor = vscode.window.activeTextEditor;
            const selection = activeTextEditor.selection;            

            let posStart = new vscode.Position(selection.start.line, 0);
            let posEnd = new vscode.Position(selection.start.line + 1, 0);
            let lineContent = activeTextEditor.document.getText(new vscode.Range(posStart, posEnd));

            matches = lineContent.match(regex.CLASS_REGEX);
            if (matches != null) {
                editBuilder.insert(posStart, generateClassDocBlock(matches));
            }

            matches = lineContent.match(regex.METHOD_REGEX);
            if (matches != null) {
                editBuilder.insert(posStart, generateMethodDocBlock(matches));
            }

            matches = lineContent.match(regex.PROPERTY_REGEX);
            if (matches != null) {
                editBuilder.insert(posStart, generatePropertyDocBlock(matches));
            }
        }, {
            undoStopBefore: true,
            undoStopAfter: true
        });
    });
    context.subscriptions.push(disposable);
};

exports.deactivate = () => {};
