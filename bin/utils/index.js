"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envToArgs = exports.envToJson = exports.jsonToEnv = exports.execAsync = exports.readFileAsync = exports.writeFileAsync = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
const child_process_1 = require("child_process");
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
    return __awaiter(this, void 0, void 0, function* () {
        const content = (yield exports.readFileAsync(path_1.default.resolve(__dirname, '../.env'))).toString().split('\n');
        return content.reduce((obj, str) => {
            const [key, value] = str.split('=');
            return Object.assign(Object.assign({}, obj), { [key]: value });
        }, {});
    });
}
exports.envToJson = envToJson;
/**
 * Converts .env to arguments string
 */
function envToArgs() {
    return __awaiter(this, void 0, void 0, function* () {
        const content = (yield exports.readFileAsync(path_1.default.resolve(__dirname, '../.env'))).toString().split('\n');
        return content.reduce((str_, str) => {
            const [key, value] = str.split('=');
            return str_ + ` --${key}=${value}`;
        }, '');
    });
}
exports.envToArgs = envToArgs;
