
import axios from 'axios';
import { getAuthHeader } from './auth';

// The CLI communicates with the Next.js server
// We use an environment variable to allow overriding the URL in different environments
const BASE_URL = (process.env.DEVNEST_API_URL || 'http://localhost:3000').replace(/\/$/, '') + '/api';

export const api = {
  async post(endpoint: string, data: any, useAuth = true) {
    try {
      const headers: any = { 'Content-Type': 'application/json' };
      if (useAuth) {
        Object.assign(headers, await getAuthHeader());
      }
      const response = await axios.post(`${BASE_URL}${endpoint}`, data, { headers });
      return response.data;
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        throw new Error(`Could not connect to DevNest server at ${BASE_URL}. 
        
Possible solutions:
1. Ensure the web app is running in another terminal (run 'npm run dev' in the root directory).
2. If you are in a cloud IDE, set the DEVNEST_API_URL environment variable to your preview URL.
   Example: export DEVNEST_API_URL=https://your-preview-url.com`);
      }
      throw error;
    }
  },

  async get(endpoint: string, params: any = {}, useAuth = true) {
    try {
      const headers: any = {};
      if (useAuth) {
        Object.assign(headers, await getAuthHeader());
      }
      const response = await axios.get(`${BASE_URL}${endpoint}`, { headers, params });
      return response.data;
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        throw new Error(`Could not connect to DevNest server at ${BASE_URL}.
        
Possible solutions:
1. Ensure the web app is running in another terminal (run 'npm run dev' in the root directory).
2. If you are in a cloud IDE, set the DEVNEST_API_URL environment variable to your preview URL.
   Example: export DEVNEST_API_URL=https://your-preview-url.com`);
      }
      throw error;
    }
  }
};
