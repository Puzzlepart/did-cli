"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDbNameFromConnectionString = void 0;
function getDbNameFromConnectionString(connectionString) {
    return connectionString.split('@')[0].split('mongodb://')[1].split(':')[0];
}
exports.getDbNameFromConnectionString = getDbNameFromConnectionString;
