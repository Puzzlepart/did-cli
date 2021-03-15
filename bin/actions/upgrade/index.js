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
const package_json_1 = __importDefault(require("../../package.json"));
const utils_1 = require("../../utils");
const log_1 = require("../../utils/log");
/**
 * Upgrade
 *
 * @description Upgrade did-cli
 */
function action({ branch, reset }) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        log_1.printSeparator('Upgrading did-cli', true, log_1.cyan);
        let url = (_a = package_json_1.default === null || package_json_1.default === void 0 ? void 0 : package_json_1.default.repository) === null || _a === void 0 ? void 0 : _a.url;
        if (branch) {
            url += `#${branch}`;
        }
        log_1.printSeparator(`Upgrading ${log_1.cyan('did-cli')} from ${url}`);
        const envArgs = yield utils_1.envToArgs();
        try {
            yield utils_1.execAsync(`npm i -g "${url}"`);
            if (!reset)
                yield utils_1.execAsync(`did-cli init ${envArgs}`);
            const { stdout } = yield utils_1.execAsync(`did-cli --version`);
            log_1.printSeparator(`Successfully upgraded ${log_1.cyan('did-cli')} to version ${stdout.trim()}`, true, log_1.green);
        }
        catch (error) {
            log_1.printSeparator(`Failed to upgrade ${log_1.cyan('did-cli')}: ${error.message}`, true, log_1.yellow);
        }
        finally {
            process.exit(0);
        }
    });
}
exports.action = action;
