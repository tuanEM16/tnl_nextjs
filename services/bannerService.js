import api from '@/lib/api';

export const bannerService = {

  getAll: async (filters = {}) => {

    const res = await api.get('/banners', { params: filters });
    return res.data;
  },


  getById: async (id) => {
    const res = await api.get(`/banners/${id}`);
    return res.data;
  },


  create: async (formData) => {
    const res = await api.post('/banners', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },


  update: async (id, data) => {


    return api.put(`/banners/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => res.data);
  },


  delete: async (id) => {
    const res = await api.delete(`/banners/${id}`);
    return res.data;
  },
};