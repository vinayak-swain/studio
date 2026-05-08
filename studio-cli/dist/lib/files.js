"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFiles = getAllFiles;
exports.writeFiles = writeFiles;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const IGNORE_LIST = ['node_modules', '.git', '.next', 'dist', '.studio'];
async function getAllFiles(dir, baseDir = dir) {
    const results = [];
    const files = await fs_extra_1.default.readdir(dir);
    for (const file of files) {
        if (IGNORE_LIST.includes(file))
            continue;
        const fullPath = path_1.default.join(dir, file);
        const stat = await fs_extra_1.default.stat(fullPath);
        if (stat.isDirectory()) {
            results.push(...(await getAllFiles(fullPath, baseDir)));
        }
        else {
            const content = await fs_extra_1.default.readFile(fullPath, 'utf8');
            const relativePath = path_1.default.relative(baseDir, fullPath);
            results.push({ path: relativePath, content });
        }
    }
    return results;
}
async function writeFiles(baseDir, files) {
    for (const file of files) {
        const fullPath = path_1.default.join(baseDir, file.path);
        await fs_extra_1.default.ensureDir(path_1.default.dirname(fullPath));
        await fs_extra_1.default.writeFile(fullPath, file.content);
    }
}
