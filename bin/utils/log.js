"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.printSeparator = exports.red = exports.cyan = exports.blue = exports.green = exports.yellow = exports.log = void 0;
const chalk_1 = __importDefault(require("chalk"));
const package_json_1 = __importDefault(require("../package.json"));
const log = console.log;
exports.log = log;
const yellow = chalk_1.default['yellow'];
exports.yellow = yellow;
const green = chalk_1.default['green'];
exports.green = green;
const blue = chalk_1.default['blue'];
exports.blue = blue;
const cyan = chalk_1.default['cyan'];
exports.cyan = cyan;
const red = chalk_1.default['red'];
exports.red = red;
const white = chalk_1.default['white'];
/**
 * Print separator using console.log
 *
 * @param text - Text
 * @param includePrefix - Include prefix
 * @param color - Color
 */
function printSeparator(text, includePrefix = false, color = white) {
    const prefix = includePrefix ? `[${package_json_1.default.name}] ` : '';
    log('----------------------------------------------------------------------------------------------');
    log(color(`   ${prefix}${text}                                                               `));
    log('----------------------------------------------------------------------------------------------');
}
exports.printSeparator = printSeparator;
