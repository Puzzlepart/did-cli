"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (fieldMap) => (item) => {
    const mappedProperties = Object.keys(fieldMap).reduce((obj, key) => {
        return Object.assign(Object.assign({}, obj), { [key]: item[fieldMap[key]] });
    }, {});
    return Object.assign(Object.assign({}, mappedProperties), { createdAt: mappedProperties.createdAt || new Date(), updatedAt: mappedProperties.createdAt || new Date() });
};
