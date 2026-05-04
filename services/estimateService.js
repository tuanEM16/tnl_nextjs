import api from '@/lib/api';

const createService = (endpoint) => ({
  getAll: async () => {
    const res = await api.get(`/estimates/${endpoint}`);
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/estimates/${endpoint}/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await api.post(`/estimates/${endpoint}`, data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/estimates/${endpoint}/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/estimates/${endpoint}/${id}`);
    return res.data;
  }
});

export const estimateService = {
  usageTypes: createService('usage-types'),
  materialTypes: createService('material-types'),
  complexityLevels: createService('complexity-levels'),
  heightFactors: createService('height-factors'),
  priceRules: createService('price-rules'),
  items: createService('items')
};