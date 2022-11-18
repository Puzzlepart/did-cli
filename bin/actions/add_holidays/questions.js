"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (args) => [
    {
        type: "input",
        name: 'name',
        message: "For what year do you want to add holidays?",
        default: new Date().getFullYear(),
        when: !args.year
    }
];
