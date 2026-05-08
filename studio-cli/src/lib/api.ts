
import axios from 'axios';
import { getAuthHeader } from './auth.js';

const BASE_URL = 'http://localhost:3000/api';

export const api = {
  async post(endpoint: string, data: any, useAuth = true) {
    const headers: any = { 'Content-Type': 'application/json' };
    if (useAuth) {
      Object.assign(headers, await getAuthHeader());
    }
    const response = await axios.post(`${BASE_URL}${endpoint}`, data, { headers });
    return response.data;
  },

  async get(endpoint: string, params: any = {}, useAuth = true) {
    const headers: any = {};
    if (useAuth) {
      Object.assign(headers, await getAuthHeader());
    }
    const response = await axios.get(`${BASE_URL}${endpoint}`, { headers, params });
    return response.data;
  }
};
