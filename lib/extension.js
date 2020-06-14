const vscode = require('vscode');
const codeParser = require('./codeParser');
const CodeParser = codeParser.CodeParser;
const CLASS_TYPE = codeParser.CLASS_TYPE;
const PROPERTY_TYPE = codeParser.PROPERTY_TYPE;
const METHOD_TYPE = codeParser.METHOD_TYPE;
const CONSTANT_TYPE = codeParser.CONSTANT_TYPE;
const docBlockGenerator = require('./docBlockGenerator');

/**
 * Handles the generation of a description for properties, methods,
 * classes from the current line.
 */
function handleGenerationFromLine() {
    const parser = new CodeParser(vscode.window.activeTextEditor);

    vscode.window.activeTextEditor.edit(editBuilder => {
        if (parser.parse()) {
            insertDocBlock(
                editBuilder,
                parser.getDocType(),
                parser.getInstanceOfDocEntity(),
                parser.getStartPosition()
            );
        }
    }, {
        undoStopBefore: true,
        undoStopAfter: true
    });
}

function insertDocBlock(editBuilder, type, doc, position) {
    switch (type) {
        case CLASS_TYPE:
            editBuilder.insert(position, docBlockGenerator.generateClassDocBlock(doc));
            break;

        case CONSTANT_TYPE:
            editBuilder.insert(position, docBlockGenerator.generateConstantDocBlock(doc));
            break;

        case PROPERTY_TYPE:
            editBuilder.insert(position, docBlockGenerator.generatePropertyDocBlock(doc));
            break;

        case METHOD_TYPE:
            editBuilder.insert(position, docBlockGenerator.generateMethodDocBlock(doc));
            break;
    }
}

/**
 * @param {vscode.ExtensionContext} context
 */
exports.activate = (context) => {
    const disposable = vscode.commands.registerCommand('phpdoc-generator.generatePHPDoc', handleGenerationFromLine);

    context.subscriptions.push(disposable);
};

exports.deactivate = () => {};
