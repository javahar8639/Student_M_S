import { api } from './client.js';

export const assignmentsApi = {
  list: (filters) => api.get('/assignments', filters),
  get: (id) => api.get(`/assignments/${id}`),
  submit: (id, { submissionText, file }) => {
    const formData = new FormData();
    if (submissionText) formData.append('submissionText', submissionText);
    if (file) formData.append('attachment', file);
    return api.postForm(`/assignments/${id}/submissions`, formData);
  },
};
