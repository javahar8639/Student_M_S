import { api } from './client.js';

export const searchApi = {
  query: (q) => api.get('/search', { q }),
};
