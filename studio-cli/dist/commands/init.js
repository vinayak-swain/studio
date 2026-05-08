"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = init;
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const api_js_1 = require("../lib/api.js");
const config_js_1 = require("../lib/config.js");
async function init() {
    const answers = await inquirer_1.default.prompt([
        { type: 'input', name: 'name', message: 'Repository name:' },
        { type: 'input', name: 'description', message: 'Description:' },
        { type: 'list', name: 'visibility', message: 'Visibility:', choices: ['public', 'private'] }
    ]);
    const spinner = (0, ora_1.default)('Creating repository...').start();
    try {
        const repo = await api_js_1.api.post('/cli/repos', answers);
        await (0, config_js_1.saveLocalConfig)({
            repoId: repo.id,
            repoName: repo.name,
            owner: repo.ownerId,
            remote: `studio-dvcs.com/${repo.ownerId}/${repo.name}`,
            branch: 'main'
        });
        spinner.succeed(chalk_1.default.green(`✅ Repository created: ${repo.name}`));
        console.log(chalk_1.default.blue(`Remote: studio-dvcs.com/${repo.ownerId}/${repo.name}`));
    }
    catch (error) {
        spinner.fail(chalk_1.default.red(`Init failed: ${error.response?.data?.error || error.message}`));
    }
}
