import chalk from 'chalk';
import ora from 'ora';
import path from 'path';
import { api } from '../lib/api';
import { writeFiles } from '../lib/files';
import { saveLocalConfig } from '../lib/config';

/**
 * Implements 'studio clone <repoId>'.
 * Downloads an entire repository and initializes the local tracking config.
 */
export async function clone(repoId: string) {
  const spinner = ora(`Cloning repository ${repoId}...`).start();
  
  try {
    // 1. Fetch remote content
    const data = await api.get('/cli/pull', { repoId, branch: 'main' });
    
    // 2. Create target directory
    const targetDir = path.join(process.cwd(), repoId);
    await writeFiles(targetDir, data.files);
    
    // 3. Save tracking config in the new directory
    process.chdir(targetDir);
    await saveLocalConfig({
      repoId: repoId,
      repoName: repoId,
      owner: 'remote',
      remote: `studio-dvcs.com/${repoId}`,
      branch: 'main'
    });

    spinner.succeed(chalk.green(`✅ Successfully cloned into ./${repoId}`));
  } catch (error: any) {
    spinner.fail(chalk.red(`Clone failed: ${error.response?.data?.error || error.message}`));
  }
}
