import { api } from './client.js';

export const assignmentsApi = {
  list: (filters) => api.get('/assignments', filters),
  get: (id) => api.get(`/assignments/${id}`),
  submit: (id, submissionText) => api.post(`/assignments/${id}/submissions`, { submissionText }),
};
