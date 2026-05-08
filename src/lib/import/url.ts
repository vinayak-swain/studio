
import { simpleGit } from 'simple-git';
import path from 'path';
import fs from 'fs-extra';
import os from 'os';

/**
 * Clones a public repository from a URL and extracts its files.
 */
export async function importFromUrl(gitUrl: string) {
  const tempDir = path.join(os.tmpdir(), `devnest-import-${Date.now()}`);
  await fs.ensureDir(tempDir);
  
  try {
    const git = simpleGit();
    await git.clone(gitUrl, tempDir, ['--depth', '1']);
    
    const files: { path: string; content: string }[] = [];
    
    async function walk(dir: string) {
      const items = await fs.readdir(dir);
      for (const item of items) {
        if (item === '.git') continue;
        
        const fullPath = path.join(dir, item);
        const stat = await fs.stat(fullPath);
        const relativePath = path.relative(tempDir, fullPath);
        
        if (stat.isDirectory()) {
          await walk(fullPath);
        } else {
          try {
            const content = await fs.readFile(fullPath, 'utf-8');
            files.push({ path: relativePath, content });
          } catch (e) {
            console.warn(`Skipping non-text file: ${relativePath}`);
          }
        }
      }
    }
    
    await walk(tempDir);
    return files;
  } finally {
    // Cleanup temporary directory
    await fs.remove(tempDir);
  }
}
