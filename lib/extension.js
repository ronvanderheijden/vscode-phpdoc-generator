const vscode = require('vscode');
const codeParser = require('./codeParser');

/**
 * Handles the generation of a description for properties, methods,
 * classes from the current line.
 */
function handleGenerationFromLine() {
    const parser = new codeParser(vscode.window.activeTextEditor);

    vscode.window.activeTextEditor.edit(editBuilder => { parser.parse(editBuilder); }, {
        undoStopBefore: true,
        undoStopAfter: true
    });
}

/**
 * @param {vscode.ExtensionContext} context
 */
exports.activate = (context) => {
    const disposable = vscode.commands.registerCommand('phpdoc-generator.generatePHPDoc', handleGenerationFromLine);

    context.subscriptions.push(disposable);
};

exports.deactivate = () => {};
