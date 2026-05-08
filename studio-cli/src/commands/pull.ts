
import chalk from 'chalk';
import ora from 'ora';
import { api } from '../lib/api';
import { getLocalConfig } from '../lib/config';
import { writeFiles } from '../lib/files';

export async function pull() {
  const config = await getLocalConfig();
  if (!config) {
    console.log(chalk.red('Not a studio repository.'));
    return;
  }

  const spinner = ora('Pulling changes...').start();
  try {
    const data = await api.get('/cli/pull', {
      repoId: config.repoId,
      branch: config.branch
    });

    await writeFiles(process.cwd(), data.files);
    spinner.succeed(chalk.green(`✅ Pulled ${data.files.length} files!`));
    console.log(chalk.gray(`Latest commit: "${data.message}" (${data.commitId})`));
  } catch (error: any) {
    spinner.fail(chalk.red(`Pull failed: ${error.response?.data?.error || error.message}`));
  }
}
