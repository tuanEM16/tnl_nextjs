'use client';

import { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { authService } from '@/services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 🟢 Gọi thẳng API lấy profile. 
        // Nếu có Cookie, nó sẽ trả về User. Nếu không, nó văng 401.
        const res = await authService.getProfile();
        setUser(res.data);
      } catch (error) {
        setUser(null);
        // Chỉ khi thực sự lỗi (không có cookie/hết hạn) mới tính là chưa login
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await authService.getProfile();
      setUser(res.data);
    } catch (error) {
      Cookies.remove('token');
    } finally {
      setLoading(false);
    }
  };
  const setCookie = (name, value, days = 7) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
  };
  // contexts/AuthContext.js
  const login = async (username, password) => {
    try {
      const res = await authService.login(username, password);
      const { token, user } = res; // Lấy token từ JSON

      // 1. Lưu vào Cookie (Để Middleware đọc được) - BẮT BUỘC
      // Sử dụng js-cookie
      Cookies.set('token', token, { expires: 7, path: '/' });
      // Hoặc dùng hàm setCookie thô của bạn
      // setCookie('token', token, 7);

      // 2. Lưu user vào state
      setUser(user);

      toast.success('Đăng nhập thành công!');

      // 3. Dùng window.location để reload hoàn toàn, tránh lỗi client-side routing
      window.location.href = '/admin/dashboard';

      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đăng nhập thất bại');
      return { success: false };
    }
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    router.push('/login');
    toast.success('Đã đăng xuất');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);