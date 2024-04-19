"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sortByBestMatch_1 = require("../../../utils/sortByBestMatch");
exports.default = (fields) => {
    const properties = [
        {
            name: 'periodId',
            message: 'Period ID property'
        },
        {
            name: 'userId',
            message: 'User ID property'
        },
        {
            name: 'createdAt',
            message: 'Created at property'
        },
        {
            name: 'hours',
            message: 'Hours property'
        }
    ];
    return properties.map((p) => (Object.assign(Object.assign({}, p), { type: 'list', default: p.name, choices: sortByBestMatch_1.sortByBestMatch(p.name, fields) })));
};
