
import chalk from 'chalk';
import { getLocalConfig } from '../lib/config.js';
import { getAllFiles } from '../lib/files.js';

export async function status() {
  const config = await getLocalConfig();
  if (!config) {
    console.log(chalk.red('Not a studio repository. Run "studio init" first.'));
    return;
  }

  const files = await getAllFiles(process.cwd());

  console.log(chalk.blue.bold(`📦 ${config.repoName}`));
  console.log(chalk.gray(`Remote: ${config.remote}`));
  console.log(chalk.gray(`Branch: ${config.branch}`));
  console.log(chalk.white(`\n${files.length} files tracked`));

  if (files.length > 0) {
    console.log(chalk.gray('\nFiles:'));
    files.slice(0, 10).forEach(f => console.log(`  ${f.path}`));
    if (files.length > 10) console.log(chalk.gray(`  ... and ${files.length - 10} more`));
  }
}
