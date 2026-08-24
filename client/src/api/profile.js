import { api } from './client.js';

export const profileApi = {
  get: () => api.get('/profile'),
  update: (payload) => api.put('/profile', payload),
};
