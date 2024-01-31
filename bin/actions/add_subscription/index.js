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
const underscore_1 = __importDefault(require("underscore"));
const client_1 = require("../../mongo/client");
const log_1 = require("../../utils/log");
const questions_1 = __importDefault(require("./questions"));
const subscription_setup_config_json_1 = __importDefault(require("./subscription_setup_config.json"));
function action(args) {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.env['INIT'] !== '1') {
            log_1.log(log_1.yellow.underline('You need to run did init.'));
            process.exit(0);
        }
        try {
            log_1.printSeparator('subscription add', true, log_1.cyan);
            const { client, db } = yield client_1.getClient();
            const [subscriptions] = yield db.listCollections({ name: 'subscriptions' }).toArray();
            if (!subscriptions) {
                log_1.printSeparator(`Subscriptions collection not found. Are you connected to the correct database?`, true, log_1.yellow);
                process.exit(0);
            }
            const input = yield inquirer_1.default.prompt(questions_1.default(args));
            let { name, tenantId, forecasting, owner, dbName } = Object.assign(Object.assign({}, args), input);
            dbName = dbName !== null && dbName !== void 0 ? dbName : underscore_1.default.last(tenantId.split('-'));
            const sub = {
                _id: tenantId,
                name,
                db: dbName,
                owner,
                settings: {
                    forecast: {
                        enabled: forecasting,
                        notifications: 4
                    },
                    adsync: {
                        enabled: true,
                        properties: [
                            "displayName",
                            "preferredLanguage",
                            "mobilePhone",
                            "surname",
                            "givenName"
                        ]
                    }
                },
            };
            yield db.collection('subscriptions').insertOne(sub);
            for (let i = 0; i < subscription_setup_config_json_1.default.collections.length; i++) {
                const coll = subscription_setup_config_json_1.default.collections[i];
                yield client.db(dbName).createCollection(coll.name);
                if (coll.indexes) {
                    for (let j = 0; j < coll.indexes.length; j++) {
                        yield client
                            .db(dbName)
                            .collection(coll.name)
                            .createIndex(coll.indexes[j]);
                    }
                }
                if (coll.documents) {
                    yield client.db(dbName).collection(coll.name).insertMany(coll.documents);
                }
            }
            log_1.printSeparator(`Subscription succesfully created with db ${dbName}.`, true, log_1.green);
            yield client.close(true);
        }
        catch (error) {
            log_1.printSeparator(`Failed to create subscription.: ${error.message}`, true, log_1.yellow);
        }
        process.exit(0);
    });
}
exports.action = action;
