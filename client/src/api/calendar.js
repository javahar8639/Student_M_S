import { api } from './client.js';

export const calendarApi = {
  list: () => api.get('/calendar'),
};
