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
const _config_json_1 = __importDefault(require("./_config.json"));
const _prompts_json_1 = __importDefault(require("./_prompts.json"));
function action() {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.env['INIT'] !== '1') {
            log_1.log(log_1.yellow.underline('You need to run did init.'));
            process.exit(0);
        }
        try {
            log_1.log('--------------------------------------------------------');
            log_1.log('[did-cli] subscription add');
            log_1.log('--------------------------------------------------------');
            const { name, tenantId, forecasting, owner } = yield inquirer_1.default.prompt(_prompts_json_1.default);
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
            log_1.log('[did-cli]', log_1.green(`Subscription succesfully created with db ${dbName}.`));
            yield client.close(true);
        }
        catch (error) {
            console.log(error);
            log_1.log('[did-cli]', log_1.yellow.underline('Failed to create subscription.'));
        }
        process.exit(0);
    });
}
exports.action = action;
