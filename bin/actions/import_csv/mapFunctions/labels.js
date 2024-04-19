"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const randomcolor_1 = __importDefault(require("randomcolor"));
const utils_1 = require("../../../utils");
exports.default = (fieldMap) => (item) => {
    var _a;
    const mappedProperties = Object.keys(fieldMap).reduce((obj, key) => {
        if (!item[fieldMap[key]])
            return obj;
        return Object.assign(Object.assign({}, obj), { [key]: item[fieldMap[key]] });
    }, {});
    if (!!fieldMap.descriptionFormat && !fieldMap.description && !!mappedProperties.name) {
        mappedProperties.description = utils_1.t9r(fieldMap.descriptionFormat, mappedProperties);
    }
    if (Object.keys(mappedProperties).length === 0)
        return null;
    const { name } = mappedProperties;
    return Object.assign(Object.assign({}, mappedProperties), { _id: name.replace(/[^a-zA-Z0-9]/g, ''), color: (_a = mappedProperties.color) !== null && _a !== void 0 ? _a : randomcolor_1.default({
            format: 'hex',
        }), createdAt: new Date(), updatedAt: new Date() });
};
