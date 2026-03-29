import api from './api';

export const getQuestions = (params) => api.get('/aptitude', { params }).then(r => r.data);
export const getTopics = (params) => api.get('/aptitude/topics', { params }).then(r => r.data);
export const getTopicStats = () => api.get('/aptitude/stats').then(r => r.data);
export const getQuestion = (id) => api.get(`/aptitude/${id}`).then(r => r.data);
export const submitAnswer = (id, answer) => api.post(`/aptitude/${id}/submit`, { answer }).then(r => r.data);
export const createQuestion = (data) => api.post('/aptitude', data).then(r => r.data);
export const updateQuestion = (id, data) => api.put(`/aptitude/${id}`, data).then(r => r.data);
export const deleteQuestion = (id) => api.delete(`/aptitude/${id}`).then(r => r.data);
