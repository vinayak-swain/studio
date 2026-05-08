"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clone = clone;
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const path_1 = __importDefault(require("path"));
const api_js_1 = require("../lib/api.js");
const files_js_1 = require("../lib/files.js");
const config_js_1 = require("../lib/config.js");
async function clone(repoPath) {
    const [owner, repoName] = repoPath.split('/');
    if (!owner || !repoName) {
        console.log(chalk_1.default.red('Invalid repo path. Use "owner/repo".'));
        return;
    }
    const spinner = (0, ora_1.default)(`Cloning ${repoPath}...`).start();
    try {
        // In a real app, we'd need a way to find the repoId from owner/repoName
        // For this prototype, we'll assume we have an endpoint for it or pass repoId directly
        const repoInfo = await api_js_1.api.get('/cli/repos');
        const repo = repoInfo.find((r) => r.name === repoName);
        if (!repo)
            throw new Error('Repository not found.');
        const data = await api_js_1.api.get('/cli/pull', { repoId: repo.id, branch: 'main' });
        const targetDir = path_1.default.join(process.cwd(), repoName);
        await (0, files_js_1.writeFiles)(targetDir, data.files);
        // Save config in the new directory
        process.chdir(targetDir);
        await (0, config_js_1.saveLocalConfig)({
            repoId: repo.id,
            repoName: repo.name,
            owner: repo.ownerId,
            remote: `studio-dvcs.com/${repo.ownerId}/${repo.name}`,
            branch: 'main'
        });
        spinner.succeed(chalk_1.default.green(`✅ Successfully cloned into ${repoName}`));
    }
    catch (error) {
        spinner.fail(chalk_1.default.red(`Clone failed: ${error.response?.data?.error || error.message}`));
    }
}
