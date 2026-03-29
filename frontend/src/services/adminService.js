import api from './api';

export const getAdminOverview = () => api.get('/admin/overview').then(r => r.data);
export const getUsers = (params) => api.get('/admin/users', { params }).then(r => r.data);
export const updateUser = (id, data) => api.put(`/admin/users/${id}`, data).then(r => r.data);
export const deleteUser = (id) => api.delete(`/admin/users/${id}`).then(r => r.data);
