// lib/api.js (Frontend)
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// lib/api.js
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🔴 NẾU LỖI TỪ CHÍNH REFRESH -> NGẮT MẠCH NGAY
    if (originalRequest.url.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {}, { withCredentials: true });
        return api(originalRequest);
      } catch (refreshError) {
        if (typeof window !== 'undefined') {
          // 🟢 Đuổi về login nhưng dùng replace để ngắt history
          window.location.replace('/login');
        }
        // 🟢 TRẢ VỀ PROMISE TREO: Để Hook/Context đứng im, không chạy vào catch, 
        // không re-render, không gây ra vòng lặp.
        return new Promise(() => { });
      }
    }
    return Promise.reject(error);
  }
);
export default api;