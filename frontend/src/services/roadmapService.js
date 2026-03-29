import api from './api';

export const generateRoadmap = (data) => api.post('/roadmap/generate', data).then(r => r.data);
export const getRoadmap = () => api.get('/roadmap').then(r => r.data);
export const updateWeek = (week, data) => api.patch(`/roadmap/week/${week}`, data).then(r => r.data);
