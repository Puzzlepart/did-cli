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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const underscore_1 = require("underscore");
const util_1 = require("util");
const writeFile = util_1.promisify(fs_1.default.writeFile);
const boxen_1 = __importDefault(require("boxen"));
const utils_1 = require("./utils");
const log = console.log;
const package_json_1 = __importDefault(require("./package.json"));
const client_1 = require("./mongo/client");
function action() {
    return __awaiter(this, void 0, void 0, function* () {
        log(boxen_1.default(`${package_json_1.default.name} v${package_json_1.default.version}`, {
            padding: 1,
            borderStyle: 'double'
        }));
        const env = yield inquirer_1.default.prompt([
            {
                type: 'input',
                name: 'MONGO_DB_CONNECTION_STRING',
                message: 'Mongo DB connection string',
                default: 'mongodb://'
            },
            {
                type: 'list',
                name: 'MONGO_DB_DB_NAME',
                message: 'Mongo DB database',
                default: 'main',
                choices: ({ MONGO_DB_CONNECTION_STRING }) => __awaiter(this, void 0, void 0, function* () {
                    const { client } = yield client_1.getClient(MONGO_DB_CONNECTION_STRING);
                    const { databases } = yield client.db().executeDbAdminCommand({ listDatabases: 1 });
                    yield client.close(true);
                    return databases.map(db => db.name);
                })
            },
            {
                type: 'confirm',
                name: 'DID_INSTALLED_LOCALLY',
                message: 'Do you have did installed locally?'
            },
            {
                type: 'file-tree-selection',
                name: 'DID_LOCAL_PATH',
                message: '...where is it?',
                when: ({ DID_INSTALLED_LOCALLY }) => DID_INSTALLED_LOCALLY,
                dirOnly: true
            }
        ]);
        yield writeFile(path_1.default.resolve(__dirname, '.env'), utils_1.jsonToEnv(underscore_1.omit(Object.assign(Object.assign({}, env), { INIT: '1' }), 'DID_INSTALLED_LOCALLY')));
        process.exit(0);
    });
}
exports.action = action;
