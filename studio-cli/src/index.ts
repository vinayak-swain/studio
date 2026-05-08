
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
  .description('DevNest CLI - A cozy version control tool')
  .version('1.0.0');

program
  .command('login')
  .description('Login to DevNest')
  .action(login);

program
  .command('init')
  .description('Initialize a new repository')
  .action(init);

program
  .command('status')
  .description('Show local repository status')
  .action(status);

program
  .command('commit')
  .description('Commit local changes')
  .argument('<message>', 'Commit message')
  .action(commit);

program
  .command('push')
  .description('Push changes to DevNest')
  .action(push);

program
  .command('pull')
  .description('Pull changes from DevNest')
  .action(pull);

program
  .command('clone')
  .description('Clone a repository')
  .argument('<repo>', 'Repository path (owner/repo)')
  .action(clone);

program.parse();
