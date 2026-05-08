import axios from 'axios';
import { getAuthHeader } from './auth';

const BASE_URL = 'http://localhost:3000/api';

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
      if (error.code === 'ECONNREFUSED') {
        throw new Error(`Could not connect to the DevNest server. Make sure your Next.js app is running at ${BASE_URL.replace('/api', '')} (run "npm run dev" in the project root).`);
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
      if (error.code === 'ECONNREFUSED') {
        throw new Error(`Could not connect to the DevNest server. Make sure your Next.js app is running at ${BASE_URL.replace('/api', '')} (run "npm run dev" in the project root).`);
      }
      throw error;
    }
  }
};
