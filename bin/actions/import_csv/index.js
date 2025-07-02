"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const csvtojson_1 = __importDefault(require("csvtojson"));
const inquirer_1 = __importDefault(require("inquirer"));
const underscore_1 = require("underscore");
const underscore_string_1 = __importDefault(require("underscore.string"));
const client_1 = require("../../mongo/client");
const log_1 = require("../../utils/log");
const mapFunctions = __importStar(require("./mapFunctions"));
const fieldMapPrompts = __importStar(require("./fieldMapPrompts"));
const questions_json_1 = __importDefault(require("./questions.json"));
function action(args) {
    return __awaiter(this, void 0, void 0, function* () {
        let path = args.path;
        if (!path) {
            const prompt = yield inquirer_1.default.prompt({
                type: 'file-tree-selection',
                name: 'path',
                message: 'Select a CSV file'
            });
            path = prompt.path;
        }
        if (!underscore_string_1.default.endsWith(path, '.csv')) {
            (0, log_1.log)('[did-cli]', log_1.yellow.underline('The file needs to be a CSV file.'));
            process.exit(0);
        }
        if (process.env['INIT'] !== '1') {
            (0, log_1.log)('[did-cli]', log_1.yellow.underline('You need to run did init.'));
            process.exit(0);
        }
        try {
            (0, log_1.printSeparator)('import csv', true, log_1.cyan);
            const json = yield (0, csvtojson_1.default)().fromFile(path);
            (0, log_1.printSeparator)(`${json.length} items found in CSV file`);
            const { collectionName, importCount } = yield inquirer_1.default.prompt(questions_json_1.default);
            (0, log_1.printSeparator)('Property mappings');
            const count = importCount === 'all' ? json.length : parseInt(importCount);
            const fields = Object.keys(json[0]).filter((f) => f.indexOf('@type') === -1);
            let fieldMap = yield inquirer_1.default.prompt(fieldMapPrompts[collectionName](fields, args));
            fieldMap = Object.assign(Object.assign({}, (0, underscore_1.omit)(args, 'path')), fieldMap);
            const { db, client } = yield (0, client_1.getClient)();
            let data = {};
            switch (collectionName) {
                case 'confirmed_periods': {
                    (0, log_1.printSeparator)(`Retrieving time entries from collection [time_entries]`);
                    data.time_entries = yield db.collection('time_entries').find({}).toArray();
                    (0, log_1.printSeparator)(`${data.time_entries.length} time entries retrieved from [time_entries]`);
                }
            }
            const documents = json
                .splice(0, count)
                .map(mapFunctions[collectionName](fieldMap, data));
            (0, log_1.printSeparator)(`Importing ${documents.length} items to collection [${collectionName}]`);
            yield db.collection(collectionName).insertMany(documents);
            (0, log_1.printSeparator)(`Succesfully imported ${documents.length} documents to collection [${collectionName}].`, true, log_1.green);
            yield client.close(true);
        }
        catch (error) {
            (0, log_1.printSeparator)(`Failed to import from CSV: ${error.message}`, true, log_1.yellow);
        }
        finally {
            process.exit(0);
        }
    });
}
