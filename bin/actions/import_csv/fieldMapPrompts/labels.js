"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sortByBestMatch_1 = require("../../../utils/sortByBestMatch");
exports.default = (fields) => {
    const properties = [
        {
            name: 'name',
            message: 'Name property'
        },
        {
            name: 'description',
            message: 'Description property'
        },
        {
            name: 'createdAt',
            message: 'Created at property'
        },
        {
            name: 'color',
            message: 'Color property'
        },
        {
            name: 'icon',
            message: 'Icon property'
        }
    ];
    return [
        {
            type: 'input',
            name: 'descriptionFormat',
            message: 'Description format',
            default: '{{name}}'
        },
        ...properties.map((p) => (Object.assign(Object.assign({}, p), { type: 'list', default: p.name, choices: [
                p.name !== 'name' && {
                    name: 'No mapping',
                    value: null
                },
                ...sortByBestMatch_1.sortByBestMatch(p.name, fields)
            ].filter(Boolean) }))),
    ];
};
