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
const underscore_1 = __importDefault(require("underscore"));
const chalk_1 = __importDefault(require("chalk"));
const _config_json_1 = __importDefault(require("./_config.json"));
const client_1 = require("../../mongo/client");
const yellow = chalk_1.default['yellow'];
const green = chalk_1.default['green'];
const log = console.log;
const add_subscription = () => __awaiter(void 0, void 0, void 0, function* () {
    if (process.env['INIT'] !== '1') {
        log(yellow.underline('You need to run did init.'));
        process.exit(0);
    }
    try {
        log('--------------------------------------------------------');
        log('[did-cli] subscription add');
        log('--------------------------------------------------------');
        const { name, tenantId, forecasting, owner } = yield inquirer_1.default.prompt(require('./_prompts.json'));
        const { client, db } = yield client_1.getClient();
        const dbName = underscore_1.default.last(tenantId.split('-'));
        const sub = {
            _id: tenantId,
            name,
            db: dbName,
            settings: {
                forecast: {
                    enabled: forecasting
                }
            }
        };
        yield db.collection('subscriptions').insertOne(sub);
        for (let i = 0; i < _config_json_1.default.collections.length; i++) {
            const coll = _config_json_1.default.collections[i];
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
        yield client
            .db(dbName)
            .collection('users')
            .insertOne(Object.assign(Object.assign({}, owner), { displayName: `${owner.givenName} ${owner.surname}`, role: 'Owner' }));
        log('[did-cli]', green(`Subscription succesfully created with db ${dbName}.`));
        yield client.close(true);
    }
    catch (error) {
        log('[did-cli]', yellow.underline('Failed to create subscription.'));
    }
    process.exit(0);
});
module.exports = add_subscription;
