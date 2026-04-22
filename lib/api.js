// lib/api.js (Frontend)
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// lib/api.js
// lib/api.js
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 1. Nếu là lỗi từ chính thằng refresh -> Cút ngay lập tức
    if (originalRequest.url.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {}, { withCredentials: true });
        return api(originalRequest);
      } catch (refreshError) {
        // 🟢 ĐOẠN NÀY LÀ CHÌA KHÓA:
        if (typeof window !== 'undefined') {
          // Dùng replace để xóa lịch sử, không cho bấm "Back" quay lại vòng lặp
          window.location.replace('/login');
        }
        
        // 🔴 TRẢ VỀ PROMISE TREO: 
        // Nó sẽ đứng im tại đây, không chạy vào .catch của useApi nữa.
        // Nhờ đó không có setLoading(false), không re-render, KHÔNG SPAM.
        return new Promise(() => {}); 
      }
    }
    return Promise.reject(error);
  }
);
export default api;