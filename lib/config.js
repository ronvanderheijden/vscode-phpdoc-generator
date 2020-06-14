"use strict";

const vscode = require("vscode");

class Config {
    /**
     * Returns configuration of the workspace.
     *
     * @return {object}
     */
    static get _config() {
        return vscode.workspace.getConfiguration();
    }

    /**
     * Returns a value of the property.
     *
     * @param  {string} key
     * @return {mixed}
     */
    static get(key) {
        return this._config.has(`phpdoc-generator.${key}`) ? this._config.get(`phpdoc-generator.${key}`) : null;
    }
};

module.exports = Config;
