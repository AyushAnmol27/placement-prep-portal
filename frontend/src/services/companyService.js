import api from './api';

export const getCompanies = (params) => api.get('/companies', { params }).then(r => r.data);
export const getCompany = (id) => api.get(`/companies/${id}`).then(r => r.data);
export const createCompany = (data) => api.post('/companies', data).then(r => r.data);
