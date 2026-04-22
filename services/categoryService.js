import api from '@/lib/api';

export const categoryService = {

  getAll: async (params = {}) => {
    const res = await api.get('/categories', { params });
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/categories/${id}`);
    return res.data;
  },

  create: async (formData) => {
    const res = await api.post('/categories', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  update: async (id, formData) => {
    const res = await api.put(`/categories/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/categories/${id}`);
    return res.data;
  },
};