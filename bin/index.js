#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config({ path: __dirname + '/' + '.env' });
const inquirer_1 = __importDefault(require("inquirer"));
const underscore_1 = require("underscore");
const yargs_1 = __importDefault(require("yargs"));
const actions_map_json_1 = __importDefault(require("./actions.map.json"));
const package_json_1 = __importDefault(require("./package.json"));
const log_1 = require("./utils/log");
inquirer_1.default.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));
inquirer_1.default.registerPrompt('file-tree-selection', require('inquirer-file-tree-selection-prompt'));
const prefix = `${log_1.cyan('did')}`;
const actions = package_json_1.default.config.actions || {};
const usage = Object.keys(actions)
    .map((k) => {
    return `${prefix} ${log_1.yellow(k)}\n\t${actions[k]}`;
})
    .join('\n');
const args = yargs_1.default
    .usage(`Usage: ${prefix} <action_name>\n\nAvailable actions:\n\n${usage}`)
    .option('path', {
    alias: 'path',
    describe: 'Path to file',
    type: 'string',
    demandOption: false
}).argv;
const action = args._.join('.');
if (actions_map_json_1.default[action]) {
    require(actions_map_json_1.default[action]).action(underscore_1.omit(args, '$0', '_'));
}
else {
    log_1.log('[did-cli]', log_1.red.bold(`Unknown action ${args._.join(' ')}.`));
}
