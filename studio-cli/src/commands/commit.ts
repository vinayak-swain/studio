
import chalk from 'chalk';
import ora from 'ora';
import { api } from '../lib/api.js';
import { getLocalConfig } from '../lib/config.js';

export async function commit(message: string) {
  const config = await getLocalConfig();
  if (!config) {
    console.log(chalk.red('Not a studio repository.'));
    return;
  }

  const spinner = ora('Committing...').start();
  try {
    const data = await api.post('/cli/commit', {
      repoId: config.repoId,
      branch: config.branch,
      message
    });

    spinner.succeed(chalk.green(`✅ Committed! Commit ID: ${data.commitId}`));
    
    if (data.aiAnalysis) {
      const ai = data.aiAnalysis;
      console.log(`\n${chalk.blue.bold('🤖 AI Analysis:')}`);
      console.log(`${chalk.white('Type:')} ${ai.changeType}`);
      console.log(`${chalk.white('Summary:')} ${ai.intentSummary}`);
      console.log(`${chalk.white('Risk Score:')} ${ai.riskScore}/100`);
      if (ai.breakingChange) {
        console.log(chalk.red.bold('⚠️  WARNING: Breaking change detected!'));
      }
    }
  } catch (error: any) {
    spinner.fail(chalk.red(`Commit failed: ${error.response?.data?.error || error.message}`));
  }
}
