import { api } from './client.js';

export const dashboardApi = {
  get: () => api.get('/dashboard'),
};
