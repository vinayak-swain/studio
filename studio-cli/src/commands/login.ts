
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { api } from '../lib/api';
import { saveCredentials } from '../lib/config';

export async function login() {
  const answers = await inquirer.prompt([
    { type: 'input', name: 'email', message: 'Email:' },
    { type: 'password', name: 'password', message: 'Password:' }
  ]);

  const spinner = ora('Logging in...').start();
  try {
    const data = await api.post('/auth/cli-login', answers, false);
    await saveCredentials(data);
    spinner.succeed(chalk.green(`Successfully logged in as ${data.name || data.email}!`));
  } catch (error: any) {
    spinner.fail(chalk.red(`Login failed: ${error.response?.data?.error || error.message}`));
  }
}
