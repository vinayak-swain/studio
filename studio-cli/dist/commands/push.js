"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.push = push;
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const api_js_1 = require("../lib/api.js");
const config_js_1 = require("../lib/config.js");
const files_js_1 = require("../lib/files.js");
async function push() {
    const config = await (0, config_js_1.getLocalConfig)();
    if (!config) {
        console.log(chalk_1.default.red('Not a studio repository.'));
        return;
    }
    const files = await (0, files_js_1.getAllFiles)(process.cwd());
    const spinner = (0, ora_1.default)(`Pushing ${files.length} files...`).start();
    try {
        const data = await api_js_1.api.post('/cli/push', {
            repoId: config.repoId,
            branch: config.branch,
            files,
            commitMessage: 'Update from CLI'
        });
        spinner.succeed(chalk_1.default.green('✅ Pushed successfully!'));
        console.log(chalk_1.default.gray(`Commit ID: ${data.commitId}`));
        console.log(chalk_1.default.gray(`Files pushed: ${data.fileCount}`));
        if (data.aiAnalysis) {
            const ai = data.aiAnalysis;
            console.log(`\n${chalk_1.default.blue.bold('🤖 AI Insights:')}`);
            console.log(`${chalk_1.default.white('Type:')} ${ai.changeType}`);
            console.log(`${chalk_1.default.white('Intent:')} ${ai.intentSummary}`);
            console.log(`${chalk_1.default.white('Risk Score:')} ${ai.riskScore}/100`);
        }
        console.log(chalk_1.default.cyan(`\nView in app: ${config.remote}`));
    }
    catch (error) {
        spinner.fail(chalk_1.default.red(`Push failed: ${error.response?.data?.error || error.message}`));
    }
}
