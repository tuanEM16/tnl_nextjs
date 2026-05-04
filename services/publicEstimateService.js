import api from '../lib/api';

export const publicEstimateService = {
  getOptions: async () => {
    const res = await api.get('/estimates/options');
    return res.data;
  },
  
  calculate: async (data) => {
    try {
      const res = await api.post('/estimates/calculate', data);
      
      // Đảm bảo items có total_price hợp lệ
      if (res.data?.items && Array.isArray(res.data.items)) {
        res.data.items = res.data.items.map(item => ({
          ...item,
          total_price: item.total_price || 0
        }));
      }
      
      return res.data;
    } catch (error) {
      console.error('Lỗi tính toán dự toán:', error);
      throw error;
    }
  }
};