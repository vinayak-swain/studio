
import path from 'path';
import os from 'os';
import fs from 'fs-extra';

export const GLOBAL_CONFIG_DIR = path.join(os.homedir(), '.studio');
export const CREDENTIALS_FILE = path.join(GLOBAL_CONFIG_DIR, 'credentials.json');
export const LOCAL_CONFIG_FILE = '.studio';

export interface Credentials {
  token: string;
  email: string;
  name: string;
}

export interface LocalConfig {
  repoId: string;
  repoName: string;
  owner: string;
  remote: string;
  branch: string;
}

export async function saveCredentials(creds: Credentials) {
  await fs.ensureDir(GLOBAL_CONFIG_DIR);
  await fs.writeJson(CREDENTIALS_FILE, creds);
}

export async function getCredentials(): Promise<Credentials | null> {
  if (!(await fs.pathExists(CREDENTIALS_FILE))) return null;
  return fs.readJson(CREDENTIALS_FILE);
}

export async function saveLocalConfig(config: LocalConfig) {
  await fs.writeJson(LOCAL_CONFIG_FILE, config, { spaces: 2 });
}

export async function getLocalConfig(): Promise<LocalConfig | null> {
  if (!(await fs.pathExists(LOCAL_CONFIG_FILE))) return null;
  return fs.readJson(LOCAL_CONFIG_FILE);
}
