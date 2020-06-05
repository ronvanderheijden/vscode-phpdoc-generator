const vscode = require('vscode');
const config = require('./config');
const regex = require('./regex');
const indentation = require('./indentation');
const classDoc = require('./classDoc');
const methodDoc = require('./methodDoc');
const propertyDoc = require('./propertyDoc');

function generateClassDocBlock(matches) {
    console.log(matches);
    let docBlock = '/**\r\n';
    docBlock += ` * [Description ${classDoc.getName(matches)}]\r\n`;
    docBlock += ` */\r\n`;

    return docBlock;
}

function generatePropertyDocBlock(matches) {
    let indent = indentation.get(matches);
    let docBlock = indent + '/**\r\n';

    if (config.get('useNamesInTop')) {
        docBlock += indent + ` * ${propertyDoc.getName(matches)}\r\n`;
        docBlock += indent + ` *\r\n`;
    }

    docBlock += indent + ` * @var ${propertyDoc.getType(matches)}\r\n`;
    docBlock += indent + ` */\r\n`;

    return docBlock;
}

function generateMethodDocBlock(matches) {    
    let indent = indentation.get(matches);
    let docBlock = indent + '/**\r\n';

    if (config.get('useNamesInTop')) {
        docBlock += indent + ` * ${methodDoc.getName(matches)}\r\n`;
        docBlock += indent + ` *\r\n`;
    }

    if (methodDoc.hasParameters(matches)) {
        let parameters = methodDoc.getParameters(matches);
        for (let parameter of parameters) {            
            docBlock += indent + ` * @param ${parameter.types.join('|')} ${parameter.name}\r\n`;
        }
        docBlock += indent + ` * \r\n`;
    }

    /** @var {string[]} typesOfMethod */
    typesOfMethod = [];

    if (matches[4] != null) {
        typesOfMethod = methodDoc.getTypesForReturn(matches);
    } else if (config.get('returnUndefinedType') !== 'none') {
        typesOfMethod = [config.get('returnUndefinedType')];
    }
    
    if (typesOfMethod && typesOfMethod.length) {        
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
