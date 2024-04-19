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
Object.defineProperty(exports, "__esModule", { value: true });
exports.action = void 0;
const log_1 = require("./utils/log");
const getDbNameFromConnectionString_1 = require("./utils/getDbNameFromConnectionString");
require('dotenv').config();
function action(args) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!args.MONGO_DB_CONNECTION_STRING) {
            log_1.printSeparator('Mongo DB connection string is not provided', true, log_1.yellow);
            process.exit(0);
        }
        if (!args.MONGO_DB_DB_NAME) {
            log_1.printSeparator('Mongo DB database is not provided', true, log_1.yellow);
            process.exit(0);
        }
        const instance = getDbNameFromConnectionString_1.getDbNameFromConnectionString(args.MONGO_DB_CONNECTION_STRING);
        log_1.printSeparator(`did-cli is initialized with ${instance}:${args.MONGO_DB_DB_NAME}`, true, log_1.cyan);
        process.exit(0);
    });
}
exports.action = action;
