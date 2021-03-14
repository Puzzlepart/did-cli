"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (fieldMap) => (item) => {
    const mappedProperties = Object.keys(fieldMap).reduce((obj, key) => {
        return Object.assign(Object.assign({}, obj), { [key]: item[fieldMap[key]] });
    }, {});
    const { customerKey, key, createdAt } = mappedProperties;
    const _id = [customerKey, key].join(' ');
    return Object.assign(Object.assign({}, mappedProperties), { _id, tag: _id, createdAt: createdAt || new Date(), updatedAt: createdAt || new Date() });
};
