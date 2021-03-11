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
require('dotenv').config();
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const underscore_string_1 = __importDefault(require("underscore.string"));
const client_1 = require("../../mongo/client");
const v2_1 = __importDefault(require("csvtojson/v2"));
const yellow = chalk_1.default['yellow'];
const green = chalk_1.default['green'];
const log = console.log;
const import_csv = ({ path }) => __awaiter(void 0, void 0, void 0, function* () {
    let path_ = path;
    if (!path) {
        const prompt = yield inquirer_1.default.prompt({
            type: 'file-tree-selection',
            name: 'path',
            message: 'Select a CSV file'
        });
        path_ = prompt.path;
    }
    if (!underscore_string_1.default.endsWith(path_, '.csv')) {
        log('[did-cli]', yellow.underline('The file needs to be a CSV file.'));
        process.exit(0);
    }
    if (process.env["INIT"] !== '1') {
        log('[did-cli]', yellow.underline('You need to run did init.'));
        process.exit(0);
    }
    try {
        log('--------------------------------------------------------');
        log('[did-cli] import csv');
        log('--------------------------------------------------------');
        const json = yield v2_1.default().fromFile(path_);
        const { collectionName, importCount } = yield inquirer_1.default.prompt(require('./_prompts.json'));
        log('--------------------------------------------------------');
        log('Property mappings');
        log('--------------------------------------------------------');
        const count = importCount === 'all' ? json.length : parseInt(importCount);
        const fields = Object.keys(json[0]).filter((f) => f.indexOf('@type') === -1);
        const fieldMap = yield inquirer_1.default.prompt(require(`./prompts/${collectionName}`)(fields));
        const documents = json
            .splice(0, count)
            .map(require(`./map/${collectionName}`)(fieldMap));
        const { db, client } = yield client_1.getClient();
        yield db.collection(collectionName).insertMany(documents);
        log('[did-cli]', green(`Succesfully imported ${documents.length} documents to collection ${collectionName}.`));
        yield client.close(true);
    }
    catch (error) {
        log('[did-cli]', yellow.underline(`Failed to import from CSV: ${error.message}`));
    }
    process.exit(0);
});
module.exports = import_csv;
