"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pull = pull;
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const api_1 = require("../lib/api");
const config_1 = require("../lib/config");
const files_1 = require("../lib/files");
/**
 * Implements 'studio pull'.
 * Fetches the remote state from Firestore and updates the local filesystem.
 */
async function pull() {
    const config = await (0, config_1.getLocalConfig)();
    if (!config) {
        console.log(chalk_1.default.red('Error: Not a DevNest repository. Run "studio init" first.'));
        return;
    }
    const spinner = (0, ora_1.default)('Pulling latest changes from DevNest...').start();
    try {
        const data = await api_1.api.get('/cli/pull', {
            repoId: config.repoId,
            branch: config.branch
        });
        // Write received buffers to local files
        await (0, files_1.writeFiles)(process.cwd(), data.files);
        spinner.succeed(chalk_1.default.green(`✅ Pulled ${data.files.length} files successfully.`));
        console.log(chalk_1.default.gray(`Latest Commit: "${data.message}"`));
    }
    catch (error) {
        spinner.fail(chalk_1.default.red(`Pull failed: ${error.response?.data?.error || error.message}`));
    }
}
