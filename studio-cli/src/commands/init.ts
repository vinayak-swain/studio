
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { api } from '../lib/api.js';
import { saveLocalConfig } from '../lib/config.js';

export async function init() {
  const answers = await inquirer.prompt([
    { type: 'input', name: 'name', message: 'Repository name:' },
    { type: 'input', name: 'description', message: 'Description:' },
    { type: 'list', name: 'visibility', message: 'Visibility:', choices: ['public', 'private'] }
  ]);

  const spinner = ora('Creating repository...').start();
  try {
    const repo = await api.post('/cli/repos', answers);
    await saveLocalConfig({
      repoId: repo.id,
      repoName: repo.name,
      owner: repo.ownerId,
      remote: `studio-dvcs.com/${repo.ownerId}/${repo.name}`,
      branch: 'main'
    });
    spinner.succeed(chalk.green(`✅ Repository created: ${repo.name}`));
    console.log(chalk.blue(`Remote: studio-dvcs.com/${repo.ownerId}/${repo.name}`));
  } catch (error: any) {
    spinner.fail(chalk.red(`Init failed: ${error.response?.data?.error || error.message}`));
  }
}
