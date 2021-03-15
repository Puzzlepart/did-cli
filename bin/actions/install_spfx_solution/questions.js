"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (args) => ([
    {
        type: "input",
        name: "siteUrl",
        message: "Site URL",
        default: "https://tenant.sharepoint.com",
        when: !args.siteUrl
    },
    {
        type: "input",
        name: "clientId",
        message: "Client ID",
        default: "00000000-0000-0000-0000-000000000000",
        when: !args.clientId
    },
    {
        type: "input",
        name: "clientSecret",
        message: "Client secret",
        default: "00000000-0000-0000-0000-000000000000",
        when: !args.clientSecret
    },
    {
        type: "input",
        name: "githubToken",
        message: "GitHub personal token with private repo access",
        default: "00000000-0000-0000-0000-000000000000",
        when: !args.githubToken
    },
    {
        type: "input",
        name: "didApiKey",
        message: "API key",
        default: "00000000-0000-0000-0000-000000000000",
        when: !args.didApiKey
    }
]);
