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
const nodejs_commonjs_1 = require("@pnp/nodejs-commonjs");
const sp_commonjs_1 = require("@pnp/sp-commonjs");
const got_1 = __importDefault(require("got"));
const inquirer_1 = __importDefault(require("inquirer"));
const log_1 = require("../../utils/log");
const questions_1 = __importDefault(require("./questions"));
const SPPKG_GITHUB_URL = ({ githubToken }) => `https://${githubToken}@raw.githubusercontent.com/puzzlepart/did-spfx/main/sharepoint/solution/did-spfx.sppkg`;
const CONFIG_LIST_NAME = 'did_spfx_configuration';
/**
 * Set up SPFetchClient
 *
 * @param input Input (siteUrl, clientId, clientSecret)
 *
 * @returns void
 */
const setup = (input) => sp_commonjs_1.sp.setup({
    sp: {
        fetchClientFactory: () => {
            return new nodejs_commonjs_1.SPFetchClient(input.siteUrl, input.clientId, input.clientSecret);
        }
    }
});
function action(args) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            log_1.printSeparator('spfx install', true, log_1.cyan);
            const input = Object.assign(Object.assign({}, args), (yield inquirer_1.default.prompt(questions_1.default(args))));
            setup(input);
            const response = yield got_1.default(SPPKG_GITHUB_URL(input), {
                headers: { 'Accept': '*/*' }
            });
            const buffer = Buffer.from(response.rawBody);
            const appCatalogWeb = yield sp_commonjs_1.sp.getTenantAppCatalogWeb();
            log_1.printSeparator(`Ensuring list ${CONFIG_LIST_NAME}`);
            const { list, created } = yield appCatalogWeb.lists.ensure(CONFIG_LIST_NAME, '', 100, false, {
                Hidden: true
            });
            if (created) {
                yield Promise.all([
                    list.fields.getByInternalNameOrTitle('Title').update({ Title: 'Key' }),
                    list.fields.addMultilineText('Value', undefined)
                ]);
                yield list.items.add({
                    Title: 'API_KEY',
                    Value: input.didApiKey
                });
                log_1.printSeparator(`List ${CONFIG_LIST_NAME} created`);
            }
            else {
                log_1.printSeparator(`List ${CONFIG_LIST_NAME} already created`);
            }
            const { data } = yield appCatalogWeb.getAppCatalog(appCatalogWeb).add('did-spfx.sppkg', buffer, true);
            const [app] = yield appCatalogWeb.getAppCatalog(appCatalogWeb).filter(`Title eq '${data.Title}'`).select('ID', 'AppCatalogVersion').get();
            yield appCatalogWeb.getAppCatalog(appCatalogWeb).getAppById(app.ID).deploy(true);
            log_1.printSeparator(`Successfully deployed version ${app.AppCatalogVersion}.`, true, log_1.green);
        }
        catch (error) {
            log_1.printSeparator(`Failed to install SPFx: ${error.message}`, true, log_1.yellow);
        }
        finally {
            process.exit(0);
        }
    });
}
exports.action = action;
