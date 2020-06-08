const vscode = require('vscode');
const regex = require('./regex');
const docBlockGenerator = require('./docBlockGenerator');

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
                editBuilder.insert(posStart, docBlockGenerator.generateClassDocBlock(matches));
            }

            matches = lineContent.match(regex.METHOD_REGEX);
            if (matches != null) {
                editBuilder.insert(posStart, docBlockGenerator.generateMethodDocBlock(matches));
            }

            matches = lineContent.match(regex.PROPERTY_REGEX);
            if (matches != null) {
                editBuilder.insert(posStart, docBlockGenerator.generatePropertyDocBlock(matches));
            }
        }, {
            undoStopBefore: true,
            undoStopAfter: true
        });
    });
    context.subscriptions.push(disposable);
};

exports.deactivate = () => {};
