"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.t9r = void 0;
function t9r(template, interpolations) {
    return template.replace(/\{\{\s*([^}\s]+)\s*\}\}/g, (_, token) => interpolations[token]);
}
exports.t9r = t9r;
