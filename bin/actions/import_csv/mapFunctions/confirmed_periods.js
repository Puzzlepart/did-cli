"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const underscore_1 = require("underscore");
const errors_1 = require("../errors");
function generatePeriodId(periodId, userId) {
    return `${periodId}${userId}`.replace(/[^\dA-Za-z]/g, '');
}
exports.default = (fieldMap, { time_entries = [] }) => (item) => {
    const mappedProperties = Object.keys(fieldMap).reduce((obj, key) => {
        return Object.assign(Object.assign({}, obj), { [key]: item[fieldMap[key]] });
    }, {});
    let { periodId, hours, createdAt, userId } = mappedProperties;
    if (periodId && periodId.split('_').length !== 3) {
        throw errors_1.PeriodIdWrongFormatError;
    }
    const [week, month, year] = periodId
        .split('_')
        .map((str_) => parseInt(str_, 10));
    const _id = generatePeriodId(periodId, userId);
    const events = time_entries.filter(entry => entry.periodId === _id).map(event => {
        return underscore_1.omit(event, 'week', 'month', 'year', 'userId', 'periodId');
    });
    return Object.assign(Object.assign({}, mappedProperties), { duration: parseFloat(hours), createdAt: new Date(createdAt), updatedAt: new Date(createdAt), week,
        month,
        year,
        _id,
        events });
};
