import { api } from './client.js';

export const coursesApi = {
  list: (filters) => api.get('/courses', filters),
  get: (id) => api.get(`/courses/${id}`),
  setLessonProgress: (courseId, lessonId, completed) =>
    api.put(`/courses/${courseId}/lessons/${lessonId}/progress`, { completed }),
};
