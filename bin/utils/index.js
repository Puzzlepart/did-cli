"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envToArgs = exports.envToJson = exports.jsonToEnv = exports.execAsync = exports.readFileAsync = exports.writeFileAsync = void 0;
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const underscore_1 = require("underscore");
const util_1 = require("util");
const package_json_1 = __importDefault(require("../package.json"));
exports.writeFileAsync = util_1.promisify(fs_1.default.writeFile);
exports.readFileAsync = util_1.promisify(fs_1.default.readFile);
exports.execAsync = util_1.promisify(child_process_1.exec);
/**
 * Converts JSON to .env
 *
 * @param json - JSON
 *
 * @returns String in .env format
 */
function jsonToEnv(json) {
    return Object.keys(json)
        .map((key) => `${key}=${json[key]}`)
        .join('\n');
}
exports.jsonToEnv = jsonToEnv;
/**
 * Converts .env to JSON
 */
function envToJson() {
    return underscore_1.pick(Object.assign({}, process.env), package_json_1.default.env);
}
exports.envToJson = envToJson;
/**
 * Converts .env to arguments string
 */
function envToArgs() {
    return package_json_1.default.env.reduce((str_, key) => {
        const value = process.env[key];
        return str_ + ` --${key}="${value}"`;
    }, '');
}
exports.envToArgs = envToArgs;
