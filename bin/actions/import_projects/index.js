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
/**
 * project add
 *
 * @description Adds a new project to Did. You will be prompted for all neccessary information.
 *
 * @param args - Args
 */
function action(args) {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.env['INIT'] !== '1') {
            log_1.log(log_1.yellow.underline('You need to run did init.'));
            process.exit(0);
        }
        try {
            log_1.printSeparator('project add', true, log_1.cyan);
            const { client, db } = yield client_1.getClient();
            const customers = yield db.collection('customers').find({}).toArray();
            const input = yield inquirer_1.default.prompt(questions_1.default(args, customers));
            const { customerKey, key, name, description, icon } = Object.assign(Object.assign({}, args), input);
            const customerKey_ = createValidKey(customerKey);
            const key_ = createValidKey(key);
            const _id = [customerKey_, key_].join(' ');
            yield db.collection('projects').insertOne({
                _id,
                key: key_,
                tag: _id,
                customerKey: customerKey_,
                name,
                description,
                icon,
                webLink: null,
                externalSystemURL: null,
                inactive: false,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            log_1.printSeparator(`Project ${_id} succesfully created`, true, log_1.green);
            yield client.close(true);
        }
        catch (error) {
            log_1.printSeparator(`Failed to create project: ${error.message}`, true, log_1.yellow);
        }
        finally {
            process.exit(0);
        }
    });
}
exports.action = action;
