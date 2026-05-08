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
async function pull() {
    const config = await (0, config_1.getLocalConfig)();
    if (!config) {
        console.log(chalk_1.default.red('Not a studio repository.'));
        return;
    }
    const spinner = (0, ora_1.default)('Pulling changes...').start();
    try {
        const data = await api_1.api.get('/cli/pull', {
            repoId: config.repoId,
            branch: config.branch
        });
        await (0, files_1.writeFiles)(process.cwd(), data.files);
        spinner.succeed(chalk_1.default.green(`✅ Pulled ${data.files.length} files!`));
        console.log(chalk_1.default.gray(`Latest commit: "${data.message}" (${data.commitId})`));
    }
    catch (error) {
        spinner.fail(chalk_1.default.red(`Pull failed: ${error.response?.data?.error || error.message}`));
    }
}
