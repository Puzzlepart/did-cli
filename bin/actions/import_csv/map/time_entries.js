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
    let { periodId, week, month, year, startDateTime, endDateTime, duration, userId, } = mappedProperties;
    if (periodId && periodId.split('_').length !== 3) {
        throw errors_1.PeriodIdWrongFormatError;
    }
    if (periodId) {
        [week, month, year] = periodId.split('_');
    }
    else {
        periodId = [week, month, year].join('_');
    }
    return Object.assign(Object.assign({}, mappedProperties), { startDateTime: new Date(startDateTime), endDateTime: new Date(endDateTime), duration: parseFloat(duration), week: parseInt(week), month: parseInt(month), year: parseInt(year), periodId: generatePeriodId(periodId, userId) });
};
