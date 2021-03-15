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
const underscore_1 = require("underscore");
const client_1 = require("../../mongo/client");
const log_1 = require("../../utils/log");
const questions_1 = __importDefault(require("./questions"));
function action() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            log_1.printSeparator('subscription remove', true, log_1.cyan);
            const { client, db } = yield client_1.getClient();
            const collection = db.collection('subscriptions');
            const subscriptions = yield collection.find({}).toArray();
            const input = yield inquirer_1.default.prompt(questions_1.default(subscriptions));
            if (input.confirm) {
                const subscription = underscore_1.find(subscriptions, (s) => s._id === input.subscriptionId);
                yield collection.deleteOne({ _id: subscription._id });
                if (input.dropDatabase) {
                    yield client.db(subscription.db).dropDatabase();
                }
                log_1.printSeparator('Subscription succesfully deleted.', true, log_1.green);
            }
            yield client.close();
        }
        catch (error) {
            log_1.printSeparator(`Failed to delete subscription: ${error.message}`, true, log_1.yellow);
        }
        process.exit(0);
    });
}
exports.action = action;
