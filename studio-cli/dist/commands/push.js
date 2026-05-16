"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.push = push;
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const api_1 = require("../lib/api");
const config_1 = require("../lib/config");
const files_1 = require("../lib/files");
/**
 * Implements 'studio push "message"'.
 * Scans local directory, uploads files to DevNest, and prints AI insights.
 */
async function push(message) {
    const config = await (0, config_1.getLocalConfig)();
    if (!config) {
        console.log(chalk_1.default.red('Error: Not a DevNest repository. Run "studio init <repoId>" first.'));
        return;
    }
    if (!message) {
        console.log(chalk_1.default.yellow('Warning: No commit message provided. Using default.'));
        message = 'Update from CLI';
    }
    const spinner = (0, ora_1.default)('Scanning and preparing changes...').start();
    try {
        // 1. Gather all files in the current directory (skipping ignored ones)
        const files = await (0, files_1.getAllFiles)(process.cwd());
        spinner.text = `Pushing ${files.length} files to DevNest...`;
        // 2. Transmit to server
        const data = await api_1.api.post('/cli/push', {
            repoId: config.repoId,
            branch: config.branch,
            files,
            message
        });
        spinner.succeed(chalk_1.default.green('✅ Successfully pushed to cloud!'));
        console.log(chalk_1.default.gray(`Commit Hash: ${data.commitId.substring(0, 8)}`));
        console.log(chalk_1.default.gray(`Files Synced: ${data.fileCount}`));
        // 3. Display AI insights returned from Genkit
        if (data.aiAnalysis) {
            const ai = data.aiAnalysis;
            console.log(`\n${chalk_1.default.cyan.bold('🤖 DEVNEST AI INSIGHTS')}`);
            console.log(`${chalk_1.default.white.bold('Summary:')} ${ai.intentSummary}`);
            console.log(`${chalk_1.default.white.bold('Architectural Impact:')} ${chalk_1.default.italic(ai.architecturalImpact)}`);
            const riskColor = ai.riskScore > 70 ? chalk_1.default.red : ai.riskScore > 30 ? chalk_1.default.yellow : chalk_1.default.green;
            console.log(`${chalk_1.default.white.bold('Risk Score:')} ${riskColor(ai.riskScore + '/100')}`);
            if (ai.breakingChange) {
                console.log(chalk_1.default.bgRed.white.bold(' ⚠️  BREAKING CHANGES DETECTED '));
            }
        }
        console.log(chalk_1.default.blue(`\nView changes online: http://localhost:3000/repo/${config.repoId}`));
    }
    catch (error) {
        spinner.fail(chalk_1.default.red(`Push failed: ${error.response?.data?.error || error.message}`));
    }
}
