import api from './api';

export const getProblems = (params) => api.get('/problems', { params }).then(r => r.data);
export const getProblem = (id) => api.get(`/problems/${id}`).then(r => r.data);
export const createProblem = (data) => api.post('/problems', data).then(r => r.data);
export const updateProblem = (id, data) => api.put(`/problems/${id}`, data).then(r => r.data);
export const deleteProblem = (id) => api.delete(`/problems/${id}`).then(r => r.data);
export const solveProblem = (id) => api.post(`/problems/${id}/solve`).then(r => r.data);
export const toggleBookmark = (id) => api.post(`/problems/${id}/bookmark`).then(r => r.data);
export const runCode = (data) => api.post('/problems/run', data).then(r => r.data);
export const submitSolution = (id, data) => api.post(`/problems/${id}/submit`, data).then(r => r.data);
export const getSubmissions = (problemId) => api.get(problemId ? `/problems/${problemId}/submissions` : '/problems/submissions').then(r => r.data);
