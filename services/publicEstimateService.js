import api from '../lib/api';

export const publicEstimateService = {
  getOptions: async () => {
    const res = await api.get('/estimates/options');
    return res.data;
  },
  
  calculate: async (data) => {
    const res = await api.post('/estimates/calculate', data);
    return res.data;
  }
};