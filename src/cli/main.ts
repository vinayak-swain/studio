
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

// Helper to get base URL
const getBaseUrl = () => (process.env.DEVNEST_API_URL || 'http://localhost:3000').replace(/\/$/, '');

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
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/api/auth/cli-login`, {
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
      console.log(chalk.gray(`\nTip: Ensure the server is running at ${getBaseUrl()}`));
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
      
      async function walk(dir: string) {
        const items = await fs.readdir(dir);
        for (const item of items) {
          const fullPath = path.join(dir, item);
          const stat = await fs.stat(fullPath);
          
          if (item === 'node_modules' || item === '.git' || item === '.next' || item === 'dist' || item.startsWith('.')) continue;

          if (stat.isDirectory()) {
            await walk(fullPath);
          } else {
            const content = await fs.readFile(fullPath, 'utf-8');
            files.push({
              path: path.relative('.', fullPath),
              content
            });
          }
        }
      }

      await walk('.');

      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/api/cli/push`, {
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
      
      if (result.aiAnalysis) {
        console.log('\n' + chalk.cyan.bold('--- AI CODE INSIGHTS ---'));
        console.log(chalk.white(result.aiAnalysis.intentSummary));
        console.log('\n' + chalk.yellow('Impact: ') + chalk.gray(result.aiAnalysis.architecturalImpact));
        console.log(chalk.magenta('Risk Level: ') + chalk.white(`${result.aiAnalysis.riskScore}/100`));
        if (result.aiAnalysis.breakingChange) {
          console.log(chalk.red.bold('⚠️  WARNING: Breaking changes detected!'));
        }
      }
      
    } catch (error: any) {
      spinner.fail(chalk.red(`Push failed: ${error.message}`));
      console.log(chalk.gray(`\nTip: Ensure the server is running at ${getBaseUrl()}`));
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
      const baseUrl = getBaseUrl();
      const res = await fetch(`${baseUrl}/api/cli/pull?repoId=${repoConfig.repoId}`, {
        headers: { 'Authorization': `Bearer ${auth.token}` }
      });
      const data = await res.json();
      
      if (data.error) throw new Error(data.error);

      for (const file of data.files) {
        const fullPath = path.join('.', file.path);
        await fs.ensureDir(path.dirname(fullPath));
        await fs.outputFile(fullPath, file.content);
      }
      
      spinner.succeed(chalk.green('Pull complete.'));
    } catch (error: any) {
      spinner.fail(chalk.red(`Pull failed: ${error.message}`));
      console.log(chalk.gray(`\nTip: Ensure the server is running at ${getBaseUrl()}`));
    }
  });

program
  .command('status')
  .description('Show current sync status')
  .action(async () => {
    const repoConfig = await fs.readJson(LOCAL_REPO_CONFIG).catch(() => null);
    if (!repoConfig) {
      console.log(chalk.yellow('Directory not initialized. Run studio-dvcs init <repoId>'));
      return;
    }
    console.log(chalk.blue(`DevNest Repo ID: ${repoConfig.repoId}`));
    console.log(chalk.green('Status: Local tracking active.'));
  });

program.parse();
