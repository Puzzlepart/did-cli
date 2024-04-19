"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
/**
 * Sanitize key, removing special characters and spaces.
 *
 * @param key Key to sanitize
 */
function sanitizeKey(key) {
    return key.replace(/[^a-zA-Z0-9]/g, '');
}
exports.default = (fieldMap) => (item) => {
    var _a;
    const mappedProperties = Object.keys(fieldMap).reduce((obj, key) => {
        if (!item[fieldMap[key]])
            return obj;
        let value = item[fieldMap[key]];
        if (['key', 'customerKey'].includes(key)) {
            value = sanitizeKey(value);
        }
        return Object.assign(Object.assign({}, obj), { [key]: value });
    }, {});
    const { customerKey, key, inactive } = mappedProperties;
    const _id = [customerKey, key].join(' ');
    return lodash_1.default.omit(Object.assign(Object.assign({}, mappedProperties), { _id, name: (_a = mappedProperties.name) !== null && _a !== void 0 ? _a : [customerKey, key].join(' '), tag: _id, labels: [mappedProperties.primaryLabel, mappedProperties.secondaryLabel].filter(Boolean), inactive: inactive === true, createdAt: new Date(), updatedAt: new Date() }), ['primaryLabel', 'secondaryLabel']);
};
