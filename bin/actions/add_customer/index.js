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
exports.action = action;
require('dotenv').config();
const inquirer_1 = __importDefault(require("inquirer"));
const client_1 = require("../../mongo/client");
const log_1 = require("../../utils/log");
const questions_1 = __importDefault(require("./questions"));
/**
 * Removes special characters and capitalizes the key
 *
 * @param key - Key
 * @param maxLen - Max length
 *
 * @returns Valid key
 */
function createValidKey(key, maxLen = 12) {
    return key.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, maxLen);
}
function action(args) {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.env['INIT'] !== '1') {
            (0, log_1.log)(log_1.yellow.underline('You need to run did init.'));
            process.exit(0);
        }
        try {
            (0, log_1.printSeparator)('customer add', true, log_1.cyan);
            const input = yield inquirer_1.default.prompt((0, questions_1.default)(args));
            const { client, db } = yield (0, client_1.getClient)();
            const { key, name, description, icon } = Object.assign(Object.assign({}, args), input);
            const key_ = createValidKey(key);
            yield db.collection('customers').insertOne({
                _id: key_,
                key: key_,
                description,
                icon,
                name,
                webLink: null,
                externalSystemURL: null,
                inactive: false,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            (0, log_1.printSeparator)('Customer succesfully created', true, log_1.green);
            yield client.close(true);
        }
        catch (error) {
            (0, log_1.printSeparator)(`Failed to create customer: ${error.message}`, true, log_1.yellow);
        }
        finally {
            process.exit(0);
        }
    });
}
