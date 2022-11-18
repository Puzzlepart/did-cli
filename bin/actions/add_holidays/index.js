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
const source_1 = __importDefault(require("got/dist/source"));
const inquirer_1 = __importDefault(require("inquirer"));
const client_1 = require("../../mongo/client");
const log_1 = require("../../utils/log");
const questions_1 = __importDefault(require("./questions"));
/**
 * Add holidays
 *
 * @description Add holidays to storage from `https://webapi.no/api/v1/holidays/{year}`
 *
 * @remarks A CLI action file must return a function named action
 *
 * @param args - Args
 */
function action(args) {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.env['INIT'] !== '1') {
            log_1.log(log_1.yellow.underline('You need to run did init.'));
            process.exit(0);
        }
        log_1.printSeparator('holidays add', true, log_1.cyan);
        const { client, db } = yield client_1.getClient();
        const [holidaysCollection] = yield db.listCollections({ name: 'holidays' }).toArray();
        if (!holidaysCollection) {
            log_1.printSeparator(`Holidays collection not found. Are you connected to the correct database?`, true, log_1.yellow);
            process.exit(0);
        }
        const input = yield inquirer_1.default.prompt(questions_1.default(args));
        let { year } = Object.assign(Object.assign({}, args), input);
        const { body } = yield source_1.default(`https://webapi.no/api/v1/holidays/${year}`);
        const docs = JSON.parse(body).data.map((item) => ({
            _id: item.date.replace(/[\W]/gm, ''),
            name: item.description,
            date: new Date(item.date)
        }));
        yield db.collection('holidays').insertMany(docs);
        log_1.printSeparator(`${docs.length} holidays for year ${year} succesfully created in db holidays.`, true, log_1.green);
        yield client.close(true);
    });
}
exports.action = action;
