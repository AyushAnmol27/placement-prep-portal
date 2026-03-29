import api from './api';

export const getTests = (params) => api.get('/tests', { params }).then(r => r.data);
export const getTest = (id) => api.get(`/tests/${id}`).then(r => r.data);
export const submitTest = (id, answers, timeTaken) => api.post(`/tests/${id}/submit`, { answers, timeTaken }).then(r => r.data);
export const getTestLeaderboard = (id) => api.get(`/tests/${id}/leaderboard`).then(r => r.data);
export const createTest = (data) => api.post('/tests', data).then(r => r.data);
export const updateTest = (id, data) => api.put(`/tests/${id}`, data).then(r => r.data);
export const deleteTest = (id) => api.delete(`/tests/${id}`).then(r => r.data);
