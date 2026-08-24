import { api } from './client.js';

export const gradesApi = {
  get: () => api.get('/grades'),
};
