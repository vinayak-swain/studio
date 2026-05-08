
import chalk from 'chalk';
import ora from 'ora';
import path from 'path';
import { api } from '../lib/api.js';
import { writeFiles } from '../lib/files.js';
import { saveLocalConfig } from '../lib/config.js';

export async function clone(repoPath: string) {
  const [owner, repoName] = repoPath.split('/');
  if (!owner || !repoName) {
    console.log(chalk.red('Invalid repo path. Use "owner/repo".'));
    return;
  }

  const spinner = ora(`Cloning ${repoPath}...`).start();
  try {
    // In a real app, we'd need a way to find the repoId from owner/repoName
    // For this prototype, we'll assume we have an endpoint for it or pass repoId directly
    const repoInfo = await api.get('/cli/repos');
    const repo = repoInfo.find((r: any) => r.name === repoName);
    
    if (!repo) throw new Error('Repository not found.');

    const data = await api.get('/cli/pull', { repoId: repo.id, branch: 'main' });
    const targetDir = path.join(process.cwd(), repoName);

    await writeFiles(targetDir, data.files);
    
    // Save config in the new directory
    process.chdir(targetDir);
    await saveLocalConfig({
      repoId: repo.id,
      repoName: repo.name,
      owner: repo.ownerId,
      remote: `studio-dvcs.com/${repo.ownerId}/${repo.name}`,
      branch: 'main'
    });

    spinner.succeed(chalk.green(`✅ Successfully cloned into ${repoName}`));
  } catch (error: any) {
    spinner.fail(chalk.red(`Clone failed: ${error.response?.data?.error || error.message}`));
  }
}
