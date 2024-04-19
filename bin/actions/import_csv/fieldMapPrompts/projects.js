"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sortByBestMatch_1 = require("../../../utils/sortByBestMatch");
function shouldSkip(property, skip) {
    return skip.includes(property.name);
}
exports.default = (fields, args) => {
    const skip = (args === null || args === void 0 ? void 0 : args.skip) ? args.skip.split(',') : [];
    const properties = [
        {
            name: 'customerKey',
            message: 'Customer key property'
        },
        {
            name: 'key',
            message: 'Project key property'
        },
        {
            name: 'name',
            message: 'Name property'
        },
        args.applyLabels && {
            name: "primaryLabel",
            message: "Primary label property"
        },
        args.applyLabels && {
            name: "secondaryLabel",
            message: "Secondary label property"
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
    return properties.filter(p => !!p && !shouldSkip(p, skip))
        .map((p) => {
        const isKey = ['customerKey', 'key'].includes(p.name);
        return Object.assign(Object.assign({}, p), { type: 'list', default: p.name, choices: [
                !isKey && {
                    name: 'No mapping',
                    value: null
                },
                ...sortByBestMatch_1.sortByBestMatch(p.name, fields)
            ].filter(Boolean) });
    });
};
