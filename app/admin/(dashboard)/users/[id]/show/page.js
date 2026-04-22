'use client';

import { use } from 'react';
import { useUser } from '@/hooks/useUsers'; // 🟢 Triệu hồi Hook "não bộ"
import { getImageUrl, formatDate } from '@/lib/utils';
import { useRouter } from 'next/navigation';

// TRIỆU HỒI VŨ KHÍ UI
import PageHeader from '@/components/admin/ui/PageHeader';

import { MdEdit, MdShield, MdEmail, MdPhone, MdBadge, MdEventAvailable, MdHistory, MdInfo } from 'react-icons/md';

export default function ShowUserPage({ params }) {
    const { id } = use(params); // Next.js 15 Unwrapping
    const router = useRouter();

    // 1. DÙNG HOOK (Dọn sạch useState & useEffect rườm rà)
    const { user, loading } = useUser(id);

    // 2. MÀN HÌNH CHỜ (LÌ LỢM)
    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
            <div className="w-20 h-20 border-[10px] border-black border-t-orange-600 animate-spin shadow-[8px_8px_0_0_#000]"></div>
            <p className="font-black uppercase italic tracking-[0.4em] text-xl">Accessing Restricted Data...</p>
        </div>
    );

    if (!user) return (
        <div className="text-center p-32 space-y-6">
            <h1 className="text-9xl font-black opacity-10 italic">404</h1>
            <p className="font-black text-red-600 uppercase tracking-widest text-2xl">Dữ liệu nhân sự không tồn tại hoặc đã bị tiêu hủy!</p>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20 font-archivo uppercase animate-in fade-in zoom-in-95 duration-500">

            {/* 🔴 HEADER ĐIỀU HƯỚNG */}
            <PageHeader 
                title="HỒ SƠ" 
                subTitle="Internal Personnel Dossier" 
                btnText="HIỆU CHỈNH" 
                btnHref={`/admin/users/${id}/edit`}
                isBack={true}
                backHref="/admin/users"
            />

            {/* 🔴 MAIN DOSSIER CARD - THIẾT KẾ CỰC NẶNG ĐÔ */}
            <div className="relative bg-white border-[8px] border-black shadow-[32px_32px_0_0_#000] overflow-hidden group">
                
                {/* Trang trí góc thẻ kiểu công nghiệp */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-orange-600 translate-x-20 -translate-y-20 rotate-45 z-10 border-b-4 border-black"></div>
                <div className="absolute top-4 right-4 z-20 text-white font-black italic text-[10px] rotate-45 translate-x-2 translate-y-1">CONFIDENTIAL</div>

                <div className="grid grid-cols-1 md:grid-cols-12">

                    {/* 🔵 CỘT TRÁI: IDENTITY & STATUS (4/12) */}
                    <div className="md:col-span-4 bg-black p-12 flex flex-col items-center justify-center text-center space-y-8 border-r-8 border-black">
                        <div className="relative group/avatar">
                            <div className="w-52 h-52 border-[8px] border-white shadow-[12px_12px_0_0_#ea580c] overflow-hidden bg-gray-900">
                                <img
                                    src={getImageUrl(user.avatar)}
                                    className="w-full h-full object-cover grayscale group-hover/avatar:grayscale-0 transition-all duration-700 scale-110 group-hover/avatar:scale-100"
                                    alt={user.name}
                                    onError={(e) => e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                                />
                            </div>
                            <div className="absolute -bottom-6 -right-6 bg-white text-black p-4 border-4 border-black shadow-lg">
                                <MdShield size={36} className="text-orange-600" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-white font-black text-3xl tracking-tighter leading-none">{user.name}</h3>
                            <div className="inline-block bg-orange-600 text-black px-4 py-1 font-black text-[10px] tracking-[0.3em] italic">
                                LEVEL: {user.roles?.toUpperCase() || 'ADMIN'}
                            </div>
                        </div>

                        <div className={`w-full py-3 font-black text-xs uppercase tracking-widest border-4 shadow-[4px_4px_0_0_rgba(255,255,255,0.2)] ${
                            user.status === 1 ? 'bg-green-500 border-green-600 text-white' : 'bg-red-600 border-red-700 text-white opacity-50'
                        }`}>
                            {user.status === 1 ? '● AUTHORIZED' : '● ACCESS_LOCKED'}
                        </div>
                    </div>

                    {/* 🟠 CỘT PHẢI: DATA DETAILS (8/12) */}
                    <div className="md:col-span-8 p-12 space-y-10 bg-white">
                        <div className="border-b-[6px] border-black pb-6">
                            <h2 className="text-4xl font-black uppercase italic tracking-tighter">DATA EXTRACTION<span className="text-orange-600">_</span></h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-16">
                            
                            {/* KHỐI DỮ LIỆU */}
                            {[
                                { icon: <MdBadge />, label: 'System ID / Username', value: `@${user.username}`, color: 'text-black' },
                                { icon: <MdEmail />, label: 'Email Communication', value: user.email, color: 'text-black lowercase underline decoration-2 decoration-orange-600' },
                                { icon: <MdPhone />, label: 'Mobile Terminal', value: user.phone || 'NOT_FOUND', color: user.phone ? 'text-black' : 'text-gray-300 italic' },
                                { icon: <MdEventAvailable />, label: 'Registration Date', value: formatDate(user.created_at), color: 'text-black' },
                            ].map((item, idx) => (
                                <div key={idx} className="flex flex-col gap-3 group/item">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-gray-100 p-2 border-2 border-black shadow-[3px_3px_0_0_#000] group-hover/item:bg-orange-600 group-hover/item:text-white transition-colors">
                                            {item.icon}
                                        </div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">{item.label}</p>
                                    </div>
                                    <p className={`font-black text-xl tracking-tight pl-2 ${item.color}`}>{item.value}</p>
                                </div>
                            ))}

                            {/* CẬP NHẬT GẦN NHẤT (Full width) */}
                            <div className="md:col-span-2 bg-gray-50 border-4 border-black p-6 flex items-center justify-between shadow-[8px_8px_0_0_#000]">
                                <div className="flex items-center gap-4">
                                    <MdHistory size={32} className="text-orange-600" />
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase italic">Last Database Sync</p>
                                        <p className="font-black text-lg">{user.updated_at ? formatDate(user.updated_at) : 'NO_PREVIOUS_LOGS'}</p>
                                    </div>
                                </div>
                                <div className="text-[8px] font-black opacity-30 text-right uppercase leading-tight">
                                    System Check: Pass<br/>Security: High
                                </div>
                            </div>
                        </div>

                        {/* SYSTEM NOTES BOX */}
                        <div className="pt-6 border-t-2 border-black border-dashed">
                            <div className="bg-yellow-50 border-4 border-black p-8 relative">
                                <MdInfo className="absolute -top-6 -left-6 bg-black text-white rounded-full p-2 border-4 border-white shadow-lg" size={48} />
                                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                    <span className="w-8 h-1 bg-black"></span> SECURITY CLEARANCE NOTE:
                                </h4>
                                <p className="text-sm font-bold text-gray-800 leading-relaxed italic normal-case">
                                    "Tài khoản này sở hữu quyền hạn cấp cao trong hệ thống quản trị Thép TNL. Mọi hành vi truy cập, sửa đổi dữ liệu Sản phẩm, Đơn hàng và Cấu hình đều được ghi lại vĩnh viễn trong nhật ký hệ thống để phục vụ công tác hậu kiểm."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}