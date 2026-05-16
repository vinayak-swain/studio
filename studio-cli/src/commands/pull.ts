import chalk from 'chalk';
import ora from 'ora';
import { api } from '../lib/api';
import { getLocalConfig } from '../lib/config';
import { writeFiles } from '../lib/files';

/**
 * Implements 'studio pull'.
 * Fetches the remote state from Firestore and updates the local filesystem.
 */
export async function pull() {
  const config = await getLocalConfig();
  if (!config) {
    console.log(chalk.red('Error: Not a DevNest repository. Run "studio init" first.'));
    return;
  }

  const spinner = ora('Pulling latest changes from DevNest...').start();
  try {
    const data = await api.get('/cli/pull', {
      repoId: config.repoId,
      branch: config.branch
    });

    // Write received buffers to local files
    await writeFiles(process.cwd(), data.files);
    
    spinner.succeed(chalk.green(`✅ Pulled ${data.files.length} files successfully.`));
    console.log(chalk.gray(`Latest Commit: "${data.message}"`));
  } catch (error: any) {
    spinner.fail(chalk.red(`Pull failed: ${error.response?.data?.error || error.message}`));
  }
}
