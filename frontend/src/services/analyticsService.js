import api from './api';

export const getDashboardAnalytics = () => api.get('/analytics/dashboard').then(r => r.data);
export const getAdminAnalytics = () => api.get('/analytics/admin').then(r => r.data);
