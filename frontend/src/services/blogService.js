import api from './api';

export const getBlogs = (params) => api.get('/blogs', { params }).then(r => r.data);
export const getBlog = (id) => api.get(`/blogs/${id}`).then(r => r.data);
export const createBlog = (data) => api.post('/blogs', data).then(r => r.data);
export const updateBlog = (id, data) => api.put(`/blogs/${id}`, data).then(r => r.data);
export const deleteBlog = (id) => api.delete(`/blogs/${id}`).then(r => r.data);
export const toggleLike = (id) => api.post(`/blogs/${id}/like`).then(r => r.data);
