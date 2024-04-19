"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sortByBestMatch_1 = require("../../../utils/sortByBestMatch");
exports.default = (fields, args) => {
    return [
        {
            name: '_id',
            message: 'ID property',
            default: 'id'
        },
        {
            name: 'projectId',
            message: 'Project id/tag property'
        },
        {
            name: 'title',
            message: 'Title property'
        },
        {
            name: 'body',
            message: 'Body property'
        },
        {
            name: 'duration',
            message: 'Duration property'
        },
        {
            name: 'startDateTime',
            message: 'Start date time property'
        },
        {
            name: 'endDateTime',
            message: 'End date time property'
        },
        {
            name: 'periodId',
            message: 'Period ID property',
            choices: [{
                    value: null,
                    name: 'Skip'
                }]
        },
        {
            name: 'week',
            message: 'Week number property',
            when: ({ periodId }) => !periodId
        },
        {
            name: 'month',
            message: 'Month number property',
            when: ({ periodId }) => !periodId
        },
        {
            name: 'year',
            message: 'Year property',
            when: ({ periodId }) => !periodId
        },
        {
            name: 'userId',
            message: 'User ID property'
        }
    ].map((p) => (Object.assign(Object.assign({}, p), { type: 'list', default: p.name, choices: [...(p.choices || []), ...sortByBestMatch_1.sortByBestMatch(p.name, fields)], when: !args[p.name] })));
};
