"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonToEnv = void 0;
function jsonToEnv(json) {
    return Object.keys(json)
        .map((key) => `${key}=${json[key]}`)
        .join('\n');
}
exports.jsonToEnv = jsonToEnv;
