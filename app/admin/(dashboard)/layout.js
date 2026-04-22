'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AdminSidebar from '@/components/admin/layout/AdminSidebar';
import AdminHeader from '@/components/admin/layout/AdminHeader';

export default function DashboardLayout({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    // 🔥 VỆ SĨ CANH CỔNG: Nếu hết loading mà không thấy user, "sút" ngay về trang login
    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    // Trong lúc đang kiểm tra quyền, hiện màn hình chờ cho nó chuyên nghiệp
    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-[#0B1F4F] font-black italic text-white tracking-[0.3em]">
                SYNCING PERMISSIONS...
            </div>
        );
    }

    // Nếu không có user, trả về null để không vẽ bất cứ thứ gì ra màn hình (chống lộ thông tin)
    if (!user) return null;

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden font-archivo">
            {/* SIDEBAR TÍM CỦA CON ĐÃ QUAY LẠI */}
            <AdminSidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* HEADER ADMIN ĐÃ QUAY LẠI */}
                <AdminHeader />

                {/* NỘI DUNG CÁC TRANG (BANNER, SẢN PHẨM, ...) */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}