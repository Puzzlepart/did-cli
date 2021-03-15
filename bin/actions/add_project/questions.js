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
const got_1 = __importDefault(require("got"));
exports.default = (args, customers) => [
    {
        type: 'autocomplete',
        name: 'customerKey',
        message: 'Select customer',
        when: () => !args.customerKey,
        source: (_a, input) => __awaiter(void 0, void 0, void 0, function* () {
            return customers
                .filter((c) => c.name.toLowerCase().indexOf((input || '').toLowerCase()) !== -1)
                .map((c) => ({
                value: c.key,
                name: c.name
            }));
        }),
    },
    {
        type: 'input',
        name: 'name',
        message: 'What\'s the name of the project?',
        default: args.name,
        when: () => !args.name
    },
    {
        type: 'input',
        name: 'key',
        message: 'What\'s the shortname for the project?',
        default: args.key,
        when: () => !args.key
    },
    {
        type: 'input',
        name: 'description',
        message: 'Describe the project for me?',
        default: args.description,
        when: () => !args.description
    },
    {
        type: 'autocomplete',
        name: 'icon',
        message: 'Select an icon from Office UI Fabric',
        source: (_a, input) => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield got_1.default('https://raw.githubusercontent.com/OfficeDev/office-ui-fabric-core/master/src/data/icons.json', {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            const items = JSON.parse(response.body);
            return items
                .filter((f) => f.name.toLowerCase().indexOf((input || '').toLowerCase()) !== -1)
                .map((f) => f.name);
        }),
        default: args.icon,
        when: () => !args.icon
    }
];
