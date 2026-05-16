#!/usr/bin/env node
import { Command } from 'commander';
import { login } from './commands/login';
import { init } from './commands/init';
import { status } from './commands/status';
import { commit } from './commands/commit';
import { push } from './commands/push';
import { pull } from './commands/pull';
import { clone } from './commands/clone';

const program = new Command();

program
  .name('studio')
  .description('DevNest CLI - Terminal workflow with AI code analysis')
  .version('1.0.0');

program
  .command('login')
  .description('Authenticate with your DevNest account')
  .action(login);

program
  .command('init')
  .description('Initialize current folder as a DevNest repository')
  .argument('<repoId>', 'The repository ID from your dashboard')
  .action(async (repoId) => {
    const { saveLocalConfig } = await import('./lib/config');
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
  .action(status);

program
  .command('push')
  .description('Push changes to DevNest and get AI analysis')
  .argument('[message]', 'Commit message')
  .action(push);

program
  .command('pull')
  .description('Pull latest changes from DevNest')
  .action(pull);

program
  .command('clone')
  .description('Clone an existing repository')
  .argument('<repoId>', 'The repository ID to clone')
  .action(clone);

program.parse();
