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
const boxen_1 = __importDefault(require("boxen"));
const inquirer_1 = __importDefault(require("inquirer"));
const path_1 = __importDefault(require("path"));
const underscore_1 = require("underscore");
const client_1 = require("./mongo/client");
const package_json_1 = __importDefault(require("./package.json"));
const utils_1 = require("./utils");
const log_1 = require("./utils/log");
function getDbNameFromConnectionString(connectionString) {
    return connectionString.split('@')[0].split('mongodb://')[1];
}
function action(args) {
    return __awaiter(this, void 0, void 0, function* () {
        log_1.log(boxen_1.default(`${package_json_1.default.name} v${package_json_1.default.version}`, {
            padding: 1,
            borderStyle: 'double'
        }));
        const env = yield inquirer_1.default.prompt([
            {
                type: 'input',
                name: 'MONGO_DB_CONNECTION_STRING',
                message: 'Mongo DB connection string',
                default: 'mongodb://',
                when: !args.MONGO_DB_CONNECTION_STRING
            },
            {
                type: 'list',
                name: 'MONGO_DB_DB_NAME',
                message: 'Mongo DB database',
                default: 'main',
                choices: ({ MONGO_DB_CONNECTION_STRING }) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const { client } = yield client_1.getClient(MONGO_DB_CONNECTION_STRING || args.MONGO_DB_CONNECTION_STRING);
                        const { databases } = yield client.db().admin().listDatabases();
                        yield client.close(true);
                        return databases.map(db => db.name);
                    }
                    catch (error) {
                        log_1.printSeparator(error.message, false, log_1.yellow);
                        process.exit(0);
                    }
                }),
                when: !args.MONGO_DB_DB_NAME
            },
            {
                type: 'confirm',
                name: 'DID_INSTALLED_LOCALLY',
                message: 'Do you have did installed locally?',
                when: !args.DID_LOCAL_PATH
            },
            {
                type: 'file-tree-selection',
                name: 'DID_LOCAL_PATH',
                message: '...where is did installed?',
                when: ({ DID_INSTALLED_LOCALLY }) => DID_INSTALLED_LOCALLY && !args.DID_LOCAL_PATH,
                dirOnly: true,
            }
        ]);
        yield utils_1.writeFileAsync(path_1.default.resolve(__dirname, '.env'), utils_1.jsonToEnv(underscore_1.omit(Object.assign(Object.assign(Object.assign({}, args), env), { INIT: '1' }), 'DID_INSTALLED_LOCALLY')));
        const instanceName = getDbNameFromConnectionString(env.MONGO_DB_CONNECTION_STRING);
        log_1.printSeparator(`did-cli sucessfully initialized with database ${instanceName}:${env.MONGO_DB_DB_NAME}`, true, log_1.green);
        process.exit(0);
    });
}
exports.action = action;
