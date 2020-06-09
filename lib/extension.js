const vscode = require('vscode');
const codeParser = require('./codeParser');
const docBlockGenerator = require('./docBlockGenerator');

/**
 * Handles the generation of a description for properties, methods,
 * classes from the current line.
 */
function handleGenerationFromLine() {
    const parser = new codeParser(vscode.window.activeTextEditor);

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
        case 'class':
            editBuilder.insert(position, docBlockGenerator.generateClassDocBlock(doc));
            break;

        case 'property':
            editBuilder.insert(position, docBlockGenerator.generatePropertyDocBlock(doc));
            break;

        case 'method':
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
