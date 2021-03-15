"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { findBestMatch } = require('string-similarity');
const sortByBestMatch = (field, fields) => {
    return findBestMatch(field, fields)
        .ratings.sort((a, b) => b.rating - a.rating)
        .map((a) => a.target);
};
exports.default = (fields) => {
    return [
        {
            name: '_id',
            message: 'ID property'
        },
        {
            name: 'createdAt',
            message: 'Created at property'
        },
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
        },
        {
            name: 'inactive',
            message: 'Inactive property'
        }
    ].map((p) => (Object.assign(Object.assign({}, p), { type: 'list', default: p.name, choices: sortByBestMatch(p.name, fields) })));
};
