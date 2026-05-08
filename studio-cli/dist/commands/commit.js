"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commit = commit;
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const api_js_1 = require("../lib/api.js");
const config_js_1 = require("../lib/config.js");
async function commit(message) {
    const config = await (0, config_js_1.getLocalConfig)();
    if (!config) {
        console.log(chalk_1.default.red('Not a studio repository.'));
        return;
    }
    const spinner = (0, ora_1.default)('Committing...').start();
    try {
        const data = await api_js_1.api.post('/cli/commit', {
            repoId: config.repoId,
            branch: config.branch,
            message
        });
        spinner.succeed(chalk_1.default.green(`✅ Committed! Commit ID: ${data.commitId}`));
        if (data.aiAnalysis) {
            const ai = data.aiAnalysis;
            console.log(`\n${chalk_1.default.blue.bold('🤖 AI Analysis:')}`);
            console.log(`${chalk_1.default.white('Type:')} ${ai.changeType}`);
            console.log(`${chalk_1.default.white('Summary:')} ${ai.intentSummary}`);
            console.log(`${chalk_1.default.white('Risk Score:')} ${ai.riskScore}/100`);
            if (ai.breakingChange) {
                console.log(chalk_1.default.red.bold('⚠️  WARNING: Breaking change detected!'));
            }
        }
    }
    catch (error) {
        spinner.fail(chalk_1.default.red(`Commit failed: ${error.response?.data?.error || error.message}`));
    }
}
