"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clone = clone;
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const path_1 = __importDefault(require("path"));
const api_1 = require("../lib/api");
const files_1 = require("../lib/files");
const config_1 = require("../lib/config");
/**
 * Implements 'studio clone <repoId>'.
 * Downloads an entire repository and initializes the local tracking config.
 */
async function clone(repoId) {
    const spinner = (0, ora_1.default)(`Cloning repository ${repoId}...`).start();
    try {
        // 1. Fetch remote content
        const data = await api_1.api.get('/cli/pull', { repoId, branch: 'main' });
        // 2. Create target directory
        const targetDir = path_1.default.join(process.cwd(), repoId);
        await (0, files_1.writeFiles)(targetDir, data.files);
        // 3. Save tracking config in the new directory
        process.chdir(targetDir);
        await (0, config_1.saveLocalConfig)({
            repoId: repoId,
            repoName: repoId,
            owner: 'remote',
            remote: `studio-dvcs.com/${repoId}`,
            branch: 'main'
        });
        spinner.succeed(chalk_1.default.green(`✅ Successfully cloned into ./${repoId}`));
    }
    catch (error) {
        spinner.fail(chalk_1.default.red(`Clone failed: ${error.response?.data?.error || error.message}`));
    }
}
