"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
!/usr/bin / env;
node;
const commander_1 = require("commander");
const login_js_1 = require("./commands/login.js");
const init_js_1 = require("./commands/init.js");
const status_js_1 = require("./commands/status.js");
const commit_js_1 = require("./commands/commit.js");
const push_js_1 = require("./commands/push.js");
const pull_js_1 = require("./commands/pull.js");
const clone_js_1 = require("./commands/clone.js");
const program = new commander_1.Command();
program
    .name('studio')
    .description('DevNest CLI - A cozy version control tool')
    .version('1.0.0');
program
    .command('login')
    .description('Login to DevNest')
    .action(login_js_1.login);
program
    .command('init')
    .description('Initialize a new repository')
    .action(init_js_1.init);
program
    .command('status')
    .description('Show local repository status')
    .action(status_js_1.status);
program
    .command('commit')
    .description('Commit local changes')
    .argument('<message>', 'Commit message')
    .action(commit_js_1.commit);
program
    .command('push')
    .description('Push changes to DevNest')
    .action(push_js_1.push);
program
    .command('pull')
    .description('Pull changes from DevNest')
    .action(pull_js_1.pull);
program
    .command('clone')
    .description('Clone a repository')
    .argument('<repo>', 'Repository path (owner/repo)')
    .action(clone_js_1.clone);
program.parse();
