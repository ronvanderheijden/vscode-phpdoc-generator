const vscode = require('vscode');
const config = require('./config');
const regex = require('./regex');
const indentation = require('./indentation');
const classDoc = require('./classDoc');
const methodDoc = require('./methodDoc');
const propertyDoc = require('./propertyDoc');
const formatTypeConverter = require('./formatTypeConverter');

function generateClassDocBlock(matches) {
    let docBlock = '/**\r\n';
    docBlock += ` * [Description ${classDoc.getName(matches)}]\r\n`;
    docBlock += ` */\r\n`;

    return docBlock;
}

function generatePropertyDocBlock(matches) {
    /** @var {string} type */
    let type = propertyDoc.getType(matches).trim();

    if (! config.get('shortType')) {        
        const converter = new formatTypeConverter(config.get('comparisonOfShortTypes'));
        type = converter.convertType(type);
    }

    let indent = indentation.get(matches);
    let docBlock = indent + '/**\r\n';

    if (config.get('useNamesInTop')) {
        docBlock += indent + ` * ${propertyDoc.getName(matches)}\r\n`;
        docBlock += indent + ` *\r\n`;
    }

    docBlock += indent + ` * @var ${type}\r\n`;
    docBlock += indent + ` */\r\n`;

    return docBlock;
}

function generateMethodDocBlock(matches) {  
    /** @var {boolean} shortType */  
    const shortType = config.get('shortType');

    let indent = indentation.get(matches);
    let docBlock = indent + '/**\r\n';    

    if (config.get('useNamesInTop')) {
        docBlock += indent + ` * ${methodDoc.getName(matches)}\r\n`;
        docBlock += indent + ` *\r\n`;
    }

    if (methodDoc.hasParameters(matches)) {
        const converter = ! shortType
            ? new formatTypeConverter(config.get('comparisonOfShortTypes'))
            : null
        ;
        
        /** @var {object[]} parameters */
        const parameters = methodDoc.getParameters(matches);        

        /** @var {string[]} types */
        let types;

        for (let parameter of parameters) {
            types = ! shortType 
                ? converter.convertTypes(parameter.types)
                : parameter.types
            ;
            
            docBlock += indent + ` * @param ${types.join('|')} ${parameter.name}\r\n`;
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

            console.log('line',selection.start.line);
            

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

            // https://regex101.com/r/1z3dwL/3/
            // https://regex101.com/r/1z3dwL/4

            // multilineFunctionArguments.state = true ?? 
            // multilineFunctionArguments.maxLength = 20/30 max length of rows to read
            // multilineFunctionArguments.minStartFrom = 0 // min start from <number> above the cursor
            // multilineFunctionArguments.maxStartFrom = 1 // max start from <number> below the cursor
            matches = lineContent.match(regex.startMethod());
            console.log('fun', matches);

            const numberAllowedLines = 20;
            
            if (matches != null) {
                console.log('yes');
                posEnd = new vscode.Position(selection.start.line + numberAllowedLines, 0);
                // TODO Позиция или конец файла
                lineContent = activeTextEditor.document.getText(new vscode.Range(posStart, posEnd));
                console.log('content', lineContent);
                

                matches = lineContent.match(regex.multilineNameOfMethod());
                // 0 - full 
                // 1 - name 
                // 2 - args 
                // 3 - return
                console.log('multiline fun', matches);

                // TODO Cut all function
            }

        }, {
            undoStopBefore: true,
            undoStopAfter: true
        });
    });
    context.subscriptions.push(disposable);
};

exports.deactivate = () => {};
