'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { userService } from '@/services/userService';
import { MdArrowBack, MdEdit, MdShield, MdEmail, MdPhone, MdBadge, MdEventAvailable,MdHistory } from 'react-icons/md';
import Link from 'next/link';

export default function ShowUserPage({ params }) {
    const { id } = use(params); // Phải dùng use() để bốc id từ params trong Next.js 15
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await userService.show(id);
                if (res.success) {
                    setUser(res.data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
            <div className="w-16 h-16 border-8 border-black border-t-orange-600 animate-spin"></div>
            <p className="font-black uppercase italic tracking-widest">ĐANG TRUY XUẤT HỒ SƠ QUẢN TRỊ...</p>
        </div>
    );

    if (!user) return <div className="text-center p-20 font-black text-red-600 uppercase">Hồ sơ không tồn tại hoặc đã bị hủy!</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">

            {/* NAVIGATION HEADER */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 font-black text-xs uppercase tracking-widest hover:text-orange-600 transition-all group"
                >
                    <MdArrowBack size={24} className="group-hover:-translate-x-2 transition-transform" />
                    QUAY LẠI HỆ THỐNG
                </button>

                <Link
                    href={`/admin/users/${id}/edit`}
                    className="bg-orange-600 text-white px-6 py-3 font-black text-xs uppercase shadow-[4px_4px_0_0_#000] hover:bg-black transition-all flex items-center gap-2"
                >
                    <MdEdit size={18} /> CHỈNH SỬA HỒ SƠ
                </Link>
            </div>

            {/* MAIN DOSSIER CARD */}
            <div className="relative bg-white border-[8px] border-black shadow-[24px_24px_0_0_#000] overflow-hidden">

                {/* Trang trí góc thẻ */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600 translate-x-16 -translate-y-16 rotate-45"></div>

                <div className="grid grid-cols-1 md:grid-cols-12">

                    {/* CỘT TRÁI: AVATAR & STATUS (4 columns) */}
                    <div className="md:col-span-4 bg-black p-10 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="relative">
                            <div className="w-48 h-48 border-[6px] border-white shadow-[10px_10px_0_0_#ea580c] overflow-hidden">
                                <img
                                    src={user.avatar ? `http://localhost:5000/uploads/${user.avatar}` : 'https://via.placeholder.com/300'}
                                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                    alt={user.name}
                                />
                            </div>
                            <div className="absolute -bottom-4 -right-4 bg-white text-black p-3 border-4 border-black">
                                <MdShield size={32} className="text-orange-600" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-white font-black text-2xl uppercase tracking-tighter">{user.name}</h3>
                            <p className="text-orange-500 font-bold text-sm tracking-[0.2em]">LEVEL: {user.roles.toUpperCase()}</p>
                        </div>

                        <div className={`px-6 py-2 font-black text-xs uppercase tracking-widest border-2 ${user.status === 1 ? 'bg-green-500 border-green-500 text-white' : 'bg-red-600 border-red-600 text-white'
                            }`}>
                            {user.status === 1 ? '● ĐANG HOẠT ĐỘNG' : '● ĐÃ KHÓA TRUY CẬP'}
                        </div>
                    </div>

                    {/* CỘT PHẢI: INFORMATION DETAILS (8 columns) */}
                    <div className="md:col-span-8 p-10 space-y-8">
                        <div className="border-b-4 border-black pb-4">
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter">THÔNG TIN ĐỊNH DANH<span className="text-orange-600">_</span></h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                            {/* Mỗi field là một khối dữ liệu */}
                            <div className="flex items-start gap-4">
                                <div className="bg-gray-100 p-3 border-2 border-black"><MdBadge size={20} /></div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase">Tên đăng nhập</p>
                                    <p className="font-bold text-lg text-black">@{user.username}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-gray-100 p-3 border-2 border-black"><MdEmail size={20} /></div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase">Email liên hệ</p>
                                    <p className="font-bold text-lg text-black">{user.email}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-gray-100 p-3 border-2 border-black"><MdPhone size={20} /></div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase">Số điện thoại</p>
                                    <p className="font-bold text-lg text-black">{user.phone || 'CHƯA CẬP NHẬT'}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-gray-100 p-3 border-2 border-black"><MdEventAvailable size={20} /></div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase">Ngày gia nhập</p>
                                    <p className="font-bold text-lg text-black">
                                        {new Date(user.created_at).toLocaleDateString('vi-VN')}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-orange-100 p-3 border-2 border-black text-orange-600">
                                    <MdHistory size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cập nhật gần nhất</p>
                                    <p className="font-bold text-lg text-black">
                                        {user.updated_at
                                            ? new Date(user.updated_at).toLocaleString('vi-VN', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })
                                            : 'CHƯA CÓ DỮ LIỆU'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Footer của Card */}
                        <div className="mt-12 pt-8 border-t-2 border-dashed border-gray-300">
                            <div className="bg-orange-50 p-6 border-l-8 border-orange-600">
                                <p className="text-[10px] font-black uppercase text-orange-800 mb-2 italic">Ghi chú hệ thống:</p>
                                <p className="text-sm font-bold text-gray-700 leading-relaxed">
                                    Tài khoản này có quyền truy cập vào các module quản trị bao gồm: Sản phẩm, Đơn hàng và Cấu hình hệ thống. Mọi thao tác đều được ghi lại trong nhật ký hệ thống (Log).
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}