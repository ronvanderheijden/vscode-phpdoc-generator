"use strict";

const vscode = require("vscode");

class Config {
    static get _config() {
        return vscode.workspace.getConfiguration();
    }
    static get(key) {
        return this._config.has(`phpdoc-generator.${key}`) ? this._config.get(`phpdoc-generator.${key}`) : null;
    }
};

module.exports = Config;
