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
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const child_process_1 = require("child_process");
const log_1 = require("../../utils/log");
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.env.DID_LOCAL_PATH) {
        log_1.log('[did-cli]', log_1.yellow.underline("You don't have did installed locally."));
        process.exit(0);
    }
    child_process_1.exec(`code ${process.env.DID_LOCAL_PATH}`, () => {
        //
    });
});
