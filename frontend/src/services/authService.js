import api from './api';

export const login = (data) => api.post('/auth/login', data).then(r => r.data);
export const register = (data) => api.post('/auth/register', data).then(r => r.data);
export const getProfile = () => api.get('/auth/profile').then(r => r.data);
export const updateProfile = (data) => api.put('/auth/profile', data).then(r => r.data);
export const getLeaderboard = () => api.get('/auth/leaderboard').then(r => r.data);
