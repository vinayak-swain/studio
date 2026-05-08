
import fs from 'fs-extra';
import path from 'path';

const IGNORE_LIST = ['node_modules', '.git', '.next', 'dist', '.studio'];

export async function getAllFiles(dir: string, baseDir = dir): Promise<{ path: string; content: string }[]> {
  const results: { path: string; content: string }[] = [];
  const files = await fs.readdir(dir);

  for (const file of files) {
    if (IGNORE_LIST.includes(file)) continue;

    const fullPath = path.join(dir, file);
    const stat = await fs.stat(fullPath);

    if (stat.isDirectory()) {
      results.push(...(await getAllFiles(fullPath, baseDir)));
    } else {
      const content = await fs.readFile(fullPath, 'utf8');
      const relativePath = path.relative(baseDir, fullPath);
      results.push({ path: relativePath, content });
    }
  }

  return results;
}

export async function writeFiles(baseDir: string, files: { path: string; content: string }[]) {
  for (const file of files) {
    const fullPath = path.join(baseDir, file.path);
    await fs.ensureDir(path.dirname(fullPath));
    await fs.writeFile(fullPath, file.content);
  }
}
