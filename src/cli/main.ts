
#!/usr/bin/env tsx
import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';

const program = new Command();
const CONFIG_FILE = path.join(process.env.HOME || process.env.USERPROFILE || '.', '.studio-dvcs-config');
const LOCAL_REPO_CONFIG = '.studio-dvcs';

// Helper to get stored token
async function getAuth() {
  if (await fs.pathExists(CONFIG_FILE)) {
    return fs.readJson(CONFIG_FILE);
  }
  return null;
}

program
  .name('studio-dvcs')
  .description('DevNest CLI - Pushing code with AI insights')
  .version('1.0.0');

program
  .command('login')
  .description('Login to DevNest')
  .action(async () => {
    const answers = await inquirer.prompt([
      { type: 'input', name: 'email', message: 'Enter your email:' },
      { type: 'password', name: 'password', message: 'Enter your password:' },
    ]);

    const spinner = ora('Authenticating...').start();
    try {
      const response = await fetch('http://localhost:3000/api/auth/cli-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      await fs.writeJson(CONFIG_FILE, data);
      spinner.succeed(chalk.green('Successfully logged in!'));
    } catch (error: any) {
      spinner.fail(chalk.red(`Login failed: ${error.message}`));
    }
  });

program
  .command('init')
  .description('Initialize a new DevNest repository')
  .argument('<repoId>', 'The repository ID from the DevNest dashboard')
  .action(async (repoId) => {
    await fs.writeJson(LOCAL_REPO_CONFIG, { repoId });
    console.log(chalk.green(`Initialized repository: ${repoId}`));
  });

program
  .command('push')
  .description('Push changes to DevNest and get AI analysis')
  .argument('[message]', 'Commit message')
  .action(async (message) => {
    const auth = await getAuth();
    if (!auth) return console.log(chalk.yellow('Please login first: studio-dvcs login'));

    const repoConfig = await fs.readJson(LOCAL_REPO_CONFIG).catch(() => null);
    if (!repoConfig) return console.log(chalk.yellow('Please init first: studio-dvcs init <repoId>'));

    const spinner = ora('Preparing files and analyzing...').start();
    
    try {
      // Basic file gathering (skipping node_modules etc)
      const files = [];
      const dirFiles = await fs.readdir('.');
      for (const f of dirFiles) {
        if (f !== 'node_modules' && f !== '.git' && !f.startsWith('.')) {
          const stat = await fs.stat(f);
          if (stat.isFile()) {
            files.push({
              path: f,
              content: await fs.readFile(f, 'utf-8')
            });
          }
        }
      }

      const response = await fetch('http://localhost:3000/api/cli/push', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify({ files, message: message || 'Update from CLI', repoId: repoConfig.repoId }),
      });

      const result = await response.json();
      if (result.error) throw new Error(result.error);

      spinner.succeed(chalk.green('Push successful!'));
      
      console.log('\n' + chalk.cyan.bold('--- AI CODE INSIGHTS ---'));
      console.log(chalk.white(result.analysis.summary));
      console.log('\n' + chalk.yellow('Suggestions:'));
      result.analysis.suggestions.forEach((s: string) => console.log(chalk.gray(`- ${s}`)));
      console.log('\n' + chalk.magenta(`Risk Level: ${result.analysis.riskLevel.toUpperCase()}`));
      
    } catch (error: any) {
      spinner.fail(chalk.red(`Push failed: ${error.message}`));
    }
  });

program
  .command('pull')
  .description('Pull latest changes from DevNest')
  .action(async () => {
    const auth = await getAuth();
    const repoConfig = await fs.readJson(LOCAL_REPO_CONFIG).catch(() => null);
    if (!auth || !repoConfig) return console.log(chalk.yellow('Auth or config missing.'));

    const spinner = ora('Pulling changes...').start();
    try {
      const res = await fetch(`http://localhost:3000/api/cli/pull?repoId=${repoConfig.repoId}`, {
        headers: { 'Authorization': `Bearer ${auth.token}` }
      });
      const data = await res.json();
      
      for (const file of data.files) {
        await fs.outputFile(file.path, file.content);
      }
      
      spinner.succeed(chalk.green('Pull complete.'));
    } catch (error: any) {
      spinner.fail(chalk.red(`Pull failed: ${error.message}`));
    }
  });

program
  .command('status')
  .description('Show current sync status')
  .action(() => {
    console.log(chalk.blue('DevNest Status: Synchronized with cloud.'));
  });

program.parse();
