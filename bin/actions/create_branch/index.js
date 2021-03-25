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
exports.action = void 0;
require('dotenv').config();
const inquirer_1 = __importDefault(require("inquirer"));
const utils_1 = require("../../utils");
const log_1 = require("../../utils/log");
const questions_1 = __importDefault(require("./questions"));
function removeShortWords(str) {
    return str.split(' ').filter(part => part.length > 3).join('-');
}
/**
 * Generate branch name
 *
 * @param issue - Issue details
 * @param branch_prefix - Branch prefix
 * @returns generated branch name
 */
function generateBranchName([id, name], branch_prefix) {
    return branch_prefix + [removeShortWords(name.replace(/[^a-zA-Z ]/g, "")), id].join('-').toLowerCase();
}
/**
 * Create branch
 *
 * @description Creates a branch for the specified issue
 *
 * @remarks A CLI action file must return a function named action
 *
 * @param args - Args
 */
function action() {
    return __awaiter(this, void 0, void 0, function* () {
        log_1.printSeparator('Create branch', true, log_1.cyan);
        try {
            let { stdout: issues_ } = yield utils_1.execAsync(`cd ${process.env.DID_LOCAL_PATH} && gh issue list`);
            const issues = issues_.split('\n').map(str => {
                return str.split(`\t`);
            });
            const input = yield inquirer_1.default.prompt(questions_1.default(issues));
            const branch_name = generateBranchName(input.issue, input.branch_prefix);
            const { stdout } = yield utils_1.execAsync(`cd ${process.env.DID_LOCAL_PATH} && git checkout -b ${branch_name}`);
            console.log(stdout);
            console.log(branch_name);
            log_1.printSeparator(`Succesfully created branch ${branch_name} for issue ${input.issue[0]}.`, true, log_1.green);
        }
        catch (error) {
            log_1.printSeparator(`Failed to create branch: ${error.message}`, true, log_1.yellow);
        }
        finally {
            process.exit(0);
        }
    });
}
exports.action = action;
