const vscode = require('vscode');
const config = require('./config').Config;
const regex = require('./regex').Regex;
const indentation = require('./indentation').Indentation;
const classDoc = require('./classdoc').ClassDoc;
const methodDoc = require('./methoddoc').MethodDoc;
const propertyDoc = require('./propertydoc').PropertyDoc;

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
            docBlock += indent + ` * @param ${parameter.type} ${parameter.name}\r\n`;
        }
        docBlock += indent + ` * \r\n`;
    }

    docBlock += indent + ` * @return ${methodDoc.getReturn(matches)}\r\n`;
    docBlock += indent + ` */\r\n`;

    return docBlock;
}

exports.activate = (context) => {
    let disposable = vscode.commands.registerCommand('phpdoc-generator.generatePHPDoc', () => {
        vscode.window.activeTextEditor.edit((editBuilder) => {
            const activeTextEditor = vscode.window.activeTextEditor;
            const selection = activeTextEditor.selection;

            let posStart = new vscode.Position(selection.start.line, 0);
            let posEnd = new vscode.Position(selection.start.line + 1, 0);
            let lineContent = activeTextEditor.document.getText(new vscode.Range(posStart, posEnd));

            matches = lineContent.match(regex.class());
            if (matches != null) {
                editBuilder.insert(posStart, generateClassDocBlock(matches));
            }

            matches = lineContent.match(regex.method());
            if (matches != null) {
                editBuilder.insert(posStart, generateMethodDocBlock(matches));
            }

            matches = lineContent.match(regex.property());
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

exports.deactivate = () => {

};
