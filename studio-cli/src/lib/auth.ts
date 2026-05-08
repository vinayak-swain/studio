
import { getCredentials } from './config.js';

export async function getAuthHeader() {
  const creds = await getCredentials();
  if (!creds?.token) {
    throw new Error('Not logged in. Please run "studio login" first.');
  }
  return { Authorization: `Bearer ${creds.token}` };
}
