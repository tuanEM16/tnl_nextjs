// app/(auth)/layout.js
'use client';
import { AuthProvider } from '@/contexts/AuthContext';

export default function AuthLayout({ children }) {
  return (
    <AuthProvider>
      {/* 🔐 Vùng này cần Auth để thực hiện lệnh Đăng nhập/Quên mật khẩu */}
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        {children}
      </div>
    </AuthProvider>
  );
}