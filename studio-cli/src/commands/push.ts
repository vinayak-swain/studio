import chalk from 'chalk';
import ora from 'ora';
import { api } from '../lib/api';
import { getLocalConfig } from '../lib/config';
import { getAllFiles } from '../lib/files';

/**
 * Implements 'studio push "message"'.
 * Scans local directory, uploads files to DevNest, and prints AI insights.
 */
export async function push(message: string) {
  const config = await getLocalConfig();
  if (!config) {
    console.log(chalk.red('Error: Not a DevNest repository. Run "studio init <repoId>" first.'));
    return;
  }

  if (!message) {
    console.log(chalk.yellow('Warning: No commit message provided. Using default.'));
    message = 'Update from CLI';
  }

  const spinner = ora('Scanning and preparing changes...').start();
  
  try {
    // 1. Gather all files in the current directory (skipping ignored ones)
    const files = await getAllFiles(process.cwd());
    
    spinner.text = `Pushing ${files.length} files to DevNest...`;
    
    // 2. Transmit to server
    const data = await api.post('/cli/push', {
      repoId: config.repoId,
      branch: config.branch,
      files,
      message
    });

    spinner.succeed(chalk.green('✅ Successfully pushed to cloud!'));
    console.log(chalk.gray(`Commit Hash: ${data.commitId.substring(0, 8)}`));
    console.log(chalk.gray(`Files Synced: ${data.fileCount}`));

    // 3. Display AI insights returned from Genkit
    if (data.aiAnalysis) {
      const ai = data.aiAnalysis;
      console.log(`\n${chalk.cyan.bold('🤖 DEVNEST AI INSIGHTS')}`);
      console.log(`${chalk.white.bold('Summary:')} ${ai.intentSummary}`);
      console.log(`${chalk.white.bold('Architectural Impact:')} ${chalk.italic(ai.architecturalImpact)}`);
      
      const riskColor = ai.riskScore > 70 ? chalk.red : ai.riskScore > 30 ? chalk.yellow : chalk.green;
      console.log(`${chalk.white.bold('Risk Score:')} ${riskColor(ai.riskScore + '/100')}`);
      
      if (ai.breakingChange) {
        console.log(chalk.bgRed.white.bold(' ⚠️  BREAKING CHANGES DETECTED '));
      }
    }

    console.log(chalk.blue(`\nView changes online: http://localhost:3000/repo/${config.repoId}`));

  } catch (error: any) {
    spinner.fail(chalk.red(`Push failed: ${error.response?.data?.error || error.message}`));
  }
}
