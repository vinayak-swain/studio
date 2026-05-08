
import chalk from 'chalk';
import ora from 'ora';
import { api } from '../lib/api.js';
import { getLocalConfig } from '../lib/config.js';
import { getAllFiles } from '../lib/files.js';

export async function push() {
  const config = await getLocalConfig();
  if (!config) {
    console.log(chalk.red('Not a studio repository.'));
    return;
  }

  const files = await getAllFiles(process.cwd());
  const spinner = ora(`Pushing ${files.length} files...`).start();

  try {
    const data = await api.post('/cli/push', {
      repoId: config.repoId,
      branch: config.branch,
      files,
      commitMessage: 'Update from CLI'
    });

    spinner.succeed(chalk.green('✅ Pushed successfully!'));
    console.log(chalk.gray(`Commit ID: ${data.commitId}`));
    console.log(chalk.gray(`Files pushed: ${data.fileCount}`));

    if (data.aiAnalysis) {
      const ai = data.aiAnalysis;
      console.log(`\n${chalk.blue.bold('🤖 AI Insights:')}`);
      console.log(`${chalk.white('Type:')} ${ai.changeType}`);
      console.log(`${chalk.white('Intent:')} ${ai.intentSummary}`);
      console.log(`${chalk.white('Risk Score:')} ${ai.riskScore}/100`);
    }

    console.log(chalk.cyan(`\nView in app: ${config.remote}`));
  } catch (error: any) {
    spinner.fail(chalk.red(`Push failed: ${error.response?.data?.error || error.message}`));
  }
}
