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
const log_1 = require("../../utils/log");
const client_1 = require("../../mongo/client");
const _prompts_1 = __importDefault(require("./_prompts"));
function action(args) {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.env['INIT'] !== '1') {
            log_1.log(log_1.yellow.underline('You need to run did init.'));
            process.exit(0);
        }
        try {
            log_1.log('--------------------------------------------------------');
            log_1.log('[did-cli] customer add');
            log_1.log('--------------------------------------------------------');
            const input = yield inquirer_1.default.prompt(_prompts_1.default(args));
            const { key, name, description, icon } = Object.assign(Object.assign({}, args), input);
            const { client, db } = yield client_1.getClient();
            yield db.collection('customers').insertOne({
                _id: key,
                key,
                description,
                icon,
                inactive: false,
                name,
                webLink: null,
                externalSystemURL: null
            });
            log_1.log('[did-cli]', log_1.green('Customer succesfully created.'));
            yield client.close(true);
        }
        catch (error) {
            console.log(error);
            log_1.log('[did-cli]', log_1.yellow.underline('Failed to create customer.'));
        }
        process.exit(0);
    });
}
exports.action = action;
