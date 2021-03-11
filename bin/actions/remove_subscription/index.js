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
const underscore_1 = require("underscore");
const chalk_1 = __importDefault(require("chalk"));
const log = console.log;
const client_1 = require("../../mongo/client");
const remove_subscription = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        log('--------------------------------------------------------');
        log('[did-cli] subscription remove');
        log('--------------------------------------------------------');
        const { client, db } = yield client_1.getClient();
        const collection = db.collection('subscriptions');
        const subscriptions = yield collection.find({}).toArray();
        const input = yield inquirer_1.default.prompt(require('./_prompts.js')(subscriptions));
        if (input.confirm) {
            const subscription = underscore_1.find(subscriptions, (s) => s._id === input.subscriptionId);
            yield collection.deleteOne({ _id: subscription._id });
            if (input.dropDatabase) {
                yield client.db(subscription.db).dropDatabase();
            }
            log('[did-cli]', chalk_1.default.green(`Subscription succesfully deleted.`));
        }
        yield client.close();
    }
    catch (error) {
        log('[did-cli]', chalk_1.default.yellow.underline('Failed to delete subscription.'));
    }
    process.exit(0);
});
module.exports = remove_subscription;
