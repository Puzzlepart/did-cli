"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Sanitize key, removing special characters and spaces.
 *
 * @param key Key to sanitize
 */
function sanitizeKey(key) {
    return key.replace(/[^a-zA-Z0-9]/g, '');
}
exports.default = (fieldMap) => (item) => {
    const mappedProperties = Object.keys(fieldMap).reduce((obj, key) => {
        if (!item[fieldMap[key]])
            return obj;
        let value = item[fieldMap[key]];
        if (['key'].includes(key)) {
            value = sanitizeKey(value);
        }
        return Object.assign(Object.assign({}, obj), { [key]: value });
    }, {});
    const { key, name, createdAt, inactive } = mappedProperties;
    return Object.assign(Object.assign({ _id: key }, mappedProperties), { name: name !== null && name !== void 0 ? name : key, icon: 'Page', inactive: inactive === true, createdAt: createdAt ? new Date(createdAt) : new Date(), updatedAt: createdAt ? new Date(createdAt) : new Date() });
};
