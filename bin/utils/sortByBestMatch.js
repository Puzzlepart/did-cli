"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortByBestMatch = void 0;
const string_similarity_1 = require("string-similarity");
const sortByBestMatch = (field, fields) => {
    return string_similarity_1.findBestMatch(field, fields)
        .ratings.sort((a, b) => b.rating - a.rating)
        .map((a) => a.target);
};
exports.sortByBestMatch = sortByBestMatch;
