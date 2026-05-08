"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthHeader = getAuthHeader;
const config_1 = require("./config");
async function getAuthHeader() {
    const creds = await (0, config_1.getCredentials)();
    if (!creds?.token) {
        throw new Error('Not logged in. Please run "studio login" first.');
    }
    return { Authorization: `Bearer ${creds.token}` };
}
