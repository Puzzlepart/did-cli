"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (fieldMap) => (item) => {
    var _a;
    const mappedProperties = Object.keys(fieldMap).reduce((obj, key) => {
        if (!item[fieldMap[key]])
            return obj;
        return Object.assign(Object.assign({}, obj), { [key]: item[fieldMap[key]] });
    }, {});
    const { customerKey, key, createdAt, inactive } = mappedProperties;
    const _id = [customerKey, key].join(' ');
    return Object.assign(Object.assign({}, mappedProperties), { _id, name: (_a = mappedProperties.name) !== null && _a !== void 0 ? _a : [customerKey, key].join(' '), tag: _id, inactive: inactive === true, createdAt: createdAt ? new Date(createdAt) : new Date(), updatedAt: createdAt ? new Date(createdAt) : new Date() });
};
