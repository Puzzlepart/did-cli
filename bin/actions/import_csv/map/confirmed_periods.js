"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
exports.default = (fieldMap) => (item) => {
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
    return Object.assign(Object.assign({}, mappedProperties), { duration: parseFloat(hours), createdAt: new Date(createdAt), updatedAt: new Date(createdAt), week,
        month,
        year, periodId: `${periodId}${userId}`.replace(/[^\dA-Za-z]/g, '') });
};
