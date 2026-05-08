"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const api_js_1 = require("../lib/api.js");
const config_js_1 = require("../lib/config.js");
async function login() {
    const answers = await inquirer_1.default.prompt([
        { type: 'input', name: 'email', message: 'Email:' },
        { type: 'password', name: 'password', message: 'Password:' }
    ]);
    const spinner = (0, ora_1.default)('Logging in...').start();
    try {
        const data = await api_js_1.api.post('/auth/cli-login', answers, false);
        await (0, config_js_1.saveCredentials)(data);
        spinner.succeed(chalk_1.default.green(`Successfully logged in as ${data.name || data.email}!`));
    }
    catch (error) {
        spinner.fail(chalk_1.default.red(`Login failed: ${error.response?.data?.error || error.message}`));
    }
}
