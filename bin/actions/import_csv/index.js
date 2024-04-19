"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const csvtojson_1 = __importDefault(require("csvtojson"));
const inquirer_1 = __importDefault(require("inquirer"));
const lodash = __importStar(require("lodash"));
const underscore_1 = require("underscore");
const underscore_string_1 = __importDefault(require("underscore.string"));
const client_1 = require("../../mongo/client");
const log_1 = require("../../utils/log");
const fieldMapPrompts = __importStar(require("./fieldMapPrompts"));
const mapFunctions = __importStar(require("./mapFunctions"));
const questions_json_1 = __importDefault(require("./questions.json"));
const fs_1 = __importDefault(require("fs"));
const util_1 = require("util");
const writeFileAsync = util_1.promisify(fs_1.default.writeFile);
function action(args) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let path = args.path;
        let delimiter = args.delimiter;
        if (!path) {
            const prompt = yield inquirer_1.default.prompt([
                {
                    type: 'file-tree-selection',
                    name: 'path',
                    message: 'Select a CSV file',
                    onlyShowValid: true,
                    validate: (input) => input.endsWith('.csv') ? true : 'The file needs to be a CSV file.',
                },
                {
                    type: 'input',
                    name: 'delimiter',
                    message: 'Delimiter',
                    default: ';'
                }
            ]);
            path = prompt.path;
            delimiter = prompt.delimiter;
        }
        if (process.env['INIT'] !== '1') {
            log_1.log('[did-cli]', log_1.yellow.underline('You need to run did init.'));
            process.exit(0);
        }
        if (!underscore_string_1.default.endsWith(path, '.csv')) {
            log_1.log('[did-cli]', log_1.yellow.underline('The file needs to be a CSV file.'));
            process.exit(0);
        }
        try {
            log_1.printSeparator('import csv', true, log_1.cyan);
            const json = yield csvtojson_1.default({ delimiter }).fromFile(path);
            log_1.printSeparator(`${json.length} items found in CSV file. We'll check for uniqueness, so don't worry about duplicates.`, true, log_1.green);
            let collectionName = args.collectionName;
            let importCount = (_a = args.importCount) !== null && _a !== void 0 ? _a : 'all';
            if (!args.collectionName) {
                const prompt = yield inquirer_1.default.prompt(questions_json_1.default);
                collectionName = prompt.collectionName;
                importCount = prompt.importCount;
            }
            log_1.printSeparator('Property mappings');
            const count = importCount === 'all' ? json.length : parseInt(importCount);
            const fields = Object.keys(json[0]).filter((f) => f.indexOf('@type') === -1);
            let fieldMap = yield inquirer_1.default.prompt(fieldMapPrompts[collectionName](fields, args));
            fieldMap = Object.assign(Object.assign({}, underscore_1.omit(args, 'path')), fieldMap);
            const { db, client } = yield client_1.getClient();
            let data = {};
            switch (collectionName) {
                case 'confirmed_periods':
                    {
                        log_1.printSeparator(`Retrieving time entries from collection [time_entries]`);
                        data.time_entries = yield db.collection('time_entries').find({}).toArray();
                        log_1.printSeparator(`${data.time_entries.length} time entries retrieved from [time_entries]`);
                    }
                    break;
                case 'customers':
                    {
                        log_1.printSeparator(`Retrieving customers from collection [customers]`);
                        data[collectionName] = yield db.collection(collectionName).find({}).toArray();
                        log_1.printSeparator(`${data.customers.length} customers retrieved from [customers]`);
                    }
                    break;
                case 'projects':
                    {
                        log_1.printSeparator(`Retrieving projects from collection [projects]`);
                        data[collectionName] = yield db.collection(collectionName).find({}).toArray();
                        log_1.printSeparator(`${data[collectionName].length} projects retrieved from [projects]`);
                    }
                    break;
            }
            const documents = lodash.uniqBy(json
                .splice(0, count)
                .map(mapFunctions[collectionName](fieldMap, data)), '_id')
                .filter(Boolean)
                .filter((d) => !lodash.some(data[collectionName], { _id: d._id }));
            if (args.output) {
                const fileName = args.includeTimestamp ? `${collectionName}-${new Date().getTime().toString()}.json` : `${collectionName}.json`;
                yield writeFileAsync(fileName, JSON.stringify(documents, null, 2));
                log_1.printSeparator(`Succesfully saved ${documents.length} documents to ${fileName}. Have a look at the file before importing.`, true, log_1.cyan);
            }
            const { confirm } = yield inquirer_1.default.prompt({
                type: 'confirm',
                name: 'confirm',
                message: `Do you want to import ${documents.length} items to collection [${collectionName}]?`
            });
            if (!confirm) {
                yield client.close(true);
                process.exit(0);
            }
            log_1.printSeparator(`Importing ${documents.length} items to collection [${collectionName}]`);
            yield db.collection(collectionName).insertMany(documents);
            log_1.printSeparator(`Succesfully imported ${documents.length} documents to collection [${collectionName}].`, true, log_1.green);
            yield client.close(true);
        }
        catch (error) {
            log_1.printSeparator(`Failed to import from CSV: ${error.message}`, true, log_1.red);
        }
        finally {
            process.exit(0);
        }
    });
}
exports.action = action;
