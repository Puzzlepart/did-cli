"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const underscore_1 = require("underscore");
exports.default = (subscriptions) => [
    {
        type: 'list',
        name: 'subscriptionId',
        message: 'Select subscription',
        choices: subscriptions.map((sub) => ({
            value: sub._id,
            name: sub.name
        }))
    },
    {
        type: 'confirm',
        name: 'dropDatabase',
        message: ({ subscriptionId }) => {
            const { db } = underscore_1.find(subscriptions, (s) => s._id === subscriptionId);
            return `Delete database ${db}?`;
        }
    },
    {
        type: 'confirm',
        name: 'confirm',
        message: ({ subscriptionId }) => {
            const { name } = underscore_1.find(subscriptions, (s) => s._id === subscriptionId);
            return `Are you sure you want to remove subscription ${name}?`;
        }
    }
];
