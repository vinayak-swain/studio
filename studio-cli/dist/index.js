#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const login_1 = require("./commands/login");
const status_1 = require("./commands/status");
const push_1 = require("./commands/push");
const pull_1 = require("./commands/pull");
const clone_1 = require("./commands/clone");
const program = new commander_1.Command();
program
    .name('studio')
    .description('DevNest CLI - Terminal workflow with AI code analysis')
    .version('1.0.0');
program
    .command('login')
    .description('Authenticate with your DevNest account')
    .action(login_1.login);
program
    .command('init')
    .description('Initialize current folder as a DevNest repository')
    .argument('<repoId>', 'The repository ID from your dashboard')
    .action(async (repoId) => {
    const { saveLocalConfig } = await Promise.resolve().then(() => __importStar(require('./lib/config')));
    await saveLocalConfig({
        repoId,
        repoName: repoId,
        owner: 'me',
        remote: 'devnest.app',
        branch: 'main'
    });
    console.log(`✅ Initialized repository: ${repoId}`);
});
program
    .command('status')
    .description('Check synchronization status')
    .action(status_1.status);
program
    .command('push')
    .description('Push changes to DevNest and get AI analysis')
    .argument('[message]', 'Commit message')
    .action(push_1.push);
program
    .command('pull')
    .description('Pull latest changes from DevNest')
    .action(pull_1.pull);
program
    .command('clone')
    .description('Clone an existing repository')
    .argument('<repoId>', 'The repository ID to clone')
    .action(clone_1.clone);
program.parse();
