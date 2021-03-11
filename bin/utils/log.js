"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.red = exports.cyan = exports.blue = exports.green = exports.yellow = exports.log = void 0;
const chalk_1 = __importDefault(require("chalk"));
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
