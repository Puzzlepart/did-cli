"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
function generatePeriodId(periodId, userId) {
    return `${periodId}${userId}`.replace(/[^\dA-Za-z]/g, '');
}
exports.default = (fieldMap) => (item) => {
    const mappedProperties = Object.keys(fieldMap).reduce((obj, key) => {
        return Object.assign(Object.assign({}, obj), { [key]: item[fieldMap[key]] });
    }, {});
    let { periodId, week, month, year, startDate, endDate, duration, userId, } = mappedProperties;
    if (periodId && periodId.split('_').length !== 3) {
        throw errors_1.PeriodIdWrongFormatError;
    }
    if (periodId) {
        [week, month, year] = periodId
            .split('_')
            .map((str_) => parseInt(str_, 10));
    }
    else {
        periodId = [week, month, year].join('_');
    }
    return Object.assign(Object.assign({}, mappedProperties), { startDate: new Date(startDate), endDate: new Date(endDate), duration: parseFloat(duration), week,
        month,
        year, periodId: generatePeriodId(periodId, userId) });
};
