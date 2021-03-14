"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.time_entries = exports.projects = exports.customers = exports.confirmed_periods = void 0;
var confirmed_periods_1 = require("./confirmed_periods");
Object.defineProperty(exports, "confirmed_periods", { enumerable: true, get: function () { return __importDefault(confirmed_periods_1).default; } });
var customers_1 = require("./customers");
Object.defineProperty(exports, "customers", { enumerable: true, get: function () { return __importDefault(customers_1).default; } });
var projects_1 = require("./projects");
Object.defineProperty(exports, "projects", { enumerable: true, get: function () { return __importDefault(projects_1).default; } });
var time_entries_1 = require("./time_entries");
Object.defineProperty(exports, "time_entries", { enumerable: true, get: function () { return __importDefault(time_entries_1).default; } });
