"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const underscore_1 = __importDefault(require("underscore"));
exports.default = (args) => [
    {
        type: "input",
        name: 'name',
        message: "What's the name of the company?",
        default: "Contoso",
        when: !args.name
    },
    {
        type: "input",
        name: "tenantId",
        message: "What's the tenant id?",
        default: "00000000-0000-0000-0000-000000000000",
    },
    {
        type: "input",
        name: "dbName",
        message: "What should the database name be?",
        default: ({ tenantId }) => underscore_1.default.last(tenantId.split('-')),
    },
    {
        type: "confirm",
        name: "forecasting",
        message: "Should forecasting be enabled?",
        default: false
    },
    {
        type: "input",
        name: "owner",
        message: "Email address of the subscription owner?",
        default: "owner@company.com",
        when: !args.owner
    }
];
