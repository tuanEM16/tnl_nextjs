// contexts/AuthContext.js
'use client';

import { createContext, useState, useContext, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation'; // 🟢 Thêm usePathname
import Cookies from 'js-cookie';
import { authService } from '@/services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname(); // 🟢 Lấy đường dẫn hiện tại

  useEffect(() => {
    const checkAuth = async () => {
      // 🟢 BƯỚC 1: LÁ CHẮN - Nếu ở trang login/quên mật khẩu thì không check
      const publicRoutes = ['/login', '/forgot-password', '/reset-password'];
      const isPublicRoute = publicRoutes.some(route => pathname.includes(route));

      if (isPublicRoute) {
        setLoading(false);
        return; // Thoát ngay, không gọi API gì hết
      }

      try {
        const res = await authService.getProfile();
        setUser(res.data);
      } catch (error) {
        setUser(null);
        // Interceptor của đại ca sẽ tự động đá về /login nếu lỗi 401/403
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname]); // 🟢 Quan trọng: Chạy lại mỗi khi đổi trang

  const login = async (username, password) => {
    try {
      const res = await authService.login(username, password);
      // Giả sử Backend của đại ca trả về { success, user, token }
      // Lưu ý: Nếu đại ca dùng HttpOnly Cookie từ Backend thì không cần dòng dưới
      if (res.token) {
        Cookies.set('token', res.token, { expires: 7, path: '/' });
      }
      
      setUser(res.user);
      toast.success('Đăng nhập thành công!');
      
      // Dùng replace để ngắt mạch vòng lặp và nhảy thẳng vào Dashboard
      window.location.replace('/admin/dashboard'); 
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đăng nhập thất bại');
      return { success: false };
    }
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    window.location.replace('/login');
    toast.success('Đã đăng xuất');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);