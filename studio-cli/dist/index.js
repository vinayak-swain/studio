#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const login_1 = require("./commands/login");
const init_1 = require("./commands/init");
const status_1 = require("./commands/status");
const commit_1 = require("./commands/commit");
const push_1 = require("./commands/push");
const pull_1 = require("./commands/pull");
const clone_1 = require("./commands/clone");
const program = new commander_1.Command();
program
    .name('studio')
    .description('DevNest CLI - A cozy version control tool')
    .version('1.0.0');
program
    .command('login')
    .description('Login to DevNest')
    .action(login_1.login);
program
    .command('init')
    .description('Initialize a new repository')
    .action(init_1.init);
program
    .command('status')
    .description('Show local repository status')
    .action(status_1.status);
program
    .command('commit')
    .description('Commit local changes')
    .argument('<message>', 'Commit message')
    .action(commit_1.commit);
program
    .command('push')
    .description('Push changes to DevNest')
    .action(push_1.push);
program
    .command('pull')
    .description('Pull changes from DevNest')
    .action(pull_1.pull);
program
    .command('clone')
    .description('Clone a repository')
    .argument('<repo>', 'Repository path (owner/repo)')
    .action(clone_1.clone);
program.parse();
