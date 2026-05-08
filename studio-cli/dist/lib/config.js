"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOCAL_CONFIG_FILE = exports.CREDENTIALS_FILE = exports.GLOBAL_CONFIG_DIR = void 0;
exports.saveCredentials = saveCredentials;
exports.getCredentials = getCredentials;
exports.saveLocalConfig = saveLocalConfig;
exports.getLocalConfig = getLocalConfig;
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const fs_extra_1 = __importDefault(require("fs-extra"));
exports.GLOBAL_CONFIG_DIR = path_1.default.join(os_1.default.homedir(), '.studio');
exports.CREDENTIALS_FILE = path_1.default.join(exports.GLOBAL_CONFIG_DIR, 'credentials.json');
exports.LOCAL_CONFIG_FILE = '.studio';
async function saveCredentials(creds) {
    await fs_extra_1.default.ensureDir(exports.GLOBAL_CONFIG_DIR);
    await fs_extra_1.default.writeJson(exports.CREDENTIALS_FILE, creds);
}
async function getCredentials() {
    if (!(await fs_extra_1.default.pathExists(exports.CREDENTIALS_FILE)))
        return null;
    return fs_extra_1.default.readJson(exports.CREDENTIALS_FILE);
}
async function saveLocalConfig(config) {
    await fs_extra_1.default.writeJson(exports.LOCAL_CONFIG_FILE, config, { spaces: 2 });
}
async function getLocalConfig() {
    if (!(await fs_extra_1.default.pathExists(exports.LOCAL_CONFIG_FILE)))
        return null;
    return fs_extra_1.default.readJson(exports.LOCAL_CONFIG_FILE);
}
