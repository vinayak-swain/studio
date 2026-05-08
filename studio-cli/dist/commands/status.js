"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.status = status;
const chalk_1 = __importDefault(require("chalk"));
const config_1 = require("../lib/config");
const files_1 = require("../lib/files");
async function status() {
    const config = await (0, config_1.getLocalConfig)();
    if (!config) {
        console.log(chalk_1.default.red('Not a studio repository. Run "studio init" first.'));
        return;
    }
    const files = await (0, files_1.getAllFiles)(process.cwd());
    console.log(chalk_1.default.blue.bold(`📦 ${config.repoName}`));
    console.log(chalk_1.default.gray(`Remote: ${config.remote}`));
    console.log(chalk_1.default.gray(`Branch: ${config.branch}`));
    console.log(chalk_1.default.white(`\n${files.length} files tracked`));
    if (files.length > 0) {
        console.log(chalk_1.default.gray('\nFiles:'));
        files.slice(0, 10).forEach(f => console.log(`  ${f.path}`));
        if (files.length > 10)
            console.log(chalk_1.default.gray(`  ... and ${files.length - 10} more`));
    }
}
