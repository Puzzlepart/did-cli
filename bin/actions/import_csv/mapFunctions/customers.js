"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (fieldMap) => (item) => {
    const mappedProperties = Object.keys(fieldMap).reduce((obj, key) => {
        return Object.assign(Object.assign({}, obj), { [key]: item[fieldMap[key]] });
    }, {});
    const { createdAt, inactive } = mappedProperties;
    return Object.assign(Object.assign({}, mappedProperties), { inactive: inactive === true, createdAt: new Date(createdAt) || new Date(), updatedAt: new Date(createdAt) || new Date() });
};
