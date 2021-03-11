"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (fieldMap) => (item) => {
    const mappedProperties = Object.keys(fieldMap).reduce((obj, key) => {
        return Object.assign(Object.assign({}, obj), { [key]: item[fieldMap[key]] });
    }, {});
    const { periodId, startDate, endDate, duration, userId } = mappedProperties;
    if (periodId.split('_').length !== 3)
        throw new Error('periodId has wrong format! Needs to be of format week_month_year.');
    const [week, month, year] = periodId
        .split('_')
        .map((str) => parseInt(str, 10));
    return Object.assign(Object.assign({}, mappedProperties), { startDate: new Date(startDate), endDate: new Date(endDate), duration: parseFloat(duration), week,
        month,
        year, periodId: `${periodId}${userId}`.replace(/[^\dA-Za-z]/g, '') });
};
