import api from '../lib/api';

const createAdminService = (endpoint) => ({
  getAll: async () => {
    const res = await api.get(`/estimates/admin/${endpoint}`);
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/estimates/admin/${endpoint}/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await api.post(`/estimates/admin/${endpoint}`, data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/estimates/admin/${endpoint}/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/estimates/admin/${endpoint}/${id}`);
    return res.data;
  }
});

export const adminEstimateService = {
  usageTypes: createAdminService('usage-types'),
  materialTypes: createAdminService('material-types'),
  complexityLevels: createAdminService('complexity-levels'),
  heightFactors: createAdminService('height-factors'),
  priceRules: createAdminService('price-rules')
};