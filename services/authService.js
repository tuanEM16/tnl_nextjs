
import api from '@/lib/api';

export const authService = {
  login: async (username, password) => {
    const res = await api.post('/auth/login', { username, password });
    return res.data;
  },
  getProfile: async () => {
    const res = await api.get('/users/profile');
    return res.data;
  },
  changePassword: async (old_password, new_password) => {
    const res = await api.post('/users/change-password', { old_password, new_password });
    return res.data;
  },
};