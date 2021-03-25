"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (issues) => [
    {
        type: "autocomplete",
        name: 'issue',
        message: "Select issue",
        source: (_a, input) => __awaiter(void 0, void 0, void 0, function* () {
            return issues
                .filter(([id, , name]) => id &&
                `${id} ${name}`.toLowerCase().indexOf((input || '').toLowerCase()) !== -1)
                .map(([id, , name, labels]) => ({
                value: [id, name, labels],
                name: `${id}: ${name} (${labels})`
            }));
        })
    },
    {
        type: "list",
        name: 'branch_prefix',
        message: "Branch prefix",
        choices: ['feature/', 'bugfix/', 'hotfix/']
    }
];
