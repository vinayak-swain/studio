
#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';

const program = new Command();

program
  .name('studio')
  .description('DevNest CLI - A cozy version control tool')
  .version('1.0.0');

// Commands will be registered here in the next step

program.parse();
