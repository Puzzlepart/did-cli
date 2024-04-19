"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sortByBestMatch_1 = require("../../../utils/sortByBestMatch");
/**
 * Get field map prompts for customers
 */
exports.default = (fields) => {
    const properties = [
        {
            name: 'key',
            message: 'Key property'
        },
        {
            name: 'name',
            message: 'Name property'
        },
        {
            name: 'description',
            message: 'Description property'
        },
        {
            name: 'icon',
            message: 'Icon property'
        },
        {
            name: 'webLink',
            message: 'Web link property'
        }
    ];
    return properties.map((p) => {
        return Object.assign(Object.assign({}, p), { type: 'list', default: p.name, choices: [
                !['_id', 'key'].includes(p.name) && {
                    name: 'No mapping',
                    value: null
                },
                ...sortByBestMatch_1.sortByBestMatch(p.name, fields)
            ].filter(Boolean) });
    });
};
