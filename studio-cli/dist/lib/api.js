"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const axios_1 = __importDefault(require("axios"));
const auth_1 = require("./auth");
const BASE_URL = 'http://localhost:3000/api';
exports.api = {
    async post(endpoint, data, useAuth = true) {
        const headers = { 'Content-Type': 'application/json' };
        if (useAuth) {
            Object.assign(headers, await (0, auth_1.getAuthHeader)());
        }
        const response = await axios_1.default.post(`${BASE_URL}${endpoint}`, data, { headers });
        return response.data;
    },
    async get(endpoint, params = {}, useAuth = true) {
        const headers = {};
        if (useAuth) {
            Object.assign(headers, await (0, auth_1.getAuthHeader)());
        }
        const response = await axios_1.default.get(`${BASE_URL}${endpoint}`, { headers, params });
        return response.data;
    }
};
